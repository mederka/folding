document.addEventListener("DOMContentLoaded", function () {
  loadAllNGL();
});

function loadNGL(id) {
  let div = document.getElementById(id);
  let stage = new NGL.Stage(id);
  if (div.className.indexOf('spin') != -1) stage.setSpin(true);
  stage.setParameters({
    backgroundColor: "white"
  });
  stage.loadFile(`rcsb://${id}`, {defaultRepresentation: true});
}

function loadAllNGL() {
  const ngl = document.getElementsByClassName('ngl');
  if (ngl.length) {
    let id = ngl[0].id;
    loadNGL(id);
  }
}

function openViewer(id) {
  let modal = document.getElementById('viewer-modal');
  modal.style.display = 'block';
  let viewer = document.getElementById('ngl-viewer');
  let stage = document.createElement('div');
  stage.className = 'ngl ngl-big';
  stage.id = id;
  viewer.appendChild(stage);
  loadNGL(id);
}

function closeViewer() {
  let modal = document.getElementById('viewer-modal');
  let viewer = document.getElementById('ngl-viewer');
  viewer.innerHTML = '';
  modal.style.display = 'none';
}

