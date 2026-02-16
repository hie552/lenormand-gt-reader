const tableau = document.getElementById("tableau");
const revealBtn = document.getElementById("reveal-cards");
const shuffleBtn = document.getElementById("shuffle-toggle");
const toggleBtn = document.getElementById("toggle-labels");
const chainBtn = document.getElementById("chain-mode");
const saveBtn = document.getElementById("save-reading");

const BACK = "images/lenormand/back.png";

let shuffled = false;
let labelMode = 'none';
let chainMode = false;
let lastClickTime = 0;
let lastClickedCard = null;

let currentDeck = [...lenormandCards];
const cardElements = [];

const houseNames = {
  1: "Rider", 2: "Clover", 3: "Ship", 4: "House", 5: "Tree", 6: "Cloud",
  7: "Snake", 8: "Coffin", 9: "Bouquet", 10: "Scythe", 11: "Broom", 12: "Owls",
  13: "Child", 14: "Fox", 15: "Bear", 16: "Star", 17: "Stork", 18: "Dog",
  19: "Tower", 20: "Garden", 21: "Mountain", 22: "Crossroad", 23: "Mice", 24: "Heart",
  25: "Ring", 26: "Book", 27: "Letter", 28: "Man", 29: "Woman", 30: "Lily",
  31: "Sun", 32: "Moon", 33: "Key", 34: "Fish", 35: "Anchor", 36: "Cross"
};

// 모바일 감지
function isMobile() {
  return window.innerWidth <= 768;
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function showCardDetail(cardId) {
  const card = cardMeanings[cardId];
  if (!card) return;
  
  const modal = document.createElement('div');
  modal.className = 'modal card-detail-modal';
  modal.style.display = 'block';
  
  modal.innerHTML = `
    <div class="modal-content card-detail-content">
      <span class="close card-detail-close">&times;</span>
      <h3>${cardId}. ${card.name}</h3>
      <div class="card-detail-body">
        <div class="card-detail-image">
          <img src="images/lenormand/${String(cardId).padStart(2, '0')}_${card.name.toLowerCase().replace(/ /g, '')}.png" alt="${card.name}">
        </div>
        <div class="card-detail-info">
          <p class="card-keywords"><strong>키워드:</strong> ${card.keywords}</p>
          <p class="card-description">${card.description}</p>
          <div class="card-character">
            <p class="character-name"><strong>🎭 ${card.character}</strong></p>
            <p class="character-quote">"${card.quote}"</p>
            <p class="character-detail">${card.detail}</p>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  const closeBtn = modal.querySelector('.card-detail-close');
  closeBtn.onclick = () => {
    document.body.removeChild(modal);
  };
  
  modal.onclick = (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  };
}

function renderCards() {
  tableau.innerHTML = "";
  cardElements.length = 0;

  currentDeck.forEach((card, index) => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.dataset.house = index + 1;
    cardDiv.dataset.cardId = card.id;
    
    if (index >= 32) {
      cardDiv.classList.add("final-card");
    }

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
    label.innerHTML = `
      <span class="card-number">${card.id}</span>
      <span class="house-num">${index + 1}</span>
      <span class="house-name">${houseNames[index + 1]}</span>
    `;

    inner.append(back, front);
    cardDiv.append(inner, label);
    tableau.appendChild(cardDiv);

    cardDiv.addEventListener("click", (event) => {
      if (!cardDiv.classList.contains("revealed")) return;
      
      const currentTime = Date.now();
      const timeDiff = currentTime - lastClickTime;
      
      // 모바일: 더블클릭으로 설명 표시
      // PC: Shift + 클릭으로 설명 표시
      if (isMobile()) {
        if (lastClickedCard === cardDiv && timeDiff < 300) {
          // 더블클릭
          showCardDetail(card.id);
          lastClickedCard = null;
          lastClickTime = 0;
          return;
        } else {
          lastClickedCard = cardDiv;
          lastClickTime = currentTime;
        }
      } else {
        if (event.shiftKey) {
          showCardDetail(card.id);
          return;
        }
      }
      
      cardDiv.classList.toggle("selected");
      
      if (chainMode) {
        applyChain();
      }
    });

    cardElements.push({ cardDiv, house: index + 1, cardId: card.id });
  });
  
  updateLabelDisplay();
}

function updateLabelDisplay() {
  document.querySelectorAll(".card-label").forEach(label => {
    const cardNum = label.querySelector(".card-number");
    const houseNum = label.querySelector(".house-num");
    const houseName = label.querySelector(".house-name");
    
    if (labelMode === 'none') {
      label.style.display = "none";
    } else {
      label.style.display = "block";
      
      if (labelMode === 'number') {
        cardNum.style.display = "inline-block";
        houseNum.style.display = "inline-block";
        houseName.style.display = "none";
      } else if (labelMode === 'house') {
        cardNum.style.display = "none";
        houseNum.style.display = "none";
        houseName.style.display = "inline-block";
      }
    }
  });
}

renderCards();

shuffleBtn.onclick = () => {
  shuffled = !shuffled;
  shuffleBtn.textContent = shuffled ? "셔플 ON" : "셔플 OFF";
  
  if (shuffled) {
    currentDeck = shuffle(lenormandCards);
  } else {
    currentDeck = [...lenormandCards];
  }
  
  renderCards();
};

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

toggleBtn.onclick = () => {
  if (labelMode === 'none') {
    labelMode = 'number';
    toggleBtn.textContent = "번호 표시";
  } else if (labelMode === 'number') {
    labelMode = 'house';
    toggleBtn.textContent = "하우스 표시";
  } else {
    labelMode = 'none';
    toggleBtn.textContent = "번호 / 하우스";
  }
  
  updateLabelDisplay();
};

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

saveBtn.onclick = async () => {
  try {
    const html2canvas = await import("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js");
    
    const captureContainer = document.createElement('div');
    captureContainer.style.cssText = `
      position: relative;
      background-image: url('images/lenormand/background_0.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      padding: 40px 20px;
      display: inline-block;
    `;
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.3);
      pointer-events: none;
    `;
    
    const tableauClone = tableau.cloneNode(true);
    tableauClone.style.position = 'relative';
    tableauClone.style.zIndex = '1';
    
    captureContainer.appendChild(overlay);
    captureContainer.appendChild(tableauClone);
    
    captureContainer.style.position = 'absolute';
    captureContainer.style.left = '-9999px';
    document.body.appendChild(captureContainer);
    
    const canvas = await html2canvas.default(captureContainer, {
      backgroundColor: null,
      scale: 2,
      logging: false,
      useCORS: true
    });
    
    document.body.removeChild(captureContainer);
    
    const link = document.createElement("a");
    link.download = `lenormand_reading_${new Date().getTime()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  } catch (error) {
    console.error("스크린샷 저장 실패:", error);
    alert("저장에 실패했습니다. 다시 시도해주세요.");
  }
};
