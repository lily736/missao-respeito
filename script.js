
function move(direction) {
  const step = 20;
  const player = document.getElementById("player");
  const board = document.getElementById("game-board");
  const maxWidth = board.offsetWidth - player.offsetWidth;
  const maxHeight = board.offsetHeight - player.offsetHeight;

  let top = parseInt(player.style.top || "0");
  let left = parseInt(player.style.left || "0");

  if (direction === "up" && top > 0) top -= step;
  if (direction === "down" && top < maxHeight) top += step;
  if (direction === "left" && left > 0) left -= step;
  if (direction === "right" && left < maxWidth) left += step;

  player.style.top = top + "px";
  player.style.left = left + "px";

  checkCollision();
}

function checkCollision() {
  const player = document.getElementById("player");
  const items = document.querySelectorAll(".item");
  const playerRect = player.getBoundingClientRect();

  items.forEach(item => {
    const itemRect = item.getBoundingClientRect();
    if (
      playerRect.left < itemRect.right &&
      playerRect.right > itemRect.left &&
      playerRect.top < itemRect.bottom &&
      playerRect.bottom > itemRect.top
    ) {
      showQuestion(item);
    }
  });
}

function showQuestion(item) {
  const questionBox = document.getElementById("question-box");
  const questionText = document.getElementById("question-text");
  const optionsBox = document.getElementById("options");

  const question = item.getAttribute("data-question");
  const options = item.getAttribute("data-options").split(",");
  const answerIndex = parseInt(item.getAttribute("data-answer"));

  questionText.textContent = question;
  optionsBox.innerHTML = "";

  options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => {
      if (index === answerIndex) {
        document.getElementById("correct-sound").play();
        const score = document.getElementById("score");
        score.textContent = parseInt(score.textContent) + 1;
        showMedal();
        item.style.display = "none";
      } else {
        document.getElementById("wrong-sound").play();
      }
      questionBox.classList.add("hidden");
    };
    optionsBox.appendChild(btn);
  });

  questionBox.classList.remove("hidden");
}

function showMedal() {
  const medalBox = document.getElementById("medal-box");
  const medalImage = document.getElementById("medal-image");
  medalImage.src = "https://cdn-icons-png.flaticon.com/512/2583/2583347.png";
  document.getElementById("medal-message").textContent = "Parabéns! Você ganhou uma medalha de respeito!";
  medalBox.classList.remove("hidden");
  setTimeout(() => medalBox.classList.add("hidden"), 2000);
}

// Controle por toque (celular)
let touchStartX = 0, touchStartY = 0;
document.addEventListener("touchstart", function(e) {
  const touch = e.changedTouches[0];
  touchStartX = touch.screenX;
  touchStartY = touch.screenY;
}, false);

document.addEventListener("touchend", function(e) {
  const touch = e.changedTouches[0];
  const deltaX = touch.screenX - touchStartX;
  const deltaY = touch.screenY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 30) move("right");
    else if (deltaX < -30) move("left");
  } else {
    if (deltaY > 30) move("down");
    else if (deltaY < -30) move("up");
  }
}, false);
