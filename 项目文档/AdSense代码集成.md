# AdSense代码集成指南

## 获取AdSense代码

### 步骤1：申请AdSense账户
1. 访问 https://www.google.com/adsense
2. 使用Google账号登录
3. 填写网站信息：
   - 网站URL：您的网站地址
   - 网站语言：中文
   - 内容类型：工具/教育
4. 同意条款并提交申请

### 步骤2：等待审核
- 审核时间：通常7-14天
- 审核期间：不要添加广告代码
- 审核通过后：您会收到批准邮件

### 步骤3：获取广告代码
1. 登录AdSense账户
2. 点击"广告" > "概览"
3. 点击"创建广告单元"
4. 配置广告：
   - **名称**：`首页顶部横幅_728x90`
   - **尺寸**：728×90
   - **广告样式**：文字和展示广告
   - **自定义渠道**：(可选)
5. 点击"创建"
6. 复制广告代码

## 广告代码格式

AdSense代码通常如下所示：

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-您的发布商ID" crossorigin="anonymous"></script>
<!-- 首页顶部横幅 -->
<ins class="adsbygoogle"
     style="display:inline-block;width:728px;height:90px"
     data-ad-client="ca-pub-您的发布商ID"
     data-ad-slot="您的广告位ID"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

## 替换占位符

网站中有预留的广告位置，您需要将占位符替换为实际的AdSense代码。

### 1. 首页 (index.html)

#### 顶部横幅广告 (第633-640行)
```html
<!-- 替换前 -->
<div class="adsense-placeholder" id="adsense-top-banner">
    <div class="placeholder-content">
        <p>Google AdSense 广告位 - 728x90 横幅广告</p>
    </div>
</div>

<!-- 替换后 -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-您的发布商ID" crossorigin="anonymous"></script>
<!-- 首页顶部横幅 -->
<ins class="adsbygoogle"
     style="display:inline-block;width:728px;height:90px"
     data-ad-client="ca-pub-您的发布商ID"
     data-ad-slot="您的广告位ID"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

#### 中部矩形广告 (第744-751行)
```html
<!-- 替换前 -->
<div class="adsense-placeholder" id="adsense-middle-rectangle">
    <div class="placeholder-content">
        <p>Google AdSense 广告位 - 300x250 矩形广告</p>
    </div>
</div>
```

### 2. 文章页面 (articles.html)

#### 顶部横幅 (第441-448行)
#### 中部矩形广告 (第564-571行)
#### 侧边栏广告 (第627-634行)
#### 底部横幅 (第662-669行)

### 3. 单篇文章页面 (article-time-management.html)

#### 顶部横幅 (第455-462行)
#### 文章内矩形广告1 (第488-495行)
#### 文章内矩形广告2 (第575-582行)
#### 底部横幅 (第671-678行)

### 4. 时间计算器页面 (time-calculator.html)

广告位置在相应位置替换。

## 广告位管理建议

### 1. 创建独立的广告单元
为每个广告位创建独立的广告单元：
- `home_top_728x90`
- `home_middle_300x250`
- `article_top_728x90`
- `article_inline_300x250`
- `article_sidebar_300x600`

### 2. 使用自定义渠道
为不同的广告位创建自定义渠道，便于追踪效果：
- 首页渠道
- 文章页面渠道
- 计算器页面渠道

### 3. 广告轮换设置
在AdSense控制台设置：
- 频率控制：避免过多广告
- 竞争性排除：排除不相关广告
- 敏感内容筛选

## 最佳实践

### 1. 广告位置
- **首屏位置**：页面加载后立即可见
- **内容相关位置**：文章中间、计算器结果附近
- **非干扰位置**：不遮挡主要内容

### 2. 广告数量
- 首页：2-3个广告
- 文章页：3-4个广告
- 工具页：1-2个广告

### 3. 用户体验
- 广告与内容明显区分
- 不干扰用户操作
- 加载速度优化

### 4. 移动端适配
- 使用响应式广告代码
- 移动端减少广告数量
- 确保广告在小屏幕上可点击

## 代码优化

### 1. 异步加载
确保所有AdSense代码使用`async`属性：
```html
<script async src="..."></script>
```

### 2. Lazy Loading
对于页面下方的广告，可以延迟加载：
```javascript
// 当广告进入视口时加载
window.addEventListener('scroll', function() {
    var adElement = document.getElementById('adsense-bottom');
    var rect = adElement.getBoundingClientRect();
    
    if (rect.top < window.innerHeight) {
        // 加载广告代码
        (adsbygoogle = window.adsbygoogle || []).push({});
    }
});
```

### 3. 错误处理
```javascript
// 广告加载失败处理
window.addEventListener('error', function(e) {
    if (e.target.src && e.target.src.includes('googlesyndication')) {
        console.log('AdSense广告加载失败');
        // 可以显示替代内容
    }
}, true);
```

## 合规性检查

### 必须遵守的规则
1. **不要点击自己的广告**
2. **不要要求他人点击广告**
3. **不要隐藏广告**
4. **不要将广告放在违规内容旁**
5. **不要修改AdSense代码**

### 定期检查
1. 每月检查AdSense政策更新
2. 检查网站是否符合最新政策
3. 及时调整不符合要求的内容

## 性能监控

### 关键指标
1. **页面 RPM**：每千次展示收入
2. **点击率 CTR**：广告点击率
3. **有效每千次展示费用 eCPM**：有效千次展示收入

### 优化策略
1. **A/B测试**：不同广告位置
2. **广告格式测试**：文字 vs 图片 vs 响应式
3. **目标受众调整**：根据用户行为优化

## 故障排除

### 常见问题

#### 广告不显示
1. 检查AdSense账户是否已批准
2. 检查广告代码是否正确
3. 检查网站是否在允许列表中
4. 检查是否有政策违规

#### 收入异常低
1. 检查广告位置是否合适
2. 检查网站流量来源
3. 检查广告与内容相关性
4. 考虑调整广告格式

#### 账户被暂停
1. 立即停止所有广告展示
2. 仔细阅读违规通知
3. 修正所有问题
4. 提交申诉

## 安全建议

### 防止广告欺诈
1. 使用AdSense内置的欺诈检测
2. 监控异常点击模式
3. 设置点击保护

### 数据保护
1. 在隐私政策中说明广告数据收集
2. 遵守GDPR/CCPA等法规
3. 提供用户选择退出选项

## 下一步

1. **申请AdSense**：等待审核通过
2. **插入代码**：按照本指南替换占位符
3. **监控效果**：使用AdSense报告
4. **持续优化**：根据数据调整广告策略

---

**重要提示**：在获得AdSense批准之前，不要插入实际广告代码。使用占位符通过审核。