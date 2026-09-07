import { extraGuides } from './content-extra';
type Note = {
  title: string;
  description: string;
  category: string;
  sections: { heading: string; paragraphs: string[] }[];
};
export const guides: { slug: string; zh: Note; en: Note }[] = [
  {
    slug: 'life-in-weeks',
    zh: {
      title: '人生周历怎么用，才不会变成焦虑日历？',
      description:
        '把一格当作一周的容器，而不是一次倒计时。用一个小练习，找到下周想留给自己的时间。',
      category: '生活观察',
      sections: [
        {
          heading: '先理解这张图的边界',
          paragraphs: [
            '人生周历把连续的日子分成七天一格。它擅长展示时间的尺度，却无法显示一周的质量：照顾家人的一周、休息的一周、完成作品的一周，在图上都一样大。不要把填满的格子理解成成就，也不要把空白格理解成欠下的任务。',
            '本站默认展示从生日开始的 80 年。这个数字是一种画布尺寸，不是个人寿命的统计估计。你可以换成 20、40、60、100 或 120 年。已经超出所选跨度时，换一张更大的画布即可；生活没有因此超时。',
          ],
        },
        {
          heading: '为什么一行不等于一岁',
          paragraphs: [
            '每一行放 52 格，每格七天，所以一行是 364 天。公历的普通年有 365 天，闰年有 366 天。我们保留每格固定七天的含义，因此不会把行号标成精确年龄。周历末尾会增加一个格子来容纳不足七天的部分。',
            '例如，从 2000 年 1 月 1 日到 2000 年 1 月 8 日，经过七个日历日：第一个格子填满，第二个格子成为当前周。出生当天经过零天，第一格是正在开始的一周。',
          ],
        },
        {
          heading: '做一次十五分钟的下周安排',
          paragraphs: [
            '先看过去七天，写下一件让你觉得时间花得值得的事。可以是散步、修好一把椅子，或一次没有看手机的晚餐。接着为下周选一件想重复的事，把它放进一个具体时间段。最后检查这个时间段是否挤掉了睡眠、必要的工作或照护责任；如果是，就把计划缩小。',
            '例如，“以后多阅读”可以改成“周三晚饭后，在沙发上读二十分钟”。周历不会替你执行，但可以提醒你：长期愿望最终需要一个很小的近期位置。',
          ],
        },
        {
          heading: '如果看图让你感到压力',
          paragraphs: [
            '可以暂时离开周历，切换到日期间隔工具，只计算眼前一个活动的准备时间。你也可以只保存一张周历，几个月后再看，而不是每天检查。这个工具的用途是提供视角，不是监督自己。',
            '下载按钮生成一张 SVG 周历，其中包含完整周数、参考日期和展示跨度，不直接写入生日。周数仍可能让别人推算大致年龄，因此只分享自己愿意公开的内容。下载不需要账户，文件由当前浏览器生成。',
          ],
        },
      ],
    },
    en: {
      title: 'Use a life calendar without turning it into a deadline',
      description:
        'A square can hold a week without judging it. Try a small planning exercise that makes room for something you care about.',
      category: 'PERSPECTIVE',
      sections: [
        {
          heading: 'What the picture can—and cannot—say',
          paragraphs: [
            'A life calendar groups consecutive days into seven-day squares. It makes scale visible, but cannot show the quality of a week. Caring for someone, resting, and finishing a project occupy the same space. A filled square is not an achievement score, and an empty square is not an overdue task.',
            'Our default view covers 80 years from the example birthday. That is a canvas size, not an estimate of your personal lifespan. You can choose 20, 40, 60, 100, or 120 years instead. If your reference date has passed the chosen span, select a larger canvas. Nothing about your life has expired.',
          ],
        },
        {
          heading: 'Why a row is not an exact year',
          paragraphs: [
            'Each row holds 52 squares of seven days: 364 days in total. A common calendar year has 365 days and a leap year has 366. We keep squares at a consistent seven days, so row numbers should not be read as exact ages. An extra partial square covers the final days of the chosen span.',
            'From January 1, 2000 to January 8, 2000, seven calendar days have passed. The first square is complete and the second marks the current week. On the birth date itself, zero days have elapsed and the first square is the current week.',
          ],
        },
        {
          heading: 'A fifteen-minute exercise for next week',
          paragraphs: [
            'Look back over the past seven days and name one thing that made the time feel worthwhile. It might be a walk, a repaired chair, or dinner without your phone. Choose one thing to repeat next week and give it a specific time slot. Check whether that slot would displace sleep, essential work, or caring responsibilities. If so, make the plan smaller.',
            '“Read more someday” could become “read for twenty minutes on the sofa after dinner on Wednesday.” The calendar will not carry out the plan. It can remind you that a distant intention needs a small place in the near future.',
          ],
        },
        {
          heading: 'When the view feels unhelpful',
          paragraphs: [
            'Leave the calendar and use the date-distance tool for one upcoming event instead. You can also save a calendar and revisit it in a few months, rather than checking every day. Its purpose is perspective, not self-surveillance.',
            'The download creates an SVG with your completed weeks, reference date, and chosen span, without writing your birth date directly. Someone could still infer an approximate age from the week count. Share only what you are comfortable making public. The file is created in your browser without an account.',
          ],
        },
      ],
    },
  },
  {
    slug: 'day-milestones',
    zh: {
      title: '第 10000 天：找到生日之外的纪念日',
      description:
        '整千天纪念日怎么算？用明确的起点、可核对的例子，避免常见的一天误差。',
      category: '日期灵感',
      sections: [
        {
          heading: '纪念日不一定要按年计算',
          paragraphs: [
            '生日每年一次，但走过 5000 天或 10000 天也可以成为一次回看的理由。本站的整千天工具取参考日期之后的下一个 1000 天倍数。它可以用来安排一次聚会、一张近照或写给自己的短笺，不必变成新的任务。',
            '输入生日后，先确认“计算到哪一天”。如果今天恰好已经走过 10000 天，工具会把下一个目标显示为 11000 天；你仍可以在自选天数中输入 10000 查看今天的纪念日。',
          ],
        },
        {
          heading: '经过 10000 天，不等于出生第 10000 天',
          paragraphs: [
            '本工具把出生当天计为第 0 天。经过 10000 天的日期，就是出生日期加上 10000 个日历日。如果把出生当天称为“人生第 1 天”，那么“人生第 10000 天”会早一天。两种说法都能使用，关键是邀请和纪念文字里说明口径。',
            '一个容易手算的例子：2000 年 1 月 1 日出生，经过 7 天是 1 月 8 日；如果包含出生当天，人生第 7 天是 1 月 7 日。更大的数字仍然沿用同样的规则。',
          ],
        },
        {
          heading: '用一个例子核对工具',
          paragraphs: [
            '以 2000 年 1 月 1 日作为起点，经过 1000 天是 2002 年 9 月 27 日；经过 10000 天是 2027 年 5 月 19 日。中间的闰日已经按真实公历日期计算，不需要自己再额外加天。',
            '工具按日期计算，没有询问出生时刻或出生地。因此结果适合日历纪念，不代表出生后精确经过多少个 24 小时。在跨时区安排活动时，应另外明确当地日期和活动时间。',
          ],
        },
        {
          heading: '让庆祝保持轻松',
          paragraphs: [
            '选一个你真正想保留的动作：拍同一地点的照片，整理十张旧照片，或者写下此刻在意的三件事。庆祝不需要支出，也不需要给过去的日子打分。',
            '如果发现纪念日已经过去，也可以选 12000 天、15000 天或任何 1–100000 之间的整数。自选日期可能早于参考日期，这是正常结果；只有“下一个整千天”自动选择未来目标。',
          ],
        },
      ],
    },
    en: {
      title: 'Your 10,000-day milestone: a date between birthdays',
      description:
        'Find a thousand-day anniversary with a clear starting point, worked examples, and no off-by-one surprises.',
      category: 'MILESTONES',
      sections: [
        {
          heading: 'Anniversaries do not have to be annual',
          paragraphs: [
            'A birthday returns once a year, but reaching 5,000 or 10,000 days can offer another reason to pause. Our milestone tool finds the next multiple of 1,000 days strictly after your reference date. Use it for a gathering, a photograph, or a note to yourself—not another obligation.',
            'Check the “Calculate as of” date after entering your birthday. If you have lived exactly 10,000 days on that date, the next target is 11,000 days. You can still enter 10,000 in the custom field to find the milestone happening on the reference date.',
          ],
        },
        {
          heading: '10,000 days old and the 10,000th day are different',
          paragraphs: [
            'This calculator treats your birth date as day 0. The date on which you have lived 10,000 days is your birth date plus 10,000 calendar days. If you call the birth date “day 1 of life,” the ordinal “10,000th day of life” is one day earlier. Both conventions can be meaningful; make the convention clear when naming an event.',
            'For an easy example, someone born on January 1, 2000 reaches seven days on January 8. Counting the birth date as day 1 makes January 7 their seventh day of life. The same rule applies to larger numbers.',
          ],
        },
        {
          heading: 'Check a worked example',
          paragraphs: [
            'Starting on January 1, 2000, 1,000 elapsed days lands on September 27, 2002. Adding 10,000 days lands on May 19, 2027. Leap days are already included by counting actual Gregorian dates, so do not add them a second time.',
            'The tool asks for a date, not a birth time or birthplace. It is suitable for calendar milestones rather than an exact number of 24-hour periods since birth. For an event across time zones, specify the local event date and time separately.',
          ],
        },
        {
          heading: 'Keep the celebration small',
          paragraphs: [
            'Choose something you would like to keep: a photograph in the same place, ten old pictures collected in a folder, or three sentences about what matters to you now. A milestone does not need spending or a verdict on the past.',
            'If one milestone has passed, try 12,000, 15,000, or any whole number from 1 to 100,000. A custom milestone may fall before the reference date; that is a valid result. Only the next-thousand-day field automatically picks a future target.',
          ],
        },
      ],
    },
  },
  {
    slug: 'date-math',
    zh: {
      title: '日期相差几天？先把“算哪一天”说清楚',
      description:
        '同一天为什么可能是 0 天或 1 天？日期间隔、闰年、周岁与时区的计算说明。',
      category: '计算方法',
      sections: [
        {
          heading: '经过的天数和覆盖的日期数',
          paragraphs: [
            '从 9 月 1 日到 9 月 7 日，经过 6 天，因为有六次跨越午夜。如果活动从 1 日持续到 7 日，并且两天都参与，就覆盖 7 个日期。本站默认计算前一种间隔；勾选“首尾两天都算在内”后，在结果上加 1。',
            '同一天作为起止日期，默认结果为 0，包含首尾时为 1。这个区别对旅行安排和活动日程很有用，但工具不解释合同期限或其他有专门规则的日期。请按具体规则另行核对。',
          ],
        },
        {
          heading: '为什么不直接除以 365',
          paragraphs: [
            '一年不总是 365 天。公历中能被 4 整除的年份一般为闰年，但能被 100 整除而不能被 400 整除的年份例外。因此 2000 年是闰年，2100 年不是。',
            '年龄按生日周年计算，而不是用总天数除以 365 再向下取整。本站对 2 月 29 日出生的周年日期采用明确约定：非闰年使用 2 月 28 日。这个约定仅用于本工具的周岁和展示跨度，不宣称适用于所有法律或文化场景。',
          ],
        },
        {
          heading: '日期计算与小时计算不同',
          paragraphs: [
            '网站先把年、月、日转成统一的 UTC 午夜标记，再相减得到日历天数。这是在编码日期，而不是声称你出生于 UTC 午夜。它避免浏览器所在时区或夏令时让一个日历间隔变成 23 或 25 小时而出现小数。',
            '“计算到哪一天”初次打开时使用你设备的当地日期，之后可以自己修改。页面跨过午夜后不会擅自改变你已选择的日期；需要时修改参考日期或刷新。当前工具不计算小时、时区换算、法定节假日或工作日。',
          ],
        },
        {
          heading: '可以自己复算的边界例子',
          paragraphs: [
            '2024 年 2 月 28 日至 3 月 1 日相隔 2 天，包含首尾时为 3 天；2023 年的相同月日相隔 1 天。2026 年 1 月 1 日至 12 月 31 日相隔 364 天，包含首尾时为 365 天。',
            '所有输入使用公历，支持 1900 年及以后的有效日期。结束日期早于开始日期时，工具显示错误而不悄悄交换日期。出生日期晚于参考日期同样会被拒绝，这样你可以发现输错的年份。',
          ],
        },
        {
          heading: '发现计算不符时',
          paragraphs: [
            '先核对是否勾选包含首尾、参考日期是否正确、以及你比较的是周岁还是完整周数。如果仍然不符，请通过页脚的联系邮箱发送一组可复现的示例日期和预期结果。可以使用虚构生日，不必提供真实个人信息。',
            '本说明和计算逻辑同步维护。工具以公历日期规则为依据；关于闰年的背景可参考美国海军天文台的 Calendars 页面，日期对象的技术说明可参考 MDN 的 Date 文档。',
          ],
        },
      ],
    },
    en: {
      title: 'Days between dates: decide what you are counting',
      description:
        'Why the same date can mean zero or one day. Our conventions for intervals, leap years, age, and time zones.',
      category: 'METHOD',
      sections: [
        {
          heading: 'Elapsed days versus included dates',
          paragraphs: [
            'September 1 to September 7 is a six-day interval: six midnight boundaries separate the dates. An event that includes both September 1 and September 7 covers seven dates. Our default is the interval. Selecting “Include both start and end dates” adds one to the result.',
            'Using the same date twice produces zero by default and one with both endpoints included. This distinction helps with trip and event planning, but the tool does not interpret contracts or deadlines governed by special rules. Check those rules separately.',
          ],
        },
        {
          heading: 'Why age is not days divided by 365',
          paragraphs: [
            'Years do not all have 365 days. Under the Gregorian rule, a year divisible by 4 is normally a leap year, except years divisible by 100 but not by 400. Consequently, 2000 was a leap year and 2100 will not be.',
            'We count completed birthday anniversaries rather than dividing elapsed days by 365. For February 29 birthdays we use February 28 in a non-leap year. This is an explicit convention for the age and display-span calculations, not a claim about every legal or cultural use of birthdays.',
          ],
        },
        {
          heading: 'Calendar dates are not durations in hours',
          paragraphs: [
            'We encode the year, month, and day as a UTC-midnight marker and subtract those markers to count calendar days. This does not mean you were born at midnight UTC. It prevents daylight-saving transitions or the browser time zone from turning a calendar interval into a fractional result because a local day lasts 23 or 25 hours.',
            'On first load, the reference date is set to your device’s local date. You can change it. If midnight passes with the page open, your chosen date is left alone; update it or refresh when needed. This tool does not calculate hours, time-zone conversions, public holidays, or working days.',
          ],
        },
        {
          heading: 'Boundary examples to check yourself',
          paragraphs: [
            'February 28 to March 1, 2024 is two elapsed days, or three included dates. The same month and day pair in 2023 is one elapsed day. January 1 to December 31, 2026 is 364 elapsed days, or 365 dates with both endpoints included.',
            'Inputs use the Gregorian calendar and accept valid dates from 1900 onward. An end date before a start date produces an error instead of silently swapping the dates. A birth date after the reference date is also rejected, making a mistyped year easier to spot.',
          ],
        },
        {
          heading: 'If your result differs',
          paragraphs: [
            'Check the endpoint option, reference date, and whether you are comparing completed years with completed weeks. If a result still appears incorrect, email a reproducible pair of example dates and the expected result using the contact link. A fictional birthday is enough; you do not need to disclose personal information.',
            'This explanation is maintained alongside the calculation logic. For background on calendar rules, see the U.S. Naval Observatory’s Calendars page; for the date representation used in software, see MDN’s Date documentation.',
          ],
        },
      ],
    },
  },
  ...extraGuides,
];
