## 🚨 문제 상황<br>  
검색 결과 영역에서 일정 목록(`filteredEvents`)을 렌더링할 때, 정렬되지 않은 상태로 표시되어 사용자 입장에서 일정 순서를 인지하기 어렵고 UX가 저하되는 문제가 발생.  
---  
## 🛠 원인<br>  
* `filteredEvents`는 날짜 및 시간 기준으로 정렬되어 있지 않음  
* `.map()`을 바로 사용하고 있어, 일정 생성 순서나 서버 응답 순서에 따라 리스트 순서가 달라질 수 있음  
* 이로 인해 동일한 날의 이벤트가 뒤죽박죽 출력되며 가독성이 떨어짐  
---  
## 🔍 현재 코드의 문제점<br>  
```typescript  
tsx
복사편집
{filteredEvents.map((event) => (
  <Box key={event.id}>
    ...
    <Text>{event.date}</Text>
    <Text>{event.startTime} - {event.endTime}</Text>
    ...
  </Box>
))}

  
```  
* 위 코드에서는 `filteredEvents`를 그대로 렌더링하고 있어 시간 순서가 보장되지 않음  
---  
## ✅ 해결 방법<br>  
* `.map()` 전에 `.sort()`를 추가하여 `event.date + event.startTime` 기준으로 정렬  
* `sort()`는 원본 배열을 변경하므로, 스프레드 연산자(`[...]`)로 복사 후 정렬 진행  
---  
### 🔧 수정된 코드<br>  
```typescript  
tsx
복사편집
{[...filteredEvents]
  .sort((a, b) => {
    const aDateTime = new Date(`${a.date}T${a.startTime}`);
    const bDateTime = new Date(`${b.date}T${b.startTime}`);
    return aDateTime.getTime() - bDateTime.getTime();
  })
  .map((event) => (
    <Box key={event.id}>
      ...
      <Text>{event.date}</Text>
      <Text>{event.startTime} - {event.endTime}</Text>
      ...
    </Box>
  ))}

  
```  
---  
## ✨ 결과<br>  
* 일정이 날짜 + 시작 시간 기준으로 정렬되어 UX가 개선됨  
* 같은 날짜의 이벤트들도 시간 순으로 정렬되어 일관성 있는 시각 흐름 제공  
* 검색 결과가 명확하게 정렬되므로 일정 비교 및 수정이 쉬워짐  
---  
## 💡 학습 포인트<br>  
* `Array.prototype.sort()`는 원본 배열을 변경(mutate)하므로 직접 쓰기보다 `spread`로 복사해서 사용하는 것이 안전함  
* React에서 반복 렌더링 전에 정렬을 명확하게 해두면 key 충돌이나 예기치 않은 재렌더링 문제도 예방할 수 있음  
* `new Date()`는 `YYYY-MM-DDTHH:mm` 포맷의 문자열을 정확히 파싱하므로 날짜+시간 비교에 매우 유용함  
