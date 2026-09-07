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

## 增强版检查

20 个中英文内容页面；执行 node scripts/verify-release.mjs 检查 canonical、语言互链、HTML 语言、站点地图目标、站内锚点、运行资源与插画、CNAME、ads.txt、robots、.nojekyll 和 404 文档。结果以每次运行输出为准。

站主已授权替换旧站。privacy.html、about.html、contact.html、calculators.html、articles.html、lifecounter.html、lifecountergoogle.html、time-calculator.html 提供即时迁移页；不相关的旧健康和财务页面保留真实 404。

日期、时间预算和日历导出共十组自动测试通过；类型检查与静态构建通过。浏览器视觉与点击测试、Search Console 收录和 AdSense 审核不在离线检查范围内。
