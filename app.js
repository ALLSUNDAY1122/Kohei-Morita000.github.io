const STORAGE_KEY = "nonal-game-table-v1";

const iconByGame = {
  stopwatch: "timer",
  ngword: "eye",
  profile: "brain",
  category: "target",
  memory: "brain",
  majority: "vote",
  halfavg: "target",
  drawing: "pen",
  cm: "play",
  bidding: "trophy",
};

const gameCatalog = [
  {
    id: "stopwatch",
    title: "秒読みストップ",
    type: "タイミング",
    duration: "2分",
    color: "color-teal",
    summary: "画面を見ずにストップウォッチを止め、目標秒数にどれだけ近づけるかを競います。",
    rules: ["親が目標秒数を決める。", "各プレイヤーは画面を見ずに開始・停止する。", "最も近い人が勝ち、最も遠い人が一口または乾杯。"],
  },
  {
    id: "ngword",
    title: "NGワード乾杯トーク",
    type: "会話誘導",
    duration: "2〜3分",
    color: "color-coral",
    summary: "相手に見えていないNGワードを、短い雑談の中で言わせにいく会話ゲームです。",
    rules: ["各プレイヤーにNGワードを割り当てる。", "共通テーマで60〜90秒話す。", "NGワードを言った人がヒット。"],
  },
  {
    id: "profile",
    title: "ウソ1つプロフィール",
    type: "ブラフ",
    duration: "2〜3分",
    color: "color-indigo",
    summary: "3つの自己紹介の中に1つだけ混ぜたウソを、他の人が見抜きます。",
    rules: ["出題者は3つの短文を出す。", "そのうち1つだけウソにする。", "他の人は一斉にどれがウソか答える。"],
  },
  {
    id: "category",
    title: "禁じ文字カテゴリ",
    type: "反射・語彙",
    duration: "2分",
    color: "color-mustard",
    summary: "カテゴリに合う単語を順番に言います。ただし禁じ文字から始まる言葉は使えません。",
    rules: ["カテゴリと禁じ文字を決める。", "5秒以内に単語を言う。", "詰まる、重複、禁じ文字で失敗。"],
  },
  {
    id: "memory",
    title: "記憶カクテル",
    type: "記憶",
    duration: "2〜3分",
    color: "color-green",
    summary: "前の人までの言葉をすべて復唱し、自分の言葉を1つ追加していきます。",
    rules: ["テーマに沿って言葉を追加する。", "それまでの言葉を順番通りに復唱する。", "順番ミスや沈黙で失敗。"],
  },
  {
    id: "majority",
    title: "多数派ハンター",
    type: "価値観予想",
    duration: "2分",
    color: "color-pink",
    summary: "2択のお題で、親が多数派を予想します。価値観のズレがそのまま笑いになります。",
    rules: ["親がA/Bの多数派を予想する。", "全員がA/Bを選ぶ。", "予想が当たれば少数派、外れれば親がリアクション。"],
  },
  {
    id: "halfavg",
    title: "ハーフ平均",
    type: "数字心理戦",
    duration: "2分",
    color: "color-teal",
    summary: "0〜10の数字を秘密で出し、全員の平均値の半分に最も近い人が勝ちます。",
    rules: ["全員が0〜10の整数を出す。", "平均値の半分を目標値にする。", "目標値に最も近い人が勝ち。"],
  },
  {
    id: "drawing",
    title: "20秒お絵描き",
    type: "描画推理",
    duration: "2〜3分",
    color: "color-indigo",
    summary: "20秒でお題を描き、他の人が何を描いたか当てます。絵のクセが主役です。",
    rules: ["描く人だけがお題を見る。", "20秒以内に絵を描く。", "文字や数字は使わない。"],
  },
  {
    id: "cm",
    title: "即興CMバトル",
    type: "即興創作",
    duration: "2〜3分",
    color: "color-coral",
    summary: "変なお題を商品に見立て、10秒だけ即興CMをします。最後に投票します。",
    rules: ["お題を商品として宣伝する。", "発表は1人10秒。", "自分以外に投票する。"],
  },
  {
    id: "bidding",
    title: "ミッション競り",
    type: "競り・挑戦",
    duration: "2〜3分",
    color: "color-green",
    summary: "自分ならどこまでできるかを競り上げ、最高宣言者が実際に挑戦します。",
    rules: ["順番にできる数を宣言する。", "前の宣言より高くするかパスする。", "最後の最高宣言者が挑戦する。"],
  },
];

const pools = {
  targets: [7, 8, 9, 10, 12, 13, 15],
  ngTopics: [
    "コンビニでつい買うもの",
    "旅行に持っていきたいもの",
    "最近ちょっと便利だと思ったもの",
    "朝起きて最初にすること",
    "休日の理想の過ごし方",
    "冷蔵庫にあるとうれしいもの",
  ],
  ngWords: [
    "スマホ",
    "アイス",
    "眠い",
    "旅行",
    "カレー",
    "財布",
    "駅",
    "映画",
    "コーヒー",
    "写真",
    "雨",
    "電車",
    "お菓子",
    "猫背",
    "掃除",
    "温泉",
  ],
  profileSeeds: [
    "最近あった小さな事件",
    "子どものころの習い事",
    "苦手そうで意外と平気なもの",
    "一度だけやった変な失敗",
    "家にある少し変なもの",
  ],
  categories: [
    "居酒屋にあるもの",
    "旅行先で見るもの",
    "コンビニ商品",
    "映画に出てきそうなもの",
    "冬っぽいもの",
    "朝食に出てきそうなもの",
    "デスクの上にあるもの",
    "駅で見かけるもの",
  ],
  forbidden: ["あ", "か", "さ", "た", "な", "は", "ま", "ら", "い", "す"],
  memoryThemes: [
    "架空のカクテル材料",
    "休日の過ごし方",
    "居酒屋メニュー",
    "変な魔法の呪文",
    "旅先に持っていくもの",
    "未来の家電",
  ],
  majority: [
    ["朝型", "夜型"],
    ["海旅行", "山旅行"],
    ["甘いもの", "しょっぱいもの"],
    ["電話", "メッセージ"],
    ["辛口カレー", "甘口カレー"],
    ["映画館", "家で配信"],
    ["計画派", "直感派"],
    ["パン派", "ごはん派"],
  ],
  drawing: [
    "電車",
    "たこ焼き",
    "傘",
    "宇宙人",
    "焼き鳥",
    "温泉",
    "自転車",
    "冷蔵庫",
    "花火",
    "スニーカー",
    "ラーメン",
    "飛行機",
  ],
  products: [
    "透明な傘",
    "眠くなる枕",
    "絶対こぼれない皿",
    "しゃべる冷蔵庫",
    "持ち歩けるこたつ",
    "勝手に片づく机",
    "気分で色が変わるマグカップ",
    "褒めてくれる鏡",
  ],
  missions: [
    "10秒で赤いものを何個言えるか",
    "15秒で「た」から始まる褒め言葉を何個言えるか",
    "コースターを何枚積めるか",
    "10秒で居酒屋メニューを何個言えるか",
    "紙に丸を何個きれいに描けるか",
    "12秒で駅にありそうなものを何個言えるか",
    "10秒で白いものを何個言えるか",
  ],
};

