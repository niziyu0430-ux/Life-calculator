import type { LifeEvent, Effects, Words } from './types';
const w = (zh: string, en: string): Words => ({ zh, en });
const profiles: Record<string, [Effects, Effects]> = {
  learn: [
    { knowledge: 5, mood: 1 },
    { connection: 3, mood: 2 },
  ],
  care: [
    { connection: 5, mood: 2 },
    { health: 3, mood: 2 },
  ],
  try: [
    { knowledge: 3, mood: 3 },
    { health: 3, connection: 2 },
  ],
  work: [
    { knowledge: 3, coins: 8, health: -2 },
    { mood: 3, connection: 2 },
  ],
  rest: [
    { health: 5, mood: 2 },
    { connection: 4, health: 1 },
  ],
  spend: [
    { coins: -8, mood: 5 },
    { knowledge: 3, coins: 2 },
  ],
};
// Each row is an independently authored bilingual situation and two choices.
const groups: [number, number, string][] = [
  [
    0,
    5,
    `
你伸手抓住了一本布书。|You reach for a soft picture book.|听家人讲故事|Listen to a story|一起辨认颜色|Name the colors together|learn
窗外的雨滴敲着玻璃。|Rain taps against the window.|跟着雨声打拍子|Tap along with the rain|依偎着听一会儿|Listen while cuddling|care
你第一次走到房间另一端。|You cross the room for the first time.|再试一小段|Try a little farther|牵着手慢慢走|Walk slowly holding hands|try
积木塔倒了，积木散了一地。|Your block tower tumbles down.|换个底座重搭|Build a wider base|邀请家人一起搭|Build with your family|learn
公园里有一条陌生的小路。|There is a new path in the park.|观察沿途的小虫|Look for tiny insects|在树荫下休息|Rest in the shade|try
第一次自己吃饭弄脏了衣服。|Your first solo meal gets messy.|继续练习拿勺子|Keep practicing with the spoon|请家人示范|Ask someone to demonstrate|learn
你在夜里被雷声惊醒。|Thunder wakes you in the night.|用话语描述害怕|Describe what feels scary|抱着玩偶休息|Rest with a favorite toy|rest
隔壁孩子带来一盒彩笔。|A neighbor brings a box of crayons.|合作画一棵树|Draw a tree together|交换最喜欢的颜色|Trade favorite colors|care
你想知道月亮为什么跟着走。|You wonder why the moon follows you.|把问题说出来|Ask your question|和家人看一会儿月亮|Watch the moon together|learn
你第一次试着穿好鞋子。|You try putting on your own shoes.|多练习一次|Practice once more|把步骤编成儿歌|Make a rhyme about the steps|try
家里准备了一次小小的生日聚会。|Your family plans a small birthday gathering.|和大家做装饰|Make decorations together|选一个安静的游戏|Choose a quiet game|care
你在花盆里看见新芽。|A new shoot appears in a plant pot.|记住浇水的日子|Remember watering days|给新芽起个名字|Name the little shoot|learn
`,
  ],
  [
    6,
    17,
    `
新同桌看起来有点紧张。|Your new desk mate seems nervous.|主动介绍自己|Introduce yourself|邀请一起整理书桌|Tidy the desks together|care
图书馆允许你办第一张借书卡。|You can get your first library card.|借一本陌生主题的书|Borrow an unfamiliar topic|听听朋友推荐|Ask a friend for a recommendation|learn
作业里有一道迟迟不会的题。|One homework problem keeps you stuck.|把步骤拆开重做|Break it into smaller steps|向同学请教|Ask a classmate for help|learn
运动会缺一位接力队员。|The relay team needs another runner.|报名认真练习|Sign up and practice|帮队伍准备饮水|Help prepare water for the team|try
你和朋友对游戏规则意见不同。|You and a friend disagree on a rule.|一起重新约定|Agree on a rule together|暂停一下再聊|Take a pause before talking|care
学校组织一次自然观察。|Your class goes on a nature walk.|记录三种树叶|Record three kinds of leaves|照顾走得慢的同伴|Stay with a slower walker|learn
你发现自己忘带午餐。|You discover you forgot your lunch.|向老师说明情况|Explain to your teacher|接受朋友分享并道谢|Accept a friend's offer and thank them|care
手工课的纸模型一直站不稳。|Your paper model will not stand up.|重新设计支撑|Redesign its support|和伙伴分工修补|Repair it with a partner|try
考试结果没有达到期待。|An exam result falls short of your hopes.|寻找一个具体薄弱点|Find one specific gap|先休息再整理心情|Rest before reflecting|rest
班级正在筹备一次演出。|Your class is preparing a performance.|试着登台|Try a role onstage|负责幕后道具|Help with backstage props|try
你第一次拥有可自己安排的周末。|You have a weekend to plan yourself.|安排学习和空白时间|Plan study and empty space|约朋友去散步|Invite a friend for a walk|care
网上一则惊人的消息引起讨论。|A startling online claim sparks discussion.|找一找原始来源|Look for its original source|提醒大家先别转发|Suggest waiting before sharing|learn
你想参加一个新的兴趣小组。|You consider joining a new club.|先旁听一次|Attend a trial session|问问成员的体验|Ask members about it|try
朋友请你替他掩饰一次失误。|A friend asks you to cover up a mistake.|陪他坦诚解释|Help him explain honestly|说明自己的界限|Explain your boundaries|care
你在旧书里发现一段陌生文字。|You find unfamiliar writing in an old book.|查字典慢慢读|Work through it with a dictionary|请长辈讲讲背景|Ask an elder about its context|learn
升学选择让你有点犹豫。|Your next school choice feels uncertain.|比较课程和兴趣|Compare courses with your interests|和信任的人讨论|Talk with someone you trust|learn
连续忙碌后你发现很难集中注意。|After a busy stretch, concentration is hard.|整理睡眠与日程|Make space for sleep|减少一项额外活动|Drop one extra activity|rest
毕业前大家交换留言。|Classmates exchange notes before graduation.|写下具体的感谢|Write a specific thank-you|约定未来保持联系|Make a plan to stay in touch|care
`,
  ],
  [
    18,
    24,
    `
你搬进了第一间独立生活的房间。|You move into your first independent room.|列一份生活清单|Make a household checklist|邀请朋友一起整理|Invite a friend to help unpack|learn
一道选修课打开了新方向。|An elective introduces a new direction.|完成一个小项目|Complete a small project|和老师聊聊可能性|Discuss possibilities with the tutor|learn
实习单位交来一个陌生任务。|An internship brings an unfamiliar task.|先确认任务边界|Clarify the task first|向同事请教范例|Ask a colleague for an example|work
生活费比预想花得更快。|Living costs rise faster than expected.|记录一周支出|Track a week's spending|和室友共享日用品|Share essentials with a roommate|learn
朋友邀请你参加一次远行。|Friends invite you on a trip.|按预算安排短途|Plan a trip within your budget|在本地安排一天探索|Explore locally for a day|spend
小组合作出现分工不均。|A group project has uneven workloads.|把任务写清楚|Write down the responsibilities|约一次坦诚讨论|Arrange an honest discussion|care
第一份求职信没有得到回复。|Your first application gets no response.|修改一个具体段落|Improve one specific paragraph|请朋友帮忙阅读|Ask a friend to review it|work
你有机会向前辈介绍作品。|You can show your work to a mentor.|准备简短演示|Prepare a short demonstration|带着问题交流|Bring a few questions|work
你与室友的作息不同。|Your roommate keeps different hours.|一起约定安静时段|Agree on quiet hours|调整自己的工作角落|Rearrange your work corner|care
附近社区招募周末志愿者。|A local group needs weekend volunteers.|承担一次固定任务|Take one defined task|先了解参与方式|Learn how the group works|care
你开始学习一道拿手菜。|You start learning a favorite dish.|按步骤反复练习|Practice the steps|邀请朋友一起做|Cook it with friends|try
一次公开发言让你紧张。|A public talk makes you nervous.|提前小范围练习|Practice with a small group|准备清晰的提纲|Prepare a clear outline|learn
旧爱好和新课程挤在同一天。|An old hobby clashes with a new class.|减少频率但保留爱好|Keep the hobby less often|试行两周新安排|Try a new schedule for two weeks|rest
你收到一个看起来很诱人的合作邀请。|A collaboration offer looks tempting.|询问清楚职责和报酬|Clarify duties and payment|请有经验的人看看|Ask an experienced person to review it|learn
你第一次负责组织聚会。|You organize a gathering for the first time.|做一份简单流程|Make a simple plan|邀请大家各带一样东西|Ask everyone to contribute|care
一份临时工作需要占用休息日。|A temporary job needs your day off.|只接受明确的一次|Accept one clearly defined shift|保留原定休息|Keep your planned rest|work
你发现一项练了很久的技能开始进步。|A practiced skill finally starts improving.|保存过程记录|Keep a record of the process|与同伴分享心得|Share what helped with a peer|try
离开熟悉环境后你有些想家。|You miss home in an unfamiliar place.|安排一次认真通话|Make time for a proper call|建立新的日常习惯|Build a new daily routine|care
招聘会上有许多不同方向。|A career fair offers many directions.|选择两条路线深入了解|Explore two routes in detail|参加一次行业讲座|Attend an industry talk|work
你准备给过去一年的自己写信。|You decide to write to your past self.|写下学到的三件事|Name three things you learned|写下值得感谢的人|Name people you appreciate|care
`,
  ],
  [
    25,
    44,
    `
工作里的一项流程总在浪费时间。|A work process keeps wasting time.|做一个小改进试验|Test one small improvement|先听同事的经验|Listen to colleagues first|work
多年不见的朋友来到你的城市。|An old friend visits your city.|留出一晚认真相聚|Make an evening for them|安排一次轻松散步|Plan a relaxed walk|care
家中一件常用物品坏了。|An everyday household item breaks.|学习维修而不是替换|Learn to repair it|比较后买合适的替代品|Choose a suitable replacement|spend
你得到一次带新人的机会。|You have a chance to mentor a newcomer.|整理清晰的入门说明|Write a clear introduction|陪他完成第一个任务|Help with the first task|work
一项项目临近截止却增加了要求。|A project gains new requirements near its deadline.|协商优先级|Negotiate priorities|把新增工作分开排期|Schedule the extra work separately|work
你意识到很久没有好好休息。|You realize it has been a while since a proper break.|空出一个完整下午|Keep an afternoon free|恢复每天的小段休息|Restore a small daily break|rest
朋友正在经历一段低落时期。|A friend is going through a difficult stretch.|认真倾听而不急着建议|Listen without rushing to advise|约定一次实际的帮忙|Offer one practical form of help|care
你想重新拾起学生时代的爱好。|You want to return to an old hobby.|从十分钟练习开始|Start with ten minutes|找一位同伴同行|Find someone to join you|try
团队对一项方案意见分裂。|Your team disagrees about a proposal.|先明确共同目标|Clarify the shared goal|提出小范围试行|Suggest a limited trial|work
你在周末发现了一条新的步道。|You find a new walking trail.|慢慢走完一小段|Walk a short section slowly|邀邻居一起探索|Invite a neighbor along|rest
一次聚会的话题让你感到不自在。|A conversation at a gathering feels uncomfortable.|平静说明自己的想法|State your view calmly|换一个大家都愿谈的话题|Offer a more comfortable topic|care
你考虑为工作学习新工具。|You consider learning a new work tool.|先做一个可用的小例子|Build one useful example|参加同事分享会|Join a colleague's workshop|learn
社区提出改善公共空间的建议。|Neighbors propose improving a shared space.|提交一个具体建议|Contribute a concrete idea|参与一次清理活动|Join a cleanup session|care
一笔意外支出打乱了本月计划。|An unexpected cost disrupts your month.|重新安排非必要支出|Reschedule optional spending|修复可继续使用的物品|Repair something still usable|learn
你发现日程里没有自己的时间。|Your calendar has no time for yourself.|取消一项不必要承诺|Cancel one unnecessary commitment|明确一个固定空档|Protect one regular opening|rest
一个过去的作品收到新的反馈。|An older project receives fresh feedback.|挑一条意见认真改进|Act on one useful comment|记录自己的成长|Record how you have grown|learn
你被邀请在小组里分享经验。|You are invited to share experience with a group.|讲一个真实的小案例|Tell one concrete story|组织一次问答|Host a question session|work
你想给家人一个不昂贵的惊喜。|You want to surprise family without spending much.|亲手准备一餐|Prepare a meal yourself|整理一册共同回忆|Collect shared memories|care
一次合作没有达到双方期待。|A collaboration falls short of expectations.|一起复盘可改进之处|Review what can improve|友好结束并说明界限|End kindly with clear boundaries|care
工作和个人计划同时需要你。|Work and a personal plan both need your attention.|为两者约定具体时间|Give each a clear time slot|先完成最小必要任务|Do the smallest essential task first|work
你有机会接触不同领域的人。|You meet people from another field.|带着好奇认真提问|Ask curious questions|交换一本书的推荐|Exchange book recommendations|learn
你想更新自己的生活空间。|You want to refresh your living space.|购买一件真正需要的东西|Buy one genuinely needed item|重新摆放已有物品|Rearrange what you already own|spend
邻居希望你帮忙照看植物。|A neighbor asks you to care for plants.|明确时间和浇水方式|Agree on timing and care|邀请对方互相照应|Suggest helping each other|care
一个忙碌季度终于结束。|A demanding quarter finally ends.|安排一天无目标的休息|Take a day without a goal|与伙伴庆祝一点进展|Celebrate some progress together|rest
`,
  ],
  [
    45,
    64,
    `
你熟悉的行业正在采用新方法。|Your field is adopting new methods.|学习一个实际用例|Learn one practical use|向年轻同事请教|Ask a younger colleague|learn
旧友提议重走年轻时的路线。|An old friend suggests revisiting a familiar route.|按体力缩短行程|Choose a manageable distance|带着旧照片慢慢聊|Talk over old photographs|care
家里的责任发生了变化。|Responsibilities at home are changing.|重新讨论分工|Discuss a new division of tasks|保留每人的休息时间|Protect everyone's rest time|care
你开始整理多年积累的资料。|You begin sorting years of collected material.|归档最有用的部分|Archive the useful parts|把经验写给后来者|Write notes for newcomers|learn
你想把一项经验传给别人。|You want to pass on a skill.|带一个小型工作坊|Run a small workshop|录下一段示范|Record a demonstration|work
一位熟人提出合伙计划。|An acquaintance suggests a partnership.|先进行有限试验|Try a limited pilot|核对责任后再决定|Clarify responsibility before deciding|work
你发现休闲活动被工作替代。|Work has displaced a leisure activity.|重新保留固定时段|Restore a regular time slot|与朋友约定一起参加|Arrange to attend with a friend|rest
你和亲人对未来安排看法不同。|You and a relative differ about future plans.|分别写下最在意的事|Write down what matters most|找一个安静时间讨论|Choose a quiet time to talk|care
社区需要一位耐心的组织者。|A community group needs a patient organizer.|承担一项明确工作|Take one defined responsibility|协助现有组织者|Help the current organizer|care
一次新学习让你再次感到笨拙。|Learning something new feels awkward again.|允许自己慢慢来|Allow yourself to go slowly|寻找适合的入门材料|Find suitable beginner material|learn
你考虑调整工作的节奏。|You consider changing your work pace.|逐步减少额外任务|Reduce extra tasks gradually|讨论更灵活的安排|Discuss a more flexible schedule|rest
多年收藏的物品占满了空间。|Collected objects fill your space.|保留有意义的少数|Keep the meaningful few|赠给真正需要的人|Give some to people who need them|care
你收到参加老同学聚会的邀请。|You receive a reunion invitation.|带着好奇去见面|Go with curiosity|写信联系最想念的人|Write to someone you miss|care
一个长期项目接近完成。|A long project nears completion.|整理过程中的经验|Document what you learned|邀请伙伴一起收尾|Finish it with your partners|work
你发现自己开始喜欢一种新音乐。|You discover a new kind of music.|了解它的创作背景|Learn its background|与朋友交换歌单|Exchange playlists with a friend|try
生活里出现了新的照护任务。|A new caring responsibility appears.|协调可以获得的帮助|Coordinate available help|先明确可承担的范围|Clarify what you can take on|care
你想安排一次有纪念意义的旅行。|You want to plan a meaningful trip.|制定可负担的路线|Plan an affordable route|收集旧地的新故事|Explore new stories in a familiar place|spend
你被问到最值得保留的工作习惯。|Someone asks which work habit matters most.|分享一个具体做法|Share one concrete practice|也听听对方的新方法|Listen to their newer approach|work
安静的早晨突然多了起来。|Quiet mornings become more frequent.|给阅读留一个位置|Make a place for reading|到附近走一小圈|Take a short local walk|rest
你开始考虑退休后的日常。|You start imagining daily life after retirement.|试行一个轻松周计划|Try a relaxed weekly plan|了解附近的兴趣活动|Explore nearby interest groups|learn
一个过去的误会有了澄清机会。|There is a chance to clear up an old misunderstanding.|坦诚表达自己的部分|Acknowledge your part honestly|给彼此留出时间|Give each other time|care
你需要决定是否再接一项额外工作。|You must decide whether to take extra work.|只接边界清楚的部分|Accept only a clearly bounded part|把时间留给生活|Keep the time for your life|work
`,
  ],
  [
    65,
    79,
    `
退休后的第一个普通星期有些陌生。|An ordinary week after retirement feels unfamiliar.|尝试轻松的日程|Try a relaxed routine|先允许自己无事可做|Allow some unplanned days|rest
你想记录一段年轻时的故事。|You want to record a story from your youth.|写下具体场景|Write a concrete scene|讲给愿意听的人|Tell someone who wants to listen|care
社区开设了新的兴趣课程。|A community center offers a new class.|试听一次|Try a session|邀请邻居一起去|Invite a neighbor|learn
花园里一株植物终于开花。|A plant in the garden finally blooms.|记录它的变化|Record its changes|与朋友分享喜悦|Share the delight with a friend|care
你发现一次远行需要更多准备。|A longer trip now needs more preparation.|安排充足的休息点|Plan enough rest stops|选择近一些的目的地|Choose somewhere closer|rest
年轻人想听听你的工作经历。|A younger person asks about your working life.|讲一次失败后的调整|Describe recovering from a setback|分享受过的帮助|Describe help you received|care
你第一次尝试一项新的数字工具。|You try an unfamiliar digital tool.|从一个简单任务学起|Start with one simple task|请朋友陪着操作|Ask a friend to explore with you|learn
一件旧衣服需要修补。|A favorite old garment needs mending.|慢慢修好继续穿|Mend it at your own pace|请手艺人帮忙|Ask a craftsperson to help|spend
你希望和远方的人保持联系。|You want to stay close to someone far away.|约定定期通话|Arrange regular calls|写一封纸质信|Write a paper letter|care
你在散步时认识了一位新朋友。|You meet a new friend on a walk.|约好下次同行|Arrange another walk|交换喜欢的书|Exchange favorite books|care
收藏多年的照片需要整理。|Old photographs need organizing.|为照片补上故事|Add stories to the photographs|请家人一起辨认|Identify people together with family|learn
你有机会参与地方故事采集。|You can contribute to a local history project.|分享亲历的小事|Share a small memory|帮助核对资料|Help check the records|care
一项兴趣开始让你感到疲惫。|A hobby begins to feel tiring.|缩短每次活动时间|Shorten each session|尝试更轻松的方式|Try a gentler version|rest
你想把某件心爱物品送给别人。|You consider giving away a treasured object.|说明它背后的故事|Explain its story|询问对方是否需要|Ask whether it would be useful|care
难得的晴天带来一个空闲下午。|A sunny day brings a free afternoon.|在窗边安静阅读|Read quietly by the window|和熟人喝茶聊天|Have tea with someone familiar|rest
你开始制作一份想做的小事清单。|You make a list of small things to try.|选一件本周能做的|Choose one for this week|留一项给朋友共同完成|Choose one to do with a friend|try
`,
  ],
  [
    80,
    89,
    `
一封旧信让你想起很久以前的人。|An old letter brings someone to mind.|写下想说的话|Write what you want to say|与信任的人分享回忆|Share the memory with someone trusted|care
有人问你一个普通日子怎样才算好。|Someone asks what makes an ordinary day good.|讲一件具体的小事|Describe one small pleasure|认真听听对方的答案|Listen to their answer|care
窗边的光线适合慢慢看书。|Light by the window is good for reading.|读一小段喜欢的文字|Read a favorite passage|闭目休息一会儿|Rest your eyes for a while|rest
你想把拿手的小技巧留下来。|You want to pass on a small practical skill.|录下一次慢速示范|Record a slow demonstration|陪别人亲手试一次|Guide someone through a first try|learn
家人翻出了你年轻时的照片。|Family finds a photograph of your younger self.|补充照片没有讲的故事|Tell what the picture leaves out|问问他们看到了什么|Ask what they notice|care
熟悉的街区开了一家新店。|A new shop opens in your neighborhood.|有人陪同去看看|Visit with a companion|在熟悉的地方聊聊|Talk in a familiar place|rest
你收到来自老朋友的问候。|An old friend sends greetings.|认真回复近况|Reply with a thoughtful update|约一次方便的通话|Arrange a convenient call|care
一个年轻人担心自己走得太慢。|A younger person worries about moving too slowly.|分享自己绕过的弯路|Share a detour from your own life|陪他把下一步想清楚|Help clarify one next step|care
你想重新听一次熟悉的旋律。|You want to hear a familiar melody again.|找出那首歌|Find the song|请家人一起听|Invite family to listen|rest
整理物品时发现一份未完成的草稿。|You find an unfinished draft while sorting things.|补上最想表达的一句|Add the sentence that matters most|把未完成也留作记录|Keep it as an unfinished record|learn
今天适合一次短短的户外停留。|Today is good for a short time outdoors.|坐着看看树影|Sit and watch the tree shadows|和同伴聊聊眼前的风景|Talk about the view with a companion|rest
你想为这一段生活留下标题。|You want to give this chapter of life a title.|选一个带着感谢的词|Choose a word of gratitude|选一个仍然好奇的词|Choose a word of curiosity|care
`,
  ],
];
export const events: LifeEvent[] = groups.flatMap(([min, max, rows], group) =>
  rows
    .trim()
    .split('\n')
    .map((line, i) => {
      const [zh, en, az, ae, bz, be, profile] = line.split('|');
      const effects = profiles[profile];
      return {
        id: `chapter-${group}-${i}`,
        min,
        max,
        text: w(zh, en),
        weight: 1,
        choices: [
          {
            label: w(az, ae),
            effects: effects[0],
            result: w(
              `你选择了${az}。这次经历留下了一点改变。`,
              `You chose to ${ae.toLowerCase()}. The experience leaves a small change.`,
            ),
          },
          {
            label: w(bz, be),
            effects: effects[1],
            result: w(
              `你选择了${bz}。生活继续向前。`,
              `You chose to ${be.toLowerCase()}. Life moves forward.`,
            ),
          },
        ],
      };
    }),
);
export { w };
