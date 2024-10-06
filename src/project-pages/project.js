///////////////////////////////
// Big Imports
///////////////////////////////

import './checkers.html';
import './chess.html';
import './chopsticks.html';
import './connect-four.html';
import './HSCD.html';
import './snake.html';

import './style.css'

///////////////////////////////
// Fix Image
///////////////////////////////

let img = document.getElementById("project-img");
let div = document.getElementById("project-overlay");

div.style.height = img.offsetHeight + "px";