const defaultPlayers = [
  { id: "p1", name: "プレイヤー1" },
  { id: "p2", name: "プレイヤー2" },
];

let activeTimer = null;

const state = loadState();

document.addEventListener("DOMContentLoaded", () => {
  render();
  document.addEventListener("click", handleClick);
  document.addEventListener("input", handleInput);
  document.addEventListener("change", handleInput);
});

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && Array.isArray(saved.players) && saved.players.length >= 2) {
      return {
        players: saved.players.slice(0, 4),
        scores: saved.scores || {},
        selectedGameId: saved.selectedGameId || "stopwatch",
        gameStates: saved.gameStates || {},
        history: saved.history || [],
      };
    }
  } catch {
    // Ignore malformed local data.
  }

  return {
    players: structuredClone(defaultPlayers),
    scores: {},
    selectedGameId: "stopwatch",
    gameStates: {},
    history: [],
  };
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function render() {
  syncScores();
  renderPlayers();
  renderLibrary();
  renderHistory();
  renderStage();
  persist();
}

function syncScores() {
  state.players.forEach((player) => {
    if (!state.scores[player.id]) {
      state.scores[player.id] = { points: 0, reactions: 0 };
    }
  });

  Object.keys(state.scores).forEach((id) => {
    if (!state.players.some((player) => player.id === id)) {
      delete state.scores[id];
    }
  });
}

function renderPlayers() {
  const playersList = document.querySelector("#playersList");
  const scoreboard = document.querySelector("#scoreboard");
  const canRemove = state.players.length > 2;

  playersList.innerHTML = state.players
    .map(
      (player) => `
        <div class="player-row">
          <input value="${escapeHtml(player.name)}" data-input="player-name" data-player-id="${player.id}" aria-label="${escapeHtml(player.name)}の名前">
          <button class="icon-button small" type="button" data-action="remove-player" data-player-id="${player.id}" title="参加者を削除" aria-label="参加者を削除" ${canRemove ? "" : "disabled"}>
            ${icon("x")}
          </button>
        </div>
      `,
    )
    .join("");

  scoreboard.innerHTML = state.players
    .map((player) => {
      const score = state.scores[player.id] || { points: 0, reactions: 0 };
      return `
        <div class="score-row">
          <span class="score-name">${escapeHtml(player.name)}</span>
          <span class="score-pill">${score.points} pt</span>
          <span class="score-pill react">${score.reactions} 杯</span>
        </div>
      `;
    })
    .join("");
}

function renderLibrary() {
  const library = document.querySelector("#gameLibrary");
  library.innerHTML = gameCatalog
    .map(
      (game, index) => `
        <button class="game-card ${game.id === state.selectedGameId ? "active" : ""}" type="button" data-action="select-game" data-game-id="${game.id}">
          <span class="game-glyph ${game.color}">${icon(iconByGame[game.id])}</span>
          <span>
            <span class="game-card-title">${index + 1}. ${escapeHtml(game.title)}</span>
            <span class="game-card-meta">${escapeHtml(game.type)} / ${escapeHtml(game.duration)}</span>
          </span>
        </button>
      `,
    )
    .join("");
}

function renderHistory() {
  const history = document.querySelector("#history");
  const items = state.history.slice(0, 5);
  history.innerHTML = `
    <h3>最近の結果</h3>
    ${
      items.length
        ? items
            .map(
              (item) => `
                <div class="history-item">
                  <strong>${escapeHtml(item.gameTitle)}</strong>
                  <span>${escapeHtml(item.summary)}</span>
                </div>
              `,
            )
            .join("")
        : '<div class="empty-state">まだ結果はありません。</div>'
    }
  `;
}

function renderStage() {
  const game = getSelectedGame();
  const stage = document.querySelector("#gameStage");
  const renderer = renderers[game.id];
  stage.innerHTML = renderer ? renderer(game) : "";
}

function getSelectedGame() {
  return gameCatalog.find((game) => game.id === state.selectedGameId) || gameCatalog[0];
}

function getPlayerName(id) {
  return state.players.find((player) => player.id === id)?.name || "不明";
}

function getGameState(gameId) {
  if (!state.gameStates[gameId]) {
    state.gameStates[gameId] = createGameState(gameId);
  }
  return state.gameStates[gameId];
}

function createGameState(gameId) {
  switch (gameId) {
    case "stopwatch":
      return {
        target: pick(pools.targets),
        turnIndex: 0,
        attempts: [],
        running: false,
        startedAt: 0,
        recorded: false,
      };
    case "ngword":
      return {
        topic: pick(pools.ngTopics),
        words: assignWords(),
        revealed: {},
        hits: {},
        remaining: 90,
        timerStatus: "idle",
        recorded: false,
      };
    case "profile":
      return {
        tellerId: state.players[0].id,
        seed: pick(pools.profileSeeds),
        statements: ["", "", ""],
        lie: "1",
        guesses: {},
        revealed: false,
        recorded: false,
      };
    case "category":
      return {
        category: pick(pools.categories),
        forbidden: pick(pools.forbidden),
        currentIndex: 0,
        used: [],
        failId: null,
        wordInput: "",
        remaining: 5,
        timerStatus: "idle",
        recorded: false,
      };
    case "memory":
      return {
        theme: pick(pools.memoryThemes),
        currentIndex: 0,
        chain: [],
        failId: null,
        wordInput: "",
        revealChain: false,
        recorded: false,
      };
    case "majority": {
      const question = pick(pools.majority);
      return {
        question,
        parentId: state.players[0].id,
        prediction: "A",
        choices: {},
        revealed: false,
        recorded: false,
      };
    }
    case "halfavg":
      return {
        numbers: {},
        revealed: false,
        recorded: false,
      };
    case "drawing":
      return {
        drawerId: state.players[0].id,
        prompt: pick(pools.drawing),
        promptVisible: false,
        remaining: 20,
        timerStatus: "idle",
        correct: {},
        finished: false,
        recorded: false,
      };
    case "cm":
      return {
        product: pick(pools.products),
        currentIndex: 0,
        spoken: [],
        remaining: 10,
        timerStatus: "idle",
        votes: {},
        revealed: false,
        recorded: false,
      };
    case "bidding":
      return {
        mission: pick(pools.missions),
        currentIndex: 0,
        highest: { playerId: null, value: 0 },
        passed: {},
        bidValue: "",
        phase: "bidding",
        result: null,
        recorded: false,
      };
    default:
      return {};
  }
}

function assignWords() {
  const pool = shuffle([...pools.ngWords]);
  return Object.fromEntries(state.players.map((player, index) => [player.id, pool[index % pool.length]]));
}

const renderers = {
  stopwatch: renderStopwatch,
  ngword: renderNgWord,
  profile: renderProfile,
  category: renderCategory,
  memory: renderMemory,
  majority: renderMajority,
  halfavg: renderHalfAvg,
  drawing: renderDrawing,
  cm: renderCm,
  bidding: renderBidding,
};

