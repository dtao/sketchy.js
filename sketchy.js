(function(doc) {
  var Sketchy = {
    fromCanvas: function(canvas, options) {
      var canvasStyle  = window.getComputedStyle(canvas);
      var overlay      = createOverlay(canvas);
      var exportButton = overlay.querySelector('button.export');
      var canvasWidth  = parseInt(canvasStyle.width, 10);
      var canvasHeight = parseInt(canvasStyle.height, 10);
      var context      = canvas.getContext('2d');
      var canvasData   = context.getImageData(0, 0, canvasWidth, canvasHeight);
      var previousDot  = null;
      var drawing      = false;
      var brushSize    = 1;
      var brushColor   = 'black';

      // Set default options
      options = options || {};
      options.exportLocation = options.exportLocation || canvas.parentNode;

      function createElement(nodeName, className) {
        var element = doc.createElement(nodeName);
        element.className = className;
        return element;
      }

      function createOverlay(canvas) {
        var canvasStyle = window.getComputedStyle(canvas);
        canvas.height = parseInt(canvasStyle.height, 10);
        canvas.width = parseInt(canvasStyle.width, 10);

        // Insert a <div class="sketchy"> after the canvas
        var overlayElement = createElement('div', 'sketchy');
        canvas.parentNode.insertBefore(overlayElement, canvas.nextSibling);

        // Populate the overlay w/ toolbars
        overlayElement.appendChild(createTopToolbar());
        overlayElement.appendChild(createBottomToolbar());

        return overlayElement;
      }

      function createTopToolbar() {
        var toolbar = createElement('div', 'toolbar');
        toolbar.appendChild(createToolbarMenu('brush-sizes', {
          className: 'brush-size',
          buttons: [1, 2, 3, 4, 5]
        }));
        toolbar.appendChild(createToolbarMenu('colors', {
          className: 'color',
          attribute: 'data-color',
          buttons: ['black', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'white']
        }));
        return toolbar;
      }

      function createBottomToolbar() {
        var toolbar = createElement('div', 'toolbar');
        var button = createElement('button', 'export');
        button.textContent = 'Export';
        toolbar.appendChild(button);
        return toolbar;
      }

      function createToolbarMenu(className, items) {
        var menu = createElement('ul', className);

        // Make the first button active
        menu.appendChild(createMenuItem(items.buttons[0], items, true));

        // Other buttons ain't special
        for (var i = 1; i < items.buttons.length; ++i) {
          menu.appendChild(createMenuItem(items.buttons[i], items));
        }

        return menu;
      }

      function createMenuItem(value, options, active) {
        var menuItem = createElement('li', options.className);
        if (active) {
          menuItem.classList.add('active');
        }

        var button = createElement('button');
        menuItem.appendChild(button);

        if (options.attribute) {
          menuItem.setAttribute(options.attribute, value);
        } else {
          button.textContent = value;
        }

        return menuItem;
      }

      function drawLine(start, end) {
        context.beginPath();
        context.moveTo.apply(context, start);
        context.lineTo.apply(context, end);
        context.lineCap = 'round';
        context.lineWidth = brushSize;
        context.strokeStyle = brushColor || '#000';
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
        var activeButton = doc.querySelector('.brush-size.active');
        activeButton.classList.remove('active');

        var targetButton = doc.querySelector('.brush-size:nth-child(' + size + ')');
        targetButton.classList.add('active');

        brushSize = (size * 2) - 1;
      }

      function setBrushColor(color) {
        var activeButton = doc.querySelector('.color.active');
        activeButton.classList.remove('active');

        var targetButton = doc.querySelector('.color[data-color="' + color + '"]');
        targetButton.classList.add('active');

        brushColor = color;
      }

      overlay.addEventListener('click', function(e) {
        if (drawing) {
          drawTo(e.layerX, e.layerY, 0, 0, 0, 255);
        }

        if (e.target.nodeName === 'BUTTON') {
          if (e.target.parentNode.classList.contains('brush-size')) {
            setBrushSize(Number(e.target.textContent));
          }

          if (e.target.parentNode.classList.contains('color')) {
            setBrushColor(e.target.parentNode.getAttribute('data-color'));
          }
        }
      });

      overlay.addEventListener('mousemove', function(e) {
        if (drawing) {
          drawTo(e.layerX, e.layerY, 0, 0, 0, 255);
        }
      });

      exportButton.addEventListener('click', function() {
        var img = doc.createElement('img');
        img.src = canvas.toDataURL();
        options.exportLocation.appendChild(img);
      });

      doc.addEventListener('keypress', function(e) {
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
    }
  };

  window.Sketchy = Sketchy;

}(document));
