// ============================================================
// 本草集 · 交互逻辑
// 零基础友好：尽量用容易读懂的写法，带中文注释
// ============================================================
"use strict";

/* ---------- 通用小工具 ---------- */

// 简写：document.querySelector
function $(sel) { return document.querySelector(sel); }

// 洗牌（Fisher-Yates），返回新数组，不改变原数组
function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

// 防止 XSS 的转义函数
function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ---------- 图片处理 ---------- */

// 图片会在 images/ 文件夹里找：id.jpg -> id.png -> id.webp -> id.jpeg
// 全都找不到时，显示一张“中文占位图”（直接画成 SVG）
var IMG_EXTS = ["jpg", "png", "webp", "jpeg"];

// 生成占位图（data URI 版 SVG，网页里直接嵌入图片）
function placeholderSrc(name) {
  var first = name.charAt(0);
  var colors = [
    ["#6f9e6a", "#3e6b45"],
    ["#c9a35b", "#8a6d2d"],
    ["#b4593a", "#7c3a24"],
    ["#7d9bb5", "#4a6a85"],
    ["#a27993", "#6e4d63"]
  ];
  var idx = (first.charCodeAt(0) + name.length) % colors.length;
  var c = colors[idx];
  var svg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>" +
    "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
    "<stop offset='0%' stop-color='" + c[0] + "'/>" +
    "<stop offset='100%' stop-color='" + c[1] + "'/>" +
    "</linearGradient></defs>" +
    "<rect width='400' height='300' fill='url(#g)'/>" +
    "<circle cx='200' cy='130' r='70' fill='rgba(255,255,255,0.25)'/>" +
    "<text x='200' y='165' font-size='80' fill='#ffffff' text-anchor='middle' font-family='serif'>" + first + "</text>" +
    "<text x='200' y='270' font-size='26' fill='rgba(255,255,255,0.9)' text-anchor='middle'>" + name + "</text>" +
    "<text x='200' y='292' font-size='16' fill='rgba(255,255,255,0.6)' text-anchor='middle'>点击查看资料 · 可替换图片</text>" +
    "</svg>";
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

// 根据药材生成 <img>，优先用缩略图（快），失败再试原图，最后用占位图
function makeImg(herb, cls) {
  var img = document.createElement("img");
  img.alt = herb.name;
  img.loading = "lazy";        // 懒加载：滚到才加载，省流量
  img.decoding = "async";      // 异步解码：不阻塞页面
  if (cls) img.className = cls;

  // 候选路径：先缩略图，再原图各种格式
  var sources = ["images/thumbs/" + herb.id + ".jpg"];
  IMG_EXTS.forEach(function (ext) {
    sources.push("images/" + herb.id + "." + ext);
  });

  var tried = 0;
  function tryNext() {
    if (tried < sources.length) {
      img.src = sources[tried];
      tried++;
    } else {
      img.src = placeholderSrc(herb.name);
    }
  }
  img.addEventListener("error", tryNext);
  tryNext();
  return img;
}

/* ---------- 视图切换 ---------- */

function showView(name) {
  document.querySelectorAll(".view").forEach(function (v) { v.classList.add("hidden"); });
  $("#view-" + name).classList.remove("hidden");
  document.querySelectorAll(".nav-btn").forEach(function (b) {
    b.classList.toggle("active", b.dataset.view === name);
  });
}

document.querySelectorAll(".nav-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    showView(btn.dataset.view);
    if (btn.dataset.view === "quiz") showQuizStart();
  });
});

/* ============================================================
   首页 · 药材百科
   ============================================================ */

function renderGrid(list) {
  var grid = $("#herb-grid");
  grid.innerHTML = "";
  if (list.length === 0) {
    grid.innerHTML = '<p class="empty-tip">没有找到相关药材，换个关键词试试～</p>';
    return;
  }
  list.forEach(function (h) {
    var card = document.createElement("div");
    card.className = "herb-card";
    card.appendChild(makeImg(h, null));

    var body = document.createElement("div");
    body.className = "card-body";
    body.innerHTML =
      "<h3>" + esc(h.name) + "</h3>" +
      "<p class='pinyin'>" + esc(h.pinyin) + "</p>" +
      "<div class='tags'>" +
      "<span class='tag'>" + esc(h.category) + "</span>" +
      "<span class='tag qi'>" + esc(h.qi) + "性</span>" +
      "</div>";
    card.appendChild(body);

    card.addEventListener("click", function () { openDetail(h); });
    grid.appendChild(card);
  });
}

