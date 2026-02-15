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

readingBtn.onclick = () => {
  readingModal.style.display = "block";
};

readingClose.onclick = () => {
  readingModal.style.display = "none";
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

document.querySelectorAll(".technique-btn").forEach(btn => {
  btn.addEventListener("click", function() {
    document.querySelectorAll(".technique-btn").forEach(b => b.classList.remove("active"));
    this.classList.add("active");
    currentTechnique = this.dataset.technique;
  });
});

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
