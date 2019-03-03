document.addEventListener("DOMContentLoaded", function () {
  const ngl = document.getElementsByClassName('ngl');
  if (ngl.length) {
    let id = ngl[0].id;
    loadNGL(id);
  }
});

function loadNGL(id) {
  let stage = new NGL.Stage(id);
  stage.setParameters({
    backgroundColor: "white"
  });
  stage.loadFile(`rcsb://${id}`, {defaultRepresentation: true});
}
