/**
 * Gère le changement de direction du serpent en fonction de l'entrée de l'utilisateur.
 *
 * Cette fonction est appelée chaque fois qu'une touche directionnelle est pressée.
 * Elle vérifie que la nouvelle direction n'est pas opposée à la direction actuelle
 * (pour éviter que le serpent se retourne sur lui-même) et retourne la nouvelle direction
 * si elle est valide.
 *
 * @param {KeyboardEvent} event - L'événement clavier qui contient les informations sur la touche pressée.
 * @param {string} currentDirection - La direction actuelle du serpent (peut être "UP", "DOWN", "LEFT", ou "RIGHT").
 * @returns {string} - La nouvelle direction du serpent après traitement, ou la direction actuelle si le changement n'est pas valide.
 */
function handleDirectionChange(event, currentDirection) {
  const key = event.key

  //Liste des opposés des touches de direction
  const reverse ={
    UP: "DOWN",
    DOWN: "UP",
    LEFT: "RIGHT",
    RIGHT: "LEFT"
  };

  //Liste des touches de direction
  const keyDirection = {
    arrowUp: "UP",
    arrowDown: "DOWN",
    arrowLeft: "LEFT",
    arrowRight: "RIGHT"
  };

  //Convertit la direction afin d'être comprehensible par le jeu
  const newDirection = keyDirection[key]

  //Si pas de changement de direction continue dans la même direction
  if(!newDirection){
    return currentDirection
  }
  //Si la direction choisie correspond a l'opposé continue dans la même direction pour eviter
  //que le serpent se rentre sur soi-même
  if(newDirection === reverse[currentDirection]){
    return currentDirection
  }

  //Si aucune exeption est detecté change la direction
  return currentDirection

}
export{handleDirectionChange}