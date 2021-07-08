
var json = sessionStorage.getItem("historialJSON");
var obj = JSON.parse(json);
var historial1= JSON.parse(json);
var container = document.getElementById('container-historial');
var h = document.getElementById('tabla-historial');



if (obj == null) {
    container.innerHTML = '<div class="contenedor-centrar"><img class="img-oh-no" src="/static/oh-no.png")}}"></div><div class="texto contenedor-centrar">Todavía no hay canciones para mostrar</div><div class="contenedor-centrar" id="contenedor-historial"><a class="btn-primario a-btn" href="/" role="button">PRUEBA CON UNA CANCIÓN</a></div>';
} else {
    console.log('OBJ ', obj)
    var seriesData = [];
    var seriesData2 = [];
    for (var i = 0; i < obj['canciones'].length; i++) {
        var x = obj['canciones'][i]['titulo_original'];
        var y = obj['canciones'][i]['similitud'];

        var x2 = obj['canciones'][i]['titulo predicho'];
        var y2 = obj['canciones'][i]['similitud 2'];

        seriesData.push([x, y]);
        seriesData2.push([x2,y2]);
    }

    Highcharts.chart('similitud1', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'History of Similarity of Recommendations Vs. Original Titles '
        },
        subtitle: {
            text: ''
        },
        accessibility: {
            announceNewData: {
                enabled: true
            }
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            min: 0,
            max: 1,
            title: {
                text: 'Similarity '
            }

        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.1f}'
                }
            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b> of total<br/>'
        },

        series: [
            {

                colorByPoint: true,
                data: seriesData2
            }
        ]

    });

    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'History of Similarity of Recommendations Vs. Original Titles '
        },
        subtitle: {
            text: ''
        },
        accessibility: {
            announceNewData: {
                enabled: true
            }
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            min: 0,
            max: 1,
            title: {
                text: 'Similarity '
            }

        },
        legend: {
            enabled: false
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.1f}'
                }
            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b> of total<br/>'
        },

        series: [
            {

                colorByPoint: true,
                data: seriesData
            }
        ]

    });

    console.log('DATOS ALI2', obj)
  



}