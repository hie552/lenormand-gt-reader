const readingBtn = document.getElementById("reading-guide");
const readingModal = document.getElementById("reading-modal");
const readingClose = document.getElementById("reading-close");
const questionInput = document.getElementById("question-input");
const saveQuestionBtn = document.getElementById("save-question");
const savedQuestion = document.getElementById("saved-question");
const findSigBtn = document.getElementById("find-significator");
const sigPosition = document.getElementById("significator-position");
const aiInterpretBtn = document.getElementById("ai-interpret");
const aiResult = document.getElementById("ai-result");

let currentQuestion = "";
let currentSignificator = null;
let currentTechnique = null;
let isReadingMode = false;

readingBtn.onclick = () => {
  readingModal.style.display = "block";
};

readingClose.onclick = () => {
  readingModal.style.display = "none";
  // 모달 닫을 때 리딩 모드 해제
  if (isReadingMode) {
    exitReadingMode();
  }
};

saveQuestionBtn.onclick = () => {
  currentQuestion = questionInput.value.trim();
  if (currentQuestion) {
    savedQuestion.textContent = `저장된 질문: "${currentQuestion}"`;
  } else {
    savedQuestion.textContent = "질문을 입력해주세요.";
  }
};

findSigBtn.onclick = () => {
  const selected = document.querySelector('input[name="significator"]:checked');
  
  if (!selected) {
    sigPosition.textContent = "시그니피케이터를 선택해주세요.";
    return;
  }
  
  if (selected.value === "custom") {
    sigPosition.textContent = "타블로에서 카드를 클릭하여 선택하세요.";
    readingModal.style.display = "none";
    enableCustomSignificatorMode();
  } else {
    const sigId = parseInt(selected.value);
    findSignificatorInTableau(sigId);
  }
};

function findSignificatorInTableau(cardId) {
  const cardEl = cardElements.find(el => el.cardId === cardId);
  
  if (cardEl) {
    currentSignificator = {
      cardId: cardId,
      house: cardEl.house,
      name: cardMeanings[cardId].name
    };
    
    document.querySelectorAll(".card").forEach(c => c.classList.remove("significator"));
    cardEl.cardDiv.classList.add("significator");
    
    sigPosition.textContent = `${currentSignificator.name}이(가) ${currentSignificator.house}번 하우스에 있습니다.`;
  } else {
    sigPosition.textContent = "카드를 찾을 수 없습니다. 먼저 카드를 펼쳐주세요.";
  }
}

function enableCustomSignificatorMode() {
  const oneTimeHandler = (e) => {
    const cardDiv = e.currentTarget;
    const cardId = parseInt(cardDiv.dataset.cardId);
    const house = parseInt(cardDiv.dataset.house);
    
    currentSignificator = {
      cardId: cardId,
      house: house,
      name: cardMeanings[cardId].name
    };
    
    document.querySelectorAll(".card").forEach(c => c.classList.remove("significator"));
    cardDiv.classList.add("significator");
    
    readingModal.style.display = "block";
    sigPosition.textContent = `${currentSignificator.name}이(가) ${house}번 하우스에 있습니다.`;
  };
  
  document.querySelectorAll(".card.revealed").forEach(card => {
    card.addEventListener("click", oneTimeHandler, { once: true });
  });
}

// 리딩 기법 적용
document.querySelectorAll(".technique-btn").forEach(btn => {
  btn.addEventListener("click", function() {
    const technique = this.dataset.technique;
    
    // 기존 하이라이트 제거
    clearAllHighlights();
    
    // 모든 버튼 비활성화
    document.querySelectorAll(".technique-btn").forEach(b => b.classList.remove("active"));
    
    // 현재 버튼 활성화
    this.classList.add("active");
    currentTechnique = technique;
    
    // 기법 적용
    applyTechnique(technique);
    
    // 설명 표시
    showTechniqueGuide(technique);
    
    // 리딩 모드 활성화 (라벨 자동 표시)
    enterReadingMode();
    
    // 모달 닫기
    readingModal.style.display = "none";
  });
});

function enterReadingMode() {
  isReadingMode = true;
  
  // 라벨 자동 표시 (하우스 모드)
  if (labelMode === 'none') {
    // 이전 라벨 모드 저장
    window.previousLabelMode = labelMode;
    
    // 하우스 이름 표시로 전환
    labelMode = 'house';
    toggleBtn.textContent = "하우스 표시";
    updateLabelDisplay();
  }
  
  // 안내 메시지 표시
  showReadingModeNotification();
}

