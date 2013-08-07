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
  var previousDot  = null;
  var drawing      = false;
  var brushSize    = 1;

  function drawLine(start, end) {
    context.beginPath();
    context.moveTo.apply(context, start);
    context.lineTo.apply(context, end);
    context.lineCap = 'round';
    context.lineWidth = brushSize;
    context.stroke();
  }

  function drawTo(x, y) {
    if (previousDot) {
      drawLine(previousDot, [x, y]);
    }
    previousDot = [x, y];
  }

  function toggleDrawing() {
    if (overlay.classList.contains('drawing')) {
      overlay.classList.remove('drawing');
      previousDot = null;
      drawing = false;
    } else {
      overlay.classList.add('drawing');
      drawing = true;
    }
  }

  function setBrushSize(size) {
    var activeButton = document.querySelector('.brush-size.active');
    activeButton.classList.remove('active');

    var targetButton = document.querySelector('.brush-size:nth-child(' + size + ')');
    targetButton.classList.add('active');

    brushSize = (size * 2) - 1;
  }

  overlay.addEventListener('click', function(e) {
    if (drawing) {
      drawTo(e.layerX, e.layerY, 0, 0, 0, 255);
    }

    if (e.target.nodeName === 'BUTTON') {
      setBrushSize(Number(e.target.textContent));
    }
  });

  overlay.addEventListener('mousemove', function(e) {
    if (drawing) {
      drawTo(e.layerX, e.layerY, 0, 0, 0, 255);
    }
  });

  document.addEventListener('keypress', function(e) {
    if (e.charCode >= '1'.charCodeAt(0) && e.charCode <= '5'.charCodeAt(0)) {
      setBrushSize(Number(String.fromCharCode(e.charCode)));
      return;
    }

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
});
