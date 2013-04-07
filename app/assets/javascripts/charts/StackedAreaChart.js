function StackedAreaChart() {

  var margin      = {top: 40, right: 20, bottom: 40, left: 40};
      xScale      = d3.time.scale(),
      yScale      = d3.scale.linear(),
      xAxis       = d3.svg.axis().scale(xScale).orient("bottom").ticks(7),
      yAxis       = d3.svg.axis().scale(yScale).orient("left").ticks(5),
      // line        = d3.svg.line().interpolate("linear").x(X).y(Y),
      area        = d3.svg.area().x(X).y0(Y0).y1(Y1),
      stack       = d3.layout.stack(),
      parseDate   = d3.time.format("%Y-%m-%d %X").parse,
      // beginDate  = '',
      // endDate    = '',
      color       = d3.scale.category20();
      

  function chart(selection) {
    selection.each(function(data)
    {
      var width = $(selection[0]).width()-margin.left-margin.right;
      var height = $(selection[0]).height()-margin.top-margin.bottom;

      // Set the domain of the color scale to all categories other than date
      color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

      data.forEach(function(d) {
        if (!d.date.getMonth) {
          d.date = parseDate(d.date);
        }
      });

      // Filter data
      // var filtered_data = [];
      // data.forEach(function(d, i) {
      //   if ( (beginDate <= d.date) && (d.date <= endDate) ) {
      //     filtered_data.push(d);
      //   }
      // });

      // Construct a series object of our data.
      stack.values(function(d) { return d.values; });

      var allSeries = stack(color.domain().map(function(name) {
        return {
          name: name,
          values: data.map(function(d) {
            return {date: d.date, y: d[name]};
          })
        };
      }));
      

      // Update the x-scale.
      xScale
          .domain(d3.extent(data, function(d) { return d.date; }))
          .range([0, width]);


      // Update the y-scale.
      yScale
        .domain([
          0,
          d3.max(allSeries, function(series) { return d3.max(series.values, function(d) { return d.y0 + d.y; }); })])
        .range([height, 0]);

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([allSeries]);

      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter().append("svg").append("g");
      for (var i = 0; i < allSeries.length; i++) {
        gEnter.append("g")
            .attr("class", "series")
          .append("path")
            .attr("class", function() { return "area ia series_" + allSeries[i].name; });
      }
      gEnter.append("g").attr("class", "x axis").call(xAxis);
      gEnter.append("g").attr("class", "y axis").call(yAxis);

      // Update the outer dimensions.
      svg.attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom);

      // Update the inner dimensions.
      var g = svg.select("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Update the x-axis.
      g.select(".x.axis")
          .attr("transform", "translate(0," + yScale.range()[0] + ")")
          // .transition()
          // .duration(500)
          .call(xAxis);

      // Update the y-axis.
      g.select(".y.axis")
          // .transition()
          // .duration(500)
          .call(yAxis);

      // Update the line paths.
      g.selectAll(".series")
        .data(function(d) {return d;})
      .enter()
        .append("g")
        .attr("class", "series")
      .append("path")
        .attr("class", function(d) { return "area ia series_" + d.name; });

      g.selectAll(".series path")
          .data(function(d) {return d;})
          .style("fill", function(d) { return color(d.name); })
          // .transition()
          // .duration(500)
          .attr("d", function(d) { return area(d.values); });

      g.selectAll(".series")
          .data(function(d) {return d;})
        .exit()
          .remove();

      d3.select("#chart-legend")
          .selectAll(".legend-item")
          .data(allSeries)
        .enter().append("div")
          .html(function(d, i) {
            return '<a class="series_' + d.name + '" data-toggle="popover" data-content="' + d.name + '" data-placement="top" data-animation="false"></a>';
          })
          .attr("class", "legend-item");


    });
  }

  // The x-accessor for the path generator; xScale(xValue).
  function X(d) {
    // return xScale(d[0]);
    return xScale(d.date);
  }

  // The x-accessor for the path generator; yScale(yValue).
  function Y0(d) {
    // return yScale(d[1]);
    return yScale(d.y0);
  }

  // The x-accessor for the path generator; yScale(yValue).
  function Y1(d) {
    // return yScale(d[1]);
    return yScale(d.y0 + d.y);
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