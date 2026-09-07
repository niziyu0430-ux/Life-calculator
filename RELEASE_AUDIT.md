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

## 2026-09-07 原创人生体验版

新增 /play/、/en/play/；总计 22 个双语页面。正式域名构建检查通过：266 个站内链接、254 个资源引用，canonical、语言互链、站点地图、CNAME 与旧地址迁移均已核对。

136 条中英原创事件，纯函数引擎，固定种子、本地存档和防损坏重建。游戏 4 组自动检查通过，其中 1,000 局模拟全部结束，136 条事件均被覆盖，无重复核心事件、无空选项、属性边界正确；另 12 组日期和下载规则测试通过。最终版已在 Chromium 浏览器实际完整游玩至 82 岁结局，并验证重开确认、回到人物/背景选择、刷新恢复、语言切换与回顾下载。

七张重新生成的原创插画逐张检查，六篇指南和规划器各占唯一位置，中英共用，列表不重复配图。旧直接调色照片不再发布。两套 Blender GLB，各七个年龄形变与骨骼呼吸动作，合计 4,011,812 bytes；静态渲染检查两人七阶段正侧背 42 个视图。实际浏览器检查年龄联动、滑杆、键盘旋转缩放、视角恢复、切换人物、暂停和高龄循环返回幼年。

通过仅本地 QA 服务在正式构建中注入存储拒绝、WebGL 不可用和减少动态效果，验证静态回退且游戏可继续，存储失败进入内存模式，减少动态效果默认不播放。QA 服务在 work 中，未进入发布文件。桌面 1365×900 和手机尺寸 390×844 检查，无横向溢出。没有进行实体手机触控、鼠标拖拽的自动验证或低端真机性能基准；浏览器后台有帧率节流，不能据此承诺所有设备帧率。

私有 Sites 第 4 版已成功部署，部署状态 succeeded；当前测试网络访问其页面受到 Cloudflare 拦截，不声称该私有网址浏览器验收通过。上述功能验收针对同一源代码的本地正式构建。正式域名上线结果以 GitHub Pages 部署与在线复核为准。本轮未启用广告脚本，未承诺 AdSense 通过或流量收益。
