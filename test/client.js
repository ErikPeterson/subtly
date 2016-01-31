'use strict';

const expect = require('expect.js');

const clientFactory = require('../lib/client.js');
const key = 'AFAKEKEY';

describe('Client', function(){
	beforeEach('Set client',function(){ 
		this.client = clientFactory(key);
		expect(this.client).to.be.ok();
	});

	describe('clientFactory(key)', function(){
		it('should return a client object', function(){
			expect(this.client).to.be.ok();
		})
		it('should throw an error without an api key', function(){
			expect(()=>{clientFactory()}).throwError();
		});
	});

});
