// js/oracle.js

const oracleBtn = document.getElementById("oracle-btn");
const modal = document.getElementById("oracle-modal");
const closeBtn = document.querySelector(".close");
const drawButton = document.getElementById("draw-oracle");
const houseImg = document.getElementById("house-img");
const houseName = document.getElementById("house-name");
const spellImg = document.getElementById("spell-img");
const spellName = document.getElementById("spell-name");
const message = document.getElementById("oracle-message");

// 랜덤 선택 함수
function drawRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 조합별 조언 생성
function generateAdvice(house, spell) {
  const adviceMap = {
    // Accio (끌어당긴다)
    "Gryffindor-Accio": "용기 있게 필요한 것을 요청하고, 적극적으로 기회를 끌어당기세요.",
    "Hufflepuff-Accio": "꾸준히 노력하며 필요한 자원과 도움을 차근차근 모아가세요.",
    "Ravenclaw-Accio": "지식과 정보를 모으고, 현명하게 필요한 것을 선별해 끌어당기세요.",
    "Slytherin-Accio": "전략적으로 필요한 관계와 자원을 확보하고 활용하세요.",
    
    // Alohomora (열어준다)
    "Gryffindor-Alohomora": "열린 마음을 가지고 활발하게 움직여 타인의 마음을 열어보세요.",
    "Hufflepuff-Alohomora": "학생이 조금 느리더라도 참을성 있게 답변을 기다려주세요.",
    "Ravenclaw-Alohomora": "새로운 관점으로 문제를 바라보고, 논리적으로 해결책을 찾아보세요.",
    "Slytherin-Alohomora": "닫혀있던 기회의 문을 영리하게 열고, 유리한 상황을 만드세요.",
    
    // Diffindo (분리한다)
    "Gryffindor-Diffindo": "과감하게 불필요한 것을 잘라내고 새로운 길로 나아가세요.",
    "Hufflepuff-Diffindo": "성실하게 문제의 원인을 파악하고, 건강하게 경계를 설정하세요.",
    "Ravenclaw-Diffindo": "명확하게 우선순위를 구분하고, 복잡한 문제를 단계별로 나누세요.",
    "Slytherin-Diffindo": "불필요한 관계나 상황에서 깔끔하게 빠져나올 때입니다.",
    
    // Expecto Patronum (지켜낸다)
    "Gryffindor-Expecto Patronum": "용기를 내어 자신과 타인을 보호하고, 두려움에 맞서세요.",
    "Hufflepuff-Expecto Patronum": "꾸준한 돌봄으로 소중한 것들을 지키고 유지하세요.",
    "Ravenclaw-Expecto Patronum": "지혜롭게 대비하고, 긍정적인 생각으로 어려움을 극복하세요.",
    "Slytherin-Expecto Patronum": "전략적으로 당신의 이익과 입지를 방어하세요.",
    
    // Obliviate (잊게 한다)
    "Gryffindor-Obliviate": "과거에 얽매이지 말고, 용감하게 새로운 시작을 하세요.",
    "Hufflepuff-Obliviate": "과거의 실수를 용서하고, 인내심을 가지고 다시 시작하세요.",
    "Ravenclaw-Obliviate": "불필요한 걱정은 내려놓고, 현재에 집중하며 배우세요.",
    "Slytherin-Obliviate": "과거의 실패는 잊고, 현명하게 다음 기회를 준비하세요.",
    
    // Reparo (복구한다)
    "Gryffindor-Reparo": "적극적으로 문제를 해결하고, 손상된 관계를 회복하세요.",
    "Hufflepuff-Reparo": "실수가 있었다면 어떤 식으로 해결하고 다음에는 어떻게 미리 대처할지 생각해보세요.",
    "Ravenclaw-Reparo": "체계적으로 원인을 분석하고, 논리적인 해결 방법을 찾으세요.",
    "Slytherin-Reparo": "상황을 냉정하게 평가하고, 당신에게 유리하게 복구하세요.",
    
    // Riddikulus (가볍게 만든다)
    "Gryffindor-Riddikulus": "두려움을 웃음으로 바꾸고, 대담하게 도전하세요.",
    "Hufflepuff-Riddikulus": "편안한 마음으로 어려운 상황을 가볍게 받아들이세요.",
    "Ravenclaw-Riddikulus": "유머와 지혜로 복잡한 문제를 단순하게 만드세요.",
    "Slytherin-Riddikulus": "영리하게 상황을 전환하고, 위기를 기회로 만드세요.",
    
    // Wingardium Leviosa (들어 올린다)
    "Gryffindor-Wingardium Leviosa": "높은 목표를 향해 과감하게 도약하고 도전하세요.",
    "Hufflepuff-Wingardium Leviosa": "꾸준한 노력으로 조금씩 상황을 개선해 나가세요.",
    "Ravenclaw-Wingardium Leviosa": "새로운 관점으로 문제를 바라보고, 차원을 높여 사고하세요.",
    "Slytherin-Wingardium Leviosa": "자신의 위치를 전략적으로 향상시키고, 영향력을 키우세요."
  };

  const key = `${house.name}-${spell.name}`;
  return adviceMap[key] || `${house.name} 학생의 ${house.style}으로 ${spell.name}(${spell.meaning}) 주문을 사용해보세요.`;
}

// 모달 열기
oracleBtn.onclick = () => {
  modal.style.display = "block";
  message.textContent = "조언 뽑기 버튼을 눌러주세요.";
  houseImg.src = "";
  spellImg.src = "";
  houseName.textContent = "";
  spellName.textContent = "";
};

// 모달 닫기
closeBtn.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// 카드 뽑기
drawButton.addEventListener("click", () => {
  const house = drawRandom(houses);
  const spell = drawRandom(spells);

  houseImg.src = house.image;
  houseName.textContent = house.name;
  
  spellImg.src = spell.image;
  spellName.textContent = `${spell.name} (${spell.meaning})`;

  message.textContent = generateAdvice(house, spell);
});
