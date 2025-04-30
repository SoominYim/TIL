## 🚨 문제 상황<br>  
  
### **🛠 원인**<br>  
1. `EditCommentDialog` 컴포넌트에서 타입 오류가 발생  
1. `selectedComment` 객체의 속성들이 `Comment`인터페이스 요구사항과 일치하지 않음  
  
### **🔍 현재 코드의 문제점 및 해결 방법**<br>  
---  
  
## **🔍 1. 현재 코드의 문제**<br>  
`EditCommentDialog.tsx`  
```typescript  
onChange={(e) => setSelectedComment({ ...selectedComment, body: e.target.value })}  
```  
* 다음과 같은 오류 발생  
* setSelectedComment에 전달되는 객체가 Comment 타입의 요구사항을 충족하지 않음  
* postId 속성이 undefined일 수 있는데, Comment 인터페이스는 postId가 number | null 타입이어야 함.  
* useCommentStore의 타입 정의를 보면:  
## **✅ 2. 해결 방법**<br>  
### **👉 조건부 렌더링으로 타입 안전성 보장**<br>  
`EditCommentDialog.tsx`  
```typescript  
onChange={(e) => {
  if (selectedComment) {
    setSelectedComment({
      ...selectedComment,
      body: e.target.value,
      postId: selectedComment.postId ?? null,
    })
  }
}}  
```  
* **변경된 부분 설명**  
   * if (selectedComment) 조건문으로 selectedComment가 존재할 때만 업데이트  
   * 널 병합 연산자(??)를 사용해 postId가 undefined일 경우 null로 설정  
   * ...selectedComment로 기존 속성을 유지하면서 변경된 속성만 덮어씀  
## ✨ **결과**<br>  
* TypeScript 타입 오류 해결  
* Comment 인터페이스 요구사항 충족  
* 코드 안정성 및 유지보수성 향상  
---  
## 💡 **학습 포인트**<br>  
* TypeScript에서 인터페이스를 사용할 때는 필수 속성의 타입을 정확하게 맞춰야 함  
* 스프레드 연산자(...)를 사용할 때 원본 객체의 속성이 필요한 타입과 일치하는지 확인 필요  
* 널 병합 연산자(??)를 사용해 undefined 값을 기본값으로 대체하는 패턴  
* 조건부 렌더링을 통해 타입 안전성 보장  
