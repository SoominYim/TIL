# 🚨 문제 상황  
* deepEquals 함수에서 객체의 키를 사용한 값 비교 시 타입 에러가 발생했다  
* Element implicitly has 'any' type because expression of type 'string' can't be used to index type 'T' 에러가 발생했다  
* 해석: Element는 'string' 유형의 표현식을 사용하여 유형 'T'를 인덱싱할 수 없으므로 암묵적으로 'any' 유형을 갖습니다.  
## ✅ 원하는 결과  
객체의 모든 키에 대해 안전하게 깊은 비교를 수행하는 함수:  
```typescript  
*// 테스트 코드에서의 예상 동작*
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };

deepEquals(obj1, obj2); *// true를 반환해야 함*
  
```  
## 🛠 원인  
* Object.keys()는 string[] 타입을 반환한다  
* 제네릭 타입 T의 키로 문자열을 직접 사용할 수 없다  
* 타입스크립트는 임의의 문자열을 객체의 키로 사용하는 것을 안전하지 않다고 판단한다  
## 🔍 문제 코드  
```typescript  
export function deepEquals<T>(objA: T, objB: T): boolean {
  // ...
  return keysA.every((key) =>
    deepEquals(objA[key], objB[key]) // ❌ 타입 에러 발생
  );
}
  
```  
## ✨ 수정된 코드  
```typescript  
export function deepEquals<T>(objA: T, objB: T): boolean {
  // ...
  return keysA.every((key) =>
    deepEquals(objA[key as keyof T], objB[key as keyof T]) // ✅ 타입 단언으로 해결
  );
}
  
```  
## 💡 학습 포인트  
1. keyof 연산자의 이해  
1. 타입 단언(Type Assertion)`의 활용  
1. 타입 안전성 확보  
1. 제네릭 타입과 인덱스 시그니처  
이러한 수정으로 deepEquals 함수가 타입 안전하게 객체의 깊은 비교를 수행할 수 있게 되었다.  
