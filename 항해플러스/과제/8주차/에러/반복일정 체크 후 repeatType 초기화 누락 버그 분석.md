## 🚨 문제 상황<br>  
* 새 일정 생성 시 "반복 일정" 체크보시 후 `repeatType`이 UI에는 "날"로 표시되지만, 스테이트에는 `none`으로 남아있어 반복 일정이 정상 저장되지 않는 문제.  
### **🔧 원인**<br>  
1. `useEventForm` 호크에서 `repeatType`의 초기값이 `initialEvent?.repeat.type || 'none'`이므로,  
### **🔍 현재 코드의 문제점 및 해결 방법**<br>  
---  
## **🔍 1. 현재 코드의 문제**<br>  
* 반복 체크보시를 누르면 `isRepeating === true`가 되지만,  
* `repeatType === 'none'`이라서 반복을 해도 스테이트 역시 반영 안 됨.  
### **App.tsx**<br>  
```typescript  
<Checkbox
  isChecked={isRepeating}
  onChange={(e) => {
    const checked = e.target.checked;
    setIsRepeating(checked);
    if (checked && repeatType === 'none') {
      setRepeatType('daily'); // 반복을 설정하면 초기 repeatType 은 남아있는 경우가 많음.
    }
  }}
>
  반복 일정
</Checkbox>  
```  
## **✅ 해결 방법**<br>  
### 👉 Checkbox 사용 시 repeatType을 반드시 설정<br>  
### **App.tsx**<br>  
```typescript  
<Checkbox
  isChecked={isRepeating}
  onChange={(e) => {
    const checked = e.target.checked;
    setIsRepeating(checked);
    if (checked && repeatType === 'none') {
      setRepeatType('daily'); // 반복 일정 체크 시 default 값 설정
    }
  }}
>
  반복 일정
</Checkbox>  
```  
## ✨ **결과**<br>  
* 새 일정 추가 시, 반복 체크보시 시 `repeatType === 'daily'`로 설정되어 정상적으로 반복 일정이 생성됨  
---  
## 💡 **학습 포인트**<br>  
* 스테이트 값과 UI 표시값이 일치하려면, 현재 상황에서 어떤 속성이 최종 전시되는지 모두 알고 다른 형식을 고려해보기  
* 초기화가 없이 반영되는 UI는 오류 발생 우지  
