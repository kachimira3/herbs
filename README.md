# 🌿 本草集 · 中药材辨别学习网站

选修课期末作业项目：一个「中药材辨别」小网站，纯 HTML + CSS + JavaScript 编写，
**不需要装任何软件**，双击 `index.html` 用浏览器打开就能用。

## 功能
- 📖 **药材百科**：30 味常用中药材，带图片、性味、归经、功效、使用注意，支持搜索
- ✏️ **辨别测验**：看图认药名 → 再选药性（四气），答完出成绩 + 答题回顾

## 项目结构
```
herbs/
├─ index.html      ← 网页主体，双击打开
├─ css/style.css   ← 样式
├─ js/data.js      ← 药材数据（想加药材改这里）
├─ js/app.js       ← 页面逻辑（百科 + 测验）
├─ images/         ← 药材图片放这里
└─ README.md       ← 本说明
```

## 怎么替换成真实药材图片
1. 找好图片（注意：课程作业建议用免费图库，如 Wikimedia Commons，并注明图片来源）
2. 图片放到 `images/` 文件夹
3. **文件名必须和药材 id 一致**，例如 `人参` 的 id 是 `renshen`，图片就命名为：
   - `renshen.jpg`（或 `.png` / `.webp` / `.jpeg`，任意一种即可）
4. 刷新页面，占位图就变成真实图片了

> 没有图片时网站会自动显示一张好看的占位图，不会报错；放图后自动替换。

## 怎么添加新药材
打开 `js/data.js`，照着现有格式在末尾加一项（记得逗号）：

```js
{
  id: "mudanpi",          // id 用英文，图片就叫 images/mudanpi.jpg
  name: "牡丹皮",          // 药材名
  pinyin: "mǔ dān pí",    // 拼音
  category: "清热药",      // 分类标签
  qi: "寒",                // 四气：寒 / 热 / 温 / 凉 / 平
  nature: "苦、辛，微寒",  // 性味
  meridian: "归心、肝、肾经", // 归经
  efficacy: "清热凉血，活血化瘀", // 功效
  intro: "……简介……",     // 简介（一两句话）
  note: "……使用注意……"   // 使用注意
}
```

## 常见问题
- **打开后图片是字/色块？** 正常，那是占位图，放好真实图片就消失。
- **打开网页很慢？** 网页在本地运行，不依赖网络（占位图也是本地生成的）。
- **想提交作业，怎么打包？** 把整个 `herbs` 文件夹压缩成 zip 即可。

## 图片来源（作业里请注明！）
已收录药材的真实图片来源于 **Wikimedia Commons**（自由授权图库），列表如下。
作业中建议在致谢或图片来源部分注明出处，例如：
“药材图片来自 Wikimedia Commons（链接见下），遵循 CC BY-SA / CC BY 等自由许可。”

| 药材 | 来源链接 |
|------|----------|
| 人参 renshen | https://commons.wikimedia.org/wiki/File:Insam_(ginseng).jpg |
| 白术 baizhu | https://commons.wikimedia.org/wiki/File:Atractylodes_macrocephala_slices.jpg |
| 当归 danggui | https://commons.wikimedia.org/wiki/File:Angelicae_radix_021014.jpg |
| 枸杞子 gouqizi | https://commons.wikimedia.org/wiki/File:Goji_dried_berries.jpg |
| 甘草 gancao | https://commons.wikimedia.org/wiki/File:Licorice_slices.jpg |
| 茯苓 fuling | https://commons.wikimedia.org/wiki/File:Wolfiporia_extensa%E8%8C%AF%E8%8B%93fu_ling.jpg |
| 陈皮 chenpi | https://commons.wikimedia.org/wiki/File:Chinpi.jpg |
| 薄荷 bohe | https://commons.wikimedia.org/wiki/File:Mentha_haplocalyx.jpg |
| 生姜 shengjiang | https://commons.wikimedia.org/wiki/File:Fresh_Ginger.JPG |
| 大枣 dazao | 百度图库搜索，干燥果实 |
| 川芎 chuanxiong | https://commons.wikimedia.org/wiki/File:Ligusticum_sinense_%27Chuanxiong%27_slices.jpg |
| 三七 sanqi | https://commons.wikimedia.org/wiki/File:Panax_notoginseng.jpg |
| 红花 honghua | https://commons.wikimedia.org/wiki/File:Yamagata_safflower_(dry_flower).jpg |
| 葛根 gegen | https://commons.wikimedia.org/wiki/File:Puerariae1.JPG |
| 桔梗 jiegeng | 百度图库搜索，干燥根 |
| 干姜 ganjiang | https://commons.wikimedia.org/wiki/File:Dried_ginger_slices.jpg |
| 五味子 wuweizi | 百度图库搜索，干燥果实 |

| 黄芪 huangqi | 百度图库搜索，干燥饮片 |
| 金银花 jinyinhua | 百度图库搜索，干燥花蕾 |
| 菊花 juhua | 百度图库搜索，干燥花序 |
| 山药 shanyao | 百度图库搜索，干燥饮片 |
| 百合 baihe | 百度图库搜索，干燥鳞叶 |
| 丹参 danshen | 百度图库搜索，干燥饮片 |
| 柴胡 chaihu | 百度图库搜索，干燥根 |
| 黄连 huanglian | 百度图库搜索，干燥根茎 |
| 连翘 lianqiao | 百度图库搜索，干燥果实 |
| 半夏 banxia | 百度图库搜索，干燥块茎 |
| 附子 fuzi | 百度图库搜索，炮制品 |
| 酸枣仁 suanzaoren | 百度图库搜索，干燥种子 |
| 石斛 shihu | 百度图库搜索，干燥茎 |

> 以上图片仅用于课程作业学习展示，不作商业用途。

## 还能怎么加分（可选拓展）
- 测验增加「错题本」，下次只练错题
- 加一个计时器，限时答题
- 药材数量扩充到 50+ 味
- 在测验里记录历史成绩，画个折线图
- 增加「药性口诀」小抄页（如：寒凉药清解火热，温热药补虚散寒……）

> ⚠️ 小提示：作业里请注明药材信息与图片来源，仅作学习用途，不构成医疗建议。
