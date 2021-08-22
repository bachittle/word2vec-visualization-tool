from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

from w2v_utils import *

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/word2vec')
def word2vec_handler():
	text_file = request.form['text_file']
	text_input = request.form['text_input']
	
	# If both are given, text_file goes first. 
	if text_file:
		print(text_file)
	elif text_input:
		print(text_input)

# get the default json file
@app.route('/word2vec_default', methods=['GET', 'POST'])
@cross_origin()
def word2vec_default():
	# initial data
	n = 1000
	word = 'dog'
	if request.method == 'GET':
		word = request.args.get('word')
		if not word:
			word = 'dog'

		n = request.args.get('n')
		try:
			if n:
				n = int(n)
		except:
			n = 1000
	elif request.method == 'POST':
		word = request.json.get('word')
		if not word:
			word = 'dog'

		n = request.json.get('n')
		try:
			if n: n = int(n)
		except:
			n = 1000
		print("n:",n)

	model = get_pretrained_model()
	# data = model_to_tsne_by_word(model, word)
	data = model_to_tsne_top_n(model, n)
	res = {}
	for i in range(len(data[1])):
		word = data[1][i]
		res[word] = data[0][i].tolist()
	# cache?
	with open('./cache.json', 'w') as fp:
		json.dump(res, fp)
	return jsonify(res)


# get json file for entire corpus (probably very slow!)
@app.route('/word2vec_all')
@cross_origin()
def word2vec_all():
	model = get_pretrained_model()
	data = model_to_tsne_all(model)
	res = {}
	for i in range(len(data[1])):
		word = data[1][i]
		res[word] = data[0][i].tolist()
	print(res)
	return jsonify(res)
