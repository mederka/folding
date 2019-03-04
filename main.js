document.addEventListener("DOMContentLoaded", function () {
  loadAllNGL();
});

function loadNGL(id) {
  let stage = new NGL.Stage(id);
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

function closeViewer() {
  let modal = document.getElementById('viewer-modal');
  let viewer = document.getElementById('ngl-viewer');
  viewer.innerHTML = '';
  debugger;
  modal.style.display = 'none';
}
