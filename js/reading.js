// js/reading.js - 리딩 가이드 기능

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

// 모달 열기/닫기
readingBtn.onclick = () => {
  readingModal.style.display = "block";
};

readingClose.onclick = () => {
  readingModal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target == readingModal) {
    readingModal.style.display = "none";
  }
};

// 질문 저장
saveQuestionBtn.onclick = () => {
  currentQuestion = questionInput.value.trim();
  if (currentQuestion) {
    savedQuestion.textContent = `저장된 질문: "${currentQuestion}"`;
  } else {
    savedQuestion.textContent = "질문을 입력해주세요.";
  }
};

// 시그니피케이터 찾기
findSigBtn.onclick = () => {
  const selected = document.querySelector('input[name="significator"]:checked');
  
  if (!selected) {
    sigPosition.textContent = "시그니피케이터를 선택해주세요.";
    return;
  }
  
  if (selected.value === "custom") {
    sigPosition.textContent = "타블로에서 카드를 클릭하여 선택하세요.";
    // 커스텀 선택 모드 활성화
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
    
    // 하이라이트
    document.querySelectorAll(".card").forEach(c => c.classList.remove("significator"));
    cardEl.cardDiv.classList.add("significator");
    
    sigPosition.textContent = `${currentSignificator.name}이(가) ${currentSignificator.house}번 하우스에 있습니다.`;
  } else {
    sigPosition.textContent = "카드를 찾을 수 없습니다. 먼저 카드를 펼쳐주세요.";
  }
}

function enableCustomSignificatorMode() {
  alert("타블로에서 원하는 카드를 클릭해주세요.");
  
  // 일시적으로 카드 클릭 이벤트 변경
  document.querySelectorAll(".card").forEach(card => {
    card.style.cursor = "pointer";
    card.addEventListener("click", customSignificatorHandler, { once: true });
  });
}

function customSignificatorHandler(e) {
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
  
  sigPosition.textContent = `${currentSignificator.name}이(가) ${house}번 하우스에 있습니다.`;
  
  // 커서 복원
  document.querySelectorAll(".card").forEach(card => {
    card.style.cursor = "pointer";
  });
}

// 리딩 기법 선택
document.querySelectorAll(".technique-btn").forEach(btn => {
  btn.addEventListener("click", function() {
    document.querySelectorAll(".technique-btn").forEach(b => b.classList.remove("active"));
    this.classList.add("active");
    currentTechnique = this.dataset.technique;
  });
});

// AI 해석
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
  // 현재 타블로 상태 수집
  const tableauState = collectTableauState();
  
  // Claude API 호출
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
  
  // 첫 줄 (1-8번 하우스)
  for (let i = 0; i < 8; i++) {
    const el = cardElements[i];
    state.firstLine.push({
      house: el.house,
      card: cardMeanings[el.cardId]
    });
  }
  
  // 전체 카드
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
  let prompt = `당신은 레노먼드 카드 전문가입니다. 다음 그랑타블로 리딩을 해석해주세요.

질문: ${state.question}

시그니피케이터: ${state.significator.name} (${state.significator.house}번 하우스)

첫 줄 카드 (1-8번 하우스):
${state.firstLine.map((c, i) => `${i + 1}. ${c.card.name} - ${c.card.keywords}`).join('\n')}

다음 형식으로 해석해주세요:

1. **첫 줄 요약 (1·2·3 하우스)**
   - 전체적인 상황의 흐름을 요약

2. **시그니피케이터 위치 분석**
   - ${state.significator.name}의 위치가 의미하는 것

3. **주변 카드 해석**
   - 시그니피케이터 주변의 카드들이 말하는 것

4. **결론 및 조언**
   - 질문에 대한 명확한 답변과 조언

각 섹션을 명확하고 이해하기 쉽게 작성해주세요.`;

  return prompt;
}

function displayInterpretation(text) {
  // 텍스트를 파싱하여 보기 좋게 표시
  const sections = text.split(/\n\n+/);
  let html = '';
  
  sections.forEach(section => {
    if (section.includes('**')) {
      // 제목 처리
      section = section.replace(/\*\*(.*?)\*\*/g, '<h5>$1</h5>');
    }
    html += `<p>${section}</p>`;
  });
  
  aiResult.innerHTML = html;
}