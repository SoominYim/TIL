## **🚨 문제 상황**<br>  
* 테스트에서 객체가 특정 키-값 쌍들을 **포함**하는지 확인 필요. toEqual만 사용할 경우 10월 공휴일 전부 확인 되므로 테스트 실패  
   * 예: holidays 객체에 10월 공휴일 외 다른 정보가 포함 시, 테스트 실패.  
  
## **🛠 원인**<br>  
1. `Vitest/Jest`의 `toEqual` 메서드는 객체 전체의 **정확한 일치**를 검사.  
1. 핵심 속성 외 다른 속성이 객체에 있으면 `toEqual` 직접 비교는 실패. 객체 일부 내용만 확인 시 문제 발생.  
  
## **🔍 현재 코드의 문제점 (해결 전 가정)**<br>  
* `easy.useCalendarView.spec.ts`에서 `result.current.holidays` 객체 검증 시 `toEqual` 직접 사용. `holidays`에 예상 외 다른 날짜 정보 포함 시 테스트 실패.  
**easy.useCalendarView.spec.ts (수정 전 가상 코드)**  
```typescript  
it('holidays는 10월 휴일인 개천절, 한글날을 포함 (엄격한 비교)', () => {
  const MOCK_TODAY = new Date(2025, 9, 1);
  vi.useFakeTimers();
  vi.setSystemTime(MOCK_TODAY);
  const { result } = renderHook(() => useCalendarView());
  // 문제점: '2025-10-03', '2025-10-09' 외 다른 속성 있으면 실패
  expect(result.current.holidays).toEqual({
    '2025-10-03': '개천절',
    '2025-10-09': '한글날',
  });
  vi.useRealTimers();
});  
```  
  
## **✅ 해결 방법**<br>  
**👉 ****`expect.objectContaining`****사용**  
* `toEqual`과 `expect.objectContaining`을 함께 사용. `result.current.holidays` 객체가 명시된 키-값 쌍들을 **포함**하는지만 검사하도록 변경. 다른 속성이 있어도 필수 정보만 정확하면 테스트 통과.  
**easy.useCalendarView.spec.ts (수정 후 실제 코드)**  
```typescript  
it('holidays는 10월 휴일인 개천절, 한글날이 포함되어 있어야 한다', () => {
  const MOCK_TODAY = new Date(2025, 9, 1);
  vi.useFakeTimers();
  vi.setSystemTime(MOCK_TODAY);
  const { result } = renderHook(() => useCalendarView());
  expect(result.current.holidays).toEqual(
    // 해결: expect.objectContaining 사용
    expect.objectContaining({
      '2025-10-03': '개천절',
      '2025-10-09': '한글날',
    })
  );
  vi.useRealTimers();
});  
```  
* `expect.objectContaining`은 `result.current.holidays` 객체 내 '2025-10-03': '개천절'과 '2025-10-09': '한글날' 존재 여부만 확인. `holidays` 객체에 다른 날짜 정보가 추가로 있어도 테스트 통과.  
## **✨ 결과**<br>  
* `expect.objectContaining` 사용으로 테스트 코드 유연성 향상. `holidays` 객체에 검증 대상 외 다른 데이터가 있어도, 핵심 공휴일 정보 존재 유무만 정확히 테스트 가능.  
* 테스트 의도 명확화, 불필요한 테스트 실패 감소, 테스트 코드 견고성 및 유지보수성 증대.  
---  
## **💡 학습 포인트**<br>  
* **`expect.objectContaining(object)`**: 실제 객체가 인자로 전달된 object의 모든 키-값 쌍을 포함하는지 검증. 실제 객체는 인자 object에 없는 추가 프로퍼티 소유 가능.  
* **사용 시기**: 객체 일부 속성만 검증 시 유용. (예: API 응답 일부 필드, 상태 객체 특정 값 검사)  
* **장점**:  
   * **유연성**: 객체 전체 아닌, 일부 중요 부분만 집중 테스트.  
   * **견고성**: 객체에 새 속성 추가돼도 기존 테스트 핵심 로직에 영향 최소화.  
   * **가독성**: 테스트 의도(특정 데이터 포함 여부) 명확화.  
  
