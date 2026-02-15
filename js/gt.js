const tableau = document.getElementById("tableau");

lenormandCards.forEach(card => {
  const cardDiv = document.createElement("div");
  cardDiv.className = "card";

  const img = document.createElement("img");
  img.src = card.image;

  cardDiv.appendChild(img);

  // 마지막 4장에 위치 클래스 추가
  if (card.id >= 33) {
    cardDiv.classList.add("final-card");
  }

  tableau.appendChild(cardDiv);
});