function shell(game, body, side = "") {
  const result = computeResult(game.id);
  const recordButton = result.ready
    ? `<button class="button success" type="button" data-action="record-result" ${getGameState(game.id).recorded ? "disabled" : ""}>${icon("check")}結果を記録</button>`
    : "";

  return `
    <section class="game-stage">
      <div class="game-head">
        <span class="game-glyph ${game.color}">${icon(iconByGame[game.id])}</span>
        <div>
          <div class="game-title-row">
            <h2>${escapeHtml(game.title)}</h2>
            <span class="tag">${escapeHtml(game.type)}</span>
            <span class="tag">${escapeHtml(game.duration)}</span>
          </div>
          <p class="game-summary">${escapeHtml(game.summary)}</p>
          <div class="toolbar" style="margin-top: 12px;">
            <button class="button secondary" type="button" data-action="reset-game">${icon("reset")}新しいラウンド</button>
            ${recordButton}
          </div>
        </div>
      </div>
      <div class="runner-grid">
        <div class="runner-main">${body}</div>
        <aside class="runner-side">
          <h3 class="runner-title">ルール</h3>
          <ol class="rule-list">
            ${game.rules.map((rule) => `<li>${escapeHtml(rule)}</li>`).join("")}
          </ol>
          ${side}
        </aside>
      </div>
    </section>
  `;
}

function renderStopwatch(game) {
  const g = getGameState(game.id);
  const current = state.players[g.turnIndex % state.players.length];
  const attempts = g.attempts.filter((attempt) => state.players.some((player) => player.id === attempt.playerId));
  const done = attempts.length >= state.players.length;
  const result = computeResult(game.id);

  const body = `
    <div class="tool-grid">
      <div class="turn-banner">
        <span>目標 <strong>${Number(g.target).toFixed(2)}秒</strong></span>
        <span>現在 <strong>${done ? "完了" : escapeHtml(current.name)}</strong></span>
      </div>
      <div class="big-number ${g.running ? "running small-text" : ""}">${g.running ? "計測中" : `${Number(g.target).toFixed(2)}秒`}</div>
      <div class="inline-actions">
        ${
          g.running
            ? `<button class="button danger" type="button" data-action="stop-stopwatch">${icon("x")}ストップ</button>`
            : `<button class="button" type="button" data-action="start-stopwatch" ${done ? "disabled" : ""}>${icon("play")}スタート</button>`
        }
      </div>
      <div class="list-stack">
        ${
          attempts.length
            ? attempts
                .map(
                  (attempt) => `
                    <div class="attempt-row">
                      <strong>${escapeHtml(getPlayerName(attempt.playerId))}</strong>
                      <span>${attempt.elapsed.toFixed(2)}秒 / 差 ${Math.abs(attempt.elapsed - g.target).toFixed(2)}</span>
                    </div>
                  `,
                )
                .join("")
            : '<div class="empty-state">まだ記録はありません。</div>'
        }
      </div>
      ${result.ready ? resultBox(result) : ""}
    </div>
  `;

  return shell(game, body);
}

function renderNgWord(game) {
  const g = getGameState(game.id);
  ensureNgWords(g);
  const result = computeResult(game.id);

  const body = `
    <div class="tool-grid">
      <div class="prompt-box">
        <span class="prompt-label">トークテーマ</span>
        <strong>${escapeHtml(g.topic)}</strong>
      </div>
      <div class="big-number small-text">${formatSeconds(g.remaining)}</div>
      <div class="inline-actions">
        <button class="button" type="button" data-action="start-ng-timer">${icon("play")}90秒スタート</button>
        <button class="button secondary" type="button" data-action="stop-timer">${icon("x")}停止</button>
      </div>
      <div class="field-grid">
        ${state.players
          .map(
            (player) => `
              <div class="secret-tile ${g.revealed[player.id] ? "revealed" : ""}">
                <strong>${escapeHtml(player.name)}のNG</strong>
                <div class="secret-word">${escapeHtml(g.words[player.id])}</div>
                <button class="mini-button" type="button" data-action="toggle-ng-word" data-player-id="${player.id}">${icon("eye")}表示</button>
              </div>
            `,
          )
          .join("")}
      </div>
      <div class="tool-box">
        <h3 class="runner-title">ヒットした人</h3>
        <div class="player-choice-grid">
          ${state.players
            .map(
              (player) => `
                <label class="checkbox-row">
                  <input type="checkbox" data-input="ng-hit" data-player-id="${player.id}" ${g.hits[player.id] ? "checked" : ""}>
                  ${escapeHtml(player.name)}
                </label>
              `,
            )
            .join("")}
        </div>
      </div>
      ${result.ready ? resultBox(result) : ""}
    </div>
  `;

  return shell(game, body, `<p class="subtle">NGワードは対象者本人に見せず、周りの人だけが確認します。</p>`);
}

function renderProfile(game) {
  const g = getGameState(game.id);
  ensureExistingPlayer(g, "tellerId");
  const others = state.players.filter((player) => player.id !== g.tellerId);
  const result = computeResult(game.id);

  const body = `
    <div class="tool-grid">
      <div class="field-grid">
        <div class="field">
          <label>出題者</label>
          ${playerSelect("profile-teller", g.tellerId)}
        </div>
        <div class="field">
          <label>ヒント</label>
          <input class="text-input" value="${escapeHtml(g.seed)}" data-input="profile-seed">
        </div>
      </div>
      <div class="field-grid single">
        ${[0, 1, 2]
          .map(
            (index) => `
              <div class="field">
                <label>${index + 1}番</label>
                <input class="text-input" value="${escapeHtml(g.statements[index] || "")}" data-input="profile-statement" data-index="${index}" placeholder="短いプロフィールを書く">
              </div>
            `,
          )
          .join("")}
      </div>
      <div class="tool-box">
        <h3 class="runner-title">ウソの番号</h3>
        <div class="segmented three">
          ${["1", "2", "3"].map((n) => `<button class="segment ${g.lie === n ? "active" : ""}" type="button" data-action="profile-lie" data-value="${n}">${n}番</button>`).join("")}
        </div>
      </div>
      <div class="tool-box">
        <h3 class="runner-title">回答</h3>
        <div class="list-stack">
          ${others
            .map(
              (player) => `
                <div>
                  <div class="subtle" style="margin-bottom: 6px;">${escapeHtml(player.name)}</div>
                  <div class="segmented three">
                    ${["1", "2", "3"].map((n) => `<button class="segment ${g.guesses[player.id] === n ? "active" : ""}" type="button" data-action="profile-guess" data-player-id="${player.id}" data-value="${n}">${n}番</button>`).join("")}
                  </div>
                </div>
              `,
            )
            .join("")}
        </div>
      </div>
      <button class="button" type="button" data-action="profile-reveal">${icon("eye")}答え合わせ</button>
      ${result.ready ? resultBox(result) : ""}
    </div>
  `;

  return shell(game, body);
}