function exitReadingMode() {
  isReadingMode = false;
  
  // 하이라이트 제거
  clearAllHighlights();
  
  // 기법 버튼 비활성화
  document.querySelectorAll(".technique-btn").forEach(b => b.classList.remove("active"));
  currentTechnique = null;
  
  // 라벨 원래대로
  if (window.previousLabelMode !== undefined) {
    labelMode = window.previousLabelMode;
    updateLabelModeButton();
    updateLabelDisplay();
  }
  
  // 안내 메시지 제거
  removeReadingModeNotification();
}

function updateLabelModeButton() {
  if (labelMode === 'none') {
    toggleBtn.textContent = "번호 / 하우스";
  } else if (labelMode === 'number') {
    toggleBtn.textContent = "번호 표시";
  } else if (labelMode === 'house') {
    toggleBtn.textContent = "하우스 표시";
  }
}

function showReadingModeNotification() {
  // 기존 알림 제거
  removeReadingModeNotification();
  
  const notification = document.createElement('div');
  notification.id = 'reading-mode-notification';
  notification.className = 'reading-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <span>📖 리딩 모드 활성화</span>
      <button id="exit-reading-mode" class="exit-reading-btn">종료</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // 종료 버튼 이벤트
  document.getElementById('exit-reading-mode').onclick = () => {
    exitReadingMode();
  };
  
  // 3초 후 자동으로 버튼만 남기고 텍스트 축소
  setTimeout(() => {
    if (notification) {
      notification.classList.add('compact');
    }
  }, 3000);
}

function removeReadingModeNotification() {
  const existing = document.getElementById('reading-mode-notification');
  if (existing) {
    existing.remove();
  }
}

function clearAllHighlights() {
  document.querySelectorAll(".card").forEach(card => {
    card.classList.remove("technique-highlight", "technique-dim", "first-line", "chain-highlight", "portrait-highlight", "cross-highlight", "house-highlight");
  });
}

function applyTechnique(technique) {
  clearAllHighlights();
  
  switch(technique) {
    case 'first-line':
      applyFirstLine();
      break;
    case 'chain':
      applyChainTechnique();
      break;
    case 'portrait':
      applyPortrait();
      break;
    case 'cross':
      applyCross();
      break;
    case 'house':
      applyHouse();
      break;
    case 'overall':
      applyOverall();
      break;
  }
}

function applyFirstLine() {
  // 첫 줄 (1-8번 하우스) 하이라이트
  for (let i = 0; i < 8; i++) {
    const card = cardElements[i];
    if (card) {
      card.cardDiv.classList.add("technique-highlight", "first-line");
    }
  }
  
  // 나머지 희미하게
  for (let i = 8; i < cardElements.length; i++) {
    cardElements[i].cardDiv.classList.add("technique-dim");
  }
}

function applyChainTechnique() {
  if (!currentSignificator) {
    alert("먼저 시그니피케이터를 선택해주세요.");
    readingModal.style.display = "block";
    return;
  }
  
  const h = currentSignificator.house;
  const row = Math.ceil(h / 8);
  const col = ((h - 1) % 8) + 1;
  
  cardElements.forEach(el => {
    const elRow = Math.ceil(el.house / 8);
    const elCol = ((el.house - 1) % 8) + 1;
    
    if (elRow === row || elCol === col || Math.abs(elRow - row) === Math.abs(elCol - col)) {
      el.cardDiv.classList.add("technique-highlight", "chain-highlight");
    } else {
      el.cardDiv.classList.add("technique-dim");
    }
  });
}

function applyPortrait() {
  if (!currentSignificator) {
    alert("먼저 시그니피케이터를 선택해주세요.");
    readingModal.style.display = "block";
    return;
  }
  
  const h = currentSignificator.house;
  const row = Math.ceil(h / 8);
  const col = ((h - 1) % 8) + 1;
  
  // 시그니피케이터와 주변 8장
  cardElements.forEach(el => {
    const elRow = Math.ceil(el.house / 8);
    const elCol = ((el.house - 1) % 8) + 1;
    
    if (Math.abs(elRow - row) <= 1 && Math.abs(elCol - col) <= 1) {
      el.cardDiv.classList.add("technique-highlight", "portrait-highlight");
    } else {
      el.cardDiv.classList.add("technique-dim");
    }
  });
}

