(function(global) {

  // Text2Slide internal functions

  // Reads through the source file and inserts nodes into a JS object, which then serves as
  // slideshow source
  function parseTree(raw) {
    let rawArray = raw.split('*' + ' ');
    let output = {};
    if (rawArray) {
      rawArray.shift();
      let slidenumber = 1;
      for (let branch of rawArray) {
        let contents = branch.split('\n');
        let title = contents.shift();
        output[slidenumber] = {
          contents: contents.join('\n'),
          title: title,
        };
        slidenumber++;
      }
    }
    return output;
  };

  // Checks if a given string refers to an image file. Returns a boolean.
  function isImage(str) {
    const formats = ['jpg', 'jpeg', 'png',
                     'gif', 'apng', 'svg',
                     'bmp', 'ico'];
    let output = false;
    formats.forEach(format => {
      let regex = new RegExp(format + ' *$', 'i');
      if (regex.test(str)) output = true;
    });
    return output;
  }

  // Checks if a given string refers to a video file. Returns a boolean.
  function isVideo(str) {
    const formats = ['mp4', 'ogv', 'webm'];
    let output = false;
    formats.forEach(format => {
      let regex = new RegExp(format + ' *$', 'i');
      if (regex.test(str)) output = true;
    });
    return output;
  }

  // Processes the given string and formats any present inserts. At the moment it can only
  // format pictures.
  function parseInserts(text) {
    let textArray = text.split(/[^\\]\{/);
    if (textArray.length > 1) {
      for (let i = 1; i < textArray.length; i++) {
        let chunks = textArray[i].split(/[^\\]\}/);
        if (isImage(chunks[0])) textArray[i] = `<div style="text-align:center"><img src="${chunks[0]}">${chunks[1]}</img></div>`;
        else if (isVideo(chunks[0])) textArray[i] = `<video width="320" height="240" controls><source src="${chunks[0]}">Your browser does not support the video tag.</video> ${chunks[1]}`;
        else if (chunks[0].substring(0,6) == 'footer') textArray[i] = `<div class="t2-footer" style="margin-top: 20px; font-size: 0.4em; color: lightgray">${chunks[0].substring(8)}</div>`;
        else textArray[i] = chunks[1];
      }
    }
    return textArray.join('').split('\\').join('');
  }

  // If the input text contains a list, this functions formats it into an HTML element.
  function parseLists(text) {
    let textArray = text.split('\n');
    let out = '';
    let list = '';
    while (textArray.length) {
      if (textArray[0][0] != '-') {
        if (list.length) out += list + '</ul>';
        list = '';
        if (out.length == 0) out += textArray.shift();
        else out += '\n' + textArray.shift();
      }
      else {
        if (!list.length) list += '<ul>';
        list += '<li>' + textArray.shift().substring(2) + '</li>';
      }
    }
    return out;
  }

  // Renders a given string into HTML
  function renderText(text) {
    let out = parseInserts(text);
    out = parseLists(out);
    return out.replace(/\n/gi, '<br>');
  };

  // Generates and returns a div with a given id. Does not append it though.
  function makeDiv(id) {
    let output = document.createElement('div');
    output.id = id;
    return output;
  }
  
  // Format the given divId as a slide. If no divId is given, the function creates one.
  function buildSlide(divId) {
    if (!divId) divId = 't2-slideshow';
    
    let slideshow = document.getElementById(divId);
    
    if (!slideshow) {
      slideshow = document.createElement('div');
      slideshow.id = divId;
      document.body.appendChild(slideshow);      
    }

    ['t2-slide-title',
     't2-slide-content',
     't2-slide-number',
     't2-close',
     't2-touch-right',
     't2-touch-left'].forEach(id => {
      let element = makeDiv(id);
      slideshow.appendChild(element);
    });

  }

  // Slideshow logic
  function makeSlideshow(branch) {
    let slidenumber = 1;
    
    function renderSlide() {
      if (branch[slidenumber]){
        let title = document.getElementById('t2-slide-title');
        title.innerText = branch[slidenumber].title;
        let content = document.getElementById('t2-slide-content');
        content.innerHTML = renderText(branch[slidenumber].contents);
        let number = document.getElementById('t2-slide-number');
        number.innerHTML = slidenumber;
        let close = document.getElementById('t2-close');
        close.innerHTML = '<a onclick="t2.endSlideshow()">&#10006;</a>';
      }
    };
        
    renderSlide();

    function goNext() {
      if (branch[slidenumber+1]) {
        slidenumber++;
      }
      return renderSlide();
    };

    function goLast() {
      if (branch[slidenumber-1]) {
        slidenumber--;
      }
      return renderSlide();
    };
    
    let nextSlide = document.getElementById('t2-touch-right');
    if (nextSlide) nextSlide.addEventListener('click', goNext);

    let lastSlide = document.getElementById('t2-touch-left');
    if (lastSlide) lastSlide.addEventListener('click', goLast);

    window.onkeyup = function(key) {
      if (key.key == 'ArrowRight' || key.key == 'PageDown') goNext();
      if (key.key == 'ArrowLeft' || key.key == 'PageUp') goLast();
      if (key.key == 'f') goFullScreen();
      if (key.key == 'Escape') Text2Slide.endSlideshow();
    };

  }

  function goFullScreen() {
    var el = document.getElementById(Text2Slide.divId),
        rfs = el.requestFullScreen
        || el.webkitRequestFullScreen
        || el.mozRequestFullScreen
        || el.msRequestFullscreen;

    rfs.call(el);
  }




  // Text2Slide Initialization
  
  let Text2Slide = function(path) {
    return new Text2Slide.init(path);
  };

  Text2Slide.prototype = {

  };

  Text2Slide.init = function(path) {

  };

  Text2Slide.init.prototype = Text2Slide.prototype;

  global.Text2Slide = global.t2 = Text2Slide;




  // Text2Slide methods

  // Load Text2Slide, with path to the data file and optional id of the target
  // element, which is optional. If no div id is given, Text2Slide will create a div.
  // The third argument, customTheme, is also optional. Without it, Text2Slide uses
  // the default style definitions (see defaultStyles()).
  Text2Slide.load = function(path, divId, customTheme) {
    if (!divId) divId = 't2-slideshow';
    this.divId = divId;
    fetch(path)
      .then(response => response.text())
      .then(response => {
        let raw = response;
        this.data = parseTree(raw);
        buildSlide(divId);
        makeSlideshow(this.data);
        if (!customTheme) this.defaultStyles();
      })
      .catch(err => {
        makeSlideshow({
          1: {
            title: 'Error',
            content: 'Slide data not found',
          }
        });
      });
  };

  // Applying default slide styles. These can be overriden by passing a custom theme argument into the load() method.
  Text2Slide.defaultStyles = function() {

    function setStyle(element, styles) {
      Object.keys(styles).forEach((key, index) => {
        element.style[key] = styles[key];
      });
    };

    // Style definitions are javascript objects
    const styles = [
      {
        id: this.divId,
        style: {
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: '0',
          left: '0',
          backgroundColor: 'white',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column'
        }
      },

      {
        id: 't2-slide-title',
        style: {
          fontFamily: 'sans',
          fontSize: '3vmax',
          margin: '50px',
        },
      },

      {
        id: 't2-slide-content',
        style: {
          fontFamily: 'sans',
          fontSize: '2vmax',
          margin: '0 auto',
          width: '80%',
          height: '60%',
          maxWidth: '900px',
  	      padding: '20px',
          textAlign: 'left',
          lineHeight: '2em',          
        }
      },

      {
        id: 't2-slide-number',
        style: {
          position: 'absolute',
          bottom: '5%',
          right: '5%',
        }
      },

      {
        id: 't2-close',
        style: {
          position: 'absolute',
          top: '1%',
          right: '1%',
          color: 'lightgray',
          zIndex: '200'
        }
      },

      {
        id: 't2-touch-right',
        style: {
          position: 'absolute',
          right: '0',
          height: '100%',
          width: '50%',
        }
      },

      {
        id: 't2-touch-left',
        style: {
          position: 'absolute',
          left: '0',
          height: '100%',
          width: '50%',
        }
      },
      
    ];

    styles.forEach(obj => {
      setStyle(document.getElementById(obj.id), obj.style);
    });
  };

  // Destroys slideshow related elements and clears slideshow data.
  Text2Slide.endSlideshow = function() {
    let slide = document.getElementById(this.divId);
    slide.remove();
    this.data = null;
  };
  
})(window);