function renderCategory(game) {
  const g = getGameState(game.id);
  const current = currentByIndex(g.currentIndex);
  const result = computeResult(game.id);

  const body = `
    <div class="tool-grid">
      <div class="field-grid">
        <div class="prompt-box">
          <span class="prompt-label">カテゴリ</span>
          <strong>${escapeHtml(g.category)}</strong>
        </div>
        <div class="prompt-box">
          <span class="prompt-label">禁じ文字</span>
          <strong>${escapeHtml(g.forbidden)}</strong>
        </div>
      </div>
      <div class="turn-banner">
        <span>現在 <strong>${g.failId ? "終了" : escapeHtml(current.name)}</strong></span>
        <span>${g.timerStatus === "running" ? `${g.remaining}秒` : "5秒ルール"}</span>
      </div>
      <div class="field-grid">
        <input class="text-input" value="${escapeHtml(g.wordInput)}" data-input="category-word" placeholder="言えた単語をメモ">
        <div class="inline-actions">
          <button class="button secondary" type="button" data-action="category-start" ${g.failId ? "disabled" : ""}>${icon("timer")}5秒</button>
          <button class="button success" type="button" data-action="category-ok" ${g.failId ? "disabled" : ""}>${icon("check")}OK</button>
          <button class="button danger" type="button" data-action="category-fail" ${g.failId ? "disabled" : ""}>${icon("x")}失敗</button>
        </div>
      </div>
      <div class="list-stack">
        ${
          g.used.length
            ? g.used.map((item) => `<div class="word-row"><strong>${escapeHtml(getPlayerName(item.playerId))}</strong><span>${escapeHtml(item.word)}</span></div>`).join("")
            : '<div class="empty-state">言葉を追加するとここに並びます。</div>'
        }
      </div>
      ${result.ready ? resultBox(result) : ""}
    </div>
  `;

  return shell(game, body);
}

function renderMemory(game) {
  const g = getGameState(game.id);
  const current = currentByIndex(g.currentIndex);
  const result = computeResult(game.id);

  const body = `
    <div class="tool-grid">
      <div class="prompt-box">
        <span class="prompt-label">テーマ</span>
        <strong>${escapeHtml(g.theme)}</strong>
      </div>
      <div class="turn-banner">
        <span>現在 <strong>${g.failId ? "終了" : escapeHtml(current.name)}</strong></span>
        <span>${g.chain.length + 1}個目</span>
      </div>
      <div class="field-grid">
        <input class="text-input" value="${escapeHtml(g.wordInput)}" data-input="memory-word" placeholder="追加する言葉">
        <div class="inline-actions">
          <button class="button success" type="button" data-action="memory-ok" ${g.failId ? "disabled" : ""}>${icon("check")}成功</button>
          <button class="button danger" type="button" data-action="memory-fail" ${g.failId ? "disabled" : ""}>${icon("x")}失敗</button>
        </div>
      </div>
      <button class="button secondary" type="button" data-action="memory-toggle-chain">${icon("eye")}チェーン確認</button>
      ${
        g.revealChain || g.failId
          ? `<div class="list-stack">${
              g.chain.length
                ? g.chain.map((item, index) => `<div class="word-row"><strong>${index + 1}. ${escapeHtml(item.word)}</strong><span>${escapeHtml(getPlayerName(item.playerId))}</span></div>`).join("")
                : '<div class="empty-state">まだ言葉はありません。</div>'
            }</div>`
          : '<div class="empty-state">チェーンは隠れています。</div>'
      }
      ${result.ready ? resultBox(result) : ""}
    </div>
  `;

  return shell(game, body);
}

function renderMajority(game) {
  const g = getGameState(game.id);
  ensureExistingPlayer(g, "parentId");
  const result = computeResult(game.id);

  const body = `
    <div class="tool-grid">
      <div class="field-grid">
        <div class="field">
          <label>親</label>
          ${playerSelect("majority-parent", g.parentId)}
        </div>
        <div class="field">
          <label>予想</label>
          <div class="segmented">
            <button class="segment ${g.prediction === "A" ? "active" : ""}" type="button" data-action="majority-predict" data-value="A">A</button>
            <button class="segment ${g.prediction === "B" ? "active" : ""}" type="button" data-action="majority-predict" data-value="B">B</button>
          </div>
        </div>
      </div>
      <div class="field-grid">
        <div class="prompt-box">
          <span class="prompt-label">A</span>
          <strong>${escapeHtml(g.question[0])}</strong>
        </div>
        <div class="prompt-box">
          <span class="prompt-label">B</span>
          <strong>${escapeHtml(g.question[1])}</strong>
        </div>
      </div>
      <div class="tool-box">
        <h3 class="runner-title">回答</h3>
        <div class="list-stack">
          ${state.players
            .map(
              (player) => `
                <div>
                  <div class="subtle" style="margin-bottom: 6px;">${escapeHtml(player.name)}</div>
                  <div class="segmented">
                    <button class="segment ${g.choices[player.id] === "A" ? "active" : ""}" type="button" data-action="majority-choice" data-player-id="${player.id}" data-value="A">A</button>
                    <button class="segment ${g.choices[player.id] === "B" ? "active" : ""}" type="button" data-action="majority-choice" data-player-id="${player.id}" data-value="B">B</button>
                  </div>
                </div>
              `,
            )
            .join("")}
        </div>
      </div>
      <button class="button" type="button" data-action="majority-reveal">${icon("eye")}公開</button>
      ${result.ready ? resultBox(result) : ""}
    </div>
  `;

  return shell(game, body);
}

function renderHalfAvg(game) {
  const g = getGameState(game.id);
  const result = computeResult(game.id);

  const body = `
    <div class="tool-grid">
      <div class="tool-box">
        <h3 class="runner-title">0〜10の数字</h3>
        <div class="field-grid">
          ${state.players
            .map(
              (player) => `
                <div class="field">
                  <label>${escapeHtml(player.name)}</label>
                  <input class="number-input" type="number" min="0" max="10" step="1" value="${escapeHtml(g.numbers[player.id] ?? "")}" data-input="half-number" data-player-id="${player.id}" placeholder="0〜10">
                </div>
              `,
            )
            .join("")}
        </div>
      </div>
      <button class="button" type="button" data-action="half-reveal">${icon("target")}計算</button>
      ${result.ready ? resultBox(result) : ""}
    </div>
  `;

  return shell(game, body);
}