function updateCount(n) {
  $("#count-info").textContent = "共收录 " + n + " 味药材";
}

// 搜索：按名称 / 拼音 / 功效 / 简介过滤
$("#search-input").addEventListener("input", function () {
  var q = this.value.trim().toLowerCase();
  var list;
  if (!q) {
    list = HERBS;
  } else {
    list = HERBS.filter(function (h) {
      var haystack = (h.name + h.pinyin + h.category + h.efficacy + h.intro).toLowerCase();
      return haystack.indexOf(q) !== -1;
    });
  }
  renderGrid(list);
  updateCount(list.length);
});

/* ---------- 详情弹窗 ---------- */

function openDetail(h) {
  var content = $("#modal-content");
  content.innerHTML =
    "<div class='detail-top'>" +
    "<div class='detail-pic'></div>" +
    "<div>" +
    "<div class='detail-name'>" + esc(h.name) + "<span class='detail-pinyin'>" + esc(h.pinyin) + "</span></div>" +
    "<div class='tags'>" +
    "<span class='tag'>" + esc(h.category) + "</span>" +
    "<span class='tag qi'>" + esc(h.qi) + "性</span>" +
    "</div>" +
    "<p class='detail-meta'><span class='meta-label'>性味</span>" + esc(h.nature) + "</p>" +
    "<p class='detail-meta'><span class='meta-label'>归经</span>" + esc(h.meridian) + "</p>" +
    "</div>" +
    "</div>" +
    "<div class='detail-section'><h4>💊 功效</h4><p>" + esc(h.efficacy) + "</p></div>" +
    "<div class='detail-section'><h4>📖 简介</h4><p>" + esc(h.intro) + "</p></div>" +
    "<div class='detail-note'><h4>⚠️ 使用注意</h4><p>" + esc(h.note) + "</p></div>" +
    "<p class='disclaimer'>本内容为课程作业学习资料，仅供学习参考，不构成医疗建议。</p>";
  content.querySelector(".detail-pic").appendChild(makeImg(h, null));
  $("#detail-modal").classList.remove("hidden");
}

function closeModal() { $("#detail-modal").classList.add("hidden"); }
$("#modal-close").addEventListener("click", closeModal);
$("#detail-modal").addEventListener("click", function (e) {
  if (e.target === this) closeModal();
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeModal();
});

/* ============================================================
   测验
   ============================================================ */

// 四气（药性）的候选答案
var QI_LEVELS = ["寒", "热", "温", "凉"];

// 测验状态
var quiz = {
  herbs: [],      // 本次抽到的药材
  index: 0,       // 当前第几题
  score: 0,       // 答对的小题数（每题有两问：名称 + 药性）
  maxScore: 0,    // 总分
  results: []     // 每题的两问对错记录
};

// 显示“开始前说明”界面，回到测验之初
function showQuizStart() {
  $("#quiz-start").classList.remove("hidden");
  $("#quiz-run").classList.add("hidden");
  $("#quiz-result").classList.add("hidden");
}

// 开始新一局
function startQuiz() {
  var n = parseInt($("#quiz-count").value, 10) || 10;
  quiz.herbs = shuffle(HERBS).slice(0, n);
  quiz.index = 0;
  quiz.score = 0;
  quiz.maxScore = n * 2;
  quiz.results = [];
  $("#quiz-start").classList.add("hidden");
  $("#quiz-result").classList.add("hidden");
  $("#quiz-run").classList.remove("hidden");
  renderQuestion(0);   // 0 = 第一问（认名称），1 = 第二问（选药性）
}

