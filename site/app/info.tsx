import { PageShell } from './article';
export default function Info({
  kind,
  en = false,
}: {
  kind: 'about' | 'privacy';
  en?: boolean;
}) {
  return (
    <PageShell
      en={en}
      title={
        kind === 'about'
          ? en
            ? 'About Life Counter'
            : '关于人生计算器'
          : en
            ? 'Privacy, in plain language'
            : '隐私说明'
      }
    >
      <p className="article-meta">
        {en ? 'Updated September 7, 2026' : '更新于 2026 年 9 月 7 日'}
      </p>
      {kind === 'about' ? (
        <>
          <section>
            <h2>{en ? 'A tool for perspective' : '让时间变得具体'}</h2>
            <p>
              {en
                ? 'Life Counter is an independent website for seeing time at a different scale. Its week calendar, day milestones and date-distance calculator turn dates into something you can inspect and use. The tools are free and do not require an account.'
                : '人生计算器是一个独立网站，希望帮助你用不同尺度观察时间。人生周历、整千天纪念日和日期间隔工具，将抽象的日期变成可以查看和使用的结果。工具免费开放，无需注册。'}
            </p>
            <p>
              {en
                ? 'A display span is a choice, not a lifespan estimate. The site does not assess health, score productivity, or tell you how a life should be lived.'
                : '展示跨度是一种选择，不是寿命估计。本站不评估健康、不为效率打分，也不规定人生应该怎么过。'}
            </p>
          </section>
          <section>
            <h2>{en ? 'How we maintain the content' : '内容与纠错'}</h2>
            <p>
              {en
                ? 'The notes explain the actual conventions used by the tools, with examples you can reproduce. They do not claim to be scientific studies. Chinese and English pages are maintained as paired versions. If a translation or calculation disagrees, please send an example so we can investigate and correct it.'
                : '手记围绕工具实际采用的计算约定展开，并提供可复算的例子，不将生活建议包装成科学研究。中英文页面成对维护。如果发现翻译或计算结果不一致，欢迎发送示例，帮助我们核对和修正。'}
            </p>
          </section>
          <section>
            <h2>{en ? 'Contact' : '联系站点维护者'}</h2>
            <p>
              <a href="mailto:niziyu0430@gmail.com">niziyu0430@gmail.com</a>
            </p>
            <p>
              {en
                ? 'For a calculation issue, include example dates, the selected options and the result you expected. Fictional dates are welcome; do not send identity documents or other sensitive information.'
                : '反馈计算问题时，请附上示例日期、所选选项与预期结果。可以使用虚构日期，无需发送身份证明或其他敏感信息。'}
            </p>
          </section>
          <section>
            <h2>{en ? 'Funding' : '网站运营'}</h2>
            <p>
              {en
                ? 'We plan to support the website with clearly labelled advertising in the future. This version does not load advertising scripts. If that changes, we will update the privacy information and applicable consent controls before enabling them.'
                : '本站计划未来通过清晰标注的广告支持运营。当前版本未加载广告脚本；启用广告前会更新隐私信息和适用的同意设置。'}
            </p>
          </section>
        </>
      ) : (
        <>
          <section>
            <h2>{en ? 'Dates you enter' : '你输入的日期'}</h2>
            <p>
              {en
                ? 'The calculators process your dates inside the current browser page. The application does not send those inputs to a server or write them into cookies or local storage. Refreshing restores the example birthday. A calendar download is generated locally and contains your week count and reference date.'
                : '计算器在当前浏览器页面内处理日期。应用不会将这些输入发送到服务器，也不会写入 Cookie 或本地存储。刷新页面后恢复示例生日。周历下载由浏览器本地生成，包含完整周数和参考日期。'}
            </p>
          </section>
          <section>
            <h2>{en ? 'Website delivery' : '访问网站时'}</h2>
            <p>
              {en
                ? 'The hosting provider receives network information needed to deliver pages, such as your IP address, requested URL and browser request headers, and may keep operational and security logs. Private preview access may also use the hosting platform’s authentication. These hosting functions are separate from the calculator inputs.'
                : '托管服务商会接收提供网页所需的网络信息，例如 IP 地址、访问网址和浏览器请求头，并可能保留运行与安全日志。私有预览的访问也可能使用托管平台的登录功能。这些托管功能与计算器的日期输入分开处理。'}
            </p>
          </section>
          <section>
            <h2>{en ? 'Analytics and advertising' : '统计与广告'}</h2>
            <p>
              {en
                ? 'This version does not include third-party analytics or advertising scripts. If advertising or analytics is enabled later, this page must be updated to identify the services, the information involved and available choices. We will add applicable consent controls before enabling those integrations.'
                : '当前版本没有接入第三方统计或广告脚本。如果日后启用广告或统计，会先更新本页，说明服务、涉及的信息和可选设置，并在接入前补充适用的同意控制。'}
            </p>
          </section>
          <section>
            <h2>{en ? 'Email and external links' : '邮件与外部链接'}</h2>
            <p>
              {en
                ? 'If you email us, your message and email address are available to the site operator and their email provider for handling the request. External reference links take you to sites with their own policies. We do not control those services.'
                : '当你主动发送邮件时，站点维护者及其邮件服务商会接收到邮件内容和邮箱地址，用于处理反馈。外部参考链接指向有各自隐私政策的网站，本站不控制这些服务。'}
            </p>
            <p>
              {en
                ? 'For privacy questions or to request deletion of correspondence, contact:'
                : '隐私问题或邮件往来删除请求，请联系：'}{' '}
              <a href="mailto:niziyu0430@gmail.com">niziyu0430@gmail.com</a>
            </p>
          </section>
        </>
      )}
    </PageShell>
  );
}