function renderDrawing(game) {
  const g = getGameState(game.id);
  ensureExistingPlayer(g, "drawerId");
  const guessers = state.players.filter((player) => player.id !== g.drawerId);
  const result = computeResult(game.id);

  const body = `
    <div class="tool-grid">
      <div class="field">
        <label>描く人</label>
        ${playerSelect("drawing-drawer", g.drawerId)}
      </div>
      <div class="prompt-box">
        <span class="prompt-label">お題</span>
        <strong>${g.promptVisible ? escapeHtml(g.prompt) : "描く人だけが表示"}</strong>
      </div>
      <div class="draw-pad">
        <span>紙かスマホに20秒で描く</span>
      </div>
      <div class="big-number small-text">${formatSeconds(g.remaining)}</div>
      <div class="inline-actions">
        <button class="button secondary" type="button" data-action="drawing-toggle-prompt">${icon("eye")}お題</button>
        <button class="button" type="button" data-action="drawing-start">${icon("play")}20秒</button>
        <button class="button secondary" type="button" data-action="stop-timer">${icon("x")}停止</button>
      </div>
      <div class="tool-box">
        <h3 class="runner-title">当てた人</h3>
        <div class="player-choice-grid">
          ${guessers
            .map(
              (player) => `
                <label class="checkbox-row">
                  <input type="checkbox" data-input="drawing-correct" data-player-id="${player.id}" ${g.correct[player.id] ? "checked" : ""}>
                  ${escapeHtml(player.name)}
                </label>
              `,
            )
            .join("")}
        </div>
      </div>
      <button class="button" type="button" data-action="drawing-finish">${icon("check")}結果確定</button>
      ${result.ready ? resultBox(result) : ""}
    </div>
  `;

  return shell(game, body);
}

function renderCm(game) {
  const g = getGameState(game.id);
  const speaker = state.players[g.currentIndex % state.players.length];
  const allSpoken = g.spoken.length >= state.players.length;
  const result = computeResult(game.id);

  const body = `
    <div class="tool-grid">
      <div class="prompt-box">
        <span class="prompt-label">商品</span>
        <strong>${escapeHtml(g.product)}</strong>
      </div>
      <div class="turn-banner">
        <span>発表 <strong>${allSpoken ? "投票へ" : escapeHtml(speaker.name)}</strong></span>
        <span>${formatSeconds(g.remaining)}</span>
      </div>
      <div class="inline-actions">
        <button class="button" type="button" data-action="cm-start" ${allSpoken ? "disabled" : ""}>${icon("play")}10秒</button>
        <button class="button success" type="button" data-action="cm-done-speaker" ${allSpoken ? "disabled" : ""}>${icon("check")}発表完了</button>
        <button class="button secondary" type="button" data-action="stop-timer">${icon("x")}停止</button>
      </div>
      <div class="list-stack">
        ${state.players
          .map((player) => `<div class="attempt-row"><strong>${escapeHtml(player.name)}</strong><span>${g.spoken.includes(player.id) ? "発表済み" : "未発表"}</span></div>`)
          .join("")}
      </div>
      ${
        allSpoken
          ? `<div class="tool-box">
              <h3 class="runner-title">投票</h3>
              <div class="list-stack">
                ${state.players
                  .map(
                    (voter) => `
                      <div>
                        <div class="subtle" style="margin-bottom: 6px;">${escapeHtml(voter.name)}</div>
                        <div class="player-choice-grid">
                          ${state.players
                            .filter((candidate) => candidate.id !== voter.id)
                            .map((candidate) => `<button class="player-choice ${g.votes[voter.id] === candidate.id ? "active" : ""}" type="button" data-action="cm-vote" data-voter-id="${voter.id}" data-player-id="${candidate.id}">${escapeHtml(candidate.name)}</button>`)
                            .join("")}
                        </div>
                      </div>
                    `,
                  )
                  .join("")}
              </div>
            </div>
            <button class="button" type="button" data-action="cm-reveal">${icon("vote")}集計</button>`
          : ""
      }
      ${result.ready ? resultBox(result) : ""}
    </div>
  `;

  return shell(game, body);
}

function renderBidding(game) {
  const g = getGameState(game.id);
  const current = currentBidder(g);
  const result = computeResult(game.id);

  const body = `
    <div class="tool-grid">
      <div class="prompt-box">
        <span class="prompt-label">ミッション</span>
        <strong>${escapeHtml(g.mission)}</strong>
      </div>
      <div class="turn-banner">
        <span>${g.phase === "challenge" ? "挑戦者" : "現在"} <strong>${g.phase === "challenge" ? escapeHtml(getPlayerName(g.highest.playerId)) : escapeHtml(current?.name || "なし")}</strong></span>
        <span>最高 ${g.highest.value}${g.highest.playerId ? ` / ${escapeHtml(getPlayerName(g.highest.playerId))}` : ""}</span>
      </div>
      ${
        g.phase === "bidding"
          ? `<div class="field-grid">
              <input class="number-input" type="number" min="${g.highest.value + 1}" step="1" value="${escapeHtml(g.bidValue)}" data-input="bid-value" placeholder="${g.highest.value + 1}以上">
              <div class="inline-actions">
                <button class="button success" type="button" data-action="bid-submit">${icon("check")}宣言</button>
                <button class="button secondary" type="button" data-action="bid-pass">${icon("x")}パス</button>
              </div>
            </div>`
          : `<div class="inline-actions">
              <button class="button success" type="button" data-action="bid-success">${icon("check")}成功</button>
              <button class="button danger" type="button" data-action="bid-fail">${icon("x")}失敗</button>
            </div>`
      }
      <div class="list-stack">
        ${state.players
          .map(
            (player) => `
              <div class="attempt-row">
                <strong>${escapeHtml(player.name)}</strong>
                <span>${g.passed[player.id] ? "パス" : g.highest.playerId === player.id ? `最高 ${g.highest.value}` : "参加中"}</span>
              </div>
            `,
          )
          .join("")}
      </div>
      ${result.ready ? resultBox(result) : ""}
    </div>
  `;

  return shell(game, body);
}

function resultBox(result) {
  return `
    <div class="result-box">
      <h3 class="runner-title">結果</h3>
      <div class="list-stack">
        ${result.lines.map((line) => `<div class="result-row ${line.kind || ""}"><strong>${escapeHtml(line.label)}</strong><span>${escapeHtml(line.value)}</span></div>`).join("")}
      </div>
      <p class="subtle">${escapeHtml(result.summary)}</p>
    </div>
  `;
}

