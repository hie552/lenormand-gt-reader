const tableau = document.getElementById("tableau");
const revealBtn = document.getElementById("reveal-cards");
const toggleBtn = document.getElementById("toggle-labels");
const chainBtn = document.getElementById("chain-mode");
const saveBtn = document.getElementById("save-reading");

const BACK = "images/lenormand/back.png";

let labelsVisible = false;
let chainMode = false;
let selectedCards = [];

const cards = [];

/* 카드 생성 */
lenormandCards.forEach((card, index) => {
  const div = document.createElement("div");
  div.className = "card";
  div.dataset.house = index + 1;

  if (card.id >= 33) div.classList.add("final-card");

  const img = document.createElement("img");
  img.src = BACK;

  const label = document.createElement("div");
  label.className = "card-label";
  label.innerHTML = `
    <span>${card.id}</span>
    <span class="house-num">${index + 1}</span>
  `;

  div.append(img, label);
  tableau.appendChild(div);

  div.addEventListener("click", () => {
    if (!div.classList.contains("revealed")) return;

    const i = selectedCards.indexOf(div);
    if (i === -1) {
      selectedCards.push(div);
      div.classList.add("selected");
    } else {
      selectedCards.splice(i, 1);
      div.classList.remove("selected");
    }
    if (chainMode) applyChain();
  });

  cards.push({ div, img, front: card.image, house: index + 1 });
});

/* 🔮 대각선 파도 펼치기 */
revealBtn.addEventListener("click", async () => {
  const order = [...cards].sort((a, b) => {
    const ar = Math.ceil(a.house / 8), ac = (a.house - 1) % 8;
    const br = Math.ceil(b.house / 8), bc = (b.house - 1) % 8;
    return (ar + ac) - (br + bc);
  });

  for (const c of order) {
    c.img.src = c.front;
    c.div.classList.add("revealed");
    await new Promise(r => setTimeout(r, 45)); // 빠른 파도
  }
});

/* 번호 토글 */
toggleBtn.onclick = () => {
  labelsVisible = !labelsVisible;
  document.querySelectorAll(".card-label").forEach(l =>
    l.style.display = labelsVisible ? "block" : "none"
  );
};

/* 체인 */
chainBtn.onclick = () => {
  chainMode = !chainMode;
  chainBtn.textContent = chainMode ? "체인 종료" : "체인 리딩";
  chainMode ? applyChain() : clearChain();
};

function applyChain() {
  clearChain();
  if (!selectedCards.length) return;

  const base = selectedCards[0];
  const h = Number(base.dataset.house);
  const br = Math.ceil(h / 8), bc = (h - 1) % 8;

  document.querySelectorAll(".card").forEach(c => {
    const ch = Number(c.dataset.house);
    const r = Math.ceil(ch / 8), col = (ch - 1) % 8;
    if (r === br || col === bc || Math.abs(r - br) === Math.abs(col - bc)) {
      c.classList.add("chain");
    } else c.classList.add("dimmed");
  });
}

function clearChain() {
  document.querySelectorAll(".card").forEach(c =>
    c.classList.remove("chain", "dimmed")
  );
}

/* 💾 리딩 저장 (이미지 캡처) */
saveBtn.onclick = async () => {
  const html2canvas = await import("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js");
  const canvas = await html2canvas.default(tableau);
  const link = document.createElement("a");
  link.download = "lenormand_reading.png";
  link.href = canvas.toDataURL();
  link.click();
};
