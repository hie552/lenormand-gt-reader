const tableau = document.getElementById("tableau");

lenormandCards.forEach((card, index) => {
  const cardDiv = document.createElement("div");
  cardDiv.className = "card";
  cardDiv.dataset.cardNumber = card.id;
  cardDiv.dataset.houseNumber = index + 1;

  const img = document.createElement("img");
  img.src = card.image;

  const label = document.createElement("div");
  label.className = "card-label";
  label.innerHTML = `
    <span class="card-num">${card.id}</span>
    <span class="house-num">${index + 1}</span>
  `;

  cardDiv.appendChild(img);
  cardDiv.appendChild(label);

  // 클릭 → 선택 토글
  cardDiv.addEventListener("click", () => {
    cardDiv.classList.toggle("selected");
  });

  // 마지막 4장 위치 조정
  if (card.id >= 33) {
    cardDiv.classList.add("final-card");
  }

  tableau.appendChild(cardDiv);
});