function computeResult(gameId) {
  const g = getGameState(gameId);

  switch (gameId) {
    case "stopwatch": {
      const attempts = g.attempts.filter((attempt) => state.players.some((player) => player.id === attempt.playerId));
      if (attempts.length < state.players.length) return notReady();
      const ranked = [...attempts].sort((a, b) => Math.abs(a.elapsed - g.target) - Math.abs(b.elapsed - g.target));
      const winner = ranked[0];
      const reaction = ranked[ranked.length - 1];
      return ready({
        summary: `${getPlayerName(winner.playerId)}が最接近。${getPlayerName(reaction.playerId)}が乾杯リアクション。`,
        winners: [winner.playerId],
        reactions: [reaction.playerId],
        lines: ranked.map((item, index) => ({
          label: `${index + 1}. ${getPlayerName(item.playerId)}`,
          value: `${item.elapsed.toFixed(2)}秒 / 差 ${Math.abs(item.elapsed - g.target).toFixed(2)}`,
          kind: index === 0 ? "winner" : index === ranked.length - 1 ? "reaction" : "",
        })),
      });
    }
    case "ngword": {
      const hits = state.players.filter((player) => g.hits[player.id]).map((player) => player.id);
      if (g.timerStatus !== "done" && hits.length === 0) return notReady();
      return ready({
        summary: hits.length ? `${hits.map(getPlayerName).join("、")}がヒット。` : "ヒットなしで終了。",
        winners: [],
        reactions: hits,
        lines: hits.length
          ? hits.map((id) => ({ label: getPlayerName(id), value: "ヒット", kind: "reaction" }))
          : [{ label: "全員", value: "セーフ", kind: "winner" }],
      });
    }
    case "profile": {
      const others = state.players.filter((player) => player.id !== g.tellerId);
      if (!g.revealed || others.some((player) => !g.guesses[player.id])) return notReady();
      const correct = others.filter((player) => g.guesses[player.id] === g.lie).map((player) => player.id);
      const wrong = others.filter((player) => g.guesses[player.id] !== g.lie).map((player) => player.id);
      const tellerReacts = correct.length >= Math.ceil(others.length / 2);
      return ready({
        summary: `ウソは${g.lie}番。${tellerReacts ? `${getPlayerName(g.tellerId)}がリアクション。` : `${wrong.map(getPlayerName).join("、")}がリアクション。`}`,
        winners: correct,
        reactions: tellerReacts ? [g.tellerId] : wrong,
        lines: [
          { label: "正解", value: `${g.lie}番`, kind: "winner" },
          { label: "見抜いた人", value: correct.length ? correct.map(getPlayerName).join("、") : "なし", kind: "winner" },
        ],
      });
    }
    case "category": {
      if (!g.failId) return notReady();
      return ready({
        summary: `${getPlayerName(g.failId)}が失敗。`,
        winners: state.players.filter((player) => player.id !== g.failId).map((player) => player.id),
        reactions: [g.failId],
        lines: [{ label: getPlayerName(g.failId), value: "失敗", kind: "reaction" }],
      });
    }
    case "memory": {
      if (!g.failId) return notReady();
      return ready({
        summary: `${getPlayerName(g.failId)}がチェーン失敗。`,
        winners: state.players.filter((player) => player.id !== g.failId).map((player) => player.id),
        reactions: [g.failId],
        lines: [
          { label: getPlayerName(g.failId), value: "失敗", kind: "reaction" },
          { label: "到達", value: `${g.chain.length}個`, kind: "" },
        ],
      });
    }
    case "majority": {
      if (!g.revealed || state.players.some((player) => !g.choices[player.id])) return notReady();
      if (state.players.length === 2) {
        const target = state.players.find((player) => player.id !== g.parentId);
        const correct = g.choices[target.id] === g.prediction;
        return ready({
          summary: correct ? `親の予想が的中。${target.name}がリアクション。` : `親の予想が外れ。${getPlayerName(g.parentId)}がリアクション。`,
          winners: correct ? [g.parentId] : [target.id],
          reactions: correct ? [target.id] : [g.parentId],
          lines: [
            { label: "予想", value: g.prediction, kind: "" },
            { label: target.name, value: g.choices[target.id], kind: correct ? "reaction" : "winner" },
          ],
        });
      }
      const counts = { A: 0, B: 0 };
      state.players.forEach((player) => {
        counts[g.choices[player.id]] += 1;
      });
      if (counts.A === counts.B) {
        return ready({
          summary: "同数で不成立。全員セーフ。",
          winners: [],
          reactions: [],
          lines: [
            { label: "A", value: `${counts.A}票`, kind: "" },
            { label: "B", value: `${counts.B}票`, kind: "" },
          ],
        });
      }
      const majority = counts.A > counts.B ? "A" : "B";
      const minority = majority === "A" ? "B" : "A";
      const correct = g.prediction === majority;
      const reactionIds = correct ? state.players.filter((player) => g.choices[player.id] === minority).map((player) => player.id) : [g.parentId];
      return ready({
        summary: correct ? `親の予想が的中。少数派がリアクション。` : `親の予想が外れ。${getPlayerName(g.parentId)}がリアクション。`,
        winners: correct ? [g.parentId] : state.players.filter((player) => player.id !== g.parentId).map((player) => player.id),
        reactions: reactionIds,
        lines: [
          { label: "多数派", value: `${majority} / ${counts[majority]}票`, kind: "winner" },
          { label: "リアクション", value: reactionIds.map(getPlayerName).join("、"), kind: "reaction" },
        ],
      });
    }
    case "halfavg": {
      if (!g.revealed || state.players.some((player) => !isNumberInRange(g.numbers[player.id]))) return notReady();
      const values = state.players.map((player) => ({ playerId: player.id, value: Number(g.numbers[player.id]) }));
      const average = values.reduce((sum, item) => sum + item.value, 0) / values.length;
      const target = average / 2;
      const diffs = values.map((item) => ({ ...item, diff: Math.abs(item.value - target) }));
      const min = Math.min(...diffs.map((item) => item.diff));
      const max = Math.max(...diffs.map((item) => item.diff));
      const winners = diffs.filter((item) => item.diff === min).map((item) => item.playerId);
      if (min === max) {
        return ready({
          summary: `目標値は${target.toFixed(2)}。全員が同じ距離でセーフ。`,
          winners,
          reactions: [],
          lines: [
            { label: "平均", value: average.toFixed(2), kind: "" },
            { label: "目標値", value: target.toFixed(2), kind: "winner" },
            { label: "判定", value: "全員セーフ", kind: "winner" },
          ],
        });
      }
      const reactions = diffs.filter((item) => item.diff === max).map((item) => item.playerId);
      return ready({
        summary: `目標値は${target.toFixed(2)}。${winners.map(getPlayerName).join("、")}が最接近。`,
        winners,
        reactions,
        lines: [
          { label: "平均", value: average.toFixed(2), kind: "" },
          { label: "目標値", value: target.toFixed(2), kind: "winner" },
          { label: "リアクション", value: reactions.map(getPlayerName).join("、"), kind: "reaction" },
        ],
      });
    }
    case "drawing": {
      if (!g.finished) return notReady();
      const correct = state.players.filter((player) => g.correct[player.id]).map((player) => player.id);
      return ready({
        summary: correct.length ? `${correct.map(getPlayerName).join("、")}が正解。` : `誰も当てられず、${getPlayerName(g.drawerId)}がリアクション。`,
        winners: correct,
        reactions: correct.length ? [] : [g.drawerId],
        lines: correct.length
          ? correct.map((id) => ({ label: getPlayerName(id), value: "正解", kind: "winner" }))
          : [{ label: getPlayerName(g.drawerId), value: "描いた人", kind: "reaction" }],
      });
    }
    case "cm": {
      if (!g.revealed || state.players.some((player) => !g.votes[player.id])) return notReady();
      const counts = Object.fromEntries(state.players.map((player) => [player.id, 0]));
      Object.values(g.votes).forEach((id) => {
        counts[id] += 1;
      });
      const values = Object.entries(counts).map(([playerId, votes]) => ({ playerId, votes }));
      const max = Math.max(...values.map((item) => item.votes));
      const min = Math.min(...values.map((item) => item.votes));
      if (max === min) {
        return ready({
          summary: "同票で全員セーフ。",
          winners: [],
          reactions: [],
          lines: values.map((item) => ({
            label: getPlayerName(item.playerId),
            value: `${item.votes}票`,
            kind: "",
          })),
        });
      }
      const winners = values.filter((item) => item.votes === max).map((item) => item.playerId);
      const reactions = values.filter((item) => item.votes === min).map((item) => item.playerId);
      return ready({
        summary: `${winners.map(getPlayerName).join("、")}のCMが最多票。`,
        winners,
        reactions,
        lines: values
          .sort((a, b) => b.votes - a.votes)
          .map((item) => ({
            label: getPlayerName(item.playerId),
            value: `${item.votes}票`,
            kind: item.votes === max ? "winner" : item.votes === min ? "reaction" : "",
          })),
      });
    }
    case "bidding": {
      if (!g.result) return notReady();
      return ready({
        summary: g.result === "success" ? `${getPlayerName(g.highest.playerId)}が成功。` : `${getPlayerName(g.highest.playerId)}が失敗。`,
        winners: g.result === "success" ? [g.highest.playerId] : [],
        reactions: g.result === "fail" ? [g.highest.playerId] : [],
        lines: [
          { label: "挑戦者", value: getPlayerName(g.highest.playerId), kind: g.result === "success" ? "winner" : "reaction" },
          { label: "宣言", value: `${g.highest.value}`, kind: "" },
          { label: "結果", value: g.result === "success" ? "成功" : "失敗", kind: g.result === "success" ? "winner" : "reaction" },
        ],
      });
    }
    default:
      return notReady();
  }
}

