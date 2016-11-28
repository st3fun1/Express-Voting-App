Chart.showPieChart('/settings/polls/poll?','GET','#vote',{
    username: Helpers.GetURLParameter('username'),
    pollID: Helpers.GetURLParameter('pollID'),
    json: '1'
});
