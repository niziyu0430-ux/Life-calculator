# 发布检查记录

基于原 main 提交 c978ebba1cd00ca1fdbc310f1aab6f7279daba2b 和当前新版 docs/ 成品检查。这里记录仓库证据，不把它当作线上服务器或 Google 审核的结果。

## 旧版发现

旧 sitemap 共 30 个 URL，全部指向 lifecalculator.com，与站主提供的 life-counter.cn 不符。其中 14 个路径在同一提交的 docs/ 中不存在：

- /about.html
- /article-career-transition.html
- /article-life-goals.html
- /article-retirement-planning.html
- /contact.html
- /article-annual-planning.html
- /article-procrastination.html
- /article-work-life-balance.html
- /article-career-development.html
- /article-retirement-savings.html
- /article-time-management-mistakes.html
- /article-stress-management.html
- /article-family-budget.html
- /article-healthy-diet.html

## 新版检查

执行 node scripts/verify-release.mjs：12 个中英文页面通过；核对了 88 个站内链接和 98 处运行资源引用。检查覆盖 canonical、语言互链、HTML 语言、站点地图目标、站内锚点、资源存在性、CNAME、ads.txt、robots、.nojekyll 和 404 文档。可在每次更新 docs/ 后重跑，不依赖网络。

## 公开切换仍待决定

草稿尚未合并。以下旧文件将在目前方案中移除，没有为不等价的内容自动跳转到首页：

- docs/article-daily-time-management.html
- docs/article-finance-health.html
- docs/article-health-lifespan-impact.html
- docs/article-longevity-habits.html
- docs/article-personal-finance-guide.html
- docs/article-time-management.html
- docs/articles.html
- docs/calculators.html
- docs/financial-calculator.html
- docs/health-lifespan-calculator.html
- docs/life-goals-calculator.html
- docs/lifecounter.html
- docs/lifecountergoogle.html
- docs/privacy.html
- docs/retirement-calculator.html
- docs/terms.html
- docs/time-calculator.html

站主确认聚焦日期工具后，应为仍有等价页面的旧地址补迁移，例如 privacy.html 到 /privacy/；没有等价内容的旧页面保留真实 404，或先决定是否移植。浏览器视觉/交互、线上 HTTP 状态、Search Console 收录和 AdSense 审核都不在本次离线检查范围内。

迁移参考：https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
