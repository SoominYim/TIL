## 🚨 문제 상황  
CI 환경에서 테스트가 실패하는 문제가 발생했습니다.  
* 로컬에서는 테스트가 통과하지만 CI 환경에서는 실패  
* TypeError: Cannot read properties of null (reading 'value')  
* localStorage.getItem("user") 결과가 null로 반환됨 (예상값: {"username":"testuser","email":"","bio":""})  
## 🔎 원인 분석  
1. 이벤트 위임 처리 과정에서 에러 발생 → login() 함수가 실행되지 않음  
1. jsdom 환경에서는 이벤트 핸들러 실행 중 예외가 발생해도 에러가 표시되지 않음  
1. 이벤트 버블링 경로에 rootElement가 포함되지 않아 form submit 이벤트가 제대로 처리되지 않음  
## ✅ 해결 방법  
```javascript  
// 이벤트 경로 수집
while (target && target !== rootElement) {
  path.push(target);
  target = target.parentNode;
}
path.push(rootElement);  // rootElement를 이벤트 경로에 추가

// 이벤트 핸들러 실행 부분에 try-catch 추가
if (handler) {
  try {
    handler(e);
  } catch (error) {
    console.error("Error in event handler:", error);
  }
  if (e.isPropagationStopped) break;
}  
```  
### 적용 대상: eventManager  
### 🔧 해결 원리  
* 이벤트 핸들러 실행을 try-catch로 감싸서 에러 발생 시 콘솔에 표시  
* 에러가 발생해도 이벤트 전파가 중단되지 않도록 처리  
* rootElement를 이벤트 경로에 포함시켜 form submit 이벤트가 정상적으로 동작하도록 수정  
* 디버깅을 쉽게 하기 위해 적절한 에러 로깅 추가  
## ✨ 결과  
* 로컬과 CI 환경 모두에서 테스트 통과  
* 에러 발생 시 콘솔에 로그가 남아 디버깅이 용이  
* 이벤트 핸들러의 안정성 향상  
* form submit 이벤트가 정상적으로 처리됨  
## 💡 학습 포인트  
* 테스트 환경(jsdom)과 실제 브라우저 환경의 차이 이해  
* 이벤트 위임 시 에러 처리의 중요성  
* 디버깅을 위한 적절한 에러 로깅의 필요성  
* 이벤트 버블링 경로에 모든 관련 요소가 포함되어야 함  
