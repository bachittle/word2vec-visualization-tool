// requests js:
// all requests made to the API will come from here. 

import axios from 'axios';

export async function get_default_vectors() {
	const res = await axios({
		method: 'post',
		url: 'http://localhost:5000/word2vec_default',
		data: {
			n: 1000,
		}
	});
	return res.data;
}