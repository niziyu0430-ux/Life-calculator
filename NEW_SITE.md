# 双语人生计算器新版

源码位于 site/；可直接静态托管的成品位于 docs/。现有 CNAME 和 AdSense ads.txt 已保留。新的 docs/ 替换了旧版页面，旧内容仍可在 Git 历史中查看。

在 site/ 安装依赖并设置 SITE_ORIGIN=https://life-counter.cn，再运行 npm run build。将 site/dist/client 的全部内容复制到 docs/，保留 docs/CNAME 和 .nojekyll。支持 GitHub Pages 的 main /docs 发布方式；实际 Pages 发布设置仍需在仓库 Settings > Pages 确认。

本分支尚未合并，原站未切换。预览：https://life-counter-lab.niziyu0430.chatgpt.site （私有，需要所有者访问）。

新增人生周历、纪念日与日期间隔工具、中英双语原创说明、隐私和联系方式。没有启用广告或统计脚本。日期测试、类型检查、静态构建及 12 页元数据检查通过；浏览器点击和视觉测试尚未执行。

公开上线前核对旧 URL 迁移、移动端交互、广告隐私与适用同意管理。GitHub Pages 的服务限制需根据实际运营方式确认；如不适合广告业务，可继续使用 GitHub 存代码并连接其他托管服务。

重新申请 AdSense 前检查正式域名可访问、内容完整、搜索收录和账户要求。不会因本文档或新版页面数量保证通过审核。

