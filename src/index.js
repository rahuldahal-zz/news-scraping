import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

try {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://kathmandupost.com/national");

  const articles = await page.evaluate(() => {
    const newsArticlesLinks = document.querySelectorAll(
      "#news-list article figure a"
    );
    const articles = [];
    newsArticlesLinks.forEach((link) => {
      const hrefSplitted = link.href.split("/");
      articles.push({
        title: hrefSplitted[hrefSplitted.length - 1].replace(/-/g, " "),
        url: link.href,
        image: link.children[0].src,
      });
    });
    return articles;
  });

  const data = fs.writeFileSync(
    path.join(path.resolve(), "/data/news.json"),
    JSON.stringify(articles)
  );
  await browser.close();
} catch (e) {
  console.log(e);
}
