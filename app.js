Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

function randColor() {
  var c = Math.round(0xFFFFFF * Math.random()).toString(16);
  var missing = 6 - c.length;
  
  return ("#" + Array(missing).join("0") + c);
}

var transmission = (function () {
  var width = $(window).width(),
      height = $(window).height(),
      radius = 20,
      drawMargin = radius + 5,
      rootId = 'transmission',
      signalCount = 5
  ;

  return {
    rootId: rootId,
    signalCount: signalCount,
    width: width,
    height: height,
    radius: radius,
    derived: {
      minX: drawMargin,
      maxX: width - drawMargin,
      minY: drawMargin,
      maxY: height - drawMargin,
    }
  }
})();

var signals = d3.range(transmission.signalCount).map(function (e) {
  var x = (Math.random() * transmission.width).clamp(
          transmission.derived.minX,
          transmission.derived.maxX),
      y = (Math.random() * transmission.height).clamp(
          transmission.derived.minY,
          transmission.derived.maxY);
  return {
    color: randColor(),
    cx: x,
    cy: y,
    rx: transmission.radius,
    ry: transmission.radius,
  }
});

var svg = d3.select('#transmission')
  .append('svg')
    .attr('width', transmission.width)
    .attr('height', transmission.height);
var defs = svg.append('defs');

defs.append('filter')
      .attr('id', 'blur')
    .append('feGaussianBlur')
      .attr('stdDeviation', 2);
defs.append('filter')
      .attr('id', 'noise')
    .append('feTurbulence')
      .attr('type', 'fractalNoise')
      .attr('baseFrequency', 0.05);

var circles = svg
  .append('g')
    .attr('id', 'circles')
    .attr('filter', 'url(#noise)');

var g = svg.selectAll('g.signal')
  .data(signals)
  .enter().append('g')
            .classed('signal', '')
          .append('ellipse')
            .style('fill', function (sig) { return sig.color; })
            .attr('rx', function (sig) { return sig.rx; })
            .attr('ry', function (sig) { return sig.ry; })
            .attr('cx', function (sig) { return sig.cx; })
            .attr('cy', function (sig) { return sig.cy; })
            .attr('filter', 'url(#blur)');

console.log(g);
