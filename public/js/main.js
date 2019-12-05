
var host = 'ws://localhost:8000';
var socket = new WebSocket(host);

socket.onopen = function() {
    console.log('connection opened...');
}

socket.onerror = function(e) {
    console.log(e);
}

socket.onclose = function(e) {
    console.log(e);
}

window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};