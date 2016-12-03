var Chart = (function(){
    
    google.charts.load('current', {
        'packages': ['corechart']
    });
    var chartObj = {};
    function addDataToChart (dataArr) {
        var data = dataArr;
        return function drawChart() {
            // Create the data table.
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Topping');
            data.addColumn('number', 'Slices');
            data.addRows(dataArr);
            // Set chart options
            var options = {
                  'width': '100%'
                , 'height': '100%'
                , is3D: true
                , legend: {
                    alignment: 'center',
                    position: 'bottom',
                },
                fontSize: '14'
            };
            // Instantiate and draw our chart, passing in some options.
            var chart = new google.visualization.PieChart(document.getElementById('chart-div'));
            chart.draw(data, options);
        };
    }
    chartObj.showPieChart = function (url,type,form,data) {
        var completeReqObj;
        var reqObj = {
            "url": url
            , "type": type
            , "success": function () {
                console.log("yes");
            }
            , "error": function () {
                console.log("no");
            }
        };
        if(data){
            completeReqObj = Object.assign(reqObj,{
                  data:data
              });
        } else {
            completeReqObj = reqObj;
        }
        $.ajax(completeReqObj).done(function (data) {
            console.log(data);
            var dataArr = data.poll.options.map((x) => [x.name, x.votes]);
            google.charts.setOnLoadCallback(addDataToChart(dataArr, decodeURIComponent(data.poll.title)));
        }).fail(function () {
            console.log(new Error('failed'));
        }).always(function () {
            if(form){
                $(form)[0].reset();
            }
        });
}

    
    return chartObj;
    
})();


