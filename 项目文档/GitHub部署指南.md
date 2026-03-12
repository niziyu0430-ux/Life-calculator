# GitHub部署指南

## 第一步：创建GitHub仓库

### 方法1：通过GitHub网站创建
1. 登录GitHub账号 (https://github.com)
2. 点击右上角 "+" 图标，选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `life-calculator` (或您喜欢的名称)
   - **Description**: 人生计算器网站 - 时间管理、健康评估、财务规划一站式工具
   - **Public** (选择公开)
   - **Initialize this repository with**: 不要勾选任何选项
4. 点击 "Create repository"

### 方法2：通过GitHub CLI创建 (如果已安装)
```bash
gh repo create life-calculator --public --description "人生计算器网站"
```

## 第二步：连接本地仓库到GitHub

打开命令提示符或终端，导航到项目目录，然后运行：

```bash
# 添加远程仓库（替换YOUR_USERNAME为您的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/life-calculator.git

# 或者使用SSH方式（如果您配置了SSH密钥）
# git remote add origin git@github.com:YOUR_USERNAME/life-calculator.git

# 推送代码到GitHub
git branch -M main
git push -u origin main
```

## 第三步：启用GitHub Pages（免费托管）

1. 在GitHub仓库页面，点击 "Settings"
2. 左侧菜单选择 "Pages"
3. 在 "Source" 部分，选择：
   - **Branch**: `main`
   - **Folder**: `/` (根目录)
4. 点击 "Save"
5. 等待几分钟，GitHub会生成您的网站地址：
   - `https://YOUR_USERNAME.github.io/life-calculator/`

## 第四步：验证网站

1. 访问您的GitHub Pages地址
2. 检查所有页面是否正常工作：
   - 主页面：`/`
   - 时间计算器：`/time-calculator.html`
   - 文章页面：`/articles.html`
   - 隐私政策：`/privacy.html`
   - 使用条款：`/terms.html`

## 第五步：配置自定义域名（可选）

如果您有自己的域名：
1. 在GitHub Pages设置中添加您的域名
2. 在您的域名注册商处配置DNS记录：
   - 类型：`CNAME`
   - 主机：`www` (或您想要的子域名)
   - 指向：`YOUR_USERNAME.github.io`

## 故障排除

### 如果推送失败：
```bash
# 确保远程仓库URL正确
git remote -v

# 如果URL错误，可以移除后重新添加
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/life-calculator.git

# 强制推送（谨慎使用）
git push -u origin main --force
```

### 如果GitHub Pages不工作：
1. 检查 `index.html` 文件是否存在
2. 确保仓库是公开的
3. 等待5-10分钟让GitHub处理
4. 检查 "Actions" 标签页是否有错误

### 文件路径问题：
如果页面链接不工作，请确保所有HTML文件中的链接使用相对路径：
- 正确：`href="time-calculator.html"`
- 错误：`href="/time-calculator.html"` (GitHub Pages上可能不工作)

## 自动部署

每次将代码推送到 `main` 分支时，GitHub Pages会自动更新网站。

```bash
# 后续更新代码只需执行：
git add .
git commit -m "更新描述"
git push origin main
```

## 重要提示

1. **不要提交敏感信息**：确保 `.gitignore` 文件已排除敏感文件
2. **定期备份**：GitHub会自动备份您的代码
3. **监控流量**：GitHub提供基本的访问统计
4. **SEO优化**：确保所有页面都有正确的meta标签和结构

## 联系方式

如果您遇到问题：
1. 查看GitHub文档：https://docs.github.com
2. 检查GitHub社区讨论
3. 或联系技术支持

---

**部署状态**：✅ 本地仓库已初始化并提交
**下一步**：请按照上述指南创建GitHub仓库并推送代码