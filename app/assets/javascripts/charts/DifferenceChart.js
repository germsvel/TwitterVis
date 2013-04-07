function DifferenceChart() {

  var margin           = {top: 20, right: 20, bottom: 40, left: 50},
      xScale           = d3.time.scale(),
      yScale           = d3.scale.linear(),
      customTimeFormat = timeFormat([
        [d3.time.format("%I %p"), function(d) { return d.getDay() && d.getDate() != 1; }]
      ]),
      xAxis            = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0).tickFormat(customTimeFormat),
      yAxis            = d3.svg.axis().scale(yScale).orient("left"),
      line             = d3.svg.area().x(X).y(Y),
      area             = d3.svg.area().x(X).y1(Y1),
      parseDate        = d3.time.format("%Y-%m-%d %X").parse,
      id               = 'id',
      showCurrentTime  = 1;
      

  function chart(selection) {
    selection.each(function(data) {

      var width = $(selection[0]).width()-margin.left-margin.right;
      var height = $(selection[0]).height()-margin.top-margin.bottom;

      var current_hour;
      data.forEach(function(d) {
        d.hour = parseDate(d.hour);
        var now = new Date();
        if ( d.hour.getHours() == now.getHours() ) { current_hour = d.hour; }
      });
      
      // Update the x-scale.
      xScale
          .domain(d3.extent(data, function(d) { return d.hour; }))
          .range([0, width]);

      // Update the y-scale.
      yScale
          .domain([
            d3.min(data, function(d) { return Math.min(d["previous"], d["current"]); }),
            d3.max(data, function(d) { return Math.max(d["previous"], d["current"]); })
          ])
          .range([height, 0]);

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([data]);

      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter().append("svg").append("g");
      gEnter.append("clipPath").attr("class", "above").attr("id", "clip-above-"+id).append("path");//.attr("d", area.y0(0));
      gEnter.append("clipPath").attr("class", "below").attr("id", "clip-below-"+id).append("path");//.attr("d", area.y0(height));
      gEnter.append("path").attr("class", "area above").attr("clip-path", "url(#clip-above-"+id+")");
      gEnter.append("path").attr("class", "area below").attr("clip-path", "url(#clip-below-"+id+")");
      gEnter.append("path").attr("class", "line");
      gEnter.append("g").attr("class", "x axis").call(xAxis);
      gEnter.append("g").attr("class", "y axis").call(yAxis);
      if (showCurrentTime) {
        gEnter.append("line").attr("class", "current-hour");
        gEnter.append("rect").attr("class", "current-hour");
      }

      // Update the outer dimensions.
      svg.attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom);

      // Update the inner dimensions.
      var g = svg.select("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Update the paths.
      g.select("#clip-above-"+id+" path").transition().duration(500).attr("d", area.y0(0));
      g.select("#clip-below-"+id+" path").transition().duration(500).attr("d", area.y0(height));
      g.select("path.area.above").transition().duration(500).attr("d", area.y0(function(d) { return yScale(d["current"]); }));
      g.select("path.area.below").transition().duration(500).attr("d", area);
      g.select("path.line").transition().duration(500).attr("d", line);

      // Update the current hour indicator.
      if (showCurrentTime) {
        var current_date = new Date();
        current_date = current_date.toDateString().split(" ").splice(1,3);
        current_date = current_date.shift() + current_date.pop();

        g.select("line.current-hour")
            .attr("x1", function() { return xScale(current_hour); })
            .attr("x2", function() { return xScale(current_hour); })
            .attr("y1", function() { return yScale.range()[0]; })
            .attr("y2", function() { return yScale.range()[1]; })
            .attr("stroke", "blue");
        g.select("rect.current-hour")
            .attr("x", function() { return xScale(current_hour); })
            .attr("y", function() { return yScale.range()[1]; })
            .attr("width", function() { return xScale.range()[1] - xScale(current_hour);})
            .attr("height", function() { return yScale.range()[0];})
            .attr("opacity", 0.1);
      }


      // Update the x-axis.
      g.select(".x.axis")
          .attr("transform", "translate(0," + yScale.range()[0] + ")")
          .transition()
          .duration(500)
          .call(xAxis);

      // Update the y-axis.
      g.select(".y.axis")
          .transition()
          .duration(500)
          .call(yAxis);
    });
  }

  function timeFormat(formats) {
    return function(date) {
      var i = formats.length - 1, f = formats[i];
      while (!f[1](date)) f = formats[--i];
      return f[0](date);
    };
  }

  // The x-accessor for the path generator; xScale(xValue).
  function X(d) {
    // return xScale(d[0]);
    return xScale(d.hour);
  }

  // The x-accessor for the path generator; yScale(yValue).
  function Y(d) {
    // return yScale(d[1]);
    return yScale(d["current"]);
  }

  function Y1(d) {
    // return yScale(d[1]);
    return yScale(d["previous"]);
  }

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  chart.id = function(_) {
    if (!arguments.length) return yValue;
    id = _;
    return chart;
  };

  chart.showCurrentTime = function(_) {
    if (!arguments.length) return showCurrentTime;
    showCurrentTime = _;
    return chart;
  };

  return chart;
}