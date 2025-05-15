## 🚨 문제 상황<br>  
* **CI/CD 파이프라인에서 빌드 실패 발생**  
---  
## 🛠 원인<br>  
1. **ESLint 설정 부족**  
1. **Props 인터페이스 함수 시그니처**  
---  
## 🔍 현재 코드의 문제점 및 해결 방법<br>  
### 1. 문제점 (수정 전 코드)<br>  
* `ESLint`가 Props 인터페이스에 정의된 함수 시그니처의 매개변수까지 미사용 변수로 간주하여 경고를 발생시킴.  
* 주요 컴포넌트인 `MonthView.tsx`와 `WeekView.tsx`에서 Props 인터페이스의 함수 타입 정의에 다수 경고 발생.  
### **MonthView.tsx (수정 전 Props 인터페이스 예시)**<br>  
```typescript  
interface MonthViewProps {
  formatDate: (currentDate: Date, day: number) => string;
}  
```  
### **WeekView.tsx (수정 전 Props 인터페이스 예시)**<br>  
```typescript  
interface WeekViewProps {
  handleEvent: (event: Event, index: number) => void;
}  
```  
---  
### 2. 해결 방법<br>  
### 1️⃣ ESLint 설정 변경<br>  
* `.eslintrc.cjs` 파일에 **`argsIgnorePattern: "^_"`**** 옵션** 추가.  
* 이를 통해 밑줄(`_`)로 시작하는 매개변수 이름은 사용되지 않아도 경고를 무시하도록 설정.  
### 2️⃣ Props 인터페이스 수정<br>  
* `MonthView.tsx`와 `WeekView.tsx`에서 **사용되지 않는 매개변수** 이름에 밑줄(`_`) 접두사 추가.  
* 타입 정의의 명확성을 유지하면서도 경고를 제거.  
---  
## ✅ 적용 코드<br>  
### **.eslintrc.cjs (변경된 부분)**<br>  
```javascript  
module.exports = {
  rules: {
    'no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_' }, // 밑줄로 시작하는 매개변수는 경고 무시
    ],
  },
}  
```  
### **MonthView.tsx (수정 후 Props 인터페이스 예시)**<br>  
```typescript  
interface MonthViewProps {
  formatDate: (_currentDate: Date, _day: number) => string;
}  
```  
### **WeekView.tsx (수정 후 Props 인터페이스 예시)**<br>  
```typescript  
interface WeekViewProps {
  handleEvent: (_event: Event, _index: number) => void;
}  
```  
---  
## ✨ 결과<br>  
1. **빌드 성공**  
1. **코드 가독성 및 명확성 유지**  
---  
## 💡 학습 포인트<br>  
1. **ESLint의 argsIgnorePattern**  
1. **린트 경고를 설정으로 해결**  
1. **CI/CD 환경에서의 린트 설정 중요성**  
1. **타입스크립트와 린트의 조화**  
