## 🚨 문제 상황<br>  
* 개발 환경에서는 `/api/...` 경로로 API를 호출하여 프록시 서버를 통해 실제 API 서버로 요청을 보냄  
* `GitHub Pages`는 정적 호스팅만 제공하므로 프록시 서버를 사용할 수 없음  
* 배포 환경에서는 `/api/...` 경로로 요청하면 실제 API 서버에 연결할 수 없는 문제 발생  
  
### **🛠 원인**<br>  
1. **개발 vs 배포 환경 차이**: 개발 환경에서는 Vite의 프록시 기능을 사용하지만, `GitHub Pages`에서는 사용 불가능  
1. **CORS 제한**: 브라우저에서 직접 외부 API를 호출할 때 발생하는 보안 제약  
1. **정적 호스팅 한계**: `GitHub Pages`에서는 서버 로직을 실행할 수 없어 API 요청을 중개할 수 없음  
  
### **🔍 현재 코드의 문제점 및 해결 방법**<br>  
---  
  
## **🔍 1. 현재 코드의 문제점**<br>  
* 개발과 배포 환경에서 API 경로 처리 방식이 달라야 하는데 이를 통합하지 못함  
* API 호출 코드가 `/api/...` 형태로 하드코딩되어 있어 배포 환경에서 문제 발생  
### **API 호출 예시**<br>  
```typescript  

// 데이터 가져오기
const fetchData = async () => {
  try {
    const response = await fetch("/api/posts")
    const data = await response.json()
    // ...
  } catch (error) {
    console.error("데이터 가져오기 오류:", error)
  }  
```  
  
## **✅ 2. 해결 방법**<br>  
### **👉 Vite 플러그인을 사용한 API 경로 변환**<br>  
빌드 시 코드 내의 모든 `/api/` 경로를 `https://dummyjson.com/`으로 변환하는 플러그인을 구현  
  
### **vite.config.ts**<br>  
```typescript  
import { defineConfig, Plugin } from "vite"
import react from "@vitejs/plugin-react"

// 배포 환경 시 api 요청 주소 변경
function apiReplace(): Plugin { 
  return {
    name: "api-replace",
    transform(code, id) {
      if (id.endsWith('.ts') || id.endsWith('.js')) { // JS/TS 파일만 처리
        return code.replace(/(["'`])\/api/g, `$1https://dummyjson.com`);
      }
    },
  }
}

export default defineConfig(({ command }) => {
  const base = command === "build" ? "/front_5th_chapter2-3/" : "/";
  return {
    base,
    plugins: [react(), apiReplace()],
    server: {
      proxy: {
        "/api": {
          target: "https://dummyjson.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  }
})  
```  
이 플러그인은 빌드 과정에서 코드를 변환하여:  
* 개발 환경: /api/posts → 프록시 서버를 통해 `https://dummyjson.com/posts`로 요청  
* 배포 환경: /api/posts → 직접 `https://dummyjson.com/posts`로 요청  
  
## ✨ **결과**<br>  
* 개발 환경과 배포 환경 모두에서 API 호출이 정상적으로 작동  
* 코드 변경 없이 환경에 따라 적절한 API 주소로 요청이 전송됨  
* GitHub Pages에서도 외부 API를 성공적으로 호출할 수 있게 됨  
* 빌드 과정에서 자동으로 경로가 변환되어 개발자의 추가 작업 불필요  
---  
## 💡 **학습 포인트**<br>  
* **빌드 타임 변환의 활용**: Vite 플러그인을 사용하여 빌드 과정에서 코드를 수정하는 방법  
* **환경별 설정 분리**: 개발 환경에서는 프록시를, 배포 환경에서는 직접 API 호출을 구현하는 방법  
* **정적 호스팅 한계 극복**: GitHub Pages와 같은 정적 호스팅 환경에서 API 호출 방법  
* **코드 변환 자동화**: 정규식을 활용한 코드 내 특정 패턴 변환 방법  
* **개발자 경험 유지**: 코드베이스 변경 없이 환경에 따른 다른 동작 구현 방법  
  
