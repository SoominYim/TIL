## 🚨 문제 상황<br>  
* `createRepeatingEvents` 함수에서 반복 일정 생성 시, `MAX_REPEAT_END_DATE`를 넘어서는 일정이 생성되는 문제가 발생.  
### **🛠 원인**<br>  
1. `eventData.repeat.endDate`가 설정된 경우, 이 값이 `MAX_REPEAT_END_DATE`보다 클 경우에도 해당 날짜를 기준으로 반복 일정이 생성됨.  
1. 종료일이 설정되지 않으면 `MAX_REPEAT_END_DATE`가 기본값으로 적용되지만, 설정된 종료일이 `MAX_REPEAT_END_DATE`보다 큰 경우 제한되지 않음.  
### **🔍 현재 코드의 문제점**<br>  
1. **반복 종료일 설정 문제**:  
1. **기본 종료일 설정 문제**:  
### **🔍 해결 방법**<br>  
---  
## **✅ 해결 방법**<br>  
### 👉 종료일이 설정된 경우, `MAX_REPEAT_END_DATE`와 비교하여 날짜를 초과하지 않도록 설정<br>  
```plain text  
ts
복사편집
// createRepeatingEvents 수정
const userEndDate = eventData.repeat.endDate ? new Date(eventData.repeat.endDate) : null;
const maxEndDate = new Date(MAX_REPEAT_END_DATE);
const finalEndDate = userEndDate && userEndDate < maxEndDate ? userEndDate : maxEndDate;

  
```  
### 👉 종료일이 설정되지 않은 경우, `MAX_REPEAT_END_DATE`를 기본 종료일로 사용<br>  
```plain text  
ts
복사편집
// createRepeatingEvents 수정
const finalEndDate = userEndDate || maxEndDate;

  
```  
## ✨ **결과**<br>  
* `MAX_REPEAT_END_DATE`를 넘어서는 반복 일정 생성을 방지  
* `endDate`가 설정된 경우와 설정되지 않은 경우 모두 정상적으로 `MAX_REPEAT_END_DATE`를 넘지 않도록 동작  
---  
## 💡 **학습 포인트**<br>  
* 반복 일정 종료일을 처리할 때 `MAX_REPEAT_END_DATE`와의 비교를 통해 적절한 종료일을 설정하는 것이 중요  
* 종료일이 설정되지 않은 경우 기본 종료일(`MAX_REPEAT_END_DATE`)을 사용해, 무제한으로 생성되는 문제를 방지할 수 있음  
