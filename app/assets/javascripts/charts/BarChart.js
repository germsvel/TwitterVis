function BarChart() {

    var margin           = {top: 40, right: 20, bottom: 40, left: 60},
        xScale           = d3.scale.ordinal(),
        yScale           = d3.scale.linear(),
        xAxis            = d3.svg.axis().scale(xScale).orient("bottom").ticks(5),
        yAxis            = d3.svg.axis().scale(yScale).orient("left"),
        color            = d3.scale.category20c(),
        oneColor         = false,
        rotateAxisLabels = false,
        noTicks          = false;
            

    function chart(selection) {
        selection.each(function(data)
        {
            var width = $(selection[0]).width()-margin.left-margin.right;
            var height = $(selection[0]).height()-margin.top-margin.bottom;

            data.forEach(function(d) {
                d.count = +d.count;
            });

            // Update the x-scale.
            xScale
                .rangeRoundBands([0, width], .1)
                .domain(data.map(function(d) { return d.category; }));

            // Update the y-scale.
            yScale
                .range([height, 0])
                .domain([0, d3.max(data, function(d) { return d.count; })]);

            // Select the svg element, if it exists.
            var svg = d3.select(this).selectAll("svg").data([data]);

            // Otherwise, create the skeletal chart.
            var gEnter = svg.enter().append("svg").append("g");
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
                .transition()
                .duration(500)
                .call(xAxis);

            if (rotateAxisLabels) {
                svg.selectAll(".x.axis text")
                    .attr("transform", "rotate(-45)translate(-9, -7)")
                    .style("text-anchor", "end");
            }

            // Update the y-axis.
            g.select(".y.axis")
                .transition()
                .duration(500)
                .call(yAxis);

            // Update the bars.
            var bars = g.selectAll(".bar").data(function(d) {return d;});

            bars.enter()
                .append("rect").attr("class", "bar").attr("height", 0).attr("y", height);
            bars
                .attr("x", function(d) { return xScale(d.category); })
                .attr("width", xScale.rangeBand())
                .attr("fill", function(d) { 
                    if (oneColor) {
                        return '#1f77b4';
                    } else {
                        return color(d.category);
                    }
                })
                // .attr("height", 0)
                // .attr("y", height)
                .transition()
                .duration(500)
                .attr("height", function(d) { return height - yScale(d.count); })
                .attr("y", function(d) { return yScale(d.count); });
            bars.exit().remove();


            // Hover info
            $(this).find('.hoverItems').remove();
            $(this).append('<div class="hoverItems"></div>');
            d3.select(this).select(".hoverItems")
                .selectAll(".hover-item")
                    .data(data)
                .enter().append("div")
                    .html(function(d, i) {
                        return '<a data-toggle="popover" data-content="<strong><span style=\'color: #1f77b4;\'> '+d.category+': '+d.count+' </span></strong>" data-placement="top" data-animation="false"></a>';
                    })
                    .attr("class", "hover-item");

            // Hover handler
            g.selectAll(".bar")
                .data(function(d) {return d;})
                .on("mouseover", function(d, i) {

                    var top = $('.bar').eq(i).position().top - 5;
                    var left = $('.bar').eq(i).position().left + (this.getBBox().width / 2);

                    barInfo = $('.hover-item a').eq(i);
                    barInfo.popover({ html: true });
                    barInfo.css({'position': 'absolute', 'top': top, 'left': left}).popover('show');

                })
                
                .on("mouseout", function(d, i) {
                    barInfo = $('.hover-item a').eq(i);
                    barInfo.popover('hide');
                });
        });
    }

    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.xAxisTickValues = function(_) {
        if (!arguments.length) return xAxis.tickValues();
        xAxis.tickValues(_);
        return chart;
    };

    chart.oneColor = function(_) {
        if (!arguments.length) return oneColor;
        oneColor = _;
        return chart;
    };

    chart.rotateAxisLabels = function(_) {
        if (!arguments.length) return rotateAxisLabels;
        rotateAxisLabels = _;
        return chart;
    };

    chart.noTicks = function(_) {
        if (!arguments.length) {
            if ( xAxis.tickSize() == 0 ) {
                return true;
            } else {
                return false;
            }
        }

        if (_ == true) {
            xAxis.tickSize(0);
        } else {
            xAxis.tickSize(1);
        }
        return chart;
    };

    return chart;
}