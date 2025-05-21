## 🧩 문제<br>  
> React 앱에서 반복 일정 수정 또는 추가 시,  
  
---  
## ⚠️ 에러 메시지<br>  
```bash  
Warning: Encountered two children with the same key, `ㅁㄴㅇ-2025-05-03-1`.
Keys should be unique so that components maintain their identity across updates.
Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported.  
```  
---  
## 🔍 원인 분석<br>  
* 반복 일정 생성 로직에서 이벤트 ID를 다음 방식으로 생성하고 있었음:  
* 이 방식은 **title, date가 동일한 이벤트가 반복적으로 등록될 경우 동일한 ID가 생성될 수밖에 없음**  
* 특히 사용자가 같은 이벤트를 여러 번 수정/등록하면서 중복 ID가 계속 생성되어 `key` 충돌 발생  
---  
## ✅ 해결 방법<br>  
### 1. **ID 생성 함수 추가 (****`generateEventId`****)**<br>  
```typescript  
function generateEventId(event: EventForm, index: number, seed: string): string {
  const safeTitle = event.title.replace(/\s/g, '');
  const safeTime = `${event.date}-${event.startTime}`.replace(/:/g, '');
  return `${safeTitle}-${safeTime}-${seed}-${index + 1}`;
}  
```  
* `seed`는 고정값 (`Date.now().toString()` 등)으로 생성 시점마다 다르게 유지  
* 이벤트 생성 시 `title + time + seed + index` 조합으로 고유한 ID 보장  
---  
### 2. **`createRepeatingEvents()`**** 내부 ID 생성 방식 변경**<br>  
```typescript  
const seed = Date.now().toString(); // 반복 그룹 고유 식별자

return dates.map((date, index) => {
  const formattedDate = formatDate(date);
  return {
    ...eventData,
    date: formattedDate,
    id: generateEventId({ ...eventData, date: formattedDate }, index, seed),
  };
});  
```  
---  
## ✨ 변경 결과<br>  
* 모든 반복 일정은 고유한 `event.id`를 가지므로 **React key 경고 사라짐**  
* 이벤트가 여러 번 반복 등록/수정되더라도 충돌 없이 동작  
* 데이터 안정성 및 사용자 경험 개선  
---  
## 💡 학습 포인트<br>  
* React에서 key는 **UI 재사용 및 성능 최적화의 핵심**이므로 고유성 필수  
* 반복 이벤트는 **생성 타이밍마다 다르게 식별**되는 것이 중요  
* 단순 `index` 기반이 아니라 `seed + index` 혹은 `uuid` 사용이 보다 안전  
