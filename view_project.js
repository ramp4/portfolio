let project = document.querySelector('.project');

let projectSrc = window.sessionStorage.getItem('savedLink');

project.src = projectSrc;

let viewType = document.querySelector('.view_type');

viewType.addEventListener('click', function() {
  if (this.innerHTML === 'Desktop') {
    project.style.width = '640px';
    this.innerHTML = 'Mobile';
  } else {
    project.style.width = '100vw';
    this.innerHTML = 'Desktop';
  }
});
