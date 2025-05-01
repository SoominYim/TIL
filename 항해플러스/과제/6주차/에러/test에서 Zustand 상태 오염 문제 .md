## 🚨 문제 상황<br>  
* 테스트가 개별적으로 실행하면 모두 통과하지만, 전체 테스트를 한 번에 실행할 때는 두 번째 테스트가 실패하는 문제가 발생함.  
* 구체적으로, "새 게시물 추가를 허용합니다" 테스트에서 "He was an expert but not in a discipline"이라는 게시물 제목을 찾을 수 없다는 오류가 나타남.  
* 콘솔 로그를 확인해보니 모든 게시물 제목이 첫 번째 게시물인 "His mother had always taught him"으로만 출력되는 현상이 발견됨.  
  
### **🛠 원인**<br>  
1. 이는 테스트 간에 상태가 제대로 초기화되지 않아 첫 번째 테스트의 검색 결과가 두 번째 테스트에 영향을 미치고 있음을 시사함.  
1. **`Zustand`**** 상태 오염**: `useFilterStore`의 `searchQuery` 상태가 테스트 간에 공유되어, 첫 번째 테스트에서 설정한 "His mother had always taught him" 검색어가 두 번째 테스트에도 유지됨. 이로 인해 두 번째 테스트에서는 검색 필터링된 결과만 표시되어 다른 게시물들이 화면에 나타나지 않음.  
1. **컴포넌트 렌더링 누락**: 원래 코드에서 두 번째 테스트의 `renderPostsManager()` 호출 부분이 누락되어 있어, DOM에 컴포넌트가 제대로 렌더링되지 않는 문제가 있었음. 이 때문에 DOM 요소를 찾으려는 시도가 실패함.  
1. **API 호출 동작 변경**: `searchQuery`가 설정된 상태에서는 애플리케이션이 일반 게시물 목록 API 대신 검색 API를 호출하게 되어, 전체 게시물 목록이 아닌 검색 결과만 표시됨.  
  
### **🔍 현재 코드의 문제점 및 해결 방법**<br>  
---  
## **🔍 1. 현재 코드의 문제점**<br>  
* `Zustand` 스토어인 `useFilterStore`의 `searchQuery` 상태가 테스트 간에 초기화되지 않아 상태 오염이 발생함.  
* 두 번째 테스트에서 `renderPostsManager()`호출이 누락되어 있어 DOM에 컴포넌트가 제대로 렌더링되지 않음.  
* 첫 번째 테스트의 검색 상태가 두 번째 테스트에 영향을 주어, 두 번째 테스트에서는 검색 결과만 표시되어 전체 게시물 확인이 불가능함.  
### **basic.test.ts**<br>  
```typescript  

// 1번 문제: afterEach에서 searchQuery만 초기화하는 부분이 없음
afterEach(() => {
  cleanup();
  // searchQuery 초기화 코드가 없음
})

// 2번 문제: 두 번째 테스트에서 renderPostsManager() 호출 누락
it("새 게시물 추가를 허용합니다", async () => {
  const user = userEvent.setup();
  const NEW_POST = {
    id: TEST_POSTS.posts.length + 1,
    title: "New Post",
    body: "This is a new post",
    userId: 1,
    tags: [],
  };
  
  // POST 요청에 대한 핸들러 추가
  server.use(
    http.post("/api/posts/add", async ({ request }) => {
      // ...
    }),
  );

  // renderPostsManager() 호출이 누락됨
  
  // 바로 waitFor로 넘어감
  await waitFor(() => {
    TEST_POSTS.posts.forEach((post) => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
      console.log(post.title);
    });
  });
  
  // ... 나머지 테스트 코드
})  
```  
  
  
## **✅ 2. 해결 방법**<br>  
### **👉 Zustand 상태 초기화 추가**<br>  
`afterEach` 함수에 `searchQuery` 상태를 초기화하는 코드를 추가하여 테스트 간 상태 오염을 방지함. 이는 최소한의 변경으로 문제를 해결하는 접근 방식임.  
### **basic.test.ts**<br>  
```typescript  
afterEach(() => {
  cleanup();
  // searchQuery 상태 초기화 추가
  const { setSearchQuery } = useFilterStore.getState();
  setSearchQuery("");
})  
```  
이 접근 방식이 효과적인 이유:  
1. **핵심 원인 해결**: 실제 문제는 `searchQuery` 값이 테스트 간에 유지되어 발생했으므로, 이 값만 초기화해도 문제가 해결됨.  
1.  **API 호출 경로 변경**: 애플리케이션 코드에서 `searchQuery`가 비어있으면 기본 게시물 API를 호출하고, 값이 있으면 검색 API를 호출하는 로직이 구현되어 있음. 따라서 `searchQuery`만 초기화해도 원하는 API 호출 경로로 변경됨.  
  
