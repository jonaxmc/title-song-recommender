
from flask import Flask, render_template, request, jsonify, flash
from werkzeug.utils import secure_filename
from ShazamAPI import Shazam
from lyrics_extractor import SongLyrics
import glob
import nltk
from topic_modeling import clean_tweet
import os, os.path


nltk.download('punkt')
from nltk.corpus import stopwords  # to get rid of StopWords

nltk.download('stopwords')
stop_words = stopwords.words('english')
# instancia del objeto Flask 
app = Flask(__name__)
# Carpeta de subida
app.config['UPLOAD_FOLDER'] = './archivos'
datos = {}


@app.route("/")
@app.route("/home")
def upload_file():
    # renderiamos la plantilla "formulario.html"
    return render_template('index.html',
                           titulo="BIENVENIDO INGRESA UNA CANCIÓN")


@app.route('/barras')
def barras():
    global datos
    info = {"prediccion": datos}
    return jsonify(info)

@app.route('/historial')
def historial():
  return render_template('historial.html')

@app.route("/upload", methods=['GET','POST'])
def uploader():
    if request.method == 'POST':
        # obtenemos el archivo del input "archivo"
        f = request.files['archivo']
        filename = secure_filename(f.filename)
        print("F ", filename)
        # Guardamos el archivo en el directorio "Archivos PDF"
        f.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        #print("archivo_", filename)
        # Retornamos una respuesta satisfactoria
        targetPattern = r"./archivos/*.mp3"
        archivos = glob.glob(targetPattern)
        #print(archivos)
        mp3_file_content_to_recognize = open("./archivos/" + filename,
                                             'rb').read()

        shazam = Shazam(mp3_file_content_to_recognize)
        global path
        path = './archivos/' + filename
        
        try:
          recognize_generator = shazam.recognizeSong()
        except:
          pass
        #print(recognize_generator)
        try:
            contenido = next(recognize_generator)
        except:
            return render_template("datos.html",
                                   titulo="DATOS FALLIDOS",
                                   x={},
                                   palabras=[],
                                   polaridad=[],
                                   original="No se encontraron datos")

        try:
          lista = contenido[1]['track']['share']
          listaLetra = contenido[1]['track']['sections']
          nombreCancion = lista['subject']
          caratula = contenido[1]['track']['images']['coverart']
          subtitle = contenido[1]['track']['subtitle']
          tipoAPI = "Shazam"
        except:
          return render_template("index.html",titulo="BIENVENIDO INGRESA UNA CANCIÓN",error="Error con la API de Shazam")

        separacion = nombreCancion.split(sep="-")
        print(separacion)
        NOMBRE_ORIGINAL = separacion[0]
        letraWeb = ""
        condicion = True
        try:
            letraCancion = listaLetra[1]['text']
            letraWeb = listaLetra[1]['text']
            print('TIPO WEB', type(letraWeb))
            #letraCancion = "\n".join(letraCancion)
            condicion = False
        except:
            cancion = separacion[0].lower()
            extract_lyrics = SongLyrics(
                'AIzaSyCMOghgFCbkagwysp9siX62gM3sRkbmN_I', 'a50f0d21cb62fbff8')
            data = extract_lyrics.get_lyrics(cancion)
            #print(data)
            letraCancion = data['lyrics']
            print('LETRA LIBRERIA\n')
            print(letraCancion)
            letraWeb = letraCancion
            tipoAPI = "Web Scrapping - Song Lyrics"
        letraCancion = str(letraCancion)
        resultados = clean_tweet(letraCancion,NOMBRE_ORIGINAL,separacion[1])
        #print("resultados SENTIMIENTOS: ",resultados["palabras"])
        #print('HISTORIAL VS', resultados["historial"])
        global datos
        datos = resultados

        global historial
        historial = resultados['historial']
        print("Proceso terminado")
        print(path)
        try:
          os.remove(path)
        except OSError as e:
          print(f"Error:{ e.strerror}")
        return render_template("datos.html",
                               titulo="DATOS EXITOSOS",
                               x=letraWeb,
                               palabras=resultados["palabras"],
                               polaridad=resultados["res"],
                               titulo_predicho=resultados["titulo predicho"],
                               original=NOMBRE_ORIGINAL,
                               cond=condicion,
                               caratula=caratula,
                               subtitle= subtitle,
                               tipoAPI=tipoAPI,
                               historial= resultados["historial"]
                               )



if __name__ == '__main__':
    # Iniciamos la aplicación
    app.run(port=8080, debug=True)
    # app.run()
    # app.run(host='0.0.0.0',port=5000)
