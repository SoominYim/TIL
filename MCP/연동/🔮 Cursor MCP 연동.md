# 🔮 Cursor MCP 연동  
## 🚀 Cursor란?  

Cursor는 AI 기능이 탑재된 코드 에디터로, 개발 생산성 향상에 초점을 맞춘 도구다. VSCode 기반으로 만들어져서 기존 VScode 설정을 그대로 옮겨와 사용할 수 있어 편리하다.  

### 💾 Cursor 설치하기 

[Cursor 다운로드](https://www.cursor.com/downloads) 페이지에서 설치 파일을 받아 실행하면 된다.  

---  

## 🧩 Cursor MCP 소개  

Cursor는 MCP(Multimodal Conversational Playground)를 기본 지원한다. 이를 통해 AI와 다양한 서비스를 쉽게 연결할 수 있는 장점이 있다.  

### ⚙️ 설정 방법:  

1. Open Cursor Settings 클릭  

2. MCP 탭 선택  

3. 원하는 MCP 설정 적용  

이 글에서는 두 가지 MCP 서버 연동 방법을 살펴본다:  

* 🌐 GitHub MCP Server  

* 🔍 BrowserTools MCP  

---  

## 🌐 GitHub 연동 방법  

### 🛠️ Smithery 활용하기  

Smithery는 각종 MCP 서버를 모아둔 사이트다. 여러 MCP 서버 중에서 필요한 것을 찾아 사용하면 된다.  

### 💻 GitHub MCP Server 설정  

Smithery에서 GitHub로 검색한 다음 @smithery-ai/github를 클릭한다.  

### 🔑 GitHub 토큰 발급하기  

MCP가 GitHub에 접근하려면 토큰이 필요하다. 발급 과정은 다음과 같다:  

1. GitHub 프로필 → Settings 클릭  

1. 하단의 Developer Settings → Personal access tokens → Fine-grained tokens → Generate new token  

### 🔒 토큰 권한 설정하기  

토큰은 유출되지 않게 잘 보관해야 한다! 필요한 권한을 다음과 같이 설정한다:  

* ⏱️ 만료기간 설정  

* 📁 Repository access: All repositories 선택  

* 🔓 Repository permissions: 필요한 기능 Read and write 권한으로 설정  

### 📥 Smithery 설치하기  

Cursor 버전(≥0.47.x)에 따라 설정 방법이 다르니 주의해야 한다.  

1. Smithery 우측의 Installation Cursor 탭 클릭  

2. GitHub 토큰 입력 후 Connect 클릭  

3. 환경에 맞는 명령어 복사하기  

---  

## 🔌 Cursor에 적용하기 (0.46.x 이하 버전)  

때로는 Docker나 node, python 같은 추가 설치가 필요하니 명령어를 잘 확인해야 한다.  

### 설정 과정:  

1. Cursor MCP 탭 → Add new MCP server 클릭  

2. 이름은 아무거나 입력  

3. Type은 command 선택  

4. Command에 복사한 명령어 붙여넣기  

### 📝 mcp.json 설정 (0.47.x 이상 버전)  

UI 팝업이 안 뜨면 JSON으로 직접 설정하는 방법도 있다. .cursor/mcp.json 파일을 만들어 설정할 수 있다.  

```plain text 
{
  "mcpServers": {

    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@smithery/cli@latest",
        "run",
        "@smithery-ai/github",
        "--config",
        "{\"githubPersonalAccessToken\":\"여기에 토큰 입력\"}"
      ]
    }
  }
}
```  

### 🤖 GitHub 작업 자동화하기  

현재(2025-03-27) MCP는 Anthropic 모델만 지원하므로 Claude 모델을 선택해야 한다. 최근 OpenAI도 MCP 지원을 발표해서 기대가 크다.  

이제 Cursor에게 "GitHub 레포 만들어줘"라고 지시하면 AI가 필요한 작업을 수행한다. Run tool, Accept 버튼만 눌러주면 된다.  

---  

## 🌐 Chrome 개발자 도구 연동하기  

이번에는 Cursor가 크롬 개발자 도구를 직접 사용할 수 있게 하는 BrowserTools MCP 서버 설정 방법을 알아보자.  

### 🧩 크롬 확장 프로그램 설치  

이 확장 프로그램은 크롬 기반 브라우저에서 작동하는 MCP 서버다. 현재(2025.03.15) 마켓플레이스 승인 대기 중이라 압축 파일을 직접 설치해야 한다.  

### 설치 과정:  

1. 크롬 → 확장 프로그램 관리  

2. 개발자 모드 켜기  

3. 압축해제된 확장 프로그램 불러오기  

### 🔗 Cursor와 연결하기  

다음 명령어로 Cursor와 연결하면 끝이다:  

```plain text  
npx @agentdeskai/browser-tools-mcp@1.2.0
```  

이 확장 프로그램은 아직 버그가 많아서 제대로 동작하지 않는 경우도 있다. 그래도 MCP를 통해 Cursor가 직접 크롬을 조작해 에러를 확인하고 수정할 수 있는 기능은 매우 유용
하다.  

---  

## 🔮 마치며  

Smithery에 많은 MCP 서버가 있으니 필요한 것을 찾아 활용해보면 좋을 것 같다  

* 🌐 웹 브라우저  

* 💾 데이터베이스  

* 💬 Slack  

* 📝 Notion  



