# word2vec and tsne utility
# uses gensim for the word2vec algorithm, and t-sne to flatten the vectors to 2/3 dimensions.

import gensim
import numpy as np
from sklearn.manifold import TSNE
import json

# load a pre-trained w2v embedding by default

def get_pretrained_model():
	model = gensim.models.keyedvectors.load_word2vec_format('../../word2vec/vectors.bin', binary=True)
	return model

# models a tsne dimensional array by close words only for speed, returns the tsne array (coords) 
# and the list of word strings (word labels) in the same index
def model_to_tsne_by_word(model, word):
	arr = np.empty((0,200), dtype='f')
	arr = np.append(arr, np.array([model[word]]), axis=0)
	word_labels = [word]

	# get close words, and add them to arr and word_labels
	close_words = model.similar_by_word(word)
	for close_word in close_words:
		# close_word: (word, score)
		word_vector = model[close_word[0]]
		word_labels.append(close_word[0])
		arr = np.append(arr, np.array([word_vector]), axis=0)
	
	# tsne coords for 3 dimensions
	tsne = TSNE(n_components=3, random_state=0)
	np.set_printoptions(suppress=True)
	coords = tsne.fit_transform(arr)
	return (coords, word_labels)

def model_to_tsne_top_n(model, n):
	arr = np.empty((0,200), dtype='f')

	vocab = list(model.index_to_key)
	print(len(vocab))
	vocab = vocab[1:n]
	for word in vocab:
		# close_word: (word, score)
		arr = np.append(arr, np.array([model[word]]), axis=0)
	
	# tsne coords for 3 dimensions
	tsne = TSNE(n_components=3, random_state=0)
	np.set_printoptions(suppress=True)
	coords = tsne.fit_transform(arr)


	return (coords, vocab)

if __name__ == "__main__":
	model = get_pretrained_model()
	# res = model_to_tsne_by_word(model, 'dog')
	res = model_to_tsne_top_n(model, 100)
