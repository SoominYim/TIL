## 🚨 문제 상황  
* JSX를 변환하는 과정에서 이벤트 핸들러가 문자열로 변환되어 DOM 속성으로 추가됨  
* onClick={clickHandler}와 같은 핸들러가 setAttribute()를 통해 DOM 속성으로 설정되면서,  
* 결과적으로 expect($container.innerHTML).toEqual(...) 같은 테스트에서 예상과 다른 HTML 구조가 생성됨  
### ✅ 원하는 결과 (올바른 렌더링)  
```javascript  
// 필요 
<ul>
  <li id="item-1" class="list-item"><button></button></li>
  <li id="item-2" class="list-item"><div></div></li>
  <li id="item-3" class="list-item"><input></li>
  <li id="item-4" class="list-item last-item"><input></li>
</ul>  
```  
❌ 실제 출력 (문제 발생)  
```javascript  
// 실제
<ul>
  <li id="item-1" class="list-item">
    <button onclick="function(...s) { ... }"></button>
  </li>
  <li id="item-2" class="list-item">
    <div onmouseover="function(...s) { ... }"></div>
  </li>
  <li id="item-3" class="list-item">
    <input onfocus="function(...s) { ... }">
  </li>
  <li id="item-4" class="list-item last-item">
    <input onkeydown="function(...s) { ... }">
  </li>
</ul>  
```  
  
  
### 🛠 원인  
1. vi.fn()을 사용해서 만든 clickHandler는 Vitest의 Mock Function이다.  
1. renderElement()가 JSX를 변환할 때, onClick={clickHandler}를 직접 DOM 속성으로 추가하면 브라우저는 이를 문자열로 변환해서 저장한다.  
1. 따라서 HTML을 출력하면, onclick="function(...s) { ... }"처럼 보이는 것.  
1. 이 때문에 expect($container.innerHTML).toEqual(...)에서 비교가 실패하는 것이다.  
  
### 🔍 현재 코드의 문제점 및 해결 방법  
---  
  
## 🔍 1. 현재 코드의 이벤트 처리 방식  
* 이벤트 핸들러를 addEventListener()로 등록하는 게 아니라, setAttribute()를 이용해 DOM 속성에 직접 추가하는 방식  
* 즉, createElement()의 updateAttributes()에서 이벤트 핸들러를 일반 속성처럼 추가하고 있다.  
### createElement.js  
```javascript  
function updateAttributes($el, props) {
  if (!props) return;

  Object.keys(props).forEach((key) => {
    if (key === "className") {
      $el.setAttribute("class", props[key]); // ✅ className 변환
    } else {
      $el.setAttribute(key, props[key]); // ❌ 이벤트 핸들러도 속성으로 추가됨
    }
  });
}
  
```  
* 여기서 props 객체에 onClick 같은 이벤트 핸들러가 들어있다면, setAttribute()가 실행되면서 onclick="function(...s) { ... }"가 HTML 속성으로 등록되는 이슈가 발생한다.  
* 이렇게 되면 브라우저가 이벤트 핸들러를 문자열로 변환하여 저장하기 때문에 테스트에서 문제가 발생  
  
  
## ✅ 2. 해결 방법  
### 👉 이벤트 핸들러를 setAttribute()가 아니라 addEventListener()로 등록  
  
### createElement.js  
```javascript  
import { addEvent } from "./eventManager";

function updateAttributes($el, props) {
  if (!props) return;

  Object.keys(props).forEach((key) => {
    if (key === "className") {
      $el.setAttribute("class", props[key]); // ✅ className 변환
    }
    // ✅ 이벤트 핸들러 등록 방식 수정
    else if (key.startsWith("on")) {
      const eventType = key.slice(2).toLowerCase();
      addEvent($el, eventType, props[key]); // ✅ addEvent() 사용
    }
    else {
      $el.setAttribute(key, props[key]);
    }
  });
}  
```  