### **👉 누락된 컴포넌트 렌더링 추가**<br>  
두 번째 테스트에 누락된 `renderPostsManager()` 호출을 추가하여 DOM에 컴포넌트가 제대로 렌더링되도록 함.  
### **basic.test.ts**<br>  
```typescript  
it("새 게시물 추가를 허용합니다", async () => {
  const user = userEvent.setup();
  const NEW_POST = {
    id: TEST_POSTS.posts.length + 1,
    title: "New Post",
    body: "This is a new post",
    userId: 1,
    tags: [],
  };
  
  // POST 요청에 대한 핸들러 추가
  server.use(
    http.post("/api/posts/add", async ({ request }) => {
      const body = await request.json();
      // 요청 body 검증
      expect(body).toMatchObject({
        title: NEW_POST.title,
        body: NEW_POST.body,
      });
      return HttpResponse.json(NEW_POST);
    }),
  );

  // 누락된 부분 추가: 컴포넌트 렌더링
  renderPostsManager();
  
  // 기존 게시물들이 로드될 때까지 대기
  await waitFor(() => {
    TEST_POSTS.posts.forEach((post) => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
      console.log(post.title);
    });
  });
  
  // ... 나머지 테스트 코드
})  
```  
  
## 추가로 개선하면 좋은 것<br>  
### **👉 테스트 데이터 복사본 사용**<br>  
더 강력한 테스트 격리를 위해 테스트 데이터의 복사본을 사용하는 방법도 고려할 수 있음. 이는 필수는 아니지만 테스트의 안정성을 높이는 좋은 습관이라고 함.  
  
### **basic.test.ts**<br>  
```typescript  
it("새 게시물 추가를 허용합니다", async () => {
  const user = userEvent.setup();
  // 테스트 데이터 복사본 사용
  const TEST_POSTS_COPY = JSON.parse(JSON.stringify(TEST_POSTS));
  
  const NEW_POST = {
    id: TEST_POSTS_COPY.posts.length + 1,
    title: "New Post",
    body: "This is a new post",
    userId: 1,
    tags: [],
  };
  
  // ... 나머지 테스트 코드
  
  await waitFor(() => {
    TEST_POSTS_COPY.posts.forEach((post) => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
    });
  });
})  
```  
  
### **👉 기존 라이브러리 사용하기**<br>  
![IMAGE](https://raw.githubusercontent.com/nogi-bot/resources/main/SoominYim/images/23b6f9ef-f3ad-4883-a029-5f6df48d006c-image.png)  
![IMAGE](https://raw.githubusercontent.com/nogi-bot/resources/main/SoominYim/images/f8471469-bf95-4e92-802a-b4d7e83c3c31-image.png)  
  
## ✨ **결과**<br>  
* `setSearchQuery("")` 초기화 코드 추가로 테스트 간 상태 오염이 방지됨.  
* 누락된 `renderPostsManager()`호출을 추가하여 DOM 요소에 정상적으로 접근할 수 있게 됨.  
* 이 두 가지 수정만으로도 모든 테스트가 개별 실행과 전체 실행 모두에서 성공적으로 통과함.  
* 테스트 간 명확한 경계가 설정되어 테스트의 독립성과 신뢰성이 향상됨.  
  
---  
## 💡 **학습 포인트**<br>  
* **전역 상태 관리의 주의점**: Zustand나 Redux 같은 전역 상태 관리 도구를 사용할 때는 테스트 간 상태 격리에 특별한 주의가 필요함. 각 테스트가 독립적으로 실행될 수 있도록 적절한 초기화 코드를 추가해야 함.  
* **테스트 순서 독립성**: 테스트는 실행 순서에 관계없이 항상 동일한 결과를 내야 함. 이를 위해 각 테스트 전후에 필요한 상태 초기화와 정리 작업을 명확히 해야 함.  
* **최소한의 변경 원칙**: 테스트 실패 원인을 정확히 파악하고, 필요한 최소한의 변경으로 문제를 해결하는 것이 효율적임. 모든 상태를 초기화하는 대신 문제가 되는 특정 상태만 초기화하는 것이 더 명확하고 유지보수하기 쉬운 접근 방식일 수 있음.  
* **렌더링 검증의 중요성**: 컴포넌트를 테스트할 때는 해당 컴포넌트가 실제로 DOM에 렌더링되었는지 확인하는 과정이 필수적임. 렌더링 호출이 누락되면 이후의 모든 DOM 조작이 실패하게 됨.  
* **디버깅 기법**: 테스트 실패 시 콘솔 로그를 통해 현재 상태를 확인하는 방법은 문제 진단에 매우 유용함. 이 사례에서도 콘솔 로그를 통해 모든 게시물이 동일한 제목으로 출력되는 것을 확인함으로써 검색 상태가 오염되었다는 사실을 파악할 수 있었음.  
* **테스트 환경 이해**: React Testing Library와 같은 테스트 도구의 동작 방식과 MSW 같은 API 모킹 도구의 상태 관리 방식을 이해하는 것이 효과적인 테스트 작성에 중요함.  
* **테스트 피드백 해석**: "Unable to find an element with the text" 같은 오류 메시지는 단순히 요소가 없다는 것 외에도, 상태 오염, 잘못된 API 호출, 누락된 렌더링 등 다양한 원인에서 비롯될 수 있음을 이해해야 함.  
  
  
