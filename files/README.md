# RO 아이템 노점 검색 (개인용)

gnjoy 공식 라그나로크 온라인 사이트의 아이템 거래현황 페이지를 대신 조회해서
보여주는 개인용 웹페이지입니다.

## 구조

```
ro-item-search/
├── api/
│   └── search.js      ← Vercel 서버리스 함수 (gnjoy 스크래핑 프록시, 백엔드)
├── public/
│   └── index.html      ← 검색 화면 (프론트엔드)
├── package.json
└── vercel.json
```

## 배포 방법 (GitHub + Vercel, 전부 무료)

### 1. GitHub에 업로드

```bash
cd ro-item-search
git init
git add .
git commit -m "init"
git remote add origin https://github.com/{내계정}/ro-item-search.git
git push -u origin main
```

(또는 GitHub 웹사이트에서 새 저장소 만들고 파일을 드래그해서 업로드해도 됩니다.)

### 2. Vercel과 연결

1. https://vercel.com 접속 → GitHub 계정으로 로그인
2. "Add New... → Project" 클릭
3. 방금 올린 `ro-item-search` 저장소 선택 → Import
4. 설정 그대로 두고 **Deploy** 클릭
5. 1~2분 후 `https://ro-item-search-xxxx.vercel.app` 같은 주소가 생성됨

이후로는 GitHub에 push할 때마다 Vercel이 자동으로 재배포합니다.

### 3. 로컬에서 먼저 테스트하고 싶다면

```bash
npm install -g vercel
cd ro-item-search
npm install
vercel dev
```

`http://localhost:3000` 접속해서 검색해보고, 정상 작동하는지 확인 후 배포하세요.

## 배포 후 반드시 확인해야 할 것 (중요)

이 코드는 실제 gnjoy 응답 HTML을 직접 테스트하지 못한 상태로 작성됐습니다.
배포 후 검색이 안 되거나 결과가 이상하게 나오면:

1. 브라우저에서 직접
   `https://ro.gnjoy.com/itemdeal/dealSearch.asp?svrID=129&itemFullName=아이템명&curpage=1`
   을 열어서 F12 개발자도구 → 우클릭 "페이지 소스 보기"로 실제 테이블 구조를 확인하세요.
2. `api/search.js`의 `$("table tbody tr")` 셀렉터와 각 `td` 인덱스를
   실제 구조에 맞게 수정하세요.
3. 한글이 깨져서 나오면 EUC-KR 인코딩일 가능성이 높습니다.
   `iconv-lite` 패키지를 추가해서 디코딩 방식을 바꿔야 합니다:
   ```js
   const iconv = require("iconv-lite");
   const html = iconv.decode(Buffer.from(buffer), "euc-kr");
   ```
4. 서버ID(svrID) 매핑이 129(바포메트) 외에는 비어있습니다.
   각 서버 탭 클릭 시 URL이 어떻게 바뀌는지 확인해서 `SERVERS` 객체와
   `index.html`의 탭 버튼을 채워 넣으세요.

## 주의사항

- gnjoy(그라비티) 공식 사이트 데이터를 자동으로 수집하는 방식이라
  이용약관 위반 소지가 있습니다. **개인 학습·테스트 용도로만** 사용하시고,
  불특정 다수 대상 서비스로 운영하지 않는 것을 권장합니다.
- 과도하게 자주 요청하면 gnjoy 서버에 부담을 주거나 IP가 차단될 수 있습니다.
