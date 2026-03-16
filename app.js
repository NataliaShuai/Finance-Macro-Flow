const nodes = [
  {
    id: "rate",
    label: "利率",
    x: 28,
    y: 22,
    define: "利率 = 钱的时间价格，越高代表借钱成本越高。",
    why: "利率上升时，企业和个人借钱扩张会更谨慎，估值也会被更高折现率压低。",
    analogy: "就像租车价格从每天100涨到200，大家会少租、精打细算。"
  },
  {
    id: "usd",
    label: "美元",
    x: 68,
    y: 20,
    define: "美元 = 全球定价和流动性的核心货币。",
    why: "当美国利率相对更高时，美元资产吸引力提升，资金更愿意回流美元。",
    analogy: "像商场里最稳定、最通用的代金券，大家不确定时更愿意先拿着它。"
  },
  {
    id: "gold",
    label: "黄金",
    x: 20,
    y: 66,
    define: "黄金 = 典型避险资产，不生息但抗不确定性。",
    why: "高利率会提高持有黄金的机会成本，但避险需求爆发时金价也会被推高。",
    analogy: "像家里长期放着的应急现金箱，平时嫌占用空间，乱的时候却最安心。"
  },
  {
    id: "oil",
    label: "原油",
    x: 52,
    y: 74,
    define: "原油 = 经济活动燃料，会影响运输、制造和通胀。",
    why: "油价上行会推高全社会成本，抬升通胀预期并挤压企业利润。",
    analogy: "像全城外卖配送费突然上涨，几乎所有商家都会被连带影响。"
  },
  {
    id: "tech",
    label: "科技股",
    x: 80,
    y: 58,
    define: "科技股 = 对未来增长预期敏感的风险资产。",
    why: "利率走高时，远期现金流折现更狠，高估值科技股通常更脆弱。",
    analogy: "像提前预订很久之后的热门演出，折扣率一变，今天愿意出的票价会立刻下降。"
  }
];

const edges = [
  { from: "rate", to: "usd", type: "positive", text: "利率↑通常支撑美元" },
  { from: "rate", to: "tech", type: "negative", text: "利率↑压制高估值科技股" },
  { from: "rate", to: "gold", type: "negative", text: "利率↑提高黄金机会成本" },
  { from: "usd", to: "gold", type: "negative", text: "美元偏强时黄金常承压" },
  { from: "usd", to: "oil", type: "negative", text: "美元走强常压制美元计价大宗" },
  { from: "oil", to: "tech", type: "negative", text: "油价上涨抬高成本、压利润" },
  { from: "oil", to: "gold", type: "complex", text: "油价冲击可引发通胀与避险共振" },
  { from: "gold", to: "tech", type: "complex", text: "避险偏好升温时风险资产承压" }
];

const scenarios = [
  {
    id: "hike",
    label: "美联储加息",
    theme: "主线：现金更值钱 + 科技估值承压",
    impacts: { rate: 1, usd: 1, tech: -1, gold: -0.5, oil: -0.3 }
  },
  {
    id: "cut",
    label: "美联储降息",
    theme: "主线：流动性改善 + 风险偏好修复",
    impacts: { rate: -1, usd: -0.7, tech: 1, gold: 0.6, oil: 0.4 }
  },
  {
    id: "geo",
    label: "地缘冲突升级",
    theme: "主线：避险升温 + 通胀担忧回潮",
    impacts: { oil: 1, gold: 1, usd: 0.6, tech: -0.8, rate: 0.2 }
  }
];

const nodeLayer = document.getElementById("nodes-layer");
const edgeLayer = document.getElementById("relation-edges");
const card = document.getElementById("explain-card");
const scenarioButtons = document.getElementById("scenario-buttons");
const marketTheme = document.getElementById("market-theme-text");

let activeNode = null;

