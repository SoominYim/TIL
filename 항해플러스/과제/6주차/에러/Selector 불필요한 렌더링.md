## 🚨 문제 상황<br>  
* 태그 셀렉터를 열 때마다 심한 렉이 발생하여 사용자 경험이 저하됨  
  
### **🛠 원인**<br>  
1. 태그 데이터가 많을 때 모든 태그를 한 번에 렌더링하여 성능 저하  
1. 태그 셀렉터를 열 때마다 불필요한 API 요청이 발생  
1. 태그 데이터에 적절한 캐싱 전략이 부재  
  
### **🔍 현재 코드의 문제점 및 해결 방법**<br>  
---  
## **🔍 1. 현재 코드의 문제점**<br>  
* 태그 목록 전체를 한 번에 렌더링하여 DOM에 많은 요소를 생성  
* 태그 데이터를 매번 새로 요청하여 불필요한 네트워크 트래픽 발생  
* 캐싱 설정이 부족하여 데이터가 불필요하게 리로드됨  
**`TagFilter.tsx`**  
```typescript  

function TagFilter() {
  // ... 생략
  
  const { data: tagsData, isLoading } = useTagsQuery()
  
  const tagItems = useMemo(() => {
    if (!tagsData) return null
    
    // 태그가 수백 개 있을 경우 모두 렌더링되어 성능 문제 발생
    return tagsData.map((tag: Tag) => (
      <SelectItem key={tag.url} value={tag.slug}>
        {tag.slug}
      </SelectItem>
    ))
  }, [tagsData])
  
  // ... 나머지 코드
}  
```  
  
**`queries.ts`**  
```typescript  
// 태그 쿼리 훅 - 캐싱 설정 없음
export function useTagsQuery() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
  })
}  
```  
  
  
## **✅ 2. 해결 방법**<br>  
### **👉 가상화 적용으로 렌더링 최적화**<br>  
  
**`TagFilter.js`**  
```typescript  
// 가상화된 태그 목록 컴포넌트
const VirtualizedTags = memo(({ tags, onSelect }: { tags: Tag[]; onSelect: (value: string) => void }) => {
  const [visibleTags, setVisibleTags] = useState<Tag[]>([])

  // 스크롤 이벤트 핸들러 추가
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight } = e.currentTarget

    // 현재 보이는 영역 계산 (각 항목 높이는 약 35px로 가정)
    const startIndex = Math.floor(scrollTop / 35)
    const endIndex = Math.min(startIndex + Math.ceil(clientHeight / 35) + 5, tags.length)

    // 화면에 보이는 태그만 렌더링
    setVisibleTags(tags.slice(startIndex, endIndex))
  }

  // 컴포넌트 마운트 시 초기 태그 설정
  useEffect(() => {
    setVisibleTags(tags.slice(0, 20))
  }, [tags])

  return (
    <div
      className="max-h-[200px] overflow-y-auto"
      onScroll={handleScroll}
      style={{ height: `${Math.min(tags.length * 35, 200)}px` }}
    >
      {visibleTags.map((tag: Tag) => (
        <SelectItem key={tag.url} value={tag.slug} onClick={() => onSelect(tag.slug)}>
          {tag.slug}
        </SelectItem>
      ))}
    </div>
  )
})  
```  
**`queries.js`**  
```typescript  
// 태그 쿼리 훅 - 캐싱 최적화 적용
export function useTagsQuery() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
    // 태그 데이터는 자주 변경되지 않으므로 캐싱 시간 증가
    staleTime: 1000 * 60 * 30, // 30분
    gcTime: 1000 * 60 * 60, // 1시간 (이전 cacheTime)
    // 많은 태그가 있을 수 있으므로 미리 가져오기
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}  
```  
* 가상화(Virtualization) 기법을 사용하여 화면에 보이는 태그만 렌더링  
* 캐싱 설정을 통해 불필요한 API 요청 최소화  
* 메모이제이션과 컴포넌트 최적화로 리렌더링 방지  
  
## ✨ **결과**<br>  
* 가상화(Virtualization) 기법을 사용하여 화면에 보이는 태그만 렌더링  
* 캐싱 설정을 통해 불필요한 API 요청 최소화  
* 메모이제이션과 컴포넌트 최적화로 리렌더링 방지  
---  
## 💡 **학습 포인트**<br>  
* 가상화(Virtualization) 기법을 사용하여 많은 양의 데이터를 효율적으로 렌더링하는 방법  
* React Query의 캐싱 전략으로 네트워크 요청 최적화  
* React.memo와 useMemo를 활용한 컴포넌트 렌더링 최적화  
* 사용자 인터페이스 성능 향상을 위한 렌더링 제한 및 지연 로딩 기법  
  
