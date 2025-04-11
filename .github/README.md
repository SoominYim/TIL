이 GitHub Actions workflow는 다음을 수행합니다 :
1. main 브랜치로의 push 또는 pull request 이벤트 발생 시 workflow가 트리거됩니다.
2. 매일 자정마다 schedule을 통해도 workflow가 트리거됩니다.
3. ubuntu-latest 러너에서 실행됩니다.
4. 작업은 단일 작업인 build로 구성됩니다.
5. 작업은 다음 단계를 실행합니다 :
   1) GitHub Actions가 코드를 실행하기 전에 리포지토리를 체크아웃합니다.
   2) Python 3.12.2를 설정합니다. 
   3) 종속성을 설치합니다. 이 경우, feedparser를 설치합니다.
   4) readme_update.py 스크립트를 실행하여 README를 업데이트합니다.
   5) 업데이트된 README를 커밋하고 푸시하여 리포지토리에 적용합니다.
이 workflow를 사용하여 README가 자동으로 업데이트되며, 업데이트가 발생할 때마다 커밋되고 push됩니다.