function renderNodes() {
  nodes.forEach((node) => {
    const el = document.createElement("button");
    el.className = "node";
    el.style.left = `${node.x}%`;
    el.style.top = `${node.y}%`;
    el.textContent = node.label;
    el.dataset.nodeId = node.id;
    el.addEventListener("click", () => setActiveNode(node.id));
    nodeLayer.appendChild(el);
  });
}

function drawEdges() {
  edges.forEach((edge) => {
    const from = nodes.find((n) => n.id === edge.from);
    const to = nodes.find((n) => n.id === edge.to);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", from.x * 10);
    line.setAttribute("y1", from.y * 6.2);
    line.setAttribute("x2", to.x * 10);
    line.setAttribute("y2", to.y * 6.2);
    line.classList.add("edge", edge.type);
    line.dataset.from = edge.from;
    line.dataset.to = edge.to;
    line.dataset.description = edge.text;
    edgeLayer.appendChild(line);
  });
}

function setActiveNode(nodeId) {
  activeNode = nodeId;
  const node = nodes.find((n) => n.id === nodeId);
  const related = edges.filter((e) => e.from === nodeId || e.to === nodeId);

  document.querySelectorAll(".node").forEach((el) => {
    const id = el.dataset.nodeId;
    const connected = related.some((r) => r.from === id || r.to === id);
    el.classList.toggle("active", id === nodeId);
    el.classList.toggle("affected", connected && id !== nodeId);
  });

  document.querySelectorAll(".edge").forEach((el) => {
    const focus = related.some(
      (r) => r.from === el.dataset.from && r.to === el.dataset.to
    );
    el.classList.toggle("focus", focus);
    el.style.opacity = focus ? "1" : "0.18";
  });

  const chains = related.map((r) => `• ${r.text}`).join("<br />");
  card.innerHTML = `
    <h3>${node.label}</h3>
    <p><strong>A. 一句话定义：</strong>${node.define}</p>
    <p><strong>B. 为什么会这样：</strong>${node.why}</p>
    <p><strong>C. 现实类比：</strong>${node.analogy}</p>
    <p class="small"><strong>简短因果链：</strong><br />${chains || "暂无关系"}</p>
  `;
}

function applyScenario(scenarioId) {
  const scenario = scenarios.find((s) => s.id === scenarioId);
  marketTheme.textContent = scenario.theme;

  document.querySelectorAll(".scenario-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.scenarioId === scenarioId);
  });

  document.querySelectorAll(".node").forEach((nodeEl) => {
    const impact = scenario.impacts[nodeEl.dataset.nodeId] || 0;
    nodeEl.classList.remove("increase", "decrease", "active", "affected");
    if (impact > 0) nodeEl.classList.add("increase", "affected");
    if (impact < 0) nodeEl.classList.add("decrease", "affected");
  });

  document.querySelectorAll(".edge").forEach((edgeEl) => {
    const fromImpact = scenario.impacts[edgeEl.dataset.from] || 0;
    const toImpact = scenario.impacts[edgeEl.dataset.to] || 0;
    const engaged = Math.abs(fromImpact) + Math.abs(toImpact) > 0;
    edgeEl.style.opacity = engaged ? "0.95" : "0.16";
    edgeEl.classList.toggle("focus", engaged);
  });

  card.innerHTML = `
    <h3>${scenario.label}</h3>
    <p>先变化的节点会先亮，再向其他变量传导。你可以继续点击节点看详细逻辑。</p>
    <p class="small">${scenario.theme}</p>
  `;

  if (activeNode) {
    setTimeout(() => setActiveNode(activeNode), 350);
  }
}

function renderScenarioButtons() {
  scenarios.forEach((scenario) => {
    const btn = document.createElement("button");
    btn.textContent = scenario.label;
    btn.className = "scenario-btn";
    btn.dataset.scenarioId = scenario.id;
    btn.addEventListener("click", () => applyScenario(scenario.id));
    scenarioButtons.appendChild(btn);
  });
}

renderScenarioButtons();
renderNodes();
drawEdges();
setActiveNode("rate");
