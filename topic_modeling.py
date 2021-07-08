import nltk
import re
#pip install ShazamApi
#Intalación google trans -> pip install googletrans==3.1.0a0
from googletrans import Translator
import gensim
import gensim.corpora as corpora
from gensim.models import CoherenceModel
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import requests, json
import numpy as np
nltk.download('stopwords')
from sklearn.feature_extraction.text import CountVectorizer
my_stopwords = nltk.corpus.stopwords.words('english')
word_rooter = nltk.stem.snowball.PorterStemmer(ignore_stopwords=False).stem
my_punctuation = '!"$%&\'()*+,-./:;<=>?[\\]^_`{|}~•@'
translator = Translator()

def tokens_nuevos(tokens,palabras):
  palabras=palabras.split(' ')
  palabras_comp = [[word_rooter(word),word] if '#' not in word else word for word in palabras]
  print("funcion tokens_nuevos",palabras_comp)
  nuevas_palabras=[]
  for token in tokens:
    for palabra in palabras_comp:
      if token == palabra[0]:
        nuevas_palabras.append(palabra[1])
        break
  return nuevas_palabras
def listToString(s): 
    
    # initialize an empty string
    str1 = "" 
    
    # traverse in the string  
    for ele in s: 
        str1 += ele+' '  
    
    # return string  
    return str1 

def jaccard(grupo1, grupo2):
	interseccion = len(set(grupo1).intersection(set(grupo2)))
	union = len (set(grupo1).union(set(grupo2)))
	return interseccion / union

def mejorsim(titulo,predicciones,interprete):
  print("datos a com: ",titulo)
  print("datos a com: ",predicciones)
  print("datos a com: ",interprete)
  titulo=titulo.lower().split(" ")
  titulo=[item for item in titulo if item]
  print("titulo sel:", titulo)
  max=-1
  prediccionfinal=""
  interprete2 = interprete.lower().split(" ")
  for prediccion in predicciones:
    envio = translator.translate(prediccion, dest='en')
    envio=envio.text
    envio = envio.split(" ")
    envio = [word for word in envio if word not in interprete2]
    envio = [word for word in envio
                 if word not in ['lyrics','karaoke','chords','tab']]
    if jaccard(envio,titulo)>max:
      max=jaccard(envio,titulo)
      prediccionfinal=' '.join(envio)
      print("max ",max)
      print("prediccion final", prediccionfinal)
    
  return [max,prediccionfinal]

def makeGoogleRequest(query):
    # If you make requests too quickly, you may be blocked by google

    URL="http://suggestqueries.google.com/complete/search"
    PARAMS = {"client":"chrome",
            "hl":"en",
            "q":query}
    print("PARAMAS",PARAMS)
    headers = {'User-agent':'chrome/5.0'}
    response = requests.get(URL, params=PARAMS, headers=headers)
    if response.status_code == 200:
        try:
            suggestedSearches = json.loads(response.content.decode('utf-8'))[1]
            print(suggestedSearches)
            return suggestedSearches
        except:
            return []
    else:
        return []
