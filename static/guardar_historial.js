$(function (){
    $.ajax({
        url:'/barras',
        success: function(datos){ 
            let array = {};
            array["canciones"] = [];
            var json = sessionStorage.getItem("historialJSON");
            var obj = JSON.parse(json);
            data = datos['prediccion']['historial']
            console.log("AKI", obj)
            if (obj == null) {
                console.log("NO HAY DATOS")
                array["canciones"].push(data);
                sessionStorage.setItem("historialJSON", JSON.stringify(array));
            } else {
                console.log('HAY DATOS')
                obj["canciones"].push(data);
                sessionStorage.setItem("historialJSON", JSON.stringify(obj));
            }
                       
        }
    })
});




