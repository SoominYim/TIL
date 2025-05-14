## **문제 상황**<br>  
`Vitest Extention`과 `React Testing Library`로 Hook 테스트 시 다음 오류 발생:  
> `act(...) is not supported in production builds of React.`  
![IMAGE](https://raw.githubusercontent.com/nogi-bot/resources/main/SoominYim/images/0ac10d38-637e-4325-89f6-bbb07c925299-image.png)  
  
## **원인**<br>  
* React가 프로덕션 모드로 동작할 때 발생하는 문제  
* 테스트 환경에서는 React가 개발 모드로 실행되어야 함  
## **의심되는 사항**<br>  
* 시스템 환경 변수(NODE_ENV)가 프로덕션으로 설정됐을 가능성  
* Windows와 다른 OS 간 환경 변수 처리 방식 차이  
* 글로벌 환경에 설정된 NODE_ENV 값이 프로젝트 설정을 덮어쓰는 문제  
* Vitest 실행 시 내부적으로 프로덕션 모드 강제 적용 가능성  
## **해결 방법**<br>  
1. ** ****`setupTests.ts`**** 파일에 환경 변수 설정**  
```typescript  
// src/setupTests.ts
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';

// React 개발 모드 강제 설정
process.env.NODE_ENV = 'development';

// 기타 코드...  
```  
1. **`vite.config.ts`**** 수정 (해 볼만 한 시도)**  
```typescript  
// vite.config.ts 중 vitest 설정 부분
environmentOptions: {
  jsdom: {
    // React 개발 모드 설정
    customExportConditions: ['node', 'development'],
  },
}  
```  
1. **테스트 실행 시 NODE_ENV 설정**  
```typescript  
"scripts": {
  "test:dev": "cross-env NODE_ENV=development vitest"
}  
```  
## 참고<br>  
* 다른 PC 작동 이유: 해당 환경의 기본 설정이 개발 모드일 가능성  
* React 18+ 버전은 테스트 시 개발 모드가 필수  
* act() 사용 훅 테스트는 반드시 개발 모드 필요  
