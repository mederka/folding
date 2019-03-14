document.addEventListener("DOMContentLoaded", function () {
  loadAllNGL();
});

function loadNGL(id, rep) {
  let div = document.getElementById(id);
  let stage = new NGL.Stage(id);
  if (div.className.indexOf('spin') != -1) stage.setSpin(true);
  stage.setParameters({
    backgroundColor: "white"
  });
  stage.loadFile(`rcsb://${id}`).then(out => {
    out.addRepresentation(rep);
    out.autoView();
  });
}

function loadAllNGL() {
  const ngl = document.getElementsByClassName('ngl');
  if (ngl.length) {
    let id = ngl[0].id;
    loadNGL(id, 'cartoon');
  }
}

function openViewer(id) {
  document.getElementById('toggleRep').value = 'cartoon';
  let modal = document.getElementById('viewer-modal');
  modal.style.display = 'block';
  let viewer = document.getElementById('ngl-viewer');
  let stage = document.createElement('div');
  stage.className = 'ngl ngl-big';
  stage.id = id;
  viewer.appendChild(stage);
  loadNGL(id, 'cartoon');
}

function toggleRep() {
  const rep = document.getElementById('toggleRep').value;
  const viewer = document.getElementById('ngl-viewer');
  const id = document.getElementsByClassName('ngl')[0].id;
  viewer.removeChild(document.getElementById(id));
  let stage = document.createElement('div');
  stage.className = 'ngl ngl-big';
  stage.id = id;
  viewer.appendChild(stage);
  loadNGL(id, rep);
}

function closeViewer() {
  let modal = document.getElementById('viewer-modal');
  let viewer = document.getElementById('ngl-viewer');
  viewer.removeChild(document.getElementsByClassName('ngl')[0]);
  modal.style.display = 'none';
}

