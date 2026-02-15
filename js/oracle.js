const oracleBtn = document.getElementById("oracle-btn");
const oracleModal = document.getElementById("oracle-modal");
const oracleClose = document.getElementById("oracle-close");
const drawButton = document.getElementById("draw-oracle");
const saveOracleBtn = document.getElementById("save-oracle");
const houseCard = document.getElementById("house-card");
const spellCard = document.getElementById("spell-card");
const houseImg = document.getElementById("house-img");
const houseName = document.getElementById("house-name");
const spellImg = document.getElementById("spell-img");
const spellName = document.getElementById("spell-name");
const message = document.getElementById("oracle-message");
const oracleContainer = document.getElementById("oracle-container");

function drawRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateAdvice(house, spell) {
  const adviceMap = {
    "Gryffindor-Accio": "용기 있게 필요한 것을 요청하고, 적극적으로 기회를 끌어당기세요.",
    "Hufflepuff-Accio": "꾸준히 노력하며 필요한 자원과 도움을 차근차근 모아가세요.",
    "Ravenclaw-Accio": "지식과 정보를 모으고, 현명하게 필요한 것을 선별해 끌어당기세요.",
    "Slytherin-Accio": "전략적으로 필요한 관계와 자원을 확보하고 활용하세요.",
    
    "Gryffindor-Alohomora": "열린 마음을 가지고 활발하게 움직여 타인의 마음을 열어보세요.",
    "Hufflepuff-Alohomora": "학생이 조금 느리더라도 참을성 있게 답변을 기다려주세요.",
    "Ravenclaw-Alohomora": "새로운 관점으로 문제를 바라보고, 논리적으로 해결책을 찾아보세요.",
    "Slytherin-Alohomora": "닫혀있던 기회의 문을 영리하게 열고, 유리한 상황을 만드세요.",
    
    "Gryffindor-Diffindo": "과감하게 불필요한 것을 잘라내고 새로운 길로 나아가세요.",
    "Hufflepuff-Diffindo": "성실하게 문제의 원인을 파악하고, 건강하게 경계를 설정하세요.",
    "Ravenclaw-Diffindo": "명확하게 우선순위를 구분하고, 복잡한 문제를 단계별로 나누세요.",
    "Slytherin-Diffindo": "불필요한 관계나 상황에서 깔끔하게 빠져나올 때입니다.",
    
    "Gryffindor-Expecto Patronum": "용기를 내어 자신과 타인을 보호하고, 두려움에 맞서세요.",
    "Hufflepuff-Expecto Patronum": "꾸준한 돌봄으로 소중한 것들을 지키고 유지하세요.",
    "Ravenclaw-Expecto Patronum": "지혜롭게 대비하고, 긍정적인 생각으로 어려움을 극복하세요.",
    "Slytherin-Expecto Patronum": "전략적으로 당신의 이익과 입지를 방어하세요.",
    
    "Gryffindor-Obliviate": "과거에 얽매이지 말고, 용감하게 새로운 시작을 하세요.",
    "Hufflepuff-Obliviate": "과거의 실수를 용서하고, 인내심을 가지고 다시 시작하세요.",
    "Ravenclaw-Obliviate": "불필요한 걱정은 내려놓고, 현재에 집중하며 배우세요.",
    "Slytherin-Obliviate": "과거의 실패는 잊고, 현명하게 다음 기회를 준비하세요.",
    
    "Gryffindor-Reparo": "적극적으로 문제를 해결하고, 손상된 관계를 회복하세요.",
    "Hufflepuff-Reparo": "실수가 있었다면 어떤 식으로 해결하고 다음에는 어떻게 미리 대처할지 생각해보세요.",
    "Ravenclaw-Reparo": "체계적으로 원인을 분석하고, 논리적인 해결 방법을 찾으세요.",
    "Slytherin-Reparo": "상황을 냉정하게 평가하고, 당신에게 유리하게 복구하세요.",
    
    "Gryffindor-Riddikulus": "두려움을 웃음으로 바꾸고, 대담하게 도전하세요.",
    "Hufflepuff-Riddikulus": "편안한 마음으로 어려운 상황을 가볍게 받아들이세요.",
    "Ravenclaw-Riddikulus": "유머와 지혜로 복잡한 문제를 단순하게 만드세요.",
    "Slytherin-Riddikulus": "영리하게 상황을 전환하고, 위기를 기회로 만드세요.",
    
    "Gryffindor-Wingardium Leviosa": "높은 목표를 향해 과감하게 도약하고 도전하세요.",
    "Hufflepuff-Wingardium Leviosa": "꾸준한 노력으로 조금씩 상황을 개선해 나가세요.",
    "Ravenclaw-Wingardium Leviosa": "새로운 관점으로 문제를 바라보고, 차원을 높여 사고하세요.",
    "Slytherin-Wingardium Leviosa": "자신의 위치를 전략적으로 향상시키고, 영향력을 키우세요."
  };

  const key = `${house.name}-${spell.name}`;
  return adviceMap[key] || `${house.name} 학생의 ${house.style}으로 ${spell.name}(${spell.meaning}) 주문을 사용해보세요.`;
}

