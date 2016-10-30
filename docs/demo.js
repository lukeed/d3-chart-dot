'use strict';

var Chart = require('../lib');
var $ = require('./help');

var c1, c2, c3;

function init() {
	c1 = new Chart({
		target: '#c1',
	});

	c2 = new Chart({
		target: '#c2',
		width: 200,
		height: 80,
		size: [2, 4]
	});

	c3 = new Chart({
		target: '#c3',
		margin: { top: 0, right: 40, bottom: 50, left: 40 },
		width: 720,
		axisPadding: 20,
		barPadding: 1,
		tickSize: 3,
		size: [2, 30],
		type: 'bar'
	});

	c1.render($.gen(24));
	c2.render($.gen(10));
	c3.render($.gen(100));
}

window.update = function () {
	c1.update($.gen(24));
	c2.update($.gen(10));
	c3.update($.gen(150));
};

$.on(document, 'DOMContentLoaded', init);
