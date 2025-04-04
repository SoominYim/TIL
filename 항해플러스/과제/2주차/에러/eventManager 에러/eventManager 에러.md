### 🚨 문제 상황  
1. setupEventListeners()가 실행될 때마다 같은 이벤트 타입에 대해 여러 개의 리스너가 등록됨  
1. 결과적으로 같은 이벤트가 중복 실행되면서 2의 제곱만큼 실행되는 문제가 발생  
1. 이벤트 리스너가 중복 실행되면 성능 저하 및 원치 않는 동작 발생 가능  
  
## 🔍 1. 현재 코드의 이벤트 처리 방식  
* 이벤트 핸들러를 setupEventListeners()에서 addEventListener()를 이용해 등록하지만, 중복 실행되는 문제가 발생  
* setupEventListeners(root)가 실행될 때마다 이벤트 리스너가 중복 등록되면서 2의 제곱으로 실행됨  
  
### 📌 기존 코드의 문제점  
### 🛠 원인  
* 현재 이벤트 핸들러는 addEvent()를 통해 eventHandlers 맵에 저장된 후, setupEventListeners()에서 root.addEventListener(type, handler)를 호출하여 이벤트를 한 번만 등록하는 방식.  
* 하지만 같은 요소에 중복해서 addEvent()가 실행되면 기존 핸들러가 덮어쓰기 되지 않고 계속 추가됨  
* 그 결과, 이벤트 리스너가 여러 개 등록되면서 클릭마다 실행 횟수가 기하급수적으로 증가하는 문제 발생  
```javascript  
export function setupEventListeners(root) {
  const eventTypes = new Set();

  eventHandlers.forEach((handlers) => {
    Object.keys(handlers).forEach((type) => {
      eventTypes.add(type);
    });
  });

  eventTypes.forEach((type) => {
    root.addEventListener(type, (e) => {
      let target = e.target;
      const path = [];
      while (target && target !== root) {
        path.push(target);
        target = target.parentNode;
      }

      for (let i = path.length - 1; i >= 0; i--) {
        const currentTarget = path[i];
        const elementHandlers = eventHandlers.get(currentTarget);

        if (elementHandlers?.[type]) {
          elementHandlers[type](e);
          if (e.isPropagationStopped) break;
        }
      }
    });
  });
}  
```  
  
  
---  
## ✅ 2. 해결 방법  
  
### 1️⃣ 이벤트 핸들러 관리 구조 변경  
```javascript  
// 이벤트 타입별로 핸들러를 관리하는 Map
const eventTypeMap = new Map();  
```  
  
✅ 적용 대상: eventManager  
* 기존: eventHandlers Map에 모든 이벤트 핸들러를 저장  
* 변경: eventTypeMap을 사용하여 이벤트 타입별로 구분하여 관리  
* 효과: 이벤트 타입별로 명확한 구분이 가능하며, 중복 등록 방지  
---  
### 2️⃣ 이벤트 리스너 등록 방식 개선  
```javascript  
export function setupEventListeners(root) {
  rootElement = root;
  eventTypeMap.forEach((_, eventType) => {
    setupEventListenerForType(eventType);
  });
}  
```  
✅ 적용 대상: eventManager  
* 기존: 매번 새로운 리스너 등록  
* 변경: 이벤트 타입당 단 한 번만 리스너 등록  
* 효과: 중복 실행 문제 해결  
---  
### 3️⃣ 이벤트 핸들러 관리 최적화  
```javascript  
export function addEvent(element, eventType, handler) {
  if (!eventTypeMap.has(eventType)) {
    eventTypeMap.set(eventType, new Map());
    setupEventListenerForType(eventType);
  }
  const handlers = eventTypeMap.get(eventType);
  handlers.set(element, handler);
}  
```  
✅ 적용 대상: eventManager  
* 기존: 핸들러 추가 시 중복 검사 없음  
* 변경: Map 구조를 사용하여 자동으로 중복 방지  
* 효과: 동일 요소의 같은 이벤트 타입에 대한 핸들러 덮어쓰기  
  
  
---  
  
## ✨ 결과  
* 이벤트 리스너 중복 실행 문제 해결, 성능 최적화  
* 불필요한 이벤트 핸들러 제거로 메모리 사용량 감소  
* 이벤트 흐름이 명확해지고 디버깅이 쉬워짐  
* 이벤트 버블링을 활용한 안정적인 이벤트 처리 가능  
## 💡 학습 포인트  
* 이벤트 리스너 중복 등록이 성능에 미치는 영향  
* Map을 활용한 이벤트 핸들러 관리 기법  
* 이벤트 위임을 최적화하는 방법  
* 메모리 누수를 방지하는 효과적인 이벤트 등록 방식  
  