// 渲染当前题（step: 0 认名称 / 1 选药性）
function renderQuestion(step) {
  var h = quiz.herbs[quiz.index];
  var total = quiz.herbs.length;

  $("#q-progress").textContent = "第 " + (quiz.index + 1) + " / " + total + " 题";
  $("#q-bar").style.width = ((quiz.index + (step === 1 ? 1 : 0)) / total * 100) + "%";

  $("#q-stage").textContent =
    step === 0 ? "第一步 · 这是什么药材？" : "第二步 · 它的药性是（四气）？";

  // 图片
  var imgBox = $("#q-img");
  imgBox.innerHTML = "";
  var img = makeImg(h, "quiz-img");
  imgBox.appendChild(img);

  // 选项
  var options = [];
  if (step === 0) {
    // 正确答案 + 3 个混淆名
    var others = shuffle(HERBS.filter(function (x) { return x.id !== h.id; })).slice(0, 3);
    options = shuffle([h.name].concat(others.map(function (x) { return x.name; })));
  } else {
    // 正确答案 + 3 个混淆药性
    var othersQi = shuffle(QI_LEVELS.filter(function (q) { return q !== h.qi; })).slice(0, 3);
    options = shuffle([h.qi].concat(othersQi));
  }

  var optsBox = $("#q-options");
  optsBox.innerHTML = "";
  options.forEach(function (opt) {
    var btn = document.createElement("button");
    btn.className = "q-option";
    btn.textContent = opt;
    btn.addEventListener("click", function () {
      handleAnswer(step, opt, btn, h);
    });
    optsBox.appendChild(btn);
  });

  $("#q-feedback").textContent = "";
  $("#q-feedback").className = "q-feedback";
  $("#q-next").classList.add("hidden");
}

// 处理一次作答
function handleAnswer(step, chosen, btn, h) {
  var correctAnswer = step === 0 ? h.name : h.qi;
  var isCorrect = chosen === correctAnswer;

  // 锁住所有选项，标出对错
  document.querySelectorAll("#q-options .q-option").forEach(function (b) {
    b.disabled = true;
    if (b.textContent === correctAnswer) b.classList.add("correct");
    if (b === btn && !isCorrect) b.classList.add("wrong");
  });

  var fb = $("#q-feedback");
  if (isCorrect) {
    fb.textContent = "✅ 回答正确！";
    fb.className = "q-feedback ok";
  } else {
    fb.textContent = "❌ 正确答案是：" + correctAnswer;
    fb.className = "q-feedback bad";
  }

  if (step === 0) {
    // 第一问已作答：记下本题第一问是否答对，500ms 后进入第二问
    quiz._nameOk = isCorrect;
    setTimeout(function () { renderQuestion(1); }, 500);
  } else {
    // 第二问已作答：记录本题，显示下一题按钮
    quiz.score += (quiz._nameOk ? 1 : 0) + (isCorrect ? 1 : 0);
    quiz.results.push({
      herb: h,
      nameOk: quiz._nameOk,
      qiOk: isCorrect
    });
    $("#q-next").classList.remove("hidden");
  }
}

// 下一题
$("#q-next").addEventListener("click", function () {
  quiz.index++;
  if (quiz.index >= quiz.herbs.length) {
    showResult();
  } else {
    renderQuestion(0);
    $("#q-img").scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

// 显示最终成绩
function showResult() {
  $("#quiz-run").classList.add("hidden");
  $("#quiz-result").classList.remove("hidden");

  $("#r-score").textContent = quiz.score + " / " + quiz.maxScore + " 分";

  var pct = Math.round(quiz.score / quiz.maxScore * 100);
  var msg;
  if (pct === 100) msg = "🎉 满分！你就是本草达人！";
  else if (pct >= 80) msg = "🌟 非常棒！再练几次就满分了～";
  else if (pct >= 60) msg = "👍 及格啦，答错的题多看看百科哦";
  else msg = "📖 别灰心，先去百科逛逛再来挑战！";
  $("#r-message").textContent = msg;

  // 答题回顾
  var list = $("#r-list");
  list.innerHTML = "";
  quiz.results.forEach(function (r) {
    var card = document.createElement("div");
    card.className = "r-card";
    var gt = function (ok, text) {
      return "<span class='mark " + (ok ? "good" : "bad") + "'>" + (ok ? "✓" : "✗") + " " + text + "</span>";
    };
    card.innerHTML =
      "<div></div>" +
      "<div>" +
      "<div class='r-name'>" + esc(r.herb.name) + "</div>" +
      "<div class='r-detail'>名称" + gt(r.nameOk, "") + "　药性(" + r.herb.qi + ")" + gt(r.qiOk, "") + "</div>" +
      "</div>";
    card.querySelector("div").appendChild(makeImg(r.herb, null));
    list.appendChild(card);
  });
}

$("#quiz-start-btn").addEventListener("click", startQuiz);
$("#r-again").addEventListener("click", showQuizStart);
$("#r-home").addEventListener("click", function () { showView("home"); });

/* ---------- 启动 ---------- */
renderGrid(HERBS);
updateCount(HERBS.length);
showView("home");
