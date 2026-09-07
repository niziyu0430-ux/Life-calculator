# 双语人生计算器新版

源码位于 site/；静态发布文件位于 docs/。站主已授权替换旧站。CNAME 为 life-counter.cn。

功能：可点选人生周历、周历图片下载、纪念日及日历文件下载、日期间隔、168 小时时间规划与计划下载。六篇成对中英文指南配有算例与互动练习，共 20 个内容页面。两张专为本站生成的插画已压缩为 WebP。

在 site/ 安装依赖，设置 SITE_ORIGIN=https://life-counter.cn 后运行 npm run build；将 dist/client 全部复制到 docs/，保留 CNAME 和 .nojekyll。根目录运行 node scripts/verify-release.mjs 核对静态发布。

日期、预算与日历导出十组测试通过，类型检查与静态构建通过。浏览器视觉和点击测试尚未执行。无广告或第三方统计脚本；邮箱 niziyu0430@gmail.com。

8 个有等价内容的旧地址提供即时迁移页面。不相关的旧健康及财务页面保持真实 404。原内容可从 Git 历史恢复。

Sites 私有预览：https://life-counter-lab.niziyu0430.chatgpt.site 。正式站：https://life-counter.cn 。是否已上线需以实际 HTTP 检查和部署状态为准。

本站不保证 AdSense 通过或流量收益。重新申请前应核对账户要求；实际启用广告时需相应更新隐私及适用同意管理。
