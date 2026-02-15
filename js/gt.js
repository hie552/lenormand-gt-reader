// js/gt.js (수정된 버전)

const tableau = document.getElementById("tableau");
const revealBtn = document.getElementById("reveal-cards");
const shuffleBtn = document.getElementById("shuffle-toggle");
const toggleBtn = document.getElementById("toggle-labels");
const chainBtn = document.getElementById("chain-mode");
const saveBtn = document.getElementById("save-reading");

const BACK = "images/lenormand/back.png";

let shuffled = false;
let labelsVisible = false;
let chainMode = false;

let cardsData = [...lenormandCards];
let currentDeck = [...lenormandCards]; // 현재 사용 중인 덱
const cardElements = [];

/* 셔플 함수 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/* 카드 생성 */
function renderCards() {
  tableau.innerHTML = "";
  cardElements.length = 0;

  currentDeck.forEach((card, index) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.dataset.house = index + 1;
    cardDiv.dataset.cardId = card.id; // 카드 ID 저장
    if (index >= 32) cardDiv.classList.add("final-card"); // 인덱스 기준으로 수정

    const inner = document.createElement("div");
    inner.className = "card-inner";

    const back = document.createElement("div");
    back.className = "card-face card-back";
    back.innerHTML = `<img src="${BACK}" alt="Card back">`;

    const front = document.createElement("div");
    front.className = "card-face card-front";
    front.innerHTML = `<img src="${card.image}" alt="Card ${card.id}">`;

    const label = document.createElement("div");
    label.className = "card-label";
    label.innerHTML = `<span>${card.id}</span><span class="house-num">${index + 1}</span>`;

    inner.append(back, front);
    cardDiv.append(inner, label);
    tableau.appendChild(cardDiv);

    cardDiv.addEventListener("click", () => {
      if (!cardDiv.classList.contains("revealed")) return;
      
      cardDiv.classList.toggle("selected");
      
      if (chainMode) {
        applyChain();
      }
    });

    cardElements.push({ cardDiv, house: index + 1, cardId: card.id });
  });
}

/* 초기 렌더 */
renderCards();

/* 셔플 토글 */
shuffleBtn.onclick = () => {
  shuffled = !shuffled;
  shuffleBtn.textContent = shuffled ? "셔플 ON" : "셔플 OFF";
  
  if (shuffled) {
    currentDeck = shuffle([...lenormandCards]);
  } else {
    currentDeck = [...lenormandCards];
  }
  
  renderCards();
};

/* 카드 펼치기 – 대각선 파도 */
revealBtn.onclick = async () => {
  const order = [...cardElements].sort((a, b) => {
    const ar = Math.ceil(a.house / 8), ac = (a.house - 1) % 8;
    const br = Math.ceil(b.house / 8), bc = (b.house - 1) % 8;
    return (ar + ac) - (br + bc);
  });

  for (const c of order) {
    c.cardDiv.classList.add("revealed");
    await new Promise(r => setTimeout(r, 40));
  }
};

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
  
  if (chainMode) {
    applyChain();
  } else {
    clearChain();
  }
};

function applyChain() {
  clearChain();
  const selected = document.querySelectorAll(".card.selected");
  
  if (selected.length === 0) return;

  const chainCards = new Set();
  
  selected.forEach(base => {
    const h = Number(base.dataset.house);
    const br = Math.ceil(h / 8), bc = (h - 1) % 8;

    document.querySelectorAll(".card").forEach(c => {
      const ch = Number(c.dataset.house);
      const r = Math.ceil(ch / 8), col = (ch - 1) % 8;
      
      if (r === br || col === bc || Math.abs(r - br) === Math.abs(col - bc)) {
        chainCards.add(c);
      }
    });
  });

  document.querySelectorAll(".card").forEach(c => {
    if (chainCards.has(c)) {
      c.classList.add("chain");
    } else {
      c.classList.add("dimmed");
    }
  });
}

function clearChain() {
  document.querySelectorAll(".card").forEach(c =>
    c.classList.remove("chain", "dimmed")
  );
}

/* 리딩 저장 */
saveBtn.onclick = async () => {
  try {
    const html2canvas = await import("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js");
    const canvas = await html2canvas.default(tableau);
    const link = document.createElement("a");
    link.download = `lenormand_reading_${new Date().getTime()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  } catch (error) {
    console.error("스크린샷 저장 실패:", error);
    alert("저장에 실패했습니다. 다시 시도해주세요.");
  }
};
