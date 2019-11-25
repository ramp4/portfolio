/* eslint-disable prefer-destructuring */
/* eslint-disable no-loop-func */
/* eslint-disable no-plusplus */

const example = document.querySelector('.canvas_element');

const ctx = example.getContext('2d');
example.width = 512;
example.height = 512;

if (localStorage.isSaved) {
  const dataURL = localStorage.getItem('saved');
  const img = new Image();
  img.src = dataURL;
  img.onload = function saver() {
    ctx.drawImage(img, 0, 0, 512, 512);
  };
} else {
  ctx.scale(4, 4);
  let fillStatus = true;
  for (let i = 0; i < 128; i += 1) {
    for (let j = 0; j < 128; j += 1) {
      if (fillStatus) {
        ctx.fillStyle = '#4c4c4c';
        fillStatus = false;
      } else {
        ctx.fillStyle = '#555555';
        fillStatus = true;
      }
      ctx.fillRect(i, j, 1, 1);
    }
    fillStatus = !fillStatus;
  }
  ctx.scale(1 / 4, 1 / 4);
}

const ToolsArray = document.getElementsByClassName('tools--item');

let CurrentTool = ToolsArray[2];
localStorage.SavedCurrentTool = 2;

for (let i = 0; i < 4; i++) {
  ToolsArray[i].addEventListener('click', (event) => {
    CurrentTool.classList.remove('tools--item-selected');
    CurrentTool = ToolsArray[i];
    localStorage.setItem('SavedCurrentTool', i);
    event.target.classList.add('tools--item-selected');
  });
}

document.addEventListener('keydown', (event) => {
  if (event.code === 'KeyP') {
    CurrentTool.classList.remove('tools--item-selected');
    CurrentTool = ToolsArray[2];
    ToolsArray[2].classList.add('tools--item-selected');
    localStorage.setItem('SavedCurrentTool', 2);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'KeyB') {
    CurrentTool.classList.remove('tools--item-selected');
    CurrentTool = ToolsArray[0];
    ToolsArray[0].classList.add('tools--item-selected');
    localStorage.setItem('SavedCurrentTool', 2);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'KeyC') {
    CurrentTool.classList.remove('tools--item-selected');
    CurrentTool = ToolsArray[1];
    ToolsArray[1].classList.add('tools--item-selected');
    localStorage.setItem('SavedCurrentTool', 2);
  }
});

let pixel = ctx.getImageData(1, 1, 1, 1);

function pos(event) {
  pixel = ctx.getImageData(event.offsetX, event.offsetY, 1, 1);
}

example.addEventListener('mousemove', pos);

const CurrentColor = document.querySelector('.colors--item_1 > .color');
const PreviousColor = document.querySelector('.colors--item_2 > .color');
const RedColor = document.querySelector('.colors--item_3 > .color');
RedColor.style.background = '#F74141';
const BlueColor = document.querySelector('.colors--item_4 > .color');
BlueColor.style.background = '#00BCD4';

if (!localStorage.isSaved) {
  CurrentColor.style.background = '#FFC107';
  PreviousColor.style.background = '#FFEB3B';
} else {
  CurrentColor.style.background = localStorage.getItem('SavedCurrentColor');
  PreviousColor.style.background = localStorage.getItem('SavedPreviousColor');
  CurrentTool.classList.remove('tools--item-selected');
  CurrentTool = ToolsArray[localStorage.getItem('SavedCurrentTool')];
  CurrentTool.classList.add('tools--item-selected');
}
function ChooseColor() {
  if (CurrentTool === ToolsArray[1]) {
    const { data } = pixel;
    let rgba;
    if (data[3] / 255 !== 1) {
      rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
    } else {
      rgba = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    }
    if (rgba !== CurrentColor.style.background) {
      PreviousColor.style.background = CurrentColor.style.background;
      CurrentColor.style.background = rgba;
    }
  }
}

function ChooseDefaultColors(event) {
  if (CurrentTool === ToolsArray[1]) {
    if (CurrentColor.style.background !== event.target.style.background) {
      PreviousColor.style.background = CurrentColor.style.background;
      CurrentColor.style.background = event.target.style.background;
    }
  }
}

RedColor.addEventListener('click', ChooseDefaultColors);
BlueColor.addEventListener('click', ChooseDefaultColors);

example.addEventListener('click', ChooseColor);

function Draw(event) {
  ctx.fillStyle = CurrentColor.style.background;
  ctx.fillRect(event.offsetX, event.offsetY, 4, 4);
}
function Pencil() {
  if (CurrentTool === ToolsArray[2]) {
    example.addEventListener('mousemove', Draw);
    document.addEventListener('mouseup', () => {
      example.removeEventListener('mousemove', Draw);
    });
  }
}

example.addEventListener('mousedown', Pencil);

function PixelIsSame(q, w) {
  for (let i = 0; i < 4; i++) {
    if (q[i] !== w[i]) {
      return false;
    }
  }
  return true;
}