function ready(data) {
  return { ready: true, winners: [], reactions: [], lines: [], summary: "", ...data };
}

function notReady() {
  return { ready: false, winners: [], reactions: [], lines: [], summary: "" };
}

function handleClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;

  if (action === "add-player") addPlayer();
  if (action === "remove-player") removePlayer(target.dataset.playerId);
  if (action === "select-game") selectGame(target.dataset.gameId);
  if (action === "random-game") randomGame();
  if (action === "reset-all") resetAll();
  if (action === "reset-game") resetCurrentGame();
  if (action === "record-result") recordResult();
  if (action === "stop-timer") stopTimer();

  const gameId = state.selectedGameId;
  if (gameId === "stopwatch") handleStopwatch(action);
  if (gameId === "ngword") handleNgWord(action, target);
  if (gameId === "profile") handleProfile(action, target);
  if (gameId === "category") handleCategory(action);
  if (gameId === "memory") handleMemory(action);
  if (gameId === "majority") handleMajority(action, target);
  if (gameId === "halfavg") handleHalfAvg(action);
  if (gameId === "drawing") handleDrawing(action);
  if (gameId === "cm") handleCm(action, target);
  if (gameId === "bidding") handleBidding(action);

  render();
}

function handleInput(event) {
  const target = event.target;
  const input = target.dataset.input;
  if (!input) return;

  if (input === "player-name") {
    const player = state.players.find((item) => item.id === target.dataset.playerId);
    if (player) player.name = target.value || "名無し";
  }

  const gameId = state.selectedGameId;
  const g = getGameState(gameId);

  if (input === "ng-hit") g.hits[target.dataset.playerId] = target.checked;
  if (input === "profile-teller") {
    g.tellerId = target.value;
    g.guesses = {};
    g.revealed = false;
    g.recorded = false;
  }
  if (input === "profile-seed") g.seed = target.value;
  if (input === "profile-statement") g.statements[Number(target.dataset.index)] = target.value;
  if (input === "category-word") g.wordInput = target.value;
  if (input === "memory-word") g.wordInput = target.value;
  if (input === "majority-parent") {
    g.parentId = target.value;
    g.revealed = false;
    g.recorded = false;
  }
  if (input === "half-number") {
    g.numbers[target.dataset.playerId] = target.value;
    g.revealed = false;
    g.recorded = false;
  }
  if (input === "drawing-drawer") {
    g.drawerId = target.value;
    g.correct = {};
    g.finished = false;
    g.recorded = false;
  }
  if (input === "drawing-correct") {
    g.correct[target.dataset.playerId] = target.checked;
    g.finished = false;
    g.recorded = false;
  }
  if (input === "bid-value") g.bidValue = target.value;

  persist();
}

function addPlayer() {
  if (state.players.length >= 4) return;
  const id = `p${Date.now().toString(36)}`;
  state.players.push({ id, name: `プレイヤー${state.players.length + 1}` });
  state.scores[id] = { points: 0, reactions: 0 };
  Object.keys(state.gameStates).forEach((gameId) => {
    state.gameStates[gameId] = createGameState(gameId);
  });
}

function removePlayer(id) {
  if (state.players.length <= 2) return;
  state.players = state.players.filter((player) => player.id !== id);
  delete state.scores[id];
  Object.keys(state.gameStates).forEach((gameId) => {
    state.gameStates[gameId] = createGameState(gameId);
  });
}

function selectGame(gameId) {
  clearActiveTimer();
  state.selectedGameId = gameId;
}

function randomGame() {
  const otherGames = gameCatalog.filter((game) => game.id !== state.selectedGameId);
  selectGame(pick(otherGames).id);
}

function resetAll() {
  clearActiveTimer();
  state.players = structuredClone(defaultPlayers);
  state.scores = {};
  state.gameStates = {};
  state.history = [];
  state.selectedGameId = "stopwatch";
}

function resetCurrentGame() {
  clearActiveTimer();
  state.gameStates[state.selectedGameId] = createGameState(state.selectedGameId);
}

function recordResult() {
  const game = getSelectedGame();
  const g = getGameState(game.id);
  const result = computeResult(game.id);
  if (!result.ready || g.recorded) return;

  result.winners.forEach((id) => {
    if (state.scores[id]) state.scores[id].points += 1;
  });
  result.reactions.forEach((id) => {
    if (state.scores[id]) state.scores[id].reactions += 1;
  });
  g.recorded = true;
  state.history.unshift({
    gameTitle: game.title,
    summary: result.summary,
    at: new Date().toISOString(),
  });
  state.history = state.history.slice(0, 12);
}

function handleStopwatch(action) {
  const g = getGameState("stopwatch");
  if (action === "start-stopwatch") {
    if (g.attempts.length >= state.players.length) return;
    g.running = true;
    g.startedAt = performance.now();
  }
  if (action === "stop-stopwatch" && g.running) {
    const elapsed = (performance.now() - g.startedAt) / 1000;
    const current = state.players[g.turnIndex % state.players.length];
    g.attempts.push({ playerId: current.id, elapsed });
    g.running = false;
    g.turnIndex += 1;
    g.recorded = false;
  }
}

function handleNgWord(action, target) {
  const g = getGameState("ngword");
  if (action === "toggle-ng-word") {
    const id = target.dataset.playerId;
    g.revealed[id] = !g.revealed[id];
  }
  if (action === "start-ng-timer") {
    startCountdown("ngword", g, 90, () => {
      g.timerStatus = "done";
    });
  }
}

