## **파일 구조 및 역할**<br>  
### **1. 핵심 파일**<br>  
<details><summary>파일 목록</summary>  
  
  * **setupTests.ts**: 테스트 환경 초기화 및 MSW 서버 설정  
```typescript  
  /* setupTests.ts */
  // MSW 서버 인스턴스를 생성하고 전역으로 노출
  export const server = setupServer(...handlers);
  
  // 모든 테스트 실행 전 서버 시작
  beforeAll(() => { server.listen(); });
  
  // 각 테스트마다 assertion이 있는지 확인
  beforeEach(() => { expect.hasAssertions(); });
  
  // 각 테스트 후 핸들러 초기화 및 모킹 클리어
  afterEach(() => { server.resetHandlers(); vi.clearAllMocks(); });
  
  // 모든 테스트 완료 후 서버 종료
  afterAll(() => { vi.resetAllMocks(); server.close(); });  
```  
  
* **`handlers.ts`**: API 요청에 대한 모의 응답 핸들러 정의  
```typescript  
  /* src/__mocks__/handlers.ts */
  // 이벤트 목록 조회 (GET)
  http.get('/api/events', () => {
    return HttpResponse.json({ events });
  }),
  
  // 새 이벤트 생성 (POST)
  http.post('/api/events', async ({ request }) => {
    const newEvent = (await request.json()) as Event;
    events.push(newEvent); // 메모리에 이벤트 추가
    return HttpResponse.json({ newEvent });
  }),
  
  // 이벤트 수정 (PUT)
  http.put('/api/events/:id', async ({ request, params }) => {
    // 파라미터로 전달된 ID를 가진 이벤트 찾아서 업데이트
    const updatedEvent = (await request.json()) as Event;
    const eventIndex = events.findIndex((event) => event.id === params.id);
    if (eventIndex !== -1) {
      events[eventIndex] = updatedEvent;
    }
    return HttpResponse.json({ updatedEvent });
  }),
  
  // 이벤트 삭제 (DELETE)
  http.delete('/api/events/:id', ({ params }) => {
    // 파라미터로 전달된 ID를 가진 이벤트 삭제
    const eventIndex = events.findIndex((event) => event.id === params.id);
    if (eventIndex !== -1) {
      events.splice(eventIndex, 1);
      return HttpResponse.json(null, { status: 204 });
    }
    return HttpResponse.json({ message: '이벤트 삭제 실패' }, { status: 404 });
  }),  
```  
  
* **`handlersUtils.ts`**: 테스트 간 독립성을 보장하는 핸들러 설정 유틸리티  
```typescript  
  /* src/__mocks__/handlersUtils.ts */
  // 각 테스트마다 독립적인 이벤트 배열 생성하여 오염 방지
  export const setupMockHandlerCreation = (initEvents = [] as Event[]) => {
    const mockEvents: Event[] = [...initEvents]; // 초기 이벤트 복사본 생성
    
    // 테스트별 독립적인 핸들러 오버라이드 설정
    server.use(
      http.get('/api/events', () => {
        return HttpResponse.json({ events: mockEvents });
      }),
      http.post('/api/events', async ({ request }) => {
        // 독립적인 mockEvents 배열에 새 이벤트 추가
        const newEvent = (await request.json()) as Event;
        mockEvents.push(newEvent);
        return HttpResponse.json({ newEvent });
      })
    );
  };  
```  
  
* **`useEventOperations.ts`**: 이벤트 CRUD 기능을 제공하는 커스텀 훅  
```typescript  
  /* src/hooks/useEventOperations.ts */
  // 이벤트 목록 상태 관리 및 CRUD 작업 수행 훅
  export const useEventOperations = (editing: boolean, onSave?: () => void) => {
    // 이벤트 목록을 저장할 상태
    const [events, setEvents] = useState<Event[]>([]);
    
    // 사용자 피드백을 위한 토스트 훅
    const toast = useToast();
    
    // 이벤트 목록 조회 함수
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const { events } = await response.json();
        setEvents(events);
      } catch (error) {
        // 에러 처리 및 토스트 알림
        toast({
          title: '이벤트 로딩 실패',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };
    
    // 이벤트 저장 함수 (POST/PUT)
    const saveEvent = async (eventData: Event | EventForm) => {
      // 편집 모드에 따라 PUT 또는 POST 요청 수행
      // 성공/실패 시 토스트 알림 표시
    };
    
    // 이벤트 삭제 함수 (DELETE)
    const deleteEvent = async (id: string) => {
      // DELETE 요청 및 에러 처리
      // 성공/실패 시 토스트 알림 표시
    };
    
    // 초기화 시 이벤트 로딩
    useEffect(() => { init(); }, []);
    
    return { events, fetchEvents, saveEvent, deleteEvent };
  };  
```  
  
* **`medium.useEventOperations.spec.ts`**: 커스텀 훅 테스트 파일  
```typescript  

  /* src/__tests__/hooks/medium.useEventOperations.spec.ts */
  // 토스트 알림을 모킹하여 UI 피드백 테스트
  const mockToastInstance = vi.fn();
  vi.mock('@chakra-ui/react', async (importOriginal) => {
    // 실제 모듈 유지하면서 useToast만 모킹
    const actual = await importOriginal<typeof import('@chakra-ui/react')>();
    return {
      ...actual,
      useToast: () => mockToastInstance,
    };
  });
  
  // 각 테스트마다 독립적인 상태로 시작
  beforeEach(() => {
    setupMockHandlerCreation(eventsForTest);
  });
  
  // 이벤트 로딩 성공 테스트
  it('저장되어있는 초기 이벤트 데이터를 적절하게 불러온다', async () => {
    const { result } = renderHook(() => useEventOperations(true));

    await waitFor(() => {
      // 이벤트 데이터 확인
      expect(result.current.events).toEqual(eventsForTest);
      // 토스트 호출 확인
      expect(mockToastInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '일정 로딩 완료!',
          status: 'info',
          duration: 1000,
        })
      );
    });
  });
  
```  
  
