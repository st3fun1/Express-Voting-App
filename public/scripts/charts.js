function GetURLParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return decodeURIComponent(sParameterName[1]);
        }
    }
}

$(function () {
    google.charts.load('current', {
        'packages': ['corechart']
    });
    function addDataToChart(dataArr, title) {
        var data = dataArr;
        var titleOfPie = title;
        return function drawChart() {
            // Create the data table.
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Topping');
            data.addColumn('number', 'Slices');
            console.log('dataArr', dataArr);
            console.log('title', title);
            data.addRows(dataArr);
            // Set chart options
            var options = {
                'title': title
                , 'width': 400
                , 'height': 400
            };
            // Instantiate and draw our chart, passing in some options.
            var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
            chart.draw(data, options);
        }
    }
    $('#vote').unbind('submit').bind('submit', function (evt) {
        evt.preventDefault();
        var data = $(this).serialize();
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
        }).done(function (data) {
            var dataArr = data.poll.options.map((x) => [x.name, x.votes]);
            console.log(dataArr);
            console.log(data.poll.title);
            console.log(data.poll.options);
            google.charts.setOnLoadCallback(addDataToChart(dataArr, decodeURIComponent(data.poll.title)));
        }).fail(function () {}).always(function () {
            $('#vote')[0].reset();
        });
    });
    $.ajax({
            "url": '/polls/getPoll?'
            , "type": 'GET'
            , "data": {
                username: GetURLParameter('username'),
                pollTitle: encodeURIComponent(GetURLParameter('pollTitle'))
            }
            , "success": function () {
                console.log("yes");
            }
            , "error": function () {
                console.log("no");
            }
        }).done(function (data) {
            var dataArr = data.poll.options.map((x) => [x.name, x.votes]);
            console.log(dataArr);
            console.log(data.poll.title);
            console.log(data.poll.options);
            google.charts.setOnLoadCallback(addDataToChart(dataArr, decodeURIComponent(data.poll.title)));
        }).fail(function () {}).always(function () {
            $('#vote')[0].reset();
    });
    
});
