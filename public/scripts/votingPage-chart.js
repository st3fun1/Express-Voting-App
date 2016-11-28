/* object Helpers used from helpers.js */
/* get updated chart when voting */
$('#vote').unbind('submit').bind('submit', function (evt) {
    evt.preventDefault();
    var data = $(this).serialize();
    console.log(data);
Chart.showPieChart($(this).attr('action'),'POST','#vote',data);
});

/* Chart on load*/
Chart.showPieChart('/polls/getPoll?','GET','#vote',{
    username: Helpers.GetURLParameter('username'),
    pollTitle: encodeURIComponent(Helpers.GetURLParameter('pollTitle'))
});