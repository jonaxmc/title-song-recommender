
$(function (){
    $.ajax({
        url: '/barras',
        success: function(datos){
            var datosNube = []

                for (var i = 0; i < datos['prediccion']['cloud'].length; i++) {
                    var name = datos['prediccion']['cloud'][i];
                    var weight = datos['prediccion']['corpus'][0][i][1];
                    obj = {
                        name: name,
                        weight: weight
                      };
                      datosNube.push(obj);
    
                }

            Highcharts.chart('tabla-nube', {
                accessibility: {
                    screenReaderSection: {
                        beforeChartFormat: '<h5>{chartTitle}</h5>' +
                            '<div>{chartSubtitle}</div>' +
                            '<div>{chartLongdesc}</div>' +
                            '<div>{viewTableButton}</div>'
                    }
                },
                series: [{
                    type: 'wordcloud',
                    data: datosNube,
                    name: 'Frecuencia'
                }],
                title: {
                    text: 'Nube de Palabras'
                }
            });


        }
    })
})

$(function () {
    $.ajax({
        url: '/barras',
        success: function (datos) {
            var datosGrafica = [];
            var palabrasGrafica = [];
            var tipoSentimientoGrafica = [];
            var positivo = 'Positivo';
            var neutro = 'Neutro';
            var negativo = 'Negativo';


            for (var i = 0; i < datos['prediccion']['palabras'].length; i++) {
                var x = datos['prediccion']['palabras'][i];
                var y = datos['prediccion']['sentimientos'][i];
                datosGrafica.push([x, y]);
                palabrasGrafica.push([x])

                if (datos['prediccion']['sentimientos'][i] >= 0.5) {
                    tipoSentimientoGrafica.push([positivo])
                } else if (datos['prediccion']['sentimientos'][i] <= -0.5) {
                    tipoSentimientoGrafica.push([negativo])
                } else if (datos['prediccion']['sentimientos'][i] == 0.0) {
                    tipoSentimientoGrafica.push([neutro])
                }
            }
         


            Highcharts.chart('tabla-hi', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Polaridad Sentimientos de Tokens'
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: palabrasGrafica
                },
                yAxis: {
                    min: -1,
                    max: 1,
                    title: {
                        text: 'POLARIDAD'
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },

                series: [
                    {
                        colorByPoint: false,
                        data: datosGrafica
                    }
                ]
            }
            );
        }
    });
})

$(function () {
    $.ajax({
        url: '/barras',
        success: function (datos) {
            var datosGraficaFrecuencia = [];
            var palabrasGraficaFrecuencia = [];

            for (var i = 0; i < datos['prediccion']['palabras'].length; i++) {
                var x = datos['prediccion']['palabras'][i];
                var y = datos['prediccion']['res'][i];
                datosGraficaFrecuencia.push([x, y, true]);
                palabrasGraficaFrecuencia.push([x]);
            }



            Highcharts.chart('tabla-hi-frecuencia', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Frecuencia de Tokens'
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: palabrasGraficaFrecuencia
                },
                yAxis: {
                    title: {
                        text: 'Frecuencia'
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },

                series: [
                    {

                        type: 'pie',
                        allowPointSelect: true,
                        keys: ['name', 'y', 'selected', 'sliced'],
                        data: datosGraficaFrecuencia
                    }
                ]
            }
            );
        }
    });
})

// $(function (){
//     $.ajax({
//         url:'/barras',
//         success: function(datos){
//             // var fs = require('fs');
//             // fs.unlink(datos['path']);
            
//             console.log('path ',datos['path'])            
//         }
//     })
// });


