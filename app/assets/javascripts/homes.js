// dataset1
// var data = new Array();
// for (var day=10; day < 30; day++) { 
//     for (hour=10; hour < 24; hour++) { 
//         data.push({
//             'date': '2013-02-'+day+' '+hour+':00:00',
//             'running': Math.floor(Math.random()*200),
//             'waiting': Math.floor(Math.random()*100),
//         });
//     }
// }

var pieData = [
	{'category': 'USA', 'count': 432},
	{'category': 'Europe', 'count': 255},
  {'category': 'Asia', 'count': 50},
	{'category': 'Austrailia', 'count': 13}
];

var barData = [
  {'category': 'Jan', 'count': 1},
  {'category': 'Feb', 'count': 14},
  {'category': 'Mar', 'count': 25},
  {'category': 'Apr', 'count': 40},
  {'category': 'May', 'count': 14},
  {'category': 'Jun', 'count': 45},
  {'category': 'Jul', 'count': 76},
  {'category': 'Aug', 'count': 34},
  {'category': 'Sep', 'count': 23},
  {'category': 'Oct', 'count': 24},
  {'category': 'Nov', 'count': 36},
  {'category': 'Dec', 'count':  2}
];

var timeSeriesChart = new TimeSeriesChart()
  .showOverlay(true);
var barChart = new BarChart().oneColor(true);
var pieChart = new PieChart();

$(document).ready(function($) {
  $('input[name="hashtagLookup"]').focus();

	$.get(document.URL + '/data', function(rawData) {
    data = aggregateData(rawData);
    drawDashboard(data);

  	$(window).resize(function() {
  		drawDashboard(data);
  	});
  });

});

function drawDashboard(data) {
		
    $('.chart').html('');
		d3.select('#timeSeriesChart')
			.data([data.timeSeries])
			.call(timeSeriesChart);

		d3.select('#pieChart')
			.data([pieData])
			.call(pieChart);

    d3.select('#barChart')
     .data([barData])
     .call(barChart);


}

function aggregateData(rawData) {
  rawData.sort(d3.ascending);
  aggregateData = {};   
  rawData.forEach(function(d) {
    if ( aggregateData[d.substr(0,10) + ' ' + d.substr(11,8)] ) {
      aggregateData[d.substr(0,10) + ' ' + d.substr(11,8)]++;
    } else {
      aggregateData[d.substr(0,10) + ' ' + d.substr(11,8)] = 1;
    }
  });

  data = {timeSeries: [], category: []};
  $.each(aggregateData, function(d, c) {
    data.timeSeries.push({
      'date': d,
      'count': c
    });
  });

  // var now = new Date();
  // var datetime = new Date();
  // datetime.setMinutes(now.getMinutes() - 60);
  // for (var minute = 0; minute < 60; minute++) {
  //   for (var second = 0; second < 60; second++) {
  //     datetime.setSeconds(datetime.getSeconds() + 1);
  //     var thisTime = datetime.getFullYear() + "-" + ('0' + (datetime.getMonth()+1)).slice(-2) + '-' + ('0' + (datetime.getDate())).slice(-2) + ' ' + ('0' + (datetime.getHours())).slice(-2) + ':' + ('0' + (datetime.getMinutes())).slice(-2) + ':' + ('0' + (datetime.getSeconds())).slice(-2);
  //     var thisCount = (aggregateData[thisTime]) ? aggregateData[thisTime] : 0;
  //     console.log(thisTime);
  //     data.push({
  //       'date': thisTime,
  //       'count': thisCount
  //     });
  //   };
  // };

  return data;
}