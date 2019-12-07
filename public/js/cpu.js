$(document).ready(function(){
            
    var cpuCtx = document.getElementById('chartCpu');
    var diskCtx = document.getElementById('chartDisk');

    var color = Chart.helpers.color;
    var chartCpuConfig = {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'The percentage of CPU utilization (User level)',
                backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                borderColor: window.chartColors.red,
                fill: false,
                data: [],
                borderWidth: 1
            },
            {
                label: 'The percentage of CPU utilization (System level)',
                backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
                borderColor: window.chartColors.blue,
                fill: false,
                data: [],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            animation: {
                duration: 0
            },
            scales: {
                xAxes: [{
                    display: true
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    };

     var chartDiskConfig = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'The number of Kilobyte per transfers',
                backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
                borderColor: window.chartColors.red,
                fill: false,
                data: [],
                borderWidth: 1
            }]
        },
        options: {
            responsive: false,
            animation: {
                duration: 0
            },
            scales: {
                xAxes: [{
                    display: true
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    };

    var cpuChart = new Chart(cpuCtx, chartCpuConfig);
    var diskChart = new Chart(diskCtx, chartDiskConfig);

    var socket;
    var wsHost = 'ws://localhost:8000';

    document.getElementById('buttonStart').addEventListener('click', function() {
        fetch('http://localhost:8000/connect', {method: 'GET'})
        .then(function(data) {
            return data.json();
        })
        .then(function(res) {
            if (res.success) {
                socket = new WebSocket(wsHost);

                socket.onopen = function() {
                    console.log('connection opened...');
                }

                socket.onerror = function(e) {
                    console.log(e);
                }

                socket.onclose = function(e) {
                    console.log(e);
                }

                socket.onmessage = function(event) {
                    var data = JSON.parse(event.data);
                    console.log(data);

                    cpuChart.config.data.labels.push(data.date);
                    cpuChart.config.data.datasets[0].data.push(data.cpu.user);
                    cpuChart.config.data.datasets[1].data.push(data.cpu.system);
                    
                    cpuChart.update();

                    diskChart.config.data.labels.push(data.date);
                    diskChart.config.data.datasets[0].data.push(data.disk.kbPerT);

                    diskChart.update();

                    if (cpuChart.config.data.labels.length > 10) {
                        cpuChart.config.data.labels.shift();
                        cpuChart.config.data.datasets[0].data.shift();
                        cpuChart.config.data.datasets[1].data.shift();

                        cpuChart.update();

                        diskChart.config.data.labels.shift();
                        diskChart.config.data.datasets[0].data.shift();

                        diskChart.update();
                    }
                    
                }
            } else {
                showWarning(res.message);
            }
        })
        .catch(function(error) {
            showWarning(error);
        });
    });

    document.getElementById('buttonStop').addEventListener('click', function() {
        fetch('http://localhost:8000/disconnect', {method: 'GET'})
        .then(function(data) {
            return data.json();
        })
        .then(function(res) {
            if (res.success) {
                socket.close();
            } else {
                showWarning(res.message);
            }
        })
        .catch(function(error) {

        });
    });

});