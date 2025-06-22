 var SERVER_DATA = {
            columns: [],
            connections: 0,
            memory: { totalMemMb: 0, freeMemMb: 0, usedMemMb: 0 },
            cpu: 0,
            rooms: [],
        };

// Service Monitoring
const services = [
  { name: 'Game Server', id: 'game-service', url: 'http://localhost:2567/monitor/health' },
  { name: 'Gateway', id: 'gateway-service', url: 'http://localhost:5000/monitor/health' },
  { name: 'Main Site', id: 'web-service', url: 'http://localhost:3001/monitor/health' },
];

const checkHealth = async () => {
  for (const service of services) {
    const el = document.getElementById(service.id);
    try {
      const res = await fetch(service.url);
      const data = await res.json();
      el.classList.remove('service-loading', 'service-down');

      el.classList.add( 'service-up' );
      el.querySelector('.service-stats').innerHTML = `
      <p class="text-sm text-gray">Status: <span id="web-server-status"
                                    class="text-success text-sm">${data.status}</span></p>
    <p class="text-sm text-gray">Uptime: <span id="web-server-uptime"
                                    class="text-gray">${data.uptime}</span></p>
        `;
    } catch (err) {
        console.log(`Error checking ${service.name} health:`, err);
        el.classList.remove('service-up');
        el.classList.add('service-down');
       el.querySelector('.service-stats').innerHTML = `
      <p class="text-sm text-gray">Status: <span id="web-server-status"
                                    class="text-danger">Down</span></p>
    <p class="text-sm text-gray">Uptime: <span id="web-server-uptime"
                                    class="text-gray">N/A</span></p>
        `;
    }
  }
};

setInterval(checkHealth, 5000); // Check every 5 seconds
checkHealth();


        // Fetch data every second

        const MEM_CHART = Highcharts.chart('memory-usage', {
            chart: {
                type: 'pie',
                custom: {},
                backgroundColor: "#272630",
                width: 350,
                events: {
                    
                }
            },
            accessibility: {
                point: {
                    valueSuffix: 'MB'
                }
            },
            title: null,

            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'

            },
            legend: {
                enabled: true
            },
            plotOptions: {
                series: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    borderRadius: 4,
                    borderWidth: 0,
                    dataLabels: [{
                        enabled: false,
                        distance: 20,
                        format: '{point.name}'
                    }, {
                        enabled: true,
                        distance: -15,
                        format: '{point.y:.1f}GB',
                        style: {
                            fontFamily: 'Tomorrow, sans-serif',
                            color: '#fff', // ← your desired color
                            fontSize: '10px'
                        }
                    }],
                    showInLegend: true
                }
            },
            legend: {
                itemStyle: {
                    color: '#908ca8',         // ← your desired color
                    fontFamily: 'Tomorrow, sans-serif' // ← your desired font
                }
            },

            series: [{
                name: 'Memory Percentage',
                colorByPoint: true,
                innerSize: '75%',
                data: []
            }]
        });


        Highcharts.chart('cpu-usage-chart', {
            chart: {
                type: 'areaspline',
                animation: Highcharts.svg,
                backgroundColor: "#272630",
                marginRight: 10,
                events: {
                    load: function () {
                        const series = this.series[0];

                        // Simulate real-time CPU usage updates
                        setInterval(function () {
                            const x = (new Date()).getTime();
                            const y = SERVER_DATA.cpu; // Replace this with real CPU data
                            series.addPoint([x, y], true, true);
                        }, 3000);
                    }
                }
            },




            time: { useUTC: false },

            title: null,

            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150,
                gridLineWidth: 0,
                labels: {
                    style: {
                        color: '#908ca8' // ← change to your desired color
                    }
                },
            },

            yAxis: {
                title: { text: 'Usage %' },
                min: 0,
                max: 100,
                gridLineWidth: 0,
                labels: {
                    style: {
                        color: '#908ca8' // ← change to your desired color
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#908ca8'
                }]
            },

            tooltip: {
                formatter: function () {
                    return '<b>' + Highcharts.dateFormat('%H:%M:%S', this.x) + '</b><br/>' +
                        Highcharts.numberFormat(this.y, 2) + ' %';
                }
            },

            legend: { enabled: false },

            series: [{
                name: 'CPU Usage',
                marker: { enabled: false },
                data: (function () {
                    // Start with 20 points
                    const data = [], time = (new Date()).getTime();
                    for (let i = -200; i <= 0; i++) {
                        data.push({ x: time + i * 1000, y: 0 });
                    }
                    return data;
                })()
            }]
        });

        let dataTable;

        function msToTime(ms) {
            const sec = Math.floor((ms / 1000) % 60);
            const min = Math.floor((ms / 60000) % 60);
            const hr = Math.floor(ms / 3600000);
            return `${hr}h ${min}m ${sec}s`;
        }

        function loadRooms(data) {
            const rows = data.rooms.map((room, index) => ([
                index + 1,
                room.name,
                room.roomId,
                room.clients,
                room.maxClients,
                room.locked ? 'Yes' : 'No',
                room.private ? 'Yes' : 'No',
                room.unlisted ? 'Yes' : 'No',
                msToTime(room.elapsedTime),
                new Date(room.createdAt).toLocaleString(),
                room.processId
            ]));

            dataTable.clear().rows.add(rows).draw();
        }

        jQuery(document).ready(function ($) {
            dataTable = $('#rooms-table').DataTable({
                paging: true,
                searching: false,
                ordering: false,
                info: false
            });

            

        })




        function getServerStats() {
            fetch('http://localhost:2567/monitor/api')
                .then(response => response.json())
                .then(data => {
                    // console.log(data);
                    // Update the CPU usage chart with the fetched data
                    SERVER_DATA = data;
                })
                .catch(error => console.error('Error fetching CPU usage data:', error));
        }

        setInterval(() => {
            getServerStats();
            const total = SERVER_DATA.memory.totalMemMb; // e.g. total GB
            const used = SERVER_DATA.memory.usedMemMb;
            const free = total - used;

            MEM_CHART.series[0].setData([
                { name: 'Used Memory', y: parseFloat((used / 1024).toFixed(2)) },
                { name: 'Free Memory', y: parseFloat((free / 1024).toFixed(2)) }
            ]);

            loadRooms(SERVER_DATA);
        }, 3000); 