oracleBtn.onclick = () => {
  oracleModal.style.display = "block";
  houseCard.classList.remove("revealed");
  spellCard.classList.remove("revealed");
  message.textContent = "조언 뽑기 버튼을 눌러주세요.";
  houseImg.src = "";
  spellImg.src = "";
  houseName.textContent = "";
  spellName.textContent = "";
};

oracleClose.onclick = () => {
  oracleModal.style.display = "none";
};

drawButton.addEventListener("click", async () => {
  houseCard.classList.remove("revealed");
  spellCard.classList.remove("revealed");
  message.textContent = "카드를 뽑는 중...";
  
  await new Promise(r => setTimeout(r, 300));
  
  const house = drawRandom(houses);
  const spell = drawRandom(spells);

  houseImg.src = house.image;
  spellImg.src = spell.image;
  
  await new Promise(r => setTimeout(r, 200));
  houseCard.classList.add("revealed");
  houseName.textContent = house.name;
  
  await new Promise(r => setTimeout(r, 400));
  spellCard.classList.add("revealed");
  spellName.textContent = spell.name;

  await new Promise(r => setTimeout(r, 400));
  message.textContent = generateAdvice(house, spell);
});

saveOracleBtn.onclick = async () => {
  try {
    const html2canvas = await import("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.esm.js");
    
    // 오라클 컨테이너를 감싸는 캡처용 컨테이너 생성
    const captureContainer = document.createElement('div');
    captureContainer.style.cssText = `
      position: relative;
      background-image: url('images/lenormand/background_0.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      padding: 40px 30px;
      display: inline-block;
      min-width: 500px;
    `;
    
    // 배경 오버레이 추가
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
    
    // 오라클 컨테이너 복제
    const oracleClone = oracleContainer.cloneNode(true);
    oracleClone.style.position = 'relative';
    oracleClone.style.zIndex = '1';
    
    captureContainer.appendChild(overlay);
    captureContainer.appendChild(oracleClone);
    
    // body에 임시로 추가 (화면 밖에)
    captureContainer.style.position = 'absolute';
    captureContainer.style.left = '-9999px';
    document.body.appendChild(captureContainer);
    
    // 스크린샷 캡처
    const canvas = await html2canvas.default(captureContainer, {
      backgroundColor: null,
      scale: 2,
      logging: false,
      useCORS: true
    });
    
    // 임시 컨테이너 제거
    document.body.removeChild(captureContainer);
    
    // 다운로드
    const link = document.createElement("a");
    link.download = `oracle_advice_${new Date().getTime()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  } catch (error) {
    console.error("오라클 저장 실패:", error);
    alert("저장에 실패했습니다. 다시 시도해주세요.");
  }
};
