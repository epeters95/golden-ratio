(function(root) {
  var GR = root.GR = (root.GR || {});

  var Slider = GR.Slider = function(x, y, leftWidth, length) {
    this.x = x;
    this.y = y;
    this.leftWidth = leftWidth;
    this.length = length;
  }

  Slider.prototype.getPlace = function() {
    return this.x + this.leftWidth;
  }

  Slider.prototype.getRatio = function() {
  	return this.leftWidth / (this.length - this.leftWidth);
  }

}(this));
