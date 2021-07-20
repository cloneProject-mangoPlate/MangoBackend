import puppeteer from "puppeteer";
import Shop from "./models/shop.js";
import { app, express } from "./index.js";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// 화면 보고 싶다면 false 설정하여 런치

let array = [];

const main = async (crawlpage) => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const crawlpage2 = crawlpage.split("/");
  const pageKeyword = crawlpage2[crawlpage2.length - 1];
  const page = await browser.newPage();
  await page.waitForTimeout(2000);
  await page.setViewport({
    width: 1920,
    height: 1080,
  });

  await page.goto(crawlpage, {
    waitUntil: "load",
  });
  await page.reload();
  await page.waitForTimeout(2000);

  const main2 = async () => {
    const button = await page.$("#contents_list > div > button");
    try {
      while (button) {
        await page.waitForSelector("#contents_list > div > button");
        await page.click("#contents_list > div > button");
        await page.waitForTimeout(2000);
      }
    } catch {
      return;
    }
  };

  await main2();
  await page.waitForTimeout(2000);

  let datas = await page.$$eval("span.title>a", (ahref) => {
    return ahref.map((ahref) => ahref.getAttribute("href"));
  });

  console.log(datas);

  async function getOne(datas, pageKeyword) {
    for (let i = 0; i < datas.length; i++) {
      await page.goto("https://www.mangoplate.com" + datas[i], {
        waitUntil: "load",
      });
      let keyword = pageKeyword;

      const result = await page.evaluate(() => {
        let data = [];
        let menu = [];
        let menuList = [];
        let tags = [];
        let images = [];

        let image_list = document.querySelectorAll("img.center-croping");
        image_list.forEach((image) => {
          images.push(image.getAttribute("src"));
        });
        let images_src = images.slice(0, 4);

        let star = document.querySelector(
          "body > main > article > div.column-wrapper > div.column-contents > div > section.restaurant-detail > header > div.restaurant_title_wrap > span > strong > span"
        ).innerText;

        let tag_list = document.querySelectorAll(
          "body > main > article > div.column-wrapper > div.side-wrap > div > div.inner > section.module.related-tags.only-desktop > p >a"
        );
        tag_list.forEach((a) => {
          tags.push(a.innerText);
        });

        let shopName = document.querySelector(
          "body > main > article > div.column-wrapper > div.column-contents > div > section.restaurant-detail > header > div.restaurant_title_wrap > span > h1"
        ).innerText;

        data_list = document
          .querySelector(
            "body > main > article > div.column-wrapper > div.column-contents > div > section.restaurant-detail > table"
          )
          .innerText.split("\n");

        for (let i = 0; i < data_list.length; i++) {
          if (data_list[i] === "메뉴\t") {
            break;
          }
          if (data_list[i].includes("지번")) {
            data.push(["지번", data_list[i].split("지번")[1]]);
          } else {
            data.push(data_list[i].split("\t"));
          }
        }
        if (data_list.includes("메뉴\t")) {
          for (
            let i = data_list.indexOf("메뉴\t") + 1;
            i < data_list.length;
            i++
          ) {
            menu.push(data_list[i]);
          }
        }

        if (menu !== []) {
          menu = menu.filter(
            (element, i) => element != "" && element != "\t" && element != null
          );
        }

        if (menu !== []) {
          for (let i = 0; i < menu.length; i++) {
            if (i % 2 === 0) {
              if (!menu[i].includes("+")) {
                menuList.push([menu[i], menu[i + 1]]);
              }
            }
          }
        }

        return {
          shopName,
          star,
          data,
          menuList,
          tags,
          images_src,
        };
      });
      result.keyword = keyword;
      array.push(result);
      console.log(result);
      await page.goto(crawlpage);
    }
  }
  await getOne(datas, pageKeyword);
  await page.waitForTimeout(10000);
  await browser.close();
};
let page_list = [
  "https://www.mangoplate.com/top_lists/gwangju_donggu",
  "https://www.mangoplate.com/top_lists/759_jjimdak",
  "https://www.mangoplate.com/top_lists/1359_korean_pub",
  "https://www.mangoplate.com/top_lists/979_fried_chicken",
  "https://www.mangoplate.com/top_lists/2858_anju_cheongdam",
  "https://www.mangoplate.com/top_lists/tantannoodle_top5",
  "https://www.mangoplate.com/top_lists/1268_daegu",
  "https://www.mangoplate.com/top_lists/1334_lamb",
  "https://www.mangoplate.com/top_lists/916_pub",
  "https://www.mangoplate.com/top_lists/2855_hangover_itaewon",
  "https://www.mangoplate.com/top_lists/968_duck",
  "https://www.mangoplate.com/top_lists/2857_familydinner_seoraevillage",
  "https://www.mangoplate.com/top_lists/2841_kidsfriendly_gangneung",
];
for (let i = 0; i < page_list.length; i++) {
  await main(page_list[i]);
}

// const mongo = async (array) => {};
await array.map((r) => {
  return Shop.create({
    shopName: r.shopName,
    keyword: r.keyword,
    star: r.star,
    data: r.data,
    menuList: r.menuList,
    tags: r.tags,
    img_url: r.images_src,
  });
});
