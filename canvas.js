window.addEventListener('load', function() {
  function extract(object, properties) {
    var extracted = {};
    for (var i = 0; i < properties.length; ++i) {
      extracted[properties[i]] = object[properties[i]];
    }
    return extracted;
  }

  var overlay      = document.getElementById('overlay');
  var canvas       = document.querySelector('canvas');
  var canvasWidth  = canvas.width;
  var canvasHeight = canvas.height;
  var context      = canvas.getContext('2d');
  var canvasData   = context.getImageData(0, 0, canvasWidth, canvasHeight);
  var drawing      = false;

  function drawDot(x, y, r, g, b, a) {
    var index = (x + y * canvasWidth) * 4;

    canvasData.data[index + 0] = r || 0;
    canvasData.data[index + 1] = g || 0;
    canvasData.data[index + 2] = b || 0;
    canvasData.data[index + 3] = typeof a === 'number' ? a : 255;
  }

  function drawTo(x, y, r, g, b, a) {
    drawDot(x, y, r, g, b, 255);
  }

  function updateCanvas() {
    context.putImageData(canvasData, 0, 0);
  }

  function toggleDrawing() {
    if (overlay.classList.contains('drawing')) {
      overlay.classList.remove('drawing');
      drawing = false;
    } else {
      overlay.classList.add('drawing');
      drawing = true;
    }
  }

  overlay.addEventListener('click', function(e) {
    if (drawing) {
      drawTo(e.layerX, e.layerY, 0, 0, 0, 255);
    }
  });

  overlay.addEventListener('mousemove', function(e) {
    if (drawing) {
      drawTo(e.layerX, e.layerY, 0, 0, 0, 255);
    }
  });

  document.addEventListener('keypress', function(e) {
    if (e.charCode === 'c'.charCodeAt(0)) {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      canvasData = context.getImageData(0, 0, canvasWidth, canvasHeight);
      return;
    }

    if (e.charCode === 'd'.charCodeAt(0)) {
      toggleDrawing();
      return;
    }
  });

  setInterval(updateCanvas, 100);
});
