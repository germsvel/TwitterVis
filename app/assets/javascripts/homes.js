// // dataset1
// var dataset1 = new Array();
// for (var day=10; day < 30; day++) { 
//     for (hour=10; hour < 24; hour++) { 
//         dataset1.push({
//             'date': '2013-02-'+day+' '+hour+':00:00',
//             'running': Math.floor(Math.random()*200),
//             'waiting': Math.floor(Math.random()*100),
//         });
//     }
// }

// var categoryData = [
// 	{'category': 'tweetsLow', 'count': 432},
// 	{'category': 'tweetsMed', 'count': 155},
// 	{'category': 'tweetsHigh', 'count': 200}
// ];

$('input[name="hashtagLookup"]').focus();

var timeSeriesChart = new TimeSeriesChart();
  // .showOverlay(true);
var barChart = new BarChart();
var pieChart = new PieChart();

$(document).ready(function($) {
	$.get(document.URL + '/data', function(rawData) {
    drawDashboard(rawData);

  	$(window).resize(function() {
  		drawDashboard(rawData);
  	})
  });

});

function drawDashboard(rawData) {
		aggregateData = {};		
		rawData.forEach(function(d) {
      if ( aggregateData[d.substr(0,10) + ' ' + d.substr(11,8)] ) {
        aggregateData[d.substr(0,10) + ' ' + d.substr(11,8)]++;
      } else {
        aggregateData[d.substr(0,10) + ' ' + d.substr(11,8)] = 1;
      }
    });

    data = [];
    $.each(aggregateData, function(d, c) {
      data.push({
        'date': d,
        'count': c
      });
    });

    $('.chart').html('');
		d3.select('#timeSeriesChart')
			.data([data])
			.call(timeSeriesChart);

		// d3.select('#barChart')
		// 	.data([categoryData])
		// 	.call(barChart);

		// d3.select('#pieChart')
		// 	.data([categoryData])
		// 	.call(pieChart);

}