function handleProfile(action, target) {
  const g = getGameState("profile");
  if (action === "profile-lie") {
    g.lie = target.dataset.value;
    g.revealed = false;
    g.recorded = false;
  }
  if (action === "profile-guess") {
    g.guesses[target.dataset.playerId] = target.dataset.value;
    g.revealed = false;
    g.recorded = false;
  }
  if (action === "profile-reveal") {
    g.revealed = true;
  }
}

function handleCategory(action) {
  const g = getGameState("category");
  const current = currentByIndex(g.currentIndex);
  if (action === "category-start") {
    startCountdown("category", g, 5, () => {
      g.failId = current.id;
      g.timerStatus = "done";
    });
  }
  if (action === "category-ok" && !g.failId) {
    clearActiveTimer();
    const word = g.wordInput.trim() || "無記入";
    g.used.push({ playerId: current.id, word });
    g.wordInput = "";
    g.currentIndex += 1;
    g.remaining = 5;
    g.timerStatus = "idle";
    g.recorded = false;
  }
  if (action === "category-fail" && !g.failId) {
    clearActiveTimer();
    g.failId = current.id;
    g.timerStatus = "done";
    g.recorded = false;
  }
}

function handleMemory(action) {
  const g = getGameState("memory");
  const current = currentByIndex(g.currentIndex);
  if (action === "memory-ok" && !g.failId) {
    const word = g.wordInput.trim() || "無記入";
    g.chain.push({ playerId: current.id, word });
    g.wordInput = "";
    g.currentIndex += 1;
    g.recorded = false;
  }
  if (action === "memory-fail" && !g.failId) {
    g.failId = current.id;
    g.revealChain = true;
    g.recorded = false;
  }
  if (action === "memory-toggle-chain") {
    g.revealChain = !g.revealChain;
  }
}

function handleMajority(action, target) {
  const g = getGameState("majority");
  if (action === "majority-predict") {
    g.prediction = target.dataset.value;
    g.revealed = false;
    g.recorded = false;
  }
  if (action === "majority-choice") {
    g.choices[target.dataset.playerId] = target.dataset.value;
    g.revealed = false;
    g.recorded = false;
  }
  if (action === "majority-reveal") {
    g.revealed = true;
  }
}

function handleHalfAvg(action) {
  const g = getGameState("halfavg");
  if (action === "half-reveal") {
    g.revealed = true;
  }
}

function handleDrawing(action) {
  const g = getGameState("drawing");
  if (action === "drawing-toggle-prompt") {
    g.promptVisible = !g.promptVisible;
  }
  if (action === "drawing-start") {
    startCountdown("drawing", g, 20, () => {
      g.timerStatus = "done";
    });
  }
  if (action === "drawing-finish") {
    clearActiveTimer();
    g.finished = true;
  }
}

function handleCm(action, target) {
  const g = getGameState("cm");
  if (action === "cm-start") {
    startCountdown("cm", g, 10, () => {
      g.timerStatus = "done";
    });
  }
  if (action === "cm-done-speaker") {
    clearActiveTimer();
    const speaker = state.players[g.currentIndex % state.players.length];
    if (!g.spoken.includes(speaker.id)) g.spoken.push(speaker.id);
    g.currentIndex += 1;
    g.remaining = 10;
    g.timerStatus = "idle";
    g.recorded = false;
  }
  if (action === "cm-vote") {
    g.votes[target.dataset.voterId] = target.dataset.playerId;
    g.revealed = false;
    g.recorded = false;
  }
  if (action === "cm-reveal") {
    g.revealed = true;
  }
}

function handleBidding(action) {
  const g = getGameState("bidding");
  const bidder = currentBidder(g);
  if (!bidder && g.phase === "bidding") return;

  if (action === "bid-submit") {
    const value = Number(g.bidValue);
    if (!Number.isInteger(value) || value <= g.highest.value) return;
    g.highest = { playerId: bidder.id, value };
    g.bidValue = "";
    advanceBidder(g);
  }
  if (action === "bid-pass") {
    g.passed[bidder.id] = true;
    advanceBidder(g);
  }
  if (action === "bid-success" && g.highest.playerId) {
    g.result = "success";
    g.recorded = false;
  }
  if (action === "bid-fail" && g.highest.playerId) {
    g.result = "fail";
    g.recorded = false;
  }
}

function startCountdown(key, gameState, seconds, onDone) {
  clearActiveTimer();
  gameState.remaining = seconds;
  gameState.timerStatus = "running";
  activeTimer = {
    key,
    id: window.setInterval(() => {
      gameState.remaining -= 1;
      if (gameState.remaining <= 0) {
        clearActiveTimer();
        gameState.remaining = 0;
        gameState.timerStatus = "done";
        onDone();
      }
      render();
    }, 1000),
  };
}

function stopTimer() {
  clearActiveTimer();
  const g = getGameState(state.selectedGameId);
  if ("timerStatus" in g) g.timerStatus = "idle";
}

function clearActiveTimer() {
  if (activeTimer) {
    window.clearInterval(activeTimer.id);
    activeTimer = null;
  }
}

function advanceBidder(g) {
  const activeIds = activeBidders(g).map((player) => player.id);
  if (g.highest.playerId && activeIds.length <= 1) {
    g.phase = "challenge";
    return;
  }

  for (let i = 0; i < state.players.length; i += 1) {
    g.currentIndex = (g.currentIndex + 1) % state.players.length;
    if (!g.passed[state.players[g.currentIndex].id]) return;
  }
}

function activeBidders(g) {
  return state.players.filter((player) => !g.passed[player.id]);
}

function currentBidder(g) {
  if (g.phase !== "bidding") return null;
  if (activeBidders(g).length === 0) return null;
  for (let i = 0; i < state.players.length; i += 1) {
    const player = state.players[(g.currentIndex + i) % state.players.length];
    if (!g.passed[player.id]) {
      g.currentIndex = (g.currentIndex + i) % state.players.length;
      return player;
    }
  }
  return null;
}

function ensureExistingPlayer(gameState, key) {
  if (!state.players.some((player) => player.id === gameState[key])) {
    gameState[key] = state.players[0].id;
  }
}

function ensureNgWords(gameState) {
  state.players.forEach((player) => {
    if (!gameState.words[player.id]) {
      gameState.words[player.id] = pick(pools.ngWords);
    }
  });
}

function currentByIndex(index) {
  return state.players[index % state.players.length];
}

function playerSelect(inputName, value) {
  return `
    <select class="select-input" data-input="${inputName}">
      ${state.players.map((player) => `<option value="${player.id}" ${player.id === value ? "selected" : ""}>${escapeHtml(player.name)}</option>`).join("")}
    </select>
  `;
}

function isNumberInRange(value) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 && n <= 10;
}

function formatSeconds(value) {
  const seconds = Math.max(0, Number(value) || 0);
  return `${seconds}秒`;
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle(list) {
  return list
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((item) => item.value);
}

function icon(name) {
  return `<svg aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
