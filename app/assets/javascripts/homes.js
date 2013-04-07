// dataset1
var dataset1 = new Array();
for (var day=10; day < 30; day++) { 
    for (hour=10; hour < 24; hour++) { 
        dataset1.push({
            'date': '2013-02-'+day+' '+hour+':00:00',
            'running': Math.floor(Math.random()*200),
            'waiting': Math.floor(Math.random()*100),
        });
    }
}

var categoryData = [
	{'category': 'tweetsLow', 'count': 432},
	{'category': 'tweetsMed', 'count': 155},
	{'category': 'tweetsHigh', 'count': 200}
];

var timeSeriesChart = new TimeSeriesChart().showOverlay(true);
var barChart = new BarChart();
var pieChart = new PieChart();

$(document).ready(function($) {
	setTimeout(function() {
		$('.chart').html('');

		drawDashboard();

		$(window).resize(function() {
			drawDashboard();
		})

	}, 1000);

});

function drawDashboard() {
	d3.select('#timeSeriesChart')
		.data([dataset1])
		.call(timeSeriesChart);

	d3.select('#barChart')
		.data([categoryData])
		.call(barChart);

	d3.select('#pieChart')
		.data([categoryData])
		.call(pieChart);
}