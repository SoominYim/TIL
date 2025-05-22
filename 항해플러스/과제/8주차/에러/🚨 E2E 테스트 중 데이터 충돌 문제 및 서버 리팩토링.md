## 1. 문제 상황<br>  
Playwright 기반의 E2E 테스트를 진행할 때, 테스트 중 추가한 이벤트가 `realEvents.json` 파일에 직접 저장되는 구조임  
테스트가 실패하거나 비정상 종료될 경우 해당 데이터가 파일에 누적되어, 다음 테스트 실행 시 다음과 같은 문제가 발생  
* 테스트 시작 전 상태를 초기화할 수 없음  
* `event-list` 항목 수 또는 필터 기준이 달라져 테스트 실패  
* `title`, `time` 충돌로 인해 의도치 않은 `중복 경고 모달` 발생  
* 테스트 간 상태가 공유되어 디버깅이 어려움  
> 예: 이전 테스트에서 추가된 테스트 (13:02~14:04) 일정이 남아 이후 테스트의 동일 시간 일정 추가가 실패  
  
---  
## 2. 원인<br>  
기존 API 서버는 `POST`, `PUT`, `DELETE` 요청 시 모든 변경 사항을 `realEvents.json`에 영구 저장하는 구조,  
이는 테스트 실행 중 생성된 테스트 데이터를 다음 실행에 그대로 남게 만들어 정상적인 테스트가 안됨  
---  
## 3. 해결 방안<br>  
### 📌 목표<br>  
* 테스트 실행마다 항상 **초기화된 상태**에서 시작할 수 있도록 구현  
* 상태를 **메모리에 유지**하고, 파일을 직접 수정하지 않도록 서버 구조를 변경  
---  
## 4. 리팩토링된 서버 코드 (`server_e2e.js`)<br>  
새로운 서버는 파일 저장을 제거하고, `let db = []` 배열에 모든 이벤트를 저장  
또한 테스트 전 상태를 초기화할 수 있도록 `/__reset` API를 추가  
  
### `sever_e2e.js` (추가)<br>  
```javascript  
import { randomUUID } from 'crypto';
import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

// 메모리 기반 DB
let db = [
  // 초기 상태 일정 예시 (선택적으로 포함 가능)
  {
    id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
    title: '팀 회의',
    date: '2025-05-20',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 미팅',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
  // 기타 일정들...
];

// 상태 초기화 API
app.post('/__reset', (_, res) => {
  db = [];
  res.status(204).send();
});

// 이벤트 CRUD API
app.get('/api/events', (_, res) => res.json({ events: db }));

app.post('/api/events', (req, res) => {
  const newEvent = { id: randomUUID(), ...req.body };
  db.push(newEvent);
  res.status(201).json(newEvent);
});

app.put('/api/events/:id', (req, res) => {
  const index = db.findIndex((e) => e.id === req.params.id);
  if (index === -1) return res.status(404).send('Not found');
  db[index] = { ...db[index], ...req.body };
  res.json(db[index]);
});

app.delete('/api/events/:id', (req, res) => {
  db = db.filter((e) => e.id !== req.params.id);
  res.status(204).send();
});

app.post('/api/events-list', (req, res) => {
  const repeatId = randomUUID();
  const newEvents = req.body.events.map((event) => {
    const isRepeat = event.repeat?.type !== 'none';
    return {
      id: randomUUID(),
      ...event,
      repeat: {
        ...event.repeat,
        id: isRepeat ? repeatId : undefined,
      },
    };
  });
  db.push(...newEvents);
  res.status(201).json(newEvents);
});

app.put('/api/events-list', (req, res) => {
  let updated = false;
  req.body.events.forEach((incoming) => {
    const idx = db.findIndex((e) => e.id === incoming.id);
    if (idx !== -1) {
      db[idx] = { ...db[idx], ...incoming };
      updated = true;
    }
  });
  if (updated) res.json(db);
  else res.status(404).send('Not found');
});

app.delete('/api/events-list', (req, res) => {
  const ids = req.body.eventIds || [];
  db = db.filter((e) => !ids.includes(e.id));
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});

  
```  
---  
## 5. Playwright 설정 (`playwright.config.ts`)<br>  
Playwright가 테스트를 실행할 때 `pnpm dev`로 Vite 서버와 함께 위의 서버도 자동 실행되도록 설정한다.  
```typescript  
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/e2e',
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'pnpm dev',
      port: 5173,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'node server_e2e.js',
      port: 3000,
      reuseExistingServer: !process.env.CI,
    },
  ],
}  
```  
## 6. package.json설정<br>  
```typescript  
"scripts": {
    // 추가
    "server:watch": "node --watch server_e2e.js",
    ...
  },  
```  
---  
## 7. 효과 및 정리<br>  
|항목|개선 전|개선 후|  
|:---|:---|:---|
|상태 초기화|수동 삭제 필요|자동 초기화 API 제공|  
|테스트 재현성|실행 순서에 따라 불안정|항상 동일한 초기 상태|  
|파일 I/O|매 요청마다 파일 저장|메모리 기반, 빠르고 깔끔함|  
|CI 환경 대응|불안정|완전 대응 가능|  
