 // Load the Visualization API and the corechart package.
 // google.charts.load('current', {
 //     'packages': ['corechart']
 // });
 // Set a callback to run when the Google Visualization API is loaded.
 // google.charts.setOnLoadCallback(drawChart);
 // Callback that creates and populates a data table,
 // instantiates the pie chart, passes in the data and
 // draws it.
 // function drawChart() {
 //     // Create the data table.
 //     var data = new google.visualization.DataTable();
 //     data.addColumn('string', 'Topping');
 //     data.addColumn('number', 'Slices');
 //     data.addRows([
 //          ['Mushrooms', 3]
 //          , ['Onions', 1]
 //        ]);
 //     // Set chart options
 //     var options = {
 //         'title': 'How Much Pizza I Ate Last Night'
 //         , 'width': 400
 //         , 'height': 400
 //     };
 //     // Instantiate and draw our chart, passing in some options.
 //     var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
 //     chart.draw(data, options);
 // }
 $('#vote').unbind('submit').bind('submit', function (evt) {
     evt.preventDefault();
     var data = $(this).serialize();
     console.log('form-data', data);
     $.ajax({
          "url": $(this).attr('action')
         , "type": 'POST'
         , "data": data
         , "success": function () {
             console.log("yes");
         }
         , "error": function () {
             console.log("no");
         }
     }).done(function (response) {
         console.log(response);
     }).fail(function () {}).always(function () {
         $('#vote')[0].reset();
     });
 });