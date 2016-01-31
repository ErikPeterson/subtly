'use strict';

const rp = require('request-promise');
const rpErrors = require('request-promise/errors');
const parser = require('xml2json');

class APIError extends Error {
	constructor(message, response){
		super.call(this);
		this.name = 'APIError';
		this.message = `Subtly: Wolfram API Error: ${message}`;
		this.response = response;
	}
};

class InternalError extends Error {
	constructor(message, original){
		super.call(this);
		this.name = 'InternalError';
		this.message = `Subtly: Internal Error: ${message}`;
		this.originalError = original;
	}
};

const parse = function(str){
	let opts = {
		object: true,
		trim: true,
		coerce: true
	};

	return parser.toJson(str, opts);
};
	
const DEFAULT_PARAMS = { 
	uri: 'http://api.wolframalpha.com/v2/query',
	method: 'GET'
};

module.exports = function(key){
	if(!key) throw new Error(`Client cannot be initialized without an API key`);

	let client = {
		request: function(input, qs){
			let params = Object.assign( {}, DEFAULT_PARAMS, { qs: Object.assign({input: input, appid: key}, qs) });
			let promise = new Promise((resolve, reject) => {
				rp(params)
					.then((xml) => {
						resolve(parse(xml));
					})
					.catch(rpErrors.StatusCodeError, (err) => {
						let notice = new APIError(`the API responded with status code ${err.response.statusCode}`, err.response);
						reject(notice);
					})
					.catch(rpErrors.RequestError, (err) => {
						let notice = new InternalError(`the request failed with the message '${err.cause.message}'`, err.error);
						reject(notice);
					});
				});

			return promise;
		}
	};

	return client;
};