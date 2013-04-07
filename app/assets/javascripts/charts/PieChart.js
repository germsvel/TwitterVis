function PieChart() {

  var margin      = {top: 20, right: 10, bottom: 20, left: 40},
      beginDate   = '',
      endDate     = '',
      color       = d3.scale.category20c();
      

  function chart(selection) {
    selection.each(function(data)
    {
      var width = $(selection[0]).width()-margin.left-margin.right;
      var height = $(selection[0]).height()-margin.top-margin.bottom;

      radius = (Math.min(width, height) / 2 );
      arc    = d3.svg.arc().outerRadius(radius).innerRadius(0);

      data.forEach(function(d) {
        d.count = +d.count;
      });

      var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.count; });

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([pie(data)]);

      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter().append("svg").append("g");
      for (var i = data.length - 1; i >= 0; i--) {
        var piece = gEnter.append("g").attr("class", "arc");
        piece.append("path").style("opacity", 0);
        piece.append("text").style("opacity", 0);
      };
      gEnter.selectAll("path")
        .data(function(d) {return d;})
        .style("fill", function(d) { return color(d.data.category); })
        .each(function(d) { this._current = d; });
      gEnter.selectAll("text")
        .data(function(d) {return d;})
        .attr("transform", function(d) { return "rotate(" + angle(d) + "," + arc.centroid(d) + ")translate(" + arc.centroid(d) + ")"; });

      // Update the outer dimensions.
      svg.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      // Update the inner dimensions.
      var g = svg.select("g")
        .attr("transform", "translate(" + ( ( width / 2 ) + margin.left ) + "," + ( ( height / 2 ) + margin.top )+ ")");

      // Update the arcs.
      g.selectAll("path")
        .data(function(d) {return d;})
        .transition()
        .duration(500)
        .style("opacity", 1)
        .attrTween("d", arcTween);

      // Update the labels.
      g.selectAll("text")
        .data(function(d) {return d;})
        .transition()
        .duration(500)
        .attr("transform", function(d) { return "rotate(" + angle(d) + "," + arc.centroid(d) + ")translate(" + arc.centroid(d) + ")"; })
        .style("opacity", 1)
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.data.category; });


    });
  }

  function angle(d) {
    var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
    return a > 90 ? a - 180 : a;
  }

  function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
      return arc(i(t));
    };
  }

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.beginDate = function(_) {
    if (!arguments.length) return beginDate;
    beginDate = _;
    return chart;
  };

  chart.endDate = function(_) {
    if (!arguments.length) return endDate;
    endDate = _;
    return chart;
  };

  return chart;
}