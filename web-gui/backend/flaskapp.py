from flask import Flask, render_template, request

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