</details>  
  
---  
  
### **2. 동작 방식**<br>  
**가상 서버 (MSW) 작동 흐름**  
1. `setupTests.ts`에서 MSW 서버 초기화  
```typescript  
   /* setupTests.ts */
   // 테스트 시작 전 MSW 서버 시작
   beforeAll(() => { server.listen(); });  
```  
  
2. `handlers.ts`에서 API 엔드포인트별 모의 응답 정의  
```typescript  
   /* src/__mocks__/handlers.ts */
   // 각 HTTP 메서드별 응답 핸들러 등록
   export const handlers = [
     http.get('/api/events', () => { /* ... */ }),
     http.post('/api/events', () => { /* ... */ }),
     // ...
   ];  
```  
  
3. `handlersUtils.ts`에서 테스트별 독립적인 상태 관리  
```typescript  
   /* src/__mocks__/handlersUtils.ts */
   // 테스트마다 고유한 데이터 상태 제공
   setupMockHandlerCreation(testData);  
```  
  
---  
  
### 3. 테스트 실행 플로우<br>  
1. 테스트 시작 시 MSW 서버 준비  
```typescript  
   /* setupTests.ts */
   // 모든 테스트가 시작되기 전 서버 시작
   beforeAll(() => { server.listen(); });  
```  
  
2. 각 테스트에서 독립적인 상태 설정  
```typescript  
   /* src/__tests__/hooks/medium.useEventOperations.spec.ts */
   // 각 테스트마다 독립적인 데이터로 환경 초기화
   beforeEach(() => {
     setupMockHandlerCreation(eventsForTest);
   });  
```  
  
3. 훅 렌더링 및 기능 테스트  
```typescript  
   /* src/__tests__/hooks/medium.useEventOperations.spec.ts */
   // 훅 렌더링 후 결과 검증
   const { result } = renderHook(() => useEventOperations(true));
   
   // 비동기 작업 완료 대기 및 검증
   await waitFor(() => {
     expect(result.current.events).toEqual(eventsForTest);
   });  
```  
  
4. 테스트 종료 시 정리  
```typescript  
   /* setupTests.ts */
   // 각 테스트 후 서버 핸들러 초기화
   afterEach(() => { server.resetHandlers(); });
   
   // 모든 테스트 완료 후 서버 종료
   afterAll(() => { server.close(); });  
```  
  
**동작 흐름도**  
```plain text  
[1] 테스트 시작
    ↓
[2] MSW 서버 초기화 (setupTests.ts)
    ↓
[3] 독립적인 테스트 환경 구성 (handlersUtils.ts)
    ↓
[4] 커스텀 훅 렌더링 및 테스트 (useEventOperations.spec.ts)
    ↓
[5] API 요청 발생 (useEventOperations.ts)
    ↓
[6] MSW 핸들러가 요청 가로채기 (handlers.ts)
    ↓
[7] 모의 응답 반환
    ↓
[8] 결과 검증
    ↓
[9] 테스트 정리 및 종료  
```  
  
---  
  
### 4. 의존 관계<br>  
```plain text  
setupTests.ts ← handlers.ts
       ↑
       |
handlersUtils.ts → useEventOperations.spec.ts → useEventOperations.ts  
```  
  
* `setupTests.ts`는 `handlers.ts`의 핸들러로 서버 구성  
```typescript  
  /* setupTests.ts */
  // handlers.ts의 핸들러 배열을 서버 구성에 사용
  export const server = setupServer(...handlers);  
```  
  
* `handlersUtils.ts`는 `setupTests.ts`의 서버 인스턴스 활용  
```typescript  
  /* src/__mocks__/handlersUtils.ts */
  // 서버 인스턴스 재사용하여 핸들러 오버라이드
  server.use(http.get('/api/events', () => { /* ... */ }));  
```  
  
* 테스트 파일은 `handlersUtils.ts`로 독립적 환경 구성  
```typescript  
  /* src/__tests__/hooks/medium.useEventOperations.spec.ts */
  // 테스트마다 독립적인 상태 설정
  setupMockHandlerCreation(testData);  
```  
  
---  
  
### 5. 특징<br>  
* **병렬 테스트 지원**  
```typescript  
  /* src/__mocks__/handlersUtils.ts */
  // 각 테스트마다 독립적인 mockEvents 배열 생성
  const mockEvents: Event[] = [...initEvents];  
```  
  
* **모의 네트워크 요청**  
```typescript  
  /* src/__mocks__/handlers.ts */
  // 실제 API 대신 MSW 핸들러가 응답 제공
  http.get('/api/events', () => HttpResponse.json({ events }));  
```  
  
* **토스트 메시지 검증**  
```typescript  
  /* src/__tests__/hooks/medium.useEventOperations.spec.ts */
  // 토스트 함수 호출 검증
  expect(mockToastInstance).toHaveBeenCalledWith(
    expect.objectContaining({
      title: '일정 로딩 완료!',
      status: 'info'
    })
  );  
```  
  
* **CRUD 작업 검증**  
```typescript  
  /* src/__tests__/hooks/medium.useEventOperations.spec.ts */
  // 이벤트 생성, 수정, 삭제 작업 검증 테스트
  it('정의된 이벤트 정보를 기준으로 적절하게 저장이 된다', async () => {
    // ...
  });  
```  
  
