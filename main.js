function loadNGL(id, rep, color) {
  let div = document.getElementById(id);
  let stage = new NGL.Stage(id);
  if (div.className.indexOf('spin') != -1) stage.setSpin(true);
  if (!color) color = 'hydrophobicity';
  stage.setParameters({
    backgroundColor: "white"
  });
  stage.loadFile(`rcsb://${id}`).then(out => {
    out.addRepresentation(rep, { color });
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

function openViewer(id, color) {
  document.getElementById('toggleRep').value = 'cartoon';
  let modal = document.getElementById('viewer-modal');
  modal.style.display = 'block';
  let viewer = document.getElementById('ngl-viewer');
  let stage = document.createElement('div');
  stage.className = 'ngl ngl-big';
  stage.id = id;
  viewer.appendChild(stage);
  loadNGL(id, 'cartoon', color);
}

function toggleRep() {
  let color = 'hydrophobicity';
  const rep = document.getElementById('toggleRep').value;
  const viewer = document.getElementById('ngl-viewer');
  const id = document.getElementsByClassName('ngl')[0].id;
  if (id == '1dn3') color = 'element';
  viewer.removeChild(document.getElementById(id));
  let stage = document.createElement('div');
  stage.className = 'ngl ngl-big';
  stage.id = id;
  viewer.appendChild(stage);
  loadNGL(id, rep, color);
}

function nglFullScreen(){
  const el = document.getElementsByTagName('canvas')[0],
        rfs = (el.requestFullScreen
               || el.webkitRequestFullScreen
               || el.mozRequestFullScreen
               || el.msRequestFullscreen);
  rfs.call(el);
}

function closeViewer() {
  let modal = document.getElementById('viewer-modal');
  let viewer = document.getElementById('ngl-viewer');
  viewer.removeChild(document.getElementsByClassName('ngl')[0]);
  modal.style.display = 'none';
}

function setDoi() {
  const resolver = document.getElementById('doiResolver').value;
  if (resolver) {
    const date = new Date();
    date.setTime(date.getTime() + (300*24*60*60*1000));
    document.cookie = `folding-resolver=${resolver}; expires=${date.toUTCString()}; path=/`;
  }
  changeLit(resolver);
  document.getElementById('doiResolver').value = '';
  
}

function changeLit(resolver) {
  const papers = document.getElementsByClassName('paper');
  for (let paper of papers) {
    paper.href = `https://${resolver}/${paper.href.split('org/')[1]}`;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadAllNGL();
  if (document.cookie && document.cookie.length) {
    changeLit(document.cookie.split('=')[1]);
  }
});

function loadProtein() {
  function getUrlVars() {
    const vars = {};
    const parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
      vars[key] = value;
    });
    return vars;
  }
  const id = getUrlVars()['id'];
  const rep = getUrlVars()['rep'] || 'cartoon';

  if (id) {
    const stage = document.createElement('div');
    stage.className = 'ngl ngl-big';
    stage.id = id;
    document.getElementById('ngl-viewer').appendChild(stage);
    loadNGL(id, rep);
  }
}
