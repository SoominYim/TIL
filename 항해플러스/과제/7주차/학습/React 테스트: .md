# React 테스트: `await` vs `waitFor`<br>  
---  
## 1. 주요 내용 정리<br>  
### `await`<br>  
* **역할**: 비동기 작업(Promise)의 완료를 기다림.  
* **사용 위치**: 비동기 함수 호출 후 작업 완료를 보장해야 할 때.  
* **예제**:  
```javascript  
await act(async () => {
  await result.current.saveEvent(newEvent);
});
  
```  
* `saveEvent`가 비동기 함수이므로 완료를 보장.  
* React 상태 업데이트는 `act`로 래핑해야 React가 상태 변경을 적절히 반영.  
---  
### `waitFor`<br>  
* **역할**: 특정 조건이 충족될 때까지 기다림.  
* **사용 위치**: 비동기 작업 후 값의 상태나 결과를 검증할 때.  
* **예제**:  
```javascript  
await waitFor(() => {
  expect(result.current.events).toEqual(eventsForTest);
});
  
```  
* 네트워크 요청 후 데이터가 업데이트되었는지 확인.  
---  
### 두 개의 조합 사용 이유<br>  
* `await`: 비동기 작업의 완료를 보장.  
* `waitFor`: 작업 결과가 예상대로 반영되었는지 확인.  
---  
## 2. 테스트 흐름<br>  
1. 비동기 작업 시작 → **`await`** 사용.  
1. 상태 업데이트 확인 → **`waitFor`** 사용.  
---  
## 3. 정리된 코드 스니펫<br>  
```javascript  
await act(async () => {
  await result.current.saveEvent(newEvent); // 비동기 작업 완료
});

await waitFor(() => {
  expect(result.current.events).toContain(newEvent); // 결과 검증
});
  
```  
---  
## 4. 활용 시 참고<br>  
* **`await`****는 작업의 완료**를, **`waitFor`****은 상태 검증**을 위해 사용.  
* 테스트의 안정성을 위해 React 상태 업데이트는 항상 `act`로 감싸는 것을 권장.  
---  
## 5. 간단한 순서도 (선택 사항)<br>  
### 테스트 단계:<br>  
1. 비동기 작업 호출 (e.g., `saveEvent`).  
1. `await`로 작업 완료 대기.  
1. `waitFor`로 상태 검증.  
```plain text  
비동기 함수 호출
    |
    v
 `await`로 대기
    |
    v
결과 검증 (`waitFor`)
    |
    v
테스트 완료  
```  
---  
