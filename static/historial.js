
var json = sessionStorage.getItem("historialJSON");
var obj = JSON.parse(json);
var container = document.getElementById('container-historial');

console.log('HISTORIAL', obj)
if (obj == null) {
    container.innerHTML = '<div class="contenedor-centrar"><img class="img-oh-no" src="/static/oh-no.png")}}"></div><div class="texto contenedor-centrar">Todavía no hay canciones para mostrar</div><div class="contenedor-centrar" id="contenedor-historial"><a class="btn-primario a-btn" href="/" role="button">PRUEBA CON UNA CANCIÓN</a></div>';
} else {
    var seriesData = [];
    for (var i = 0; i < obj['canciones'].length; i++) {
        var x = obj['canciones'][i]['titulo_original'];
        var y = obj['canciones'][i]['similitud'];
        seriesData.push([x, y]);
    }

    Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Historial de Similitud de Recomendaciones Vs. Títulos Originales'
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
            title:{
                text: 'Canciones'
            },
            type: 'category'
        },
        yAxis: {
            title: {
                text: 'Similitud'
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

}