# cleaning master function
def clean_tweet(tweet,original,interprete, bigrams=False):
    nombreOriginalCancion = original
    tweet = tweet.lower() # lower case
    tweet = re.sub('['+my_punctuation + ']+', ' ', tweet) # strip punctuation
    tweet = re.sub('\s+', ' ', tweet) #remove double spacing
    tweet = re.sub('([0-9]+)', '', tweet) # remove numbers
    tweet2 = tweet
    original = original.lower() # lower case
    original = re.sub('['+my_punctuation + ']+', ' ', original) # strip punctuation
    original = re.sub('\s+', ' ', original) #remove double spacing
    original = re.sub('([0-9]+)', '', original) # remove numbers
    tweet_token_list = [word for word in tweet.split(' ')
                            if word not in my_stopwords] # remove stopwords

    letraNube = listToString(tweet_token_list)
    print("Letra Nube ", letraNube)

    
    tweet_token_list = [word_rooter(word) if '#' not in word else word
                        for word in tweet_token_list] # apply word rooter
    
    tweet_token_list2 = [word for word in original.split(' ')
                        if word not in my_stopwords]  # remove stopwords
    tweet_token_list2 = [word_rooter(word2) if '#' not in word2 else word2
                        for word2 in tweet_token_list2]
    
    tweet_token_list3 = [word_rooter(word2) if '#' not in word2 else word2
                         for word2 in original.split(' ')]
    tweet_token_list3 = [item for item in tweet_token_list3 if item]
    # apply word rooter

    if bigrams:
        tweet_token_list = tweet_token_list+[tweet_token_list[i]+'_'+tweet_token_list[i+1]
                                            for i in range(len(tweet_token_list)-1)]
    tweet_token_list2 = [item for item in tweet_token_list2 if item]
    print("original :",tweet_token_list3)
    tweet = ' '.join(tweet_token_list)
    print("size",tweet.split())
    tweet_token_list = [item for item in tweet_token_list if item]
    id2word = corpora.Dictionary([tweet_token_list])
    print("id2word",id2word)
    texts = [tweet_token_list]
    palabrasNube = list(id2word.token2id.keys())
    print('TOKENS!!! ', palabrasNube)
    corpus = [id2word.doc2bow(text) for text in texts]
    lda_model = gensim.models.ldamodel.LdaModel(corpus=corpus,
                                           id2word=id2word,
                                           num_topics=5, 
                                           random_state=100,
                                           update_every=1,
                                           chunksize=100,
                                           passes=3,
                                           alpha='auto',
                                           per_word_topics=True)
                                      
    print("corpus ",corpus)
    print(lda_model.print_topic(0,topn=len(tweet_token_list2)))
    print("LDA: ",lda_model.print_topics())
    if tweet_token_list2:
        cadena_pred=lda_model.print_topic(0, topn=len(tweet_token_list2))
    else:
        cadena_pred = lda_model.print_topic(0, topn=len(tweet_token_list3))
    cadena_pred2 = lda_model.print_topic(0, topn=10)
    patron='"(.*?)"'
    print("cadena pred",cadena_pred)
    palabras_pred=re.findall(patron,cadena_pred)
    peso_pred = [float(s) for s in re.findall(r'-?\d+\.?\d*', cadena_pred)]
    print("Palabras predichas ",palabras_pred)

     # ANALISIS SENTIMIENTOS
    analyzer = SentimentIntensityAnalyzer()
    sentimientos = []
    for i in range(0,len(palabras_pred)):
        vs = analyzer.polarity_scores(palabras_pred[i])
        sentimientos.append(vs)

    print("Pesos pred:",peso_pred)
    palabras_topico = re.findall(patron, cadena_pred2)
    pesos_topico = [float(s) for s in re.findall(r'-?\d+\.?\d*', cadena_pred2)]
    print("Palabras topico ", palabras_topico)
    print("Pesos topico:", pesos_topico)
    frecuenciaPalab = [tweet.split().count(w) for w in palabras_pred]
    print("t 2:",tweet_token_list2)
    print(frecuenciaPalab)
    por_similtud=jaccard(palabras_pred,tweet_token_list3)
    print("similitud ",por_similtud)
    palabras_pred2 = tokens_nuevos(palabras_pred, tweet2)
    print("palabras pred :",)
    ingreso = ""
    for pal in palabras_pred2:
        if pal:
            ingreso = ingreso + " " + pal
    print(interprete)
    interprete = re.sub('[' + my_punctuation + ']+', ' ', interprete)  # strip punctuation
    result = makeGoogleRequest(ingreso + " " + interprete.lower())
    print(result)
    similitud2=0
    if result:
        datos=mejorsim(nombreOriginalCancion,result,interprete)
        envio=datos[1]
        similitud2=datos[0]
    else:
        try:
          result=makeGoogleRequest(ingreso)
          if result:
            datos=mejorsim(nombreOriginalCancion,result,interprete)
            envio=datos[1]
            similitud2=datos[0]
          else:
            envio = translator.translate(ingreso, dest='en').text
        except:
            envio = translator.translate(ingreso, dest='en').text
    if similitud2 == 0:
        similitud2=por_similtud
    if envio:
        pass
    else:
        envio=ingreso

    print(envio)
    print("similitud", similitud2)
    historial= {
        "titulo_original": nombreOriginalCancion,
        "palabras_topico": palabras_topico,
        "pesos_topico": pesos_topico,
        "frecuencia": frecuenciaPalab,
        "similitud": por_similtud,
        "palabras_predichas": palabras_pred,
        "sentimientos": sentimientos,
        "titulo predicho": envio.title(),
        "similitud 2": similitud2
    }


    return {"palabras":palabras_pred,
            "pesos predichos":peso_pred,
            "res":frecuenciaPalab,
            "palabras topico":palabras_topico,
            "pesos topico": pesos_topico,
            "tokens":tweet_token_list,
            "jaccard":por_similtud,
            "historial":historial,
            "sentimientos": sentimientos,
            "cloud": palabrasNube,
            "titulo predicho": envio.title(),
            "corpus": corpus,
            "letraNube":letraNube} 