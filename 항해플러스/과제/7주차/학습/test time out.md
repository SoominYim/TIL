## 🚨 문제 상황<br>  
* 테스트 실행 시 시간 초과 발생.  
* 비동기 작업 완료 전 결과를 검증해 간헐적으로 실패.  
---  
### 🛠 원인<br>  
1. **`userEvent.type`****의 기본 지연 시간**  
1. **비동기 작업 완료 대기 누락**  
---  
## 🔍 현재 코드의 문제점 및 해결 방법<br>  
---  
### 문제점<br>  
* `userEvent.type` 기본 설정이 테스트를 불필요하게 지연시킴.  
* 비동기 작업 완료를 명시적으로 기다리지 않아 실패 발생.  
---  
### 기존 코드<br>  
```typescript  
tsx
복사편집
const user = userEvent.setup(); // 기본 지연 시간 사용
await user.type(screen.getByLabelText('제목'), newEvent.title);
await user.type(screen.getByLabelText('날짜'), newEvent.date);
const eventList = await screen.findByTestId('event-list');
expect(within(eventList).getByText(newEvent.title)).toBeInTheDocument();

  
```  
---  
## ✅ 해결 방법<br>  
### 해결 방안<br>  
1. **`userEvent.setup({ delay: null })`****로 지연 시간 제거**  
1. **`waitFor`****로 비동기 작업 대기**  
---  
### 수정된 코드<br>  
```typescript  
tsx
복사편집
const user = userEvent.setup({ delay: null }); // 지연 제거
await user.type(screen.getByLabelText('제목'), newEvent.title);
await user.type(screen.getByLabelText('날짜'), newEvent.date);
await waitFor(() => { // 비동기 작업 완료 대기
  const eventList = screen.getByTestId('event-list');
  expect(within(eventList).getByText(newEvent.title)).toBeInTheDocument();
});

  
```  
---  
### 변경 요약<br>  
* **`delay: null`**** 추가**  
* **`waitFor`**** 사용**  
---  
## ✨ 결과<br>  
* 테스트 실행 시간이 단축됨.  
* 비동기 검증으로 시간 초과 및 간헐적 실패 해결.  
---  
## 💡 학습 포인트<br>  
* `userEvent` 설정 최적화로 성능 개선 가능.  
* `waitFor`로 비동기 작업 완료를 명시적으로 기다려야 테스트가 안정적임.  
* 비동기 처리와 DOM 업데이트 타이밍을 고려한 테스트 설계 중요.  
## 🚨 문제 상황<br>  
* 정상적으로 작동하던 테스트가 컴포넌트를 분리한 이후 **시간 초과** 오류가 발생.  
* 비동기 작업 완료 전 DOM 업데이트를 검증하려다 실패가 발생함.  
---  
### 🛠 원인<br>  
1. **컴포넌트 분리로 인해 렌더링 구조 변경**  
1. **`userEvent.type`****의 기본 지연 시간**  
1. **비동기 작업 대기 누락**  
---  
## 🔍 현재 코드의 문제점 및 해결 방법<br>  
---  
### 문제점<br>  
* 컴포넌트 분리 이후 DOM 업데이트 타이밍이 달라져 검증 실패.  
* `userEvent.type` 기본 설정으로 테스트 속도가 느려짐.  
* 비동기 작업 완료를 명시적으로 기다리지 않음.  
---  
### 기존 코드<br>  
```typescript  
tsx
복사편집
it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
  const user = userEvent.setup(); // 기본 지연 사용
  renderApp();

  await user.type(screen.getByLabelText('제목'), newEvent.title);
  await user.type(screen.getByLabelText('날짜'), newEvent.date);
  // 결과 검증
  const eventList = await screen.findByTestId('event-list');
  expect(within(eventList).getByText(newEvent.title)).toBeInTheDocument();
});

  
```  
---  
## ✅ 해결 방법<br>  
### 해결 방안<br>  
1. **`userEvent.setup({ delay: null })`****로 지연 시간 제거**  
1. **`waitFor`****를 사용해 비동기 작업 완료 대기**  
1. **컴포넌트 분리 후 상태 관리 및 렌더링 로직 점검**  
---  
### 수정된 코드<br>  
```typescript  
tsx
복사편집
it('입력한 새로운 일정 정보에 맞춰 모든 필드가 이벤트 리스트에 정확히 저장된다.', async () => {
  const user = userEvent.setup({ delay: null }); // 지연 제거
  renderApp();

  await user.type(screen.getByLabelText('제목'), newEvent.title);
  await user.type(screen.getByLabelText('날짜'), newEvent.date);

  // 제출 및 결과 대기
  const submitButton = screen.getByTestId('event-submit-button');
  await user.click(submitButton);

  // 비동기 작업 대기 후 결과 검증
  await waitFor(() => {
    const eventList = screen.getByTestId('event-list');
    expect(within(eventList).getByText(newEvent.title)).toBeInTheDocument();
  });
});

  
```  
---  
### 변경 요약<br>  
1. **`delay: null`**** 추가**  
1. **`waitFor`****로 비동기 상태 대기**  
1. **컴포넌트 분리와 상태 의존성 확인**  
---  
## ✨ 결과<br>  
* 테스트 실행 속도가 향상되고 시간 초과 문제 해결.  
* 비동기 작업과 DOM 업데이트를 명시적으로 처리해 테스트 안정성 확보.  
---  
## 💡 학습 포인트<br>  
1. **컴포넌트 분리 시 테스트 구조 점검**  
1. **`userEvent`**** 최적화**  
1. **`waitFor`****로 비동기 검증**  