function FillBucket1(x, y) {
  const startPixel = ctx.getImageData(x, y, 4, 4).data;

  if (x >= 0 && x <= 512 && y >= 0 && y <= 512) {
    const a = ctx.getImageData(x, y + 1, 1, 1).data;
    const b = ctx.getImageData(x + 1, y, 1, 1).data;
    // const c = ctx.getImageData(x - 1, y, 1, 1).data;
    // const d = ctx.getImageData(x, y - 1, 1, 1).data;

    if (PixelIsSame(a, startPixel)) FillBucket1(x, y + 1);
    if (PixelIsSame(b, startPixel)) FillBucket1(x + 1, y);
    // if (PixelIsSame(c, startPixel)) FillBucket(x - 1, y);
    // if (PixelIsSame(d, startPixel)) FillBucket(x, y - 1);
    ctx.fillRect(x, y, 1, 1);
  }
}

function FillBucket2(x, y) {
  const startPixel = ctx.getImageData(x, y, 1, 1).data;

  if (x >= 0 && x <= 512 && y >= 0 && y <= 512) {
    // const a = ctx.getImageData(x, y + 1, 1, 1).data;
    // const b = ctx.getImageData(x + 1, y, 1, 1).data;
    const c = ctx.getImageData(x - 1, y, 1, 1).data;
    const d = ctx.getImageData(x, y - 1, 1, 1).data;

    // if (PixelIsSame(a, startPixel)) FillBucket1(x, y + 1);
    // if (PixelIsSame(b, startPixel)) FillBucket1(x + 1, y);
    if (PixelIsSame(c, startPixel)) FillBucket2(x - 1, y);
    if (PixelIsSame(d, startPixel)) FillBucket2(x, y - 1);
    ctx.fillRect(x, y, 1, 1);
  }
}

function FillBucket3(x, y) {
  const startPixel = ctx.getImageData(x, y, 1, 1).data;

  if (x >= 0 && x <= 512 && y >= 0 && y <= 512) {
    // const a = ctx.getImageData(x, y + 1, 1, 1).data;
    const b = ctx.getImageData(x + 1, y, 1, 1).data;
    // const c = ctx.getImageData(x - 1, y, 1, 1).data;
    const d = ctx.getImageData(x, y - 1, 1, 1).data;

    // if (PixelIsSame(a, startPixel)) FillBucket1(x, y + 1);
    if (PixelIsSame(b, startPixel)) FillBucket1(x + 1, y);
    // if (PixelIsSame(c, startPixel)) FillBucket3(x - 1, y);
    if (PixelIsSame(d, startPixel)) FillBucket3(x, y - 1);
    ctx.fillRect(x, y, 1, 1);
  }
}

function FillBucket4(x, y) {
  const startPixel = ctx.getImageData(x, y, 1, 1).data;

  if (x >= 0 && x <= 512 && y >= 0 && y <= 512) {
    const a = ctx.getImageData(x, y + 1, 1, 1).data;
    // const b = ctx.getImageData(x + 1, y, 1, 1).data;
    const c = ctx.getImageData(x - 1, y, 1, 1).data;
    // const d = ctx.getImageData(x, y - 1, 1, 1).data;

    if (PixelIsSame(a, startPixel)) FillBucket4(x, y + 1);
    // if (PixelIsSame(b, startPixel)) FillBucket1(x + 1, y);
    if (PixelIsSame(c, startPixel)) FillBucket4(x - 1, y);
    // if (PixelIsSame(d, startPixel)) FillBucket3(x, y - 1);
    ctx.fillRect(x, y, 1, 1);
  }
}

example.addEventListener('click', (event) => {
  if (CurrentTool === ToolsArray[0]) {
    const checkPixel = ctx.getImageData(event.offsetX, event.offsetY, 1, 1);
    const data = checkPixel.data;
    let rgba;
    if (data[3] / 255 !== 1) {
      rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
    } else {
      rgba = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    }
    if (rgba !== CurrentColor.style.background) {
      ctx.fillStyle = CurrentColor.style.background;
      FillBucket1(event.offsetX, event.offsetY);
      FillBucket2(event.offsetX - 1, event.offsetY - 1);
      FillBucket3(event.offsetX, event.offsetY - 1);
      FillBucket4(event.offsetX - 1, event.offsetY);
    }
  }
});

document.addEventListener('click', () => {
  localStorage.setItem('saved', example.toDataURL());
  localStorage.isSaved = true;
  localStorage.setItem('SavedCurrentColor', CurrentColor.style.background);
  localStorage.setItem('SavedPreviousColor', PreviousColor.style.background);
});

const picture = new Image();
const searchInput = document.querySelector('.search_input');

async function drawNewCanvas() {
  const url = `https://api.unsplash.com/photos/random?query=town,${searchInput.value}&client_id=fe6449c5e30a90a51b3f246ad14f20ddf1be8e78ee913d96cf0aeb65df9c8bd0`;
  const response = await fetch(url);
  const data = await response.json();
  picture.src = data.urls.small;
  picture.crossOrigin = "Anonymous";

  picture.onload = function () {
    ctx.drawImage(picture, 0, 0, 512, 512);
    localStorage.setItem('saved', example.toDataURL("image/png"));
  };
}

const loadButton = document.querySelector('.image_loader_form--load');

loadButton.addEventListener('click', () => {
  drawNewCanvas();
});




