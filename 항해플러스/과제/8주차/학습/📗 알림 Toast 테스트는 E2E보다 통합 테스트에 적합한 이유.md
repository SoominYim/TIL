## 알림 Toast 테스트는 E2E보다 통합 테스트에 적합한 이유<br>  
### 개요<br>  
알림 기능은 시간 기반 동작(예: 시작 1분 전 알림)이라는 특성상, 테스트 시점과 무관하게 일정한 결과를 보장하기 어려움  
이 때문에 Playwright 기반의 E2E 테스트로는 **정확하고 안정적인 알림 테스트가 어려우며,**  
대신 **통합 테스트에서 알림 로직 자체를 단독으로 검증하는 것이 더 신뢰성 있고 효과적**  
---  
### ✅ E2E 테스트에서의 문제점<br>  
|문제점|설명|  
|:---|:---|
|시스템 시간 조작 불가|Playwright는 `setSystemTime()` 같은 기능을 제공하지 않음|  
|알림 발생 타이밍 불확실|`setTimeout` 기반 알림은 브라우저 환경/속도에 따라 다르게 동작|  
|flaky 테스트 위험|알림이 나타나는 시점이 다르거나 누락되어 테스트가 불안정해짐|  
|검증 지점 모호|Toast DOM 요소가 뜨는 시점이 예측 불가해 `expect(...).toBeVisible()`도 실패 가능|  
---  
### ✅ 통합 테스트에서의 장점<br>  
|항목|장점|  
|:---|:---|
|알림 로직 단독 테스트|`useNotifications` 등의 훅 또는 유틸 함수 자체를 테스트 가능|  
|시스템 시간 제어|`vi.useFakeTimers()`, `vi.setSystemTime()`으로 정확한 타이밍 제어|  
|상태 기반 검증|UI가 아니라 내부 `notifications`, `notifiedEvents` 배열 등을 직접 확인|  
|빠르고 안정적|1초 이내에 실행되는 확정적인 테스트 구성 가능|  
---  
### ✅ 예시 코드: useNotifications 통합 테스트<br>  
```typescript  

import { renderHook } from '@testing-library/react';
import { useNotifications } from '../../hooks/useNotifications';
import { vi } from 'vitest';

vi.useFakeTimers();
vi.setSystemTime(new Date('2025-05-22T13:59:00'));

const testEvent = {
  id: '1',
  title: '곧 시작',
  date: '2025-05-22',
  startTime: '14:00',
  endTime: '15:00',
  notificationTime: 1,
};

test('지정된 시간이 되면 알림이 생성된다', () => {
  const { result } = renderHook(() => useNotifications([testEvent]));

  vi.advanceTimersByTime(60_000); // 1분 경과

  expect(result.current.notifications).toHaveLength(1);
  expect(result.current.notifications[0].title).toBe('곧 시작');
});  
```  
---  
### ✅ 결론<br>  
* 알림 기능은 **시간 제어가 핵심**인 테스트이므로,  
* E2E에서는 단순히 "Toast가 보이는가" 수준까지만 검증하고,  
* **알림 트리거와 상태 변화는 통합 테스트로 명확히 분리해 테스트**해야 안정성과 정확성을 보장할 수 있음.  