function applyCross() {
  if (!currentSignificator) {
    alert("먼저 시그니피케이터를 선택해주세요.");
    readingModal.style.display = "block";
    return;
  }
  
  const h = currentSignificator.house;
  const row = Math.ceil(h / 8);
  const col = ((h - 1) % 8) + 1;
  
  // 십자가 (상하좌우)
  cardElements.forEach(el => {
    const elRow = Math.ceil(el.house / 8);
    const elCol = ((el.house - 1) % 8) + 1;
    
    if ((elRow === row && Math.abs(elCol - col) === 1) || 
        (elCol === col && Math.abs(elRow - row) === 1)) {
      el.cardDiv.classList.add("technique-highlight", "cross-highlight");
    } else if (el.house === h) {
      el.cardDiv.classList.add("technique-highlight", "cross-highlight");
    } else {
      el.cardDiv.classList.add("technique-dim");
    }
  });
}

function applyHouse() {
  // 모든 카드를 하우스로 읽기 (전체 표시)
  cardElements.forEach(el => {
    el.cardDiv.classList.add("technique-highlight", "house-highlight");
  });
}

function applyOverall() {
  // 전체 분위기 - 모든 카드 표시
  cardElements.forEach(el => {
    el.cardDiv.classList.add("technique-highlight");
  });
}

function showTechniqueGuide(technique) {
  const guides = {
    'first-line': {
      title: '1·2·3 하우스 (첫 줄 요약)',
      content: `
        <p><strong>📌 읽는 방법:</strong></p>
        <p>• 첫 번째 줄(1-8번 하우스)은 전체 상황의 요약입니다.</p>
        <p>• 1-2-3번 하우스: 과거 → 현재 → 미래의 흐름</p>
        <p>• 4-5번: 기반과 뿌리, 안정성</p>
        <p>• 6-7번: 현재의 문제나 도전</p>
        <p>• 8번: 결과나 결론</p>
        <p class="tip">💡 팁: 이 줄만으로도 전체 이야기를 파악할 수 있습니다.</p>
      `
    },
    'chain': {
      title: '체인 기법',
      content: `
        <p><strong>📌 읽는 방법:</strong></p>
        <p>• 시그니피케이터와 같은 행: 현재 상황과 주변 환경</p>
        <p>• 시그니피케이터와 같은 열: 과거에서 미래로의 흐름</p>
        <p>• 대각선: 숨겨진 영향이나 간접적인 요소</p>
        <p class="tip">💡 팁: 행은 '지금 무슨 일이?', 열은 '어디로 가고 있나?'를 보여줍니다.</p>
      `
    },
    'portrait': {
      title: '초상화 기법',
      content: `
        <p><strong>📌 읽는 방법:</strong></p>
        <p>• 시그니피케이터 주변 8장의 카드를 봅니다.</p>
        <p>• 위: 생각과 의식</p>
        <p>• 아래: 무의식과 감정</p>
        <p>• 좌우: 과거와 미래, 주변 상황</p>
        <p>• 대각선: 간접적 영향</p>
        <p class="tip">💡 팁: 가장 가까운 카드가 가장 강한 영향을 줍니다.</p>
      `
    },
    'cross': {
      title: '십자가 기법',
      content: `
        <p><strong>📌 읽는 방법:</strong></p>
        <p>• 위: 목표, 의식, 생각</p>
        <p>• 아래: 기반, 무의식, 과거</p>
        <p>• 왼쪽: 떠나가는 것, 과거</p>
        <p>• 오른쪽: 다가오는 것, 미래</p>
        <p class="tip">💡 팁: 상하좌우 4장만으로 핵심을 빠르게 파악할 수 있습니다.</p>
      `
    },
    'house': {
      title: '하우스 해석',
      content: `
        <p><strong>📌 읽는 방법:</strong></p>
        <p>• 각 카드가 놓인 하우스 번호의 의미를 함께 읽습니다.</p>
        <p>• 예: 24번(Heart) 카드가 10번 하우스(Scythe)에 있다면</p>
        <p>  → 사랑(Heart)의 갑작스러운 결단(Scythe)</p>
        <p>• 카드의 본래 의미 + 하우스의 의미 = 복합 해석</p>
        <p class="tip">💡 팁: 하우스 이름을 켜서 함께 보면 더 쉽습니다.</p>
      `
    },
    'overall': {
      title: '전체 분위기 & 결론',
      content: `
        <p><strong>📌 읽는 방법:</strong></p>
        <p>• 긍정 카드와 부정 카드의 비율을 봅니다.</p>
        <p>• 특정 테마(사랑, 돈, 건강)의 카드가 집중된 곳을 찾습니다.</p>
        <p>• 강한 카드(Sun, Key, Cross 등)의 위치를 확인합니다.</p>
        <p>• 마지막 4장(33-36번)은 최종 결과를 나타냅니다.</p>
        <p class="tip">💡 팁: 전체를 보고 첫인상과 느낌을 신뢰하세요.</p>
      `
    }
  };
  
  const guide = guides[technique];
  if (guide) {
    const guideDiv = document.getElementById('technique-guide-display') || createGuideDisplay();
    guideDiv.innerHTML = `
      <h4>${guide.title}</h4>
      ${guide.content}
    `;
    guideDiv.classList.add('show');
  }
}

