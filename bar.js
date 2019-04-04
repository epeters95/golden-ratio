(function(root) {
  const GR = root.GR = (root.GR || {});

  const Bar = GR.Bar = function(slider, getX, getY, getSizeRatio, direction = [1, 1], fillstyle = 'rgba(100, 10, 10, 0.5)') {
    this.slider = slider;
    this.getX = getX;
    this.getY = getY;
    this.getSizeRatio = getSizeRatio;
    this.widthL;
    this.height;
    this.fillStyle = fillstyle;
    this.direction = direction;
  }

  Bar.prototype.draw = function(ctx) {
    var direction = this.direction;
    var x = this.getX();
    var y = this.getY();
    var sr = this.getSizeRatio();
    this.widthL = this.slider.getRatio() * GR.bLength * sr;//sr * this.slider.leftWidth; // number of pixels from main bar's x
    this.height = sr * GR.barHeight;
    var height = this.height;

    //Left side
    ctx.beginPath();
    ctx.fillStyle = this.fillStyle;
    if (direction[1] === 1) {
      ctx.fillRect(x, y, this.widthL, height);
    }
    else {
      ctx.fillRect(x, y, height, this.widthL);
    }
    //Slider
    ctx.beginPath();
    if (direction[1] === 1) {
      ctx.moveTo(x + this.widthL, y);
      ctx.lineTo(x + this.widthL, y + height);
    }
    else {
      ctx.moveTo(x, y + this.widthL);
      ctx.lineTo(x + height, y + this.widthL);
    }
    ctx.strokeStyle = '#0e2f44';
    ctx.stroke();

    //Right Side
    ctx.beginPath();
    var widthR = sr * GR.bLength;
    ctx.fillStyle = 'rgba(10, 10, 100, 0.5)';
    if (direction[1] === 1) {
       ctx.fillRect(x + (this.widthL), y, widthR, height);
    }
    else {
       ctx.fillRect(x , y + (this.widthL), height, widthR);
    }
  }

}(this));