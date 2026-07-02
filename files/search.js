// api/search.js
// Vercel Serverless Function: ro.gnjoy.com 아이템 거래현황을 대신 요청해서
// HTML을 파싱한 뒤 JSON으로 반환하는 프록시입니다.
//
// 브라우저는 CORS 때문에 ro.gnjoy.com을 직접 호출할 수 없어서,
// 이 서버(백엔드) 코드가 대신 요청하고 결과만 프론트엔드에 넘겨줍니다.

const cheerio = require("cheerio");

const BASE_URL = "https://ro.gnjoy.com/itemdeal/dealSearch.asp";

// 확인된 서버ID. 나머지는 실제 페이지에서 개발자도구(F12) > Network 탭으로
// 각 서버 탭 클릭 시 svrID 값이 어떻게 바뀌는지 확인해서 채워 넣으세요.
const SERVERS = {
  "0": "전체",
  "129": "바포메트",
  // "xxx": "이그드라실",
  // "xxx": "이프리트",
};

module.exports = async (req, res) => {
  // CORS 허용 (내 프론트엔드가 이 함수를 호출할 수 있도록)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const {
    svrID = "0",
    itemFullName = "",
    itemOrder = "",
    inclusion = "",
    curpage = "1",
  } = req.query;

  const params = new URLSearchParams({
    svrID,
    itemFullName,
    itemOrder,
    inclusion,
    curpage,
  });

  const targetUrl = `${BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Referer: "https://ro.gnjoy.com/itemdeal/dealSearch.asp",
        "Accept-Language": "ko-KR,ko;q=0.9",
      },
    });

    if (!response.ok) {
      res.status(502).json({ error: `gnjoy 응답 오류: ${response.status}` });
      return;
    }

    const buffer = await response.arrayBuffer();
    // gnjoy는 EUC-KR일 수도, UTF-8일 수도 있습니다. 배포 후 한글이 깨지면
    // 아래 디코딩 방식을 iconv-lite로 EUC-KR 디코딩하도록 바꿔야 합니다.
    let html = Buffer.from(buffer).toString("utf-8");

    const $ = cheerio.load(html);

    // ---- 아래 셀렉터는 실제 페이지 구조를 F12로 확인 후 조정 필요 ----
    const items = [];
    $("table tbody tr").each((_, el) => {
      const tds = $(el).find("td");
      if (tds.length < 4) return; // 데이터 행이 아니면 스킵

      const serverText = $(tds[0]).text().trim();
      const itemCell = $(tds[1]);
      const itemName = itemCell.text().trim();
      const itemImg = itemCell.find("img").attr("src") || "";
      const quantity = $(tds[2]).text().trim();
      const price = $(tds[3]).text().trim();
      const shopName = tds.length > 4 ? $(tds[4]).text().trim() : "";

      if (!itemName) return;

      items.push({
        server: serverText,
        itemName,
        itemImage: itemImg,
        quantity,
        price,
        shopName,
      });
    });

    // 총 검색 결과 수 같은 안내 텍스트가 있으면 함께 추출 (있을 경우)
    let totalText = "";
    $("body")
      .contents()
      .each((_, node) => {
        if (node.type === "text" && node.data.includes("검색결과")) {
          totalText = node.data.trim();
        }
      });

    res.status(200).json({
      query: { svrID, itemFullName, curpage },
      serverName: SERVERS[svrID] || svrID,
      total: totalText,
      items,
    });
  } catch (err) {
    res.status(500).json({ error: "스크래핑 실패", detail: String(err) });
  }
};
