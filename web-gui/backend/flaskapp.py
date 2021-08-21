from flask import Flask, request, jsonify

from w2v_utils import get_pretrained_model, model_to_tsne_by_word

app = Flask(__name__)

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
@app.route('/word2vec_default', methods=['GET'])
def word2vec_default():
	if request.method == 'GET':
		word = request.args['word']
		if not word:
			word = 'dog'
		model = get_pretrained_model()
		data = model_to_tsne_by_word(model, word)
		res = {}
		for i, word in data[1]:
			res[word] = data[0][i]
		
		jsonify(res)
