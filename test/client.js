'use strict';

const expect = require('expect.js');
const sinon = require('sinon');
const mockery = require('mockery');

const key = 'AFAKEKEY';


describe('Client', function(){

	beforeEach('Set client',function(){ 
		let spy = this.spy = sinon.spy();
		mockery.enable();
		mockery.warnOnUnregistered(false);
		mockery.registerMock('request-promise', function(){
			spy.apply(this, arguments);
			return new Promise((r)=>r(true));
		});
		mockery.registerAllowable('../lib/client.js', true);
		this.client = require('../lib/client.js')(key);
		expect(this.client).to.be.ok();
	});

	afterEach(function(){
		mockery.deregisterAll();
		mockery.disable();
	});

	describe('clientFactory(key)', function(){

		it('should return a client object', function(){
			expect(this.client).to.be.ok();
		})
		it('should throw an error without an api key', function(){
			expect(()=>{clientFactory()}).throwError();
		});
	});

	describe('#request(input, options)', function(){
		describe('with a valid input and options', function(){
			it('returns a promise', function(){
				let prom = this.client.request('what is a dog');
				expect(prom).to.be.a(Promise);
			});

			it('makes a request for the specified query and params', function(){

				this.client.request('weather', {podstate: 'WeatherCharts:WeatherData__Past+5+years'});
				expect(this.spy.calledOnce).to.be.ok();
				let args = this.spy.getCall(0).args[0];
				expect(args.uri).to.equal('http://api.wolframalpha.com/v2/query');
				expect(args.qs).to.eql({
					podstate: 'WeatherCharts:WeatherData__Past+5+years',
					appid: 'AFAKEKEY',
					input: 'weather'
				});
			});
		});
	});

});
