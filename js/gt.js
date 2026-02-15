const tableau = document.getElementById("tableau");

lenormandCards.forEach(card => {
  const div = document.createElement("div");
  div.className = "card";

  const img = document.createElement("img");
  img.src = card.image;
  img.alt = card.name;

  div.appendChild(img);
  tableau.appendChild(div);
});
