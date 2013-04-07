// Usage notes:
//   - data has to be in ascending order

function TimeSeriesChart() {

    var margin      = {top: 10, right: 10, bottom: 110, left: 40},
        xScale      = d3.time.scale(),
        yScale      = d3.scale.linear(),
        xAxis       = d3.svg.axis().scale(xScale).orient("bottom").ticks(7),
        yAxis       = d3.svg.axis().scale(yScale).orient("left").ticks(5),
        line        = d3.svg.line().interpolate("linear").x(X).y(Y),
        parseDate   = d3.time.format("%Y-%m-%d %X").parse,
        bisectDate  = d3.bisector(function(d) { return d.date; }).left,
        beginDate   = '',
        endDate     = '',
        color       = d3.scale.category20c(),

        marginBrush = {right: margin.right, bottom: 30, left: margin.left}, // .top is set dynamically
        xScaleBrush = d3.time.scale(),
        yScaleBrush = d3.scale.linear(),
        xAxisBrush  = d3.svg.axis().scale(xScaleBrush).orient("bottom").ticks(7),
        brush       = d3.svg.brush(),
        brushDirty,
        showLegend,
        showOverlay;

    function chart(selection) {
        selection.each(function(data)
        {
            marginBrush.top = $(selection[0]).height() - marginBrush.bottom - 50;

            var width = $(selection[0]).width() - margin.left - margin.right,
                height = $(selection[0]).height() - margin.top - margin.bottom,
                heightBrush = $(selection[0]).height() - marginBrush.top - marginBrush.bottom;


            // Set the domain of the color scale to all categories but date
            color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

            data.forEach(function(d) {
                if (!d.date.getMonth) {
                    d.date = parseDate(d.date);
                }
            });

            // If beginDate and endDate are set, filter data.
            // var filteredData = new Array();
            // if (beginDate.getMonth) {
            //     data.forEach(function(d, i) {
            //       if ( (beginDate <= d.date) && (d.date <= endDate) ) {
            //         filteredData.push(d);
            //       }
            //     })

            // // Otherwise, use full dataset.
            // } else {
            //     filteredData = data;
            // }

            // Construct an array with one element for each data series we have.
            var allSeries = color.domain().map(function(name) {
                return {
                    name: name,
                    values: data.map(function(d) {
                        return {date: d.date, count: +d[name]};
                    })
                };
            });

            // Update the x-scale.
            xScale
                .domain(d3.extent(data, function(d) { return d.date; }))
                .range([0, width]);
            xScaleBrush
                .domain(xScale.domain())
                .range([0, width]);

            // Update the y-scale.
            var all_values = Array();
            $.each(data, function(i, obj) {
                $.each(obj, function(k, v) {
                    if (k != 'date') {
                        all_values.push(+v);
                    }
                });
            });
            yScale
                .domain(d3.extent(all_values))
                .range([height, 0]);
            yScaleBrush
                .domain(yScale.domain())
                .range([heightBrush, 0]);

            // Update the brush.
            brush
                .x(xScaleBrush)
                .on("brush", brushed);

            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([allSeries]);

            // Otherwise, create the skeletal chart & skeletal brush.
            var svgEnter = svg.enter().append("svg");
            var gEnter = svgEnter.append("g").attr("class", "chart");
            gEnter.append("clipPath").attr("id", "clipPath").append("rect").attr("width", width).attr("height", height);
            for (var i = allSeries.length - 1; i >= 0; i--) {
                gEnter.append("path").attr("class", "line").attr("clip-path", "url(#clipPath)").style("opacity", 0);
            };
            gEnter.append("g").attr("class", "x axis").call(xAxis);
            gEnter.append("g").attr("class", "y axis").call(yAxis);

            var gEnterBrush = svgEnter.append("g").attr("class", "brush");
            gEnterBrush.append("clipPath").attr("id", "clipPathBrush").append("rect").attr("width", width).attr("height", heightBrush);
            for (var i = allSeries.length - 1; i >= 0; i--) {
                gEnterBrush.append("path").attr("class", "line").attr("clip-path", "url(#clipPathBrush)").style("opacity", 0);
            };
            gEnterBrush.append("g").attr("class", "x axis").call(xAxisBrush);
            gEnterBrush.append("g").attr("class", "x brush"); //.call(brush).selectAll("rect").attr("y", -6).attr("height", heightBrush + 7);


            // Update the outer dimensions.
            svg.attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom);

            // Update the inner dimensions.
            var g = svg.select("g.chart")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var gBrush = svg.select("g.brush")
                    .attr("transform", "translate(" + marginBrush.left + "," + marginBrush.top + ")");

            // Update the chart's x-axis.
            g.select(".x.axis")
                    .attr("transform", "translate(0," + yScale.range()[0] + ")")
                    .transition()
                    .duration(500)
                    .call(xAxis);

            // Update the chart's y-axis.
            g.select(".y.axis")
                    .transition()
                    .duration(500)
                    .call(yAxis);

            // Update the chart's line paths.
            g.selectAll(".line")
                    .data(function(d) {return d;})
                    .style("stroke", function(d) { return color(d.name); })
                    .transition()
                    .duration(500)
                    .style("opacity", 1)
                    .attr("d", function(d) { return line(d.values); });

            // Update the brush's x-axis.
            gBrush.select(".x.axis")
                    .attr("transform", "translate(0," + yScaleBrush.range()[0] + ")")
                    .transition()
                    .duration(500)
                    .call(xAxisBrush);

            // Update the brush's brush.
            gBrush.select(".x.brush")
                    .transition()
                    .duration(500)
                    .call(brush)
                .selectAll("rect")
                    .attr("y", -6)
                    .attr("height", heightBrush + 7);

            // Update the brush's line paths.
            gBrush.selectAll(".line")
                    .data(function(d) {return d;})
                    .style("stroke", function(d) { return color(d.name); })
                    .transition()
                    .duration(500)
                    .style("opacity", 1)
                    .attr("d", function(d) { return line(d.values); });

            if (showLegend) {
                var legend = g.selectAll(".legend")
                  .data(color.domain().slice())
                .enter().append("g")
                  .attr("class", "legend")
                  .attr("transform", function(d, i) { return "translate( 0 , " + (i*20) + ")"; });

                legend.append("rect")
                    .attr("x", width - 18)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", color);

                legend.append("text")
                    .attr("x", width - 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(function(d) { return d; });
            }

            if (showOverlay) {
                gEnter.append("rect")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("class", "overlay");

                var tooltipEnter = gEnter.append("g")
                    .attr("class", "overlayTooltip")
                    .style("display", "none");

                tooltipEnter.append("line")
                    .attr("y2", height)
                    .style("stroke", "#999");

                tooltipEnter.append("path")
                    .style("fill", "white")
                    .style("stroke", "#999")
                    .attr("stroke-width", "1px")
                    .attr("d", "M2.5,11.513496398925781 L2.5,11.513496398925781 C2.5,6.535900115966797 6.4405975341796875,2.5 11.301300048828125,2.5 L15.303199768066406,2.5 L15.303199768066406,2.5 L34.508995056152344,2.5 L70.51799011230469,2.5 C72.85198974609375,2.5 75.08999633789062,3.449298858642578 76.74200439453125,5.140098571777344 C78.39299011230469,6.830799102783203 79.31999206542969,9.123699188232422 79.31999206542969,11.513496398925781 L79.31999206542969,58.0469970703125 L79.31999206542969,58.0469970703125 L79.31999206542969,71.56700134277344 L79.31999206542969,71.56700134277344 C79.31999206542969,76.54499816894531 75.37899780273438,80.58099365234375 70.51799011230469,80.58099365234375 L46.508995056152344,80.58099365234375 L38.41899871826172,92.5 L32.303199768066406,80.58099365234375 C35.969200134277344,80.58099365234375 12.635299682617188,80.58099365234375 11.301300048828125,80.58099365234375 C6.4405975341796875,80.58099365234375 2.5,76.54499816894531 2.5,71.56700134277344 L2.5,71.56700134277344 L2.5,58.0469970703125 L2.5,58.0469970703125 L2.5,11.513496398925781 z")
                    .attr("transform", "rotate(90,0,100)translate(-100,0)");

                tooltipEnter.append("text")
                    .attr("transform", function(d, i) { return "translate(25, 25)"; })
                    .attr("class", "tooltipDate")
                    .text("Date");

                tooltipEnter.selectAll(".tooltipCategory")
                    .data(color.domain().slice())
                .enter().append("text")
                    .attr("transform", function(d, i) { return "translate(50, " + ((i*20) + 45) + ")"; })
                    .attr("class", function(d) { return d + " tooltipCategory"; })
                    .style("fill", color)
                    .text("testing");

                var tooltip = d3.select(this).select(".overlayTooltip");

                // console.log(data);
                function mousemove() {
                    var x0 = xScale.invert(d3.mouse(this)[0]),
                        i = bisectDate(data, x0, 1),
                        d0 = data[i - 1],
                        d1 = data[i],
                        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
                    // console.log(x0 + ' ' + i);
                    // console.log(x0);
                    // console.log(d3.mouse(this));
                    tooltip.attr("transform", "translate(" + xScale(d.date) + ",0)");
                    tooltip.select("text.tooltipDate").text( formatAMPM(d.date) )
                    tooltip.select("text.count").text(d.count)
                }

                g.on("mouseover", function() { tooltip.style("display", null); });
                g.on("mouseout", function() { tooltip.style("display", "none"); });
                g.select(".overlay").on("mousemove", mousemove);

            }


            if (brushDirty) {
                gBrush.select(".x.brush").call(brush);
                brushed();
            }

            function brushed() {
                xScale.domain(brush.empty() ? xScaleBrush.domain() : brush.extent());
                if (brushDirty) {
                    g.selectAll(".line")
                        .data(function(d) {return d;})
                        .style("stroke", function(d) { return color(d.name); })
                        .transition()
                        .duration(500)
                        .style("opacity", 1)
                        .attr("d", function(d) { return line(d.values); });
                    g.select(".x.axis")
                        .attr("transform", "translate(0," + yScale.range()[0] + ")")
                        .transition()
                        .duration(500)
                        .call(xAxis);
                } else {
                    g.selectAll(".line")
                        .data(function(d) {return d;})
                        .style("stroke", function(d) { return color(d.name); })
                        .style("opacity", 1)
                        .attr("d", function(d) { return line(d.values); });
                    g.select(".x.axis")
                        .attr("transform", "translate(0," + yScale.range()[0] + ")")
                        .call(xAxis);
                }
                brushDirty = 0;
            }
        });
    }


    function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        seconds = seconds < 10 ? '0'+seconds : seconds;
        var strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
        return strTime;
    }

    // The x-accessor for the path generator; xScale(xValue).
    function X(d) {
        // return xScale(d[0]);
        return xScale(d.date);
    }

    // The x-accessor for the path generator; yScale(yValue).
    function Y(d) {
        // return yScale(d[1]);
        return yScale(d.count);
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

    chart.filter = function(_) {
        if (!arguments.length) return brush.extent();
        brush.extent(_);
        brushDirty = 1;
        return chart;
    };

    chart.showLegend = function(_) {
        if (!arguments.length) return showLegend;
        showLegend = _;
        return chart;
    };

    chart.showOverlay = function(_) {
        if (!arguments.length) return showOverlay;
        showOverlay = _;
        return chart;
    };

    return chart;
}