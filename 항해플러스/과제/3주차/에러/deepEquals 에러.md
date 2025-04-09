# 🚨 문제 상황  
* deepEquals 함수에서 타입 오류가 발생했다  
* 'T' 형식에 'every' 속성이 없다는 오류가 발생했다  
* '접근할 수 없는 코드가 있습니다'라는 오류도 발생했다  
* useDeepMemo에서 deepEquals 함수를 사용할 때 문제가 발생했다  
## ✅ 원하는 결과  
객체와 배열의 깊은 비교를 올바르게 수행하는 함수:  
```typescript  
// 테스트 코드에서의 예상 동작
act(() => {
  ref.current?.updateDeps([{}]);
});
expect(mockFactory).toHaveBeenCalledTimes(1); // 같은 빈 객체라 호출 안됨

act(() => {
  ref.current?.updateDeps([{ a: 1 }]);
});
expect(mockFactory).toHaveBeenCalledTimes(2); // 다른 객체라 호출됨
  
```  
## 🛠 원인  
1. 타입 오류: 제네릭 타입 T에는 'every' 속성이 보장되지 않았다  
1. 로직 구조 문제: 조건문 분기 처리가 명확하지 않았다  
1. 도달 불가능한 코드: return문 이후에 코드가 있었다  
## 🔍 문제 코드  
```typescript  
export function deepEquals<T>(objA: T, objB: T): boolean {
  if (JSON.stringify(objA) === JSON.stringify(objB)) return true;
  if (
    objA === null ||
    objB === null ||
    typeof objA !== "object" ||
    typeof objB !== "object"
  ) {
    return objA.every((v, i) => deepEquals(v, objB[i])); // 에러 발생
  }
  if (Array.isArray(objA) && Array.isArray(objB)) {
    // 배열 처리 로직
  }

  return Object.keys(objA as object).every((key) =>
    deepEquals(objA[key as keyof T], objB[key as keyof T]),
  );
  return false; // 접근 불가능 코드
}
  
```  
## ✨ 수정된 코드  
```typescript  
export function deepEquals<T>(objA: T, objB: T): boolean {
  if (JSON.stringify(objA) === JSON.stringify(objB)) return true;
  if (
    objA === null ||
    objB === null ||
    typeof objA !== "object" ||
    typeof objB !== "object"
  ) {
    return false; // 1. 기본 타입이나 null인 경우 false 반환
  }

  if (Array.isArray(objA) && Array.isArray(objB)) {
    if (objA.length !== objB.length) return false;
    return objA.every((v, i) => deepEquals(v, objB[i])); // 2. 배열 타입에 대한 처리
  }

  const keysA = Object.keys(objA as object);
  const keysB = Object.keys(objB as object);

  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) =>
    deepEquals(objA[key as keyof T], objB[key as keyof T])
  ); // 3. 객체 타입에 대한 처리
}
  
```  
## 💡 학습 포인트  
1. 타입 오류 해결: 제네릭 타입에 대한 명확한 타입 체크와 형변환이 필요하다  
1. 로직 구조 개선: 조건문 분기를 명확히 하고 각 케이스에 대한 처리를 구분했다  
1. 배열 처리 로직 수정: 배열 타입 검사 후 적절한 비교 로직을 적용했다  
1. 객체 비교 로직 추가: 객체의 키 개수 비교 후 속성별 비교를 구현했다  
