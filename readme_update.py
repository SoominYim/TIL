import feedparser
import ssl

# 디버깅 출력 추가
print("스크립트 실행 시작")

# SSL 인증서 검증 무시
ssl._create_default_https_context = ssl._create_unverified_context

# 티스토리 RSS 주소 (끝의 슬래시 제거)
tistory_uri = "https://s-o-o-min.tistory.com"
rss_url = f"{tistory_uri}/rss"
print(f"RSS URL: {rss_url}")

# 피드 파싱
feed = feedparser.parse(rss_url)
print(f"피드 항목 수: {len(feed.entries)}")

# 기본 마크다운 텍스트
markdown_text = """
# 공부하자

### 📕 Latest Blog Posts

"""

# 피드 항목 처리
if len(feed.entries) > 0:
    for i in feed.entries[:3]:
        print(f"블로그 포스트: {i.title}")
        markdown_text += f"<a href=\"{i.link}\"> {i.title} </a><br>\n"
else:
    print("피드 항목이 없습니다. 피드 내용:")
    print(feed)
    markdown_text += "현재 블로그 포스트를 가져올 수 없습니다.<br>\n"

# 파일 쓰기
print("README.md 파일 쓰기")
with open("README.md", mode="w", encoding="utf-8") as f:
    f.write(markdown_text)
print("파일 쓰기 완료")
