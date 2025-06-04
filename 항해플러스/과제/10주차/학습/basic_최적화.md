### 1단계: 보안 헤더 및 메타 최적화<br>  
**설명**  
* 웹 페이지에 필요한 메타 태그와 보안 헤더를 최적화하여 페이지 로딩 시점부터 보안과 SEO, PWA 지원을 강화합니다.  
* `<meta charset>`과 `<meta viewport>`는 기본 설정으로, 올바른 문자 인코딩과 반응형 뷰포트를 지정합니다.  
* `<meta description>`과 `<meta keywords>`는 검색 엔진에 노출될 때 페이지 내용과 연관된 정보를 제공합니다.  
* `Content-Security-Policy(CSP)` 헤더를 설정하여 스크립트, 이미지 등의 출처를 제한함으로써 XSS 공격을 방지합니다.  
* `X-Content-Type-Options: nosniff`는 브라우저가 파일 타입을 추측하지 못하도록 하여 MIME 스니핑 공격을 예방합니다.  
* `X-Frame-Options: DENY`는 해당 페이지를 iframe으로 임베드하지 못하게 하여 클릭재킹을 방지합니다.  
* `<link rel="canonical">`은 중복된 URL이 여러 개일 때, 대표 URL을 지정하여 SEO를 최적화합니다.  
* PWA 지원을 위해 `<link rel="manifest">`, `theme-color`, iOS 용 메타 태그 등을 추가합니다.  
```html  
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SEO 및 사이트 정보 -->
    <metaname="description"
      content="VR Headsets - Discover our premium line of virtual reality headsets including Apple, PlayStation, and Oculus VR headsets with best prices and deals."
    />
    <meta name="keywords" content="VR headsets, virtual reality, Apple headset, PlayStation VR, Oculus, tech shop" />
    <meta name="author" content="Tech Shop" />

    <!-- 보안 헤더 -->
    <meta http-equiv="Content-Security-Policy" content="
      default-src 'self';
      img-src 'self' data: https:;
      script-src 'self' https://www.googletagmanager.com https://www.freeprivacypolicy.com;
    " />
    <meta http-equiv="X-Content-Type-Options" content="nosniff" />
    <meta http-equiv="X-Frame-Options" content="DENY" />

    <!-- 대표 URL 지정 (Canonical) -->
    <link rel="canonical" href="https://front-5th-chapter4-2-basic-dusky.vercel.app" />

    <title>Home - Tech Shop</title>

    <!-- PWA 지원 -->
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#33c6dd" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="VR Shop" />
    <link rel="apple-touch-icon" href="/images/menu_icon.png" />

  
```  
---  
### 2단계: 최적화된 리소스 로딩<br>  
**설명**  
* 핵심 스타일(Critical CSS)을 `<style>` 태그 안에 인라인으로 삽입하여 초기 렌더링 시점에 CSS가 로드되지 않는 문제를 최소화합니다. 이로 인해 First Contentful Paint(FCP) 개선 효과를 기대할 수 있습니다.  
* 나머지 스타일시트(`styles.min.css`)는 `rel="preload" as="style"`로 먼저 브라우저가 다운로드를 준비하도록 지시하여 렌더링 차단 시간을 줄이고, 이후 `<link rel="stylesheet">`로 실제 적용되도록 합니다.  
* Hero 섹션에 사용되는 대형 이미지들은 미디어 쿼리 조건과 함께 `preload as="image"`로 설정하여, 필요 시 미리 다운로드됩니다. 특정 뷰포트 크기에 맞는 이미지를 우선적으로 가져올 수 있어 LCP(Largest Contentful Paint)를 크게 개선합니다.  
```html  
<!-- Critical CSS (Ultra compressed) -->
    <style>
      body{margin:0;font-family:Heebo;padding-top:80px}
      .container{width:1440px;max-width:90%;margin:auto;padding:0 16px}
      header{background:#fff;box-shadow:0 1px 6px 0 rgba(0,0,0,.15);height:80px;position:fixed;top:0;left:0;width:100%;z-index:1}
      header .container{display:flex;align-items:center;justify-content:space-between;height:100%}
      header .logo{display:inline-block;font-size:27px}
      header .logo a{text-decoration:none;color:#000}
      header .logo .blue-dot{background:#33c6dd;width:10px;height:10px;display:inline-block;vertical-align:middle;border-radius:6px}
      header nav{display:inline-block}
      header nav ul li{display:inline-block}
      header nav ul li.menu-icon{display:none}
      header nav ul li a{color:#3e3e3e;font-size:15px;letter-spacing:.37px;margin-right:24px;text-decoration:none}
      section.hero{position:relative;overflow:hidden;height:50vh;max-height:400px}
      section.hero img{width:100%;height:100%;filter:brightness(50%);display:none;object-fit:cover;transform:translateZ(0)}
      section.hero img.desktop{display:block}
      .hero-content{position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;display:flex;align-items:center}
      .hero-content .container{display:flex;flex-direction:column;justify-content:center}
      .hero-content h1{max-width:495px;color:#fff;font-size:50px;letter-spacing:1.25px;line-height:56px;margin:0 0 16px;font-weight:400}
      .hero-content p{max-width:518px;color:#fff;font-weight:300;font-size:20px;letter-spacing:.5px;line-height:28px;margin:0 0 21px}
      .hero-content button{height:50px;width:220px;border-radius:92px;background:#33c6dd;color:#fff;font-size:16px;font-weight:700;letter-spacing:.4px;text-align:center;border:none;text-transform:uppercase;cursor:pointer}
      @media (max-width:768px){section.hero{height:40vh;max-height:300px}section.hero img.desktop{display:none}section.hero img.tablet{display:block}.hero-content h1{font-size:36px;line-height:44px}.hero-content p{font-size:18px}.hero-content button{width:180px;height:45px;font-size:14px}}
      @media (max-width:480px){section.hero{height:35vh;max-height:250px}section.hero img.tablet{display:none}section.hero img.mobile{display:block}.hero-content h1{font-size:28px;line-height:36px}.hero-content p{font-size:16px}.hero-content button{width:160px;height:40px;font-size:12px}}
    </style>

    <!-- Optimized resource preloading -->
    <link rel="preload" href="https://fonts.googleapis.com/css?family=Heebo:300,400,600,700&display=swap" as="style" crossorigin />
    <link rel="preload" href="/css/styles.min.css" as="style" crossorigin />
    <link rel="stylesheet" href="/css/styles.min.css" />

    <!-- Preload hero images with media queries -->
    <link rel="preload" as="image" href="images/Hero_Desktop.webp" media="(min-width: 1024px)" />
    <link rel="preload" as="image" href="images/Hero_Tablet.webp" media="(min-width: 768px) and (max-width: 1023px)" />
    <link rel="preload" as="image" href="images/Hero_Mobile.webp" media="(max-width: 767px)" />

  
```  
---  
### 3단계: 시멘틱 HTML 및 접근성 개선<br>  
**설명**  
* `<header role="banner">`와 `<nav role="navigation">`로 의미론적 역할을 명확히 지정하여 스크린 리더 등 보조 기술이 페이지 구조를 이해하기 쉽게 만듭니다.  
* 로고에 `aria-label="Home"`을 부여하여, 이미지나 글자를 읽어줄 때 “홈으로 이동”이라는 의미를 명확히 전달합니다.  
* 메뉴 아이콘(햄버거 버튼) 등은 시멘틱 요소가 아닌 `<button>` 태그로 감싸고, `aria-label="Open menu"`를 명시하여 접근성을 확보합니다.  
* `main` 태그에 `role="main"`을 지정하여 페이지의 주요 콘텐츠가 시작되는 지점을 알립니다.  
```html  
  <body>
    <!-- Google Tag Manager (noscript) -->
    <noscript>
      <iframesrc="https://www.googletagmanager.com/ns.html?id=GTM-PKK35GL5"
        height="0"
        width="0"
        style="display: none; visibility: hidden"
      ></iframe>
    </noscript>
    <!-- End Google Tag Manager (noscript) -->

    <header role="banner">
      <div class="container">
        <section class="logo">
          <a href="index.html" aria-label="Home">
            <strong>VR</strong>
            <span class="blue-dot" aria-hidden="true"></span>
            <span class="blue-dot" aria-hidden="true"></span>
            <span>Headsets</span>
          </a>
        </section>
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="about.html">About us</a></li>
            <li><a href="index.html#best-sellers-section">Best Sellers</a></li>
            <li><a href="index.html#newsletter-section">Newsletter</a></li>
            <li class="menu-icon">
              <button type="button" aria-label="Open menu" tabindex="0">
                <img src="images/menu_icon.png" alt="" width="24" height="24" style="aspect-ratio: 1.2/1; object-fit: contain;" />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <main role="main">

  
```  
---  
### 4단계: Hero 섹션 최적화<br>  
**설명**  
* `<picture>`와 `<source>` 태그를 사용하여 화면 크기에 따라 적절한 이미지를 제공함으로써 불필요한 대용량 이미지를 내려받지 않도록 합니다.  
* `loading="eager"`와 `fetchpriority="high"`를 사용해 Hero 이미지가 가능한 한 빨리 로드되도록 우선순위를 높여 LCP 개선에 기여합니다.  
* `decoding="async"`를 추가해 이미지 해석(디코딩) 시간을 비동기화하여 렌더링 차단을 최소화합니다.  
* `aria-label="Hero section"`을 지정해 보조 기술이 Hero 영역을 명확히 식별할 수 있도록 합니다.  
```html  
html
복사편집
    <section class="hero" aria-label="Hero section">
      <picture>
        <source srcset="images/Hero_Mobile.webp" media="(max-width: 767px)" type="image/webp" />
        <source srcset="images/Hero_Tablet.webp" media="(max-width: 1023px)" type="image/webp" />
        <source srcset="images/Hero_Desktop.webp" media="(min-width: 1024px)" type="image/webp" />
        <imgsrc="images/Hero_Desktop.webp"
          alt="VR Headset"
          width="1200"
          height="675"
          style="aspect-ratio: 16/9; object-fit: cover;"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
      </picture>

      <div class="hero-content">
        <div class="container">
          <h1>Discover our line of VR Headsets</h1>
          <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
          <button>View Headsets</button>
        </div>
      </div>
    </section>

  
```  
---  
### 5단계: 제품 섹션 헤딩 구조 개선<br>  
**설명**  
* 제품을 소개하는 섹션에 `<h2>` 태그를 사용하여 시멘틱하게 제목 구조를 잡습니다. 검색 엔진 최적화(SEO)와 접근성 측면 모두 도움이 됩니다.  
* `<hr />` 태그를 사용해 시각적으로 섹션을 구분하고, 콘텐츠가 끊기는 지점을 명확히 표시합니다.  
* 각 제품별 이미지에 `loading="lazy"`를 지정해 실제로 화면에 노출되기 전까지 이미지를 로드하지 않습니다. 이를 통해 초기 페이지 로딩 시 불필요한 네트워크 요청을 줄이고, 전체 페이지 성능을 개선합니다.  
* 제품 이미지는 `width`, `height`, `style="aspect-ratio"`를 명시하여 레이아웃 시점에 정확한 공간을 잡아주어 레이아웃 이동(CLS)을 방지합니다.  
* 제품 정보를 `<h5>`나 `<h3>` 같은 시멘틱 태그로 구분하고, 가격 정보에는 할인된 가격과 정가를 명확히 표시합니다.  
```html  
    <section class="best-sellers" id="best-sellers-section" aria-label="Best selling products">
      <h2>Best Sellers</h2>
      <hr />
      <div class="product-slider">
        <div class="container">
          <div class="product new">
            <div class="product-picture">
              <imgsrc="images/vr1.jpg"
                alt="Apple VR Headset - Premium virtual reality experience"
                width="300"
                height="200"
                loading="lazy"
                style="aspect-ratio: 3/2; object-fit: contain;"
              />
            </div>
            <div class="product-info">
              <h5 class="categories">Headsets, Apple</h5>
              <h3 class="title">Apple Headset</h3>
              <div class="price">
                <span>US$ 450.00</span>
              </div>
              <button>Add to bag</button>
            </div>
          </div>

          <div class="product new">
            <div class="product-picture">
              <imgsrc="images/vr2.jpg"
                alt="PlayStation VR Headset - Gaming virtual reality headset"
                width="300"
                height="200"
                loading="lazy"
                style="aspect-ratio: 3/2; object-fit: contain;"
              />
            </div>
            <div class="product-info">
              <h5 class="categories">Headsets, PS</h5>
              <h3 class="title">Playstation Headset</h3>
              <div class="price">
                <span>US$ 399.99</span>
              </div>
              <button>Add to bag</button>
            </div>
          </div>

          <div class="product">
            <div class="product-picture">
              <imgsrc="images/vr3.jpg"
                alt="Oculus VR Headset - Immersive virtual reality gaming"
                width="300"
                height="200"
                loading="lazy"
                style="aspect-ratio: 3/2; object-fit: contain;"
              />
            </div>
            <div class="product-info">
              <h5 class="categories">Headsets, Oculus</h5>
              <h3 class="title">Oculus Headset</h3>
              <div class="price">
                <span class="discounted-price">US$ 349.99</span>
                <span class="original-price">US$ 419.99</span>
              </div>
              <button>Add to bag</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="best-sellers">
      <h2>All Products</h2>
      <hr />
      <div class="product-slider" id="all-products">
        <div class="container"></div>
      </div>
    </section>

    <section class="newsletter" id="newsletter-section" aria-label="Newsletter subscription">
      <h2>Newsletter Signup</h2>
      <p>Subscribe now and don't miss a single deal!</p>
      <form aria-label="Newsletter subscription form">
        <label for="email">Your email address</label>
        <input type="email" id="email" name="email" placeholder="Your email..." aria-label="Email address" />
        <button type="submit">Subscribe</button>
      </form>
    </section>

  
```  
---  
### 6단계: Footer 및 JavaScript 최적화<br>  
**설명**  
* `<footer role="contentinfo">`를 사용하여 페이지의 푸터에 의미를 부여합니다.  
* 푸터 내부 카테고리, 회사 정보, 소셜 미디어, 고객 서비스 등으로 메뉴를 분할하여 시멘틱하고 명확한 구조를 제공합니다.  
* 페이지 맨 하단에 필요한 스크립트를 배치하되, 사용자가 실제로 DOM을 완전히 읽은 후에 로드하도록 처리합니다.  
```html  
    </main>

    <footer role="contentinfo">
      <div class="bottom-nav">
        <div class="container">
          <ul>
            <li class="list-title">Categories</li>
            <li><a href="#">Watches</a></li>
            <li><a href="#">Cameras</a></li>
            <li><a href="#">Phones</a></li>
            <li><a href="#">Tablets</a></li>
            <li><a href="#">Computers</a></li>
          </ul>

          <ul>
            <li class="list-title">About Us</li>
            <li><a href="#">Our Story</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Awards</a></li>
            <li><a href="#">Stores</a></li>
          </ul>

          <ul>
            <li class="list-title">Social Media</li>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">LinkedIn</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Twitter</a></li>
            <li><a href="#">YouTube</a></li>
          </ul>

          <ul>
            <li class="list-title">Customer Service</li>
            <li><a href="#">Live Chat</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Terms & Conditions</a></li>
            <li><a href="#">Delivery & Returns</a></li>
            <li><a href="#">Finance</a></li>
          </ul>
        </div>
      </div>
      <div class="copyright-text">2020 &copy; All Rights Reserved</div>
    </footer>

    <a href="#" id="open_preferences_center">Update cookies preferences</a>

    <!-- Register Service Worker for PWA -->
    <script>
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
          navigator.serviceWorker
            .register("/sw.js")
            .then(registration => {
              console.log("SW registered: ", registration);
            })
            .catch(registrationError => {
              console.log("SW registration failed: ", registrationError);
            });
        });
      }
    </script>

    <!-- Load main.js only when DOM is ready -->
    <script type="module">
      document.addEventListener('DOMContentLoaded', () => {
        import('/js/main.min.js');
      });
    </script>

    <!-- Load products.js only when scrolled to products section -->
    <script type="module">
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            import('/js/products.min.js');
            observer.disconnect();
          }
        });
      });

      observer.observe(document.querySelector('#all-products'));
    </script>
  </body>
</html>
  
```  
