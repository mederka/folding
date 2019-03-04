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
