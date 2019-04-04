(function(root) {
  const GR = root.GR = (root.GR || {});

  // global vars
  GR.bLength = 80; // number of pixels for dark-shaded part in main bar (fixed size)
  GR.barHeight = 80;
  GR.sliderLength = 670.217;
  const startx = 350;
  const starty = 150;
  const sliderX = startx + 200;
  const rangeLimit = 400;
  const slider = new GR.Slider(sliderX, 10, GR.sliderLength / 2, GR.sliderLength);
  const bars = [];
  var ctx;


  function draw() {
    ctx.clearRect(0, 0, 1280, 720);
    for(let i = 0; i < bars.length; i++) {
      bars[i].draw(ctx);
    }
    drawSlider();
    //Size ratio
    ctx.font="20px Serif";
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillText("Ratio of red to blue:   " + slider.getRatio().toPrecision(6), 200, 50);
    ctx.fillText("Ratio of blue to total:  " + (1 / slider.getRatio2()).toPrecision(6), 200, 75);
    window.setTimeout(draw, 50);
  };

  function drawSlider() {
    var x = sliderX;
    var y = 10;
    var height = 30;
    var widthL = slider.leftWidth;
    var widthR = GR.sliderLength - slider.leftWidth;
    //Left side
    ctx.beginPath();
    ctx.fillStyle = 'rgba(100, 10, 10, 0.5)';
    ctx.fillRect(x, y, widthL, height);

    //Slider
    ctx.beginPath();
    ctx.moveTo(x + widthL, y - 2);
    ctx.lineTo(x + widthL, y + height + 2);
    ctx.strokeStyle = '#0e2f44';
    ctx.stroke();

    //Right Side
    ctx.beginPath();
    ctx.fillStyle = 'rgba(10, 10, 100, 0.5)';
    ctx.fillRect(x + widthL + 1, y, widthR, height);
  }

  function isBetween(a, b, c) {
    return (a >= b && a <= c);
  }

  $(document).ready(function() {
    
    // set up canvas
    const canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    const canvasPosition = {
        x: canvas.offsetLeft,
        y: canvas.offsetTop
    };
    let held = false;

    console.log("slider x: " + slider.x);
    console.log("slider y: " + slider.y);
    console.log("slider place: " + slider.getPlace());
    console.log("slider leftWidth: " + slider.leftWidth);

    // bar1
    const bar1 = new GR.Bar(slider,
      function() { return startx },
      function() { return starty },
      function() { return 1.0 }
    );

    const bar2 = new GR.Bar(slider,
      function() { return startx + this.bar.widthL }.bind({bar: bar1}),
      function() { return starty + GR.barHeight },
      function() { return slider.getRatio2() }
    );

    // inline bar
    function getBar2X() {
      return this.bar.getX() + this.bar.widthL;
    }
    const barInline = new GR.Bar(slider,
      getBar2X.bind({bar: bar1}),
      function() {return starty + GR.barHeight},
      function() {return 1.0 },
      [1, -1]
    );

    // top bar
    function getBarTopX() {
      return startx - this.bar.widthL;
    }
    const barTop = new GR.Bar(slider,
      getBarTopX.bind({slider: slider, bar: bar2}),
      function() {return starty + GR.barHeight - 161.8},
      slider.getRatio
    );

    // bar 3
    function getSR4() {
      return Math.pow(slider.getRatio2(), 2);
    };
    const bar3 = new GR.Bar(slider,
      getBar2X.bind({bar: bar2}),
      function() {return this.bar.getY() + this.bar.getSizeRatio() * GR.barHeight}.bind({bar: bar2}),
      getSR4.bind({slider: slider})
    );
    const bar4 = new GR.Bar(slider,
      getBar2X.bind({bar: bar3}),
      function() {return this.bar.getY() + this.bar.getSizeRatio() * GR.barHeight}.bind({bar: bar3}),
      function() {return Math.pow(slider.getRatio2(), 3)}.bind({slider: slider})
    );
    const barInline2 = new GR.Bar(slider,
      function() {return this.bar.getX()}.bind({bar: bar3}),
      function() {return this.bar.getY()}.bind({bar: bar3}),
      function() {return slider.getRatio2() },
      [1, -1]
    );



    // new top bar
    const barNew = new GR.Bar(slider,
      // getBarTopX.bind({bar: bar2}),
      // function() {return starty - GR.barHeight * getSR.bind({slider: slider}).call()},
      function() { return startx },//function() { return startx + this.bar.widthL + GR.bLength }.bind({bar: bar1}),
      function() { return starty },
      slider.getRatio,
      [1, -1]
    );

    const barNew2 = new GR.Bar(slider,
      // getBarTopX.bind({bar: bar2}),
      // function() {return starty - GR.barHeight * getSR.bind({slider: slider}).call()},
      function() { return startx + this.bar.widthL }.bind({bar: bar1}),//function() { return this.bar.getX() + this.bar.widthL + this.bar.height }.bind({bar: bar2}),
      function() {return starty + GR.barHeight},
      getSR4.bind({slider: slider, bar: bar2}),
      [1, -1]
    );

    bars.push(bar1);
    bars.push(bar2);
    bars.push(bar3);
    bars.push(bar4);
    bars.push(barInline);
    bars.push(barInline2);
    // bars.push(barTop);
    // bars.push(barNew);
    // bars.push(barNew2);

    // mouse input
    
    $(canvas).on('mousedown', function(e) {
      const mouse = {
          // use pageX and pageY to get the mouse position
          // relative to the browser window
          x: e.pageX - canvasPosition.x,
          y: e.pageY - canvasPosition.y
      }
      // (0,0) origin = top-left of canvas element
      const x = slider.getPlace();
      if (!held &&
          isBetween(mouse.x, x - 5, x + 5) &&
          isBetween(mouse.y, slider.y, slider.y + 30)) {
        held = true;
        // $(this).css('cursor', 'pointer');
        console.log("OVER");
      }
    });

    $(canvas).on('mouseup', function(e) {
      held = false;
    });

    $(canvas).on('mousemove', function(e) {
      if (held) {
        const mouse = {
          x: e.pageX - canvasPosition.x,
          y: e.pageY - canvasPosition.y
        }
        slider.leftWidth = mouse.x - slider.x;

        // limit range
        // if (slider.x < startx) slider.x = startx;
        if (slider.x > sliderX + GR.sliderLength) slider.x = sliderX + GR.sliderLength;
      }
    });

    draw();
  });
}(this));