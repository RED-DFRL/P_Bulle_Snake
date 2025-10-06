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
let isPaused = false //Variable pour la pause
let starTime = Date.now();
let timeElapsed = 0; //Secondes

//Initialisation du deplacment du serpent
document.addEventListener("keydown", (event) => {
  direction = handleDirectionChange(event, direction);
});

//Initialisation de la Pause
document.addEventListener("keydown", (event) => {{
    if (event.code === "Space"){
      isPaused = !isPaused; //Active la pause a la perrsion de la touche espace
      return;
    }
    direction = handleDirectionChange(event, direction);
  }})

  function startGame() {
    snake = initSnake();
    food = generateFood(box, canvas);
    direction = "RIGHT";
    score = 0;
    clearInterval(gameInterval) //stoppe un potentiel ancient intervalle de jeux
    gameInterval = setInterval(draw, gameSpeed); // Stockage de l'identifiant de l'intervalle
  }

  function draw() {
    //Si jeu terminé, aucune mise à jour
    if (typeof gameInterval === 'undefined') return;

    //Calcul du temps si le jeu pas en pause
    if (!isPaused) {
    timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    }
    
    if(!isPaused){
      //Reset du canvas avant de le redessiner
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      //Initialisation de la logique de manger de la nourriture
      const result = moveSnake(snake, direction, box, food);
      snake = result.snake;

      //Initialisation des collisions
      const head = snake[0];
      const body = snake.slice(1);

      if (checkWallCollision(head, canvas, box) || checkCollision(head, body)){
        clearInterval(gameInterval);
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "30px Arial";
        ctx.fillText("Vous avez perdu!", canvas.width/ 2, canvas.height / 2);
        return;
      }

      if(result.ateFood) {
        food = generateFood(box, canvas);
        score += 10;
      }
        
      //Dessin du serpent, Nourriture et score
      drawFood(ctx, food, box)
      drawSnake(ctx, snake, box);
      drawScore(ctx, score)
    }

  //Dessin de la Pause
  if(isPaused){
    ctx.fillStyle = "black";
    ctx.font = "40px Arial";
    ctx.textAlign = "center"
    ctx.fillText("PAUSE", canvas.width / 2, canvas.height / 2);
  }

  //Affichage du chrono en Haut à droite
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText(`Temps : ${timeElapsed}s`, canvas.width - 10, 10);
}

startGame();
