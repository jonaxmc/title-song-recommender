


$(function () {
    $.ajax({
        url: '/barras',
        success: function (datos) {
            var text = datos['prediccion']['letraNube']
            

            var lines = text.split(/[,\. ]+/g),
                data = Highcharts.reduce(lines, function (arr, word) {
                    var obj = Highcharts.find(arr, function (obj) {
                        return obj.name === word;
                    });
                    if (obj) {
                        obj.weight += 1;
                    } else {
                        obj = {
                            name: word,
                            weight: 1
                        };
                        arr.push(obj);
                    }
                    return arr;
                }, []);

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
                    data: data,
                    name: 'Occurrences'
                }],
                title: {
                    text: 'Word Cloud'
                }
            });

        }
    })
});

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
                    text: 'Tokens Frequency'
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


$(function (){
    $.ajax({
        url: '/barras',
        success: function (datos){
            var y = []
            var z = []
            var name = []
            var array = []
            var obj = []        
            data2: [
                {  y: 0.7, z: 12, name: 'use'},
                {  y: 0, z: 12, name: 'somebodi' },      
                {  y: -0.5, z: 12, name: 'know'},
                
              ]  

            for (var i = 0; i < datos['prediccion']['sentimientos'].length; i++) {
                name.push(datos['prediccion']['palabras'][i])
                data = {
                    y : datos['prediccion']['sentimientos'][i]['compound'],
                    z:datos['prediccion']['res'][i],
                    name:datos['prediccion']['palabras'][i]
                }
                obj.push(data);             

            }

            console.log('Nueva grafica ', obj)

            Highcharts.chart('tabla-hi', {

                chart: {
                  type: 'bubble',
                  plotBorderWidth: 1,
                  zoomType: 'xy'
                },
              
                legend: {
                  enabled: false
                },
              
                title: {
                  text: 'Polarity'
                },
              
                xAxis: {
                  gridLineWidth: 1,
                  
                  categories: name,
                  plotLines: [{
                    color: 'black',
                    dashStyle: 'dot',
                    width: 2,
                    value: 65,
                    label: {
                      rotation: 0,
                      y: 15,
                      style: {
                        fontStyle: 'italic'
                      },
                    },
                    
                  }]
                },
              
                yAxis: {
                  min:-1,
                  max:1,
                  startOnTick: false,
                  endOnTick: false,
                  title: {
                    text: 'Polarity'
                  },
                  labels: {
                    format: '{value}'
                  },
                  maxPadding: 0.2,
                  plotLines: [{
                    color: 'black',
                    dashStyle: 'dot',
                    width: 2,
                    value: 50,
                    label: {
                      align: 'right',
                      style: {
                        fontStyle: 'italic'
                      },
                      text: 'Safe sugar intake 50g/day',
                      x: -10
                    },
                    zIndex: 3
                  }],
                 
                },
              
                tooltip: {
                  useHTML: true,
                  headerFormat: '<table>',
                  pointFormat: '<tr><th colspan="2"><h3>{point.name}</h3></th></tr>' +
                    '<tr><th>Polarity:</th><td>{point.y}</td></tr>' +
                    '<tr><th>Frecuency:</th><td>{point.z}</td></tr>',
                  footerFormat: '</table>',
                  followPointer: true
                },
              
                plotOptions: {
                  series: {
                    dataLabels: {
                      enabled: true,
                      format: '{point.name}'
                    }
                  }
                },
              
                series: [{
                  data: obj,
                   marker: {
                          fillColor: {
                              radialGradient: { cx: 0.4, cy: 0.3, r: 0.7 },
                              stops: [
                                  [0, 'rgba(255,255,255,0.5)'],
                                  [1, Highcharts.color(Highcharts.getOptions().colors[4]).setOpacity(0.5).get('rgba')]
                              ]
                          }
                      }
                }]
              
              });

        }
    })
})



// $(function () {
//     $.ajax({
//         url: '/barras',
//         success: function (datos) {
//             var palabras = []
//             var positivos = []
//             var negativos = []
//             var neutros = []

       

//             for (var i = 0; i < datos['prediccion']['sentimientos'].length; i++) {
//                 positivos.push(datos['prediccion']['sentimientos'][i]['pos']);
//                 negativos.push(datos['prediccion']['sentimientos'][i]['neg']);
//                 neutros.push(datos['prediccion']['sentimientos'][i]['neu']);
//                 palabras.push(datos['prediccion']['palabras'][i]);

//             }
//             console.log('POSITIVOS', positivos)
//             console.log('NEUTRO', neutros)
//             console.log('NEGATIVO', negativos)

//             Highcharts.chart('tabla-hi', {
//                 chart: {
//                     type: 'area'
//                 },
//                 title: {
//                     text: 'Tokens Polarity'
//                 },
//                 xAxis: {
//                     categories: palabras
//                 },
//                 yAxis: {
//                     min: 0,
//                     max: 1,
//                     allowDecimals: false
//                 },
//                 credits: {
//                     enabled: false
//                 },
//                 series: [{
//                     name: 'Positivo',
//                     data: positivos,
//                     color: '#30F58C'
//                 }, {
//                     name: 'Neutral',
//                     data: neutros,
//                     color: '#566573'
//                 }, {
//                     name: 'Negativo',
//                     data: negativos,
//                     color: '#FA8072'
//                 }]
//             });


//         }
//     })
// });