function createGuideDisplay() {
  const guideDiv = document.createElement('div');
  guideDiv.id = 'technique-guide-display';
  guideDiv.className = 'technique-guide-display';
  
  const readingSection = document.querySelector('.reading-section:nth-of-type(3)');
  readingSection.appendChild(guideDiv);
  
  return guideDiv;
}

aiInterpretBtn.onclick = async () => {
  if (!currentQuestion) {
    alert("먼저 질문을 저장해주세요.");
    return;
  }
  
  if (!currentSignificator) {
    alert("먼저 시그니피케이터를 찾아주세요.");
    return;
  }
  
  aiResult.classList.add("show");
  aiResult.innerHTML = '<p class="loading">🔮 AI가 카드를 해석하는 중...</p>';
  
  try {
    const interpretation = await generateAIInterpretation();
    displayInterpretation(interpretation);
  } catch (error) {
    aiResult.innerHTML = '<p style="color: #ff6b6b;">해석 생성에 실패했습니다. 다시 시도해주세요.</p>';
    console.error(error);
  }
};

async function generateAIInterpretation() {
  const tableauState = collectTableauState();
  
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: generatePrompt(tableauState)
        }
      ],
    })
  });
  
  const data = await response.json();
  return data.content[0].text;
}

function collectTableauState() {
  const state = {
    question: currentQuestion,
    significator: currentSignificator,
    firstLine: [],
    allCards: []
  };
  
  for (let i = 0; i < 8; i++) {
    const el = cardElements[i];
    state.firstLine.push({
      house: el.house,
      card: cardMeanings[el.cardId]
    });
  }
  
  cardElements.forEach(el => {
    state.allCards.push({
      house: el.house,
      cardId: el.cardId,
      card: cardMeanings[el.cardId]
    });
  });
  
  return state;
}

function generatePrompt(state) {
  const sigCard = cardElements.find(el => el.house === state.significator.house);
  const sigRow = Math.ceil(state.significator.house / 8);
  const sigCol = ((state.significator.house - 1) % 8) + 1;
  
  const surroundingCards = cardElements.filter(el => {
    const row = Math.ceil(el.house / 8);
    const col = ((el.house - 1) % 8) + 1;
    return Math.abs(row - sigRow) <= 1 && Math.abs(col - sigCol) <= 1 && el.house !== state.significator.house;
  }).map(el => `${cardMeanings[el.cardId].name} (${el.house}번)`).join(', ');

  return `당신은 레노먼드 카드 전문가입니다. 다음 그랑타블로 리딩을 해석해주세요.

질문: ${state.question}

시그니피케이터: ${state.significator.name} (${state.significator.house}번 하우스 - ${sigRow}행 ${sigCol}열)

첫 줄 카드 (1-8번 하우스):
${state.firstLine.map((c, i) => `${i + 1}. ${c.card.name} - ${c.card.keywords}`).join('\n')}

시그니피케이터 주변 카드: ${surroundingCards}

다음 형식으로 해석해주세요:

**1. 첫 줄 요약 (1·2·3 하우스 중심)**
전체적인 상황의 흐름을 간단히 요약해주세요.

**2. 시그니피케이터 위치 분석**
${state.significator.name}이 ${state.significator.house}번 하우스(${sigRow}행 ${sigCol}열)에 위치한 것이 의미하는 바를 설명해주세요.

**3. 주변 카드 해석**
시그니피케이터 주변의 카드들이 말하는 것을 해석해주세요.

**4. 결론 및 조언**
질문에 대한 명확한 답변과 실천 가능한 조언을 제시해주세요.

각 섹션을 명확하고 이해하기 쉽게 작성해주세요. 한국어로 답변해주세요.`;
}

function displayInterpretation(text) {
  const sections = text.split(/\n\n+/);
  let html = '';
  
  sections.forEach(section => {
    if (section.includes('**')) {
      section = section.replace(/\*\*(.*?)\*\*/g, '<h5>$1</h5>');
    }
    html += `<p>${section}</p>`;
  });
  
  aiResult.innerHTML = html;
}
