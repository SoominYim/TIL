### 📌 목적<br>  
* 반복 일정인 경우, 캘린더 셀 내에 `repeat` 아이콘(`cycle`)이 표시되는지 확인  
* 반복 일정을 **수정하거나 단독 일정으로 바꿨을 때**, 아이콘이 올바르게 반영되는지 확인  
---  
### 🧪 현재 단위 테스트 구조<br>  
```typescript  
it('반복 일정 수정 후 repeat 아이콘이 여전히 표시된다', async () => {
  setupMockHandlerUpdating([
    {
      id: '3',
      title: '반복 회의',
      date: '2025-10-02',
      startTime: '10:00',
      endTime: '11:00',
      description: '매일 반복 회의',
      location: '회의실 A',
      category: '업무',
      repeat: {
        type: 'monthly',
        interval: 1,
        endType: 'date',
        endDate: '2025-10-05',
      },
      notificationTime: 10,
    },
  ]);

  const { user } = setup(<App />);
  const editButton = (await screen.findAllByLabelText('Edit event'))[0];
  await user.click(editButton);

  await user.clear(screen.getByLabelText('제목'));
  await user.type(screen.getByLabelText('제목'), '수정된 반복 일정');

  await user.selectOptions(screen.getByLabelText('반복 유형'), 'monthly');
  await user.selectOptions(screen.getByLabelText('반복 종료 방식'), 'date');
  await user.type(screen.getByLabelText('반복 종료일'), '2025-10-05');

  await user.click(screen.getByTestId('event-submit-button'));

  const monthView = within(await screen.findByTestId('month-view'));
  const updatedEvent = await monthView.findByText('수정된 반복 일정');
  const container = updatedEvent.closest('div')!;
  expect(within(container).getByText('cycle')).toBeInTheDocument();
});  
```  
```typescript  
it('반복 일정 → 단독 일정으로 수정 시 repeat 아이콘이 사라진다', async () => {
  setupMockHandlerUpdating();
  const { user } = setup(<App />);

  const editButton = (await screen.findAllByLabelText('Edit event'))[0];
  await user.click(editButton);

  const checkbox = screen.getByLabelText('반복 일정');
  if (checkbox instanceof HTMLInputElement && checkbox.checked) {
    await user.click(checkbox); // 체크 해제
  }

  await user.click(screen.getByTestId('event-submit-button'));

  const eventBox = (await screen.findByText(/.+/)).closest('div')!;
  expect(within(eventBox).queryByText('cycle')).not.toBeInTheDocument();
});  
```  
---  
### 🎯 단위 테스트 한계<br>  
|한계|설명|  
|:---|:---|
|상태 불연속성|`setupMockHandlerUpdating`에서 수정은 되지만, 이후 `GET` 결과에는 반영되지 않음|  
|이름 수정 시 테스트 실패|실제 UI는 수정되었지만 mock 상태가 유지되지 않아 `findByText('수정된 제목')`이 실패할 수 있음|  
|`repeat` 정보가 시각적으로 반영됐는지 검증 불확실|데이터 수정이 아닌 UI 렌더링 상태를 확인하기 때문에 전체 흐름 보장 어려움|  
---  
### 🔄 E2E 전환 계획<br>  
* Cypress 또는 Playwright 기반의 브라우저 E2E 테스트로 전환 예정  
* 실제 사용자 흐름처럼:  
* 상태 조작 없이 실질적인 DOM 확인 + 시나리오 기반 테스트 가능  
---  
### ✅ 정리<br>  
|케이스|단위 테스트 상태|향후|  
|:---|:---|:---|
|반복 일정 수정 후 아이콘 유지|구현 완료|E2E 전환 예정|  
|반복 일정 해제 후 아이콘 사라짐|구현 완료|E2E 전환 예정|  
---  
### 💡 비고<br>  
* 현재는 `msw`와 `mockEvents` 기반으로 흐름을 흉내냄  
* 복잡한 데이터 흐름/상태 연속성 문제는 추후 통합 테스트에서 자연스럽게 해결될 예정  
