## **핵심: vi.mock의 역할**<br>  
vi.mock은 테스트 중 특정 모듈의 동작을 제어하기 위해 사용된다. 본 문서는 @chakra-ui/react의 useToast 훅 모킹 예제를 통해 vi.mock의 사용법과 필요성을 설명한다.  
## **예시 코드**<br>  
테스트 파일(useEventOperations.spec.ts) 내 코드:  
```typescript  
vi.mock('@chakra-ui/react', () => ({
	useToast: vi.fn(),
}));  
```  
## **코드 분석**<br>  
1. **`vi.mock('@chakra-ui/react', ...)`**:  
1. **`() => ({ useToast: vi.fn() }`****)**:  
1. **`useToast`****: vi.fn()**:  
## **모킹(Mocking) 사용 이유**<br>  
`useEventOperations.spec.ts`는 useEventOperations 커스텀 훅을 테스트한다. 이 훅은 사용자 알림을 위해 Chakra UI의 `useToast`를 사용하여 토스트 메시지를 표시할 수 있다.  
테스트 환경에서 실제 `useToast` 대신 모의 객체를 사용하는 주된 이유는 다음과 같다.  
* **단위 테스트 격리 (Isolation)**:  
   * 단위 테스트는 대상 코드(예: useEventOperations 훅) 기능만 독립적으로 검증한다. `useToast`는 UI 렌더링 등 외부 의존성을 가지므로, 모킹을 통해 테스트 대상을 외부 환경으로부터 격리한다.  
* **부작용 방지 (Preventing Side Effects)**:  
   * 실제 `useToast`는 화면에 토스트 메시지를 렌더링하는 부작용을 발생시킨다. 테스트 중 이러한 실제 UI 변경은 불필요하며, 테스트 불안정성을 야기할 수 있다.  
* **동작 제어 및 검증 (Controlling and Verifying Behavior)**:  
   * `useToast`를 `vi.fn()`으로 모킹하면, useEventOperations 훅이 특정 상황에서 `useToast`를 올바르게 호출하는지(예: 정확한 메시지 전달) 감시하고 검증할 수 있다.  
   * 예: `expect(mockedUseToastFn).toHaveBeenCalledWith({ title: '성공!', status: 'success' });`  
* **테스트 속도 및 안정성 향상 (Improving Test Speed and Stability)**:  
   * 외부 라이브러리의 실제 동작은 테스트 속도를 저하하거나 예기치 않은 테스트 실패를 유발할 수 있다. 모킹은 이러한 문제를 줄여 테스트 속도 및 안정성을 향상시킨다.  
## **결론**<br>  
위 예시에서 `vi.mock`은 useEventOperations 훅이 Chakra UI의 `useToast` 기능을 사용할 때, 실제 토스트 메시지를 화면에 표시하는 대신, `useToast`가 의도한 대로 올바르게 호출되었는지 검증하는 역할을 한다.  
