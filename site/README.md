# 人生计算器 / Life Counter

双语静态网站：人生周历、整千天纪念日、日期间隔、六篇成对中英文指南、168 小时时间规划、交互周历与日历文件下载、关于与隐私说明。联系邮箱：niziyu0430@gmail.com。

## 运行与发布

需要 Node 22.13+。安装使用 npm ci；预览使用 npm run dev；验证使用 npm test、npm run typecheck；构建使用 npm run build。静态成品在 dist/client。

默认构建为 Sites 预览域名。正式域名构建前设置 SITE_ORIGIN=https://life-counter.cn，站点地图与页面 canonical 会一起更新。GitHub Pages 或其他静态托管需要发布 dist/client 的全部内容，包括 _next、.nojekyll、ads.txt 和子目录，不能仅上传 index.html。

## 计算约定

出生当天为第零天；日期按 UTC 午夜标记相减，避免夏令时引起的小数；周岁使用生日周年，2 月 29 日在非闰年按 2 月 28 日；每格固定七天，每行 52 格共 364 天；80 年为展示跨度，不是寿命预测。

日期输入不写入应用服务器、Cookie 或本地存储。下载 SVG 含周数和参考日期，不直接写入生日。网页托管仍会接收访问日志。当前无广告或第三方统计脚本。

## 发布状态

这是独立重建版本，站主已授权替换旧站。发布包含 20 个中英文内容页面，并为 8 个相关旧地址提供迁移页；不相关的旧健康与财务页面返回 404。私有 Sites 地址不供 Google 索引，也不能用于正式 AdSense 审核。

## 流量与 AdSense 的下一阶段

先用真实使用反馈验证周历下载、纪念日与日期间隔是否有持续需求。Search Console 验证域名后提交正式 sitemap，观察中文和英文分别出现的搜索词、展示、点击与收录情况；用这些信号决定扩展哪些工具和手记，不大量生成同义页面。

分享可以围绕“10000 天纪念日”和“人生周历”真实使用场景展开，避免承诺寿命预测或收益。现有六篇指南是起点，不代表 Google 一定会判定内容充足。公开站点的原创实用内容、完整访问体验与政策符合性才是审核对象。

AdSense 编号和 ads.txt 来自站主现有仓库。准备重新审核前确认账户要求、公开可访问性与联系方式；启用广告前更新实际隐私说明并配置适用的同意管理。不要诱导点击广告或购买无效流量。审核通过和广告收入均未实现或保证。

参考：https://support.google.com/adsense/answer/7299563 、https://support.google.com/adsense/answer/12176698 、https://developers.google.com/search/docs/fundamentals/creating-helpful-content

## 验证边界

日期、时间预算与日历导出有十组自动测试。浏览器视觉和点击测试尚未执行；WebMCP set_life_calendar 已按能力检测注册，但当前没有可用的 WebMCP 验证环境，尚未声称验证通过。

