const drawButton = document.getElementById("draw-oracle");
const houseDiv = document.getElementById("house-card");
const spellDiv = document.getElementById("spell-card");
const message = document.getElementById("oracle-message");

function drawRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

drawButton.addEventListener("click", () => {
  const house = drawRandom(houses);
  const spell = drawRandom(spells);

  houseDiv.innerHTML = `
    <img src="${house.image}">
    <p>${house.name}</p>
  `;

  spellDiv.innerHTML = `
    <img src="${spell.image}">
    <p>${spell.name}</p>
  `;

  message.textContent =
    `${house.name} 학생이라면, ` +
    `${spell.name}(${spell.meaning}) 주문을 ` +
    `${house.style} 방식으로 사용해보세요.`;
});
