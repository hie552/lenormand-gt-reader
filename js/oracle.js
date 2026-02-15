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
    "Gryffindor-Accio": "필요한 것을 용기 있게 요청하고, 원하는 기회를 적극적으로 끌어당기세요.",
    "Hufflepuff-Accio": "꾸준한 노력으로 필요한 자원과 도움을 하나씩 모아가세요.",
    "Ravenclaw-Accio": "지식과 정보를 수집하고, 현명하게 선별하여 활용하세요.",
    "Slytherin-Accio": "전략적으로 필요한 관계와 자원을 확보하세요.",
    
    "Gryffindor-Alohomora": "열린 마음으로 새로운 가능성의 문을 두드려보세요.",
    "Hufflepuff-Alohomora": "시간이 걸리더라도 인내심을 갖고 기다리며 문제를 풀어가세요.",
    "Ravenclaw-Alohomora": "새로운 관점으로 상황을 바라보고 해결책을 찾아보세요.",
    "Slytherin-Alohomora": "막혀있던 상황을 현명하게 풀어나가세요.",
    
    "Gryffindor-Diffindo": "과감하게 불필요한 것을 정리하고 새로운 길로 나아가세요.",
    "Hufflepuff-Diffindo": "문제의 원인을 차분히 파악하고 건강한 경계를 설정하세요.",
    "Ravenclaw-Diffindo": "우선순위를 명확히 구분하고 문제를 단계별로 나누세요.",
    "Slytherin-Diffindo": "도움이 되지 않는 상황에서 깔끔하게 선을 그으세요.",
    
    "Gryffindor-Expecto Patronum": "두려움에 맞서고 소중한 것들을 지키세요.",
    "Hufflepuff-Expecto Patronum": "꾸준한 관심과 돌봄으로 중요한 것들을 유지하세요.",
    "Ravenclaw-Expecto Patronum": "지혜롭게 준비하고 긍정적인 마음으로 어려움을 극복하세요.",
    "Slytherin-Expecto Patronum": "당신의 이익과 입지를 전략적으로 방어하세요.",
    
    "Gryffindor-Obliviate": "과거에 얽매이지 말고 새로운 시작을 하세요.",
    "Hufflepuff-Obliviate": "지난 일을 용서하고 인내심을 가지고 다시 시작하세요.",
    "Ravenclaw-Obliviate": "불필요한 걱정은 내려놓고 현재에 집중하세요.",
    "Slytherin-Obliviate": "과거의 실수는 잊고 다음 기회를 준비하세요.",
    
    "Gryffindor-Reparo": "적극적으로 문제를 해결하고 관계를 회복하세요.",
    "Hufflepuff-Reparo": "실수를 인정하고 개선 방법을 차근차근 생각해보세요.",
    "Ravenclaw-Reparo": "원인을 분석하고 논리적인 해결 방법을 찾으세요.",
    "Slytherin-Reparo": "상황을 냉정하게 평가하고 유리하게 복구하세요.",
    
    "Gryffindor-Riddikulus": "두려움을 가볍게 여기고 대담하게 도전하세요.",
    "Hufflepuff-Riddikulus": "편안한 마음으로 어려운 상황을 받아들이세요.",
    "Ravenclaw-Riddikulus": "유머와 지혜로 복잡한 문제를 단순하게 만드세요.",
    "Slytherin-Riddikulus": "상황을 영리하게 전환하고 위기를 기회로 만드세요.",
    
    "Gryffindor-Wingardium Leviosa": "높은 목표를 향해 과감하게 도약하세요.",
    "Hufflepuff-Wingardium Leviosa": "꾸준한 노력으로 조금씩 상황을 개선해 나가세요.",
    "Ravenclaw-Wingardium Leviosa": "새로운 시각으로 문제를 바라보고 차원을 높여 생각하세요.",
    "Slytherin-Wingardium Leviosa": "당신의 위치를 전략적으로 향상시키세요."
  };

  const key = `${house.name}-${spell.name}`;
  return adviceMap[key] || `${house.name}의 ${house.style}으로 ${spell.name}(${spell.meaning}) 주문을 사용해보세요.`;
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
    
    // 복제된 요소들의 색상 조정 (더 진하게)
    const cloneCards = oracleClone.querySelectorAll('.oracle-card p');
    cloneCards.forEach(p => {
      p.style.color = '#B8860B';
      p.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.8)';
      p.style.fontWeight = 'bold';
    });
    
    const cloneMessage = oracleClone.querySelector('#oracle-message');
    if (cloneMessage) {
      cloneMessage.style.color = '#2a2a2a';
      cloneMessage.style.background = 'rgba(255, 255, 255, 0.9)';
      cloneMessage.style.border = '2px solid #B8860B';
      cloneMessage.style.fontWeight = '600';
      cloneMessage.style.fontSize = '1.1em';
    }
    
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
