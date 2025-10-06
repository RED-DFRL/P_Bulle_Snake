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
let gameInterval; // Variable pour stocker l'identifiant de l'intervalle

document.addEventListener("keydown", (event) => {
  direction = handleDirectionChange(event, direction);
});

function startGame() {
  snake = initSnake();
  food = generateFood(box, canvas);
  direction = "RIGHT";
  score = 0;
  clearInterval(gameInterval) //stoppe un potentiel ancient intervalle de jeux
  gameInterval = setInterval(draw, gameSpeed); // Stockage de l'identifiant de l'intervalle
}

function draw() {
  //Reset du canvas avant de le redessiner
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  //Initialisation du deplacment du serpent
  snake = moveSnake(snake, direction, box);
  //Initialisation des collisions
  const head = snake[0];
  const body = snake.slice(1);

  if (checkWallCollision(head, canvas, box) || checkCollision(head, body)){
    clearInterval(gameInterval);
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Vous avez perdu!", canvas.width/ 4, canvas.height / 2);
    return;
  }
  
  //Dessin du serpent, Nourriture et score
  drawFood(ctx, food, box)
  drawSnake(ctx, snake, box);
  drawScore(ctx, score)
}

startGame();
