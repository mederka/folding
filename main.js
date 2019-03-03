document.addEventListener("DOMContentLoaded", function () {
  let stage = new NGL.Stage("4trx");
  stage.setParameters({
    backgroundColor: "white"
  });
  stage.loadFile("rcsb://4trx", {defaultRepresentation: true});
});
