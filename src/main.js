import { initSnake, moveSnake, drawSnake } from "./snake.js";
import { generateFood, drawFood } from "./food.js";
import { handleDirectionChange } from "./controls.js";
import { checkCollision, checkWallCollision } from "./collision.js";
import { drawScore } from "./score.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const gameSpeed = 200;

let snake;
let food;
let direction = "RIGHT";
let score = 0;
let gameInterval; // Identifiant de l'intervalle du jeu

let isPaused = false;
let isGameOver = false;
let startTime = 0;
let timeElapsed = 0;
let pauseStart = null;

// Gestion des touches
document.addEventListener("keydown", (event) => {
  // Relance le jeu si perdu
  if (isGameOver) {
    startGame();
    return;
  }

  // Pause / Reprise avec espace
  if (event.code === "Space") {
    if (!isPaused) {
      isPaused = true;
      pauseStart = Date.now();
    } else {
      isPaused = false;
      if (pauseStart) {
        const pausedDuration = Date.now() - pauseStart;
        startTime += pausedDuration; // Décale le timer pour ignorer le temps de pause
        pauseStart = null;
      }
    }
    return; // on ne change pas la direction quand on appuie sur espace
  }

  // Changement de direction
  direction = handleDirectionChange(event, direction);
});

function startGame() {
  // Stoppe un éventuel ancien intervalle
  if (gameInterval) clearInterval(gameInterval);

  // Initialisation du jeu
  snake = initSnake();
  food = generateFood(box, canvas);
  direction = "RIGHT";
  score = 0;

  // Initialisation du chrono
  startTime = Date.now();
  timeElapsed = 0;
  pauseStart = null;

  isPaused = false;
  isGameOver = false;

  // Démarre la boucle principale
  gameInterval = setInterval(draw, gameSpeed);
}

function draw() {
  // Mise à jour du chrono uniquement si le jeu tourne
  if (!isPaused && !isGameOver) {
    timeElapsed = Math.floor((Date.now() - startTime) / 1000);
  }

  // Logique principale du jeu
  if (!isPaused && !isGameOver) {
    // Nettoie le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const result = moveSnake(snake, direction, box, food);
    snake = result.snake;

    // Dessin du serpent et de la nourriture
    drawFood(ctx, food, box);
    drawSnake(ctx, snake, box);

    const head = snake[0];
    const body = snake.slice(1);

    // Gestion des collisions
    if (checkWallCollision(head, canvas, box) || checkCollision(head, body)) {
      clearInterval(gameInterval);
      isGameOver = true;

      // Affichage du message de fin
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "red";
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Vous avez perdu!", canvas.width / 2, canvas.height / 2 - 10);
      ctx.font = "20px Arial";
      ctx.fillStyle = "white";
      ctx.fillText("Appuyez sur une touche pour recommencer", canvas.width / 2, canvas.height / 2 + 40);
      return;
    }

    // Si le serpent mange
    if (result.ateFood) {
      food = generateFood(box, canvas);
      score += 10;
    }

    // Dessin du score
    drawScore(ctx, score);
  }

  // Affichage Pause
  if (isPaused) {

    // Texte de pause centré
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("PAUSE", canvas.width / 2, canvas.height / 2);
  }

  // Affichage du chrono (fixe en haut à droite)
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText(`Temps : ${timeElapsed}s`, canvas.width - 10, 10);
}

startGame();
