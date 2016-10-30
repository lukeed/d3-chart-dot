'use strict';

var Chart = require('../lib');
var $ = require('./help');

var plots;

function init() {
	plots = $.cls('chart').map(function (el) {
		var n = Number(el.getAttribute('data-count'));
		var o = JSON.parse(el.getAttribute('data-options') || '{}');
		o.target = '#' + el.id;

		var chart = new Chart(o);
		chart.render($.gen(n));

		return {c: chart, n: n};
	});
}

window.update = function () {
	plots.forEach(function (o) {
		o.c.update($.gen(o.n));
	});
};

$.on(document, 'DOMContentLoaded', init);
