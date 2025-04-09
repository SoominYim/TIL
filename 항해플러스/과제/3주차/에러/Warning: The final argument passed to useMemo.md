## 🚨 문제 상황<br>  
* `useMemo`쪽에서 warning 발생  
```shell  
Previous: [43]
Incoming: [42, 43]
at C:\\Users\\Soomin\\Desktop\\hanghae_plus\\front_5th_chapter1-3\\src\\**tests**\\basic.test.tsx:512:85
Warning: The final argument passed to useCallback changed size between renders. The order and size of this array must remain constant.
  
```  
* 로컬 테스트 및 CI는 통과한 상태  
* 해석 : `useCallback`에 전달된 최종 인수는 렌더링 간에 크기가 변경되었습니다. 이 배열의 순서와 크기는 일정해야 합니다.  
### **🛠 원인 추론…**<br>  
* `memo HOC` 구현에서 다음과 같은 문제가 발생하고 있는데  
```typescript  
      it("useMemo의 deps 비교 함수를 주입받아서 사용할 수 있다.", () => {
        const ref: ComponentProps<typeof TestComponent>["ref"] = {
          current: null,
        };

        // 배열의 첫 번째 인자에 대해서만 값이 같은지 검사하는 equals 주입
        const equals = (a: unknown[], b: unknown[]) => a[0] === b[0];
        render(<TestComponent ref={ref} initialDeps={[42]} equals={equals} />);
        expect(mockFactory).toHaveBeenCalledTimes(1);

        // 첫 번째 의존성을 다시 [42] 로 변경 -> 재계산 되지 않아야 함
        act(() => {
          ref.current?.updateDeps([42]);
        });
        expect(mockFactory).toHaveBeenCalledTimes(1);

        // 첫 번째 의존성을 [43]으로 변경 -> 재계산
        act(() => {
          ref.current?.updateDeps([43]);
        });
        expect(mockFactory).toHaveBeenCalledTimes(2);

        // 두 번째 의존성 추가 -> 재계산 하지 않음
        act(() => {
          ref.current?.updateDeps([43, 44]);
        });
        expect(mockFactory).toHaveBeenCalledTimes(2);

        // 첫 번째 의존성 수정 -> 재계산
        act(() => {
          ref.current?.updateDeps([41, 44]);
        });
        expect(mockFactory).toHaveBeenCalledTimes(3);
      });
    });
  
```  
* 이 테스트 코드에서 발생합니다.  
* `useMemo` `useCallback`은 `dependency`의 `length`가 바뀌는걸 상정하지 않기 때문에 `[42] ⇒ [42, 43]` 이렇게 바뀌면 안된다로 보여 이 테스트 코드가 문제가 되는 걸로 판단됩니다.  
* 이 `warning`의 원인이 궁금합니다. 또한 이 `warning`으로 인한 위험성이 있을까요?  
## 참고<br>  
1. [*](https://github.com/preactjs/preact/issues/2728)[https://github.com/preactjs/preact/issues/2728\*\*](https://github.com/preactjs/preact/issues/2728**)  
1. [*](https://github.com/preactjs/preact/pull/2732)[https://github.com/preactjs/preact/pull/2732\*\*](https://github.com/preactjs/preact/pull/2732**)  
1. [*](https://www.perplexity.ai/search/daeum-vitest-gyeonggoreul-buns-xwkTcDSUTI2OEHrdyy30TQ?0=d#0)[https://www.perplexity.ai/search/daeum-vitest-gyeonggoreul-buns-xwkTcDSUTI2OEHrdyy30TQ?0=d#0\*\*](https://www.perplexity.ai/search/daeum-vitest-gyeonggoreul-buns-xwkTcDSUTI2OEHrdyy30TQ?0=d#0**)  
### <br>  
