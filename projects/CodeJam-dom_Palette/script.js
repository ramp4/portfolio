/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */
/* eslint linebreak-style: ["error", "windows"] */
/* eslint-env browser */

const tools = document.querySelectorAll('div.tools>button');
const state = {};

function toolChooser(event) {
  if (state.curTool) state.curTool.style.border = '';
  state.curTool = event.path[1];
  state.curTool.style.border = '#ccc solid 1px';
}
for (let i = 0; i < 4; i++) {
  tools[i].addEventListener('click', toolChooser);
}

const colors = document.querySelectorAll('div.color-circle');
colors[0].style.backgroundColor = '#C4C4C4';
colors[1].style.backgroundColor = '#41F795';
colors[2].style.backgroundColor = '#F74141';
colors[3].style.backgroundColor = '#41B6F7';
state.curColor = '#C4C4C4';
state.prevColor = '#41F795';

const figures = document.querySelectorAll('section.figures>div.figure');

figures[0].style.backgroundColor = '#cccccc';
figures[1].style.backgroundColor = '#bdbdbd';
figures[2].style.backgroundColor = '#bfbfbf';
figures[3].style.backgroundColor = '#bababa';
figures[4].style.backgroundColor = '#cfcfcf';
figures[5].style.backgroundColor = '#c9c9c9';
figures[6].style.backgroundColor = '#c7c7c7';
figures[7].style.backgroundColor = '#c4c4c4';
figures[8].style.backgroundColor = '#cccccc';
figures[6].style.borderRadius = '50%';
state.curTool = tools[0];
state.curTool.style.border = '#ccc solid 1px';
function chooseColor(event) {
  if (state.curTool.innerText === 'Choose color') {
    if (state.curColor !== event.target.style.backgroundColor) {
      state.prevColor = state.curColor;
      state.curColor = event.target.style.backgroundColor;
      colors[0].style.backgroundColor = state.curColor;
      colors[1].style.backgroundColor = state.prevColor;
    }
  }
}

for (let i = 0; i < 4; i++) {
  colors[i].addEventListener('click', chooseColor);
}

function paintBucket() {
  if (state.curTool.innerText === 'Paint bucket') {
    state.curFigure.style.backgroundColor = state.curColor;
  }
}
function transform() {
  if (state.curTool.innerText === 'Transform') {
    state.curFigure.style.borderRadius = `${Math.random() * 50}%`;
  }
}
function move(event) {
  if (state.curTool.innerText === 'Move') {
    item = event.target;
    function getCoords(elem) {
      let box = elem.getBoundingClientRect();
      return {
        top: box.top + window.pageYOffset,
        left: box.left + window.pageXOffset,
      };
    }

    item.onmousedown = function coords(e) {
      item.coords = getCoords(item);
      item.shiftX = e.pageX - item.coords.left;
      item.shiftY = e.pageY - item.coords.top;

      item.style.position = 'absolute';
      document.querySelector('main').appendChild(item);

      function moveAt(e) {
        item.style.margin = '0';
        item.style.left = `${e.pageX - item.shiftX}px`;
        item.style.top = `${e.pageY - item.shiftY}px`;
      }
      moveAt(e);

      item.style.zIndex = 1000;

      document.onmousemove = function onmousemove(e) {
        moveAt(e);
      };

      item.onmouseup = function onmouseup() {
        document.onmousemove = null;
        item.onmouseup = null;
        item.onmousedown = null;
      };
    };
  }
}

function figureChanger(event) {
  state.curFigure = event.target;
  paintBucket();
  transform();
}

for (let i = 0; i < 9; i++) {
  figures[i].addEventListener('click', figureChanger);
  figures[i].addEventListener('click', chooseColor);
  figures[i].addEventListener('mouseover', move);
}

function keyboardInput(event) {
  if (state.curTool) state.curTool.style.border = '';
  switch (event.code) {
    case 'KeyP':
      state.curTool = tools[0];
      state.curTool.style.border = '#ccc solid 1px';
      break;
    case 'KeyC':
      state.curTool = tools[1];
      state.curTool.style.border = '#ccc solid 1px';
      break;
    case 'KeyM':
      state.curTool = tools[2];
      state.curTool.style.border = '#ccc solid 1px';
      break;
    case 'KeyT':
      state.curTool = tools[3];
      state.curTool.style.border = '#ccc solid 1px';
      break;
  }
}
document.addEventListener('keypress', keyboardInput);
