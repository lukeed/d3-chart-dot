'use strict';

var d3 = require('d3');
var defs = require('./config');

var zeroMargin = {top: 0, right: 0, bottom: 0, left: 0};

function DotChart(opts) {
	this.set(opts);
	if (!this.axis) {
		this.margin = zeroMargin;
	}
	this.init();
}

DotChart.prototype = {
	/**
	 * Set configuration options.
	 */
	set: function (config) {
		Object.assign(this, defs, config);
	},

	/**
	 * Get all dimensions, sans margin.
	 */
	dimensions: function () {
		var w = this.width - this.margin.left - this.margin.right;
		var h = this.height - this.margin.top - this.margin.bottom;
		return [w, h];
	},

	/**
	 * Handle mouseover.
	 */
	onMouseOver: function () {
		var dim = this.dimensions();
		var width = dim[0] / this.data.length;
		var m = d3.mouse(this.chart.node());
		var x = this.x.invert(m[0]);
		var i = this.xBisect(this.data, x, 1);
		var data = this.data[i - 1];
		this.mouseover(data);
	},

	/**
	 * Handle mouseleave.
	 */
	onMouseLeave: function () {
		this.mouseout();
	},

	/**
	 * Initialize the chart.
	 */
	init: function () {
		var { target, width, height, margin, axisPadding, tickSize } = this
		var { color, colorInterpolate, size, axis } = this
		var [w,h] = this.dimensions();

		this.chart = d3.select(this.target)
				.style('max-width', `${width}px`)
				.style('padding-top', `${height / w * width}px`)
			.append('svg')
				.attr('viewBox', `0 0 ${width} ${height}`)
			.append('g')
				.attr('transform', `translate(${margin.left}, ${margin.top})`)
				.on('mouseover', _ => this.onMouseOver())
				.on('mouseleave', _ => this.onMouseLeave())

		this.x = d3.scaleTime().range([0, w]);

		this.z = d3.scaleLinear().range(size);

		this.color = d3.scaleLinear()
			.range(color)
			.interpolate(d3[colorInterpolate]);

		this.xAxis = d3.axisBottom()
			.scale(this.x)
			.ticks(5)
			.tickPadding(8)
			.tickSize(tickSize);

		if (axis) {
			this.chart.append('g')
				.attr('class', 'x axis')
				.attr('transform', `translate(0, ${h+axisPadding})`)
				.call(this.xAxis);
		}

		this.xBisect = d3.bisector(d => d.bin).left;

		this.ease = d3.transition().ease(d3[this.ease]);
	},

	/**
	 * Render axis.
	 */
	renderAxis: function (data, options) {
		var { chart, x, xAxis, nice, ease } = this;

		var xd = x.domain(d3.extent(data, d => d.bin));

		if (nice) {
			xd.nice();
		}

		(options.animate ? chart.transition() : chart)
			.select('.x.axis').call(xAxis);
	},

	/**
	 * Render dots.
	 */
	renderDots: function (data, options) {
		var { chart, x, z, ease, size, color, type, barPadding } = this;
		var [w, h] = this.dimensions();

		var width = w / data.length;

		// domains
		var zMax = d3.max(data, d => d.value);
		z.domain([0, zMax]);
		color.domain([0, zMax]);

		// dots
		var dot = chart.selectAll('.dot').data(data);
		var dur = options.animate ? 300 : 0;

		if (type == 'bar') {
			var barWidth = (w / data.length) - barPadding;
			if (barWidth < 0.5) throw new Error('DotChart is too small for the amount of data points provided');

			dot.enter() // enter
				.append('rect')
					.attr('class', 'dot')
					.style('fill', d => color(d.value))
				.merge(dot) // update
					.transition().duration(dur)
						.attr('x', d => x(d.bin) + width / 2)
						.attr('y', d => h / 2 - z(d.value) / 2)
						.attr('height', d => z(d.value))
						.attr('width', barWidth)
						.style('fill', d => color(d.value));
		} else {
			dot.enter() // enter
				.append('circle')
					.attr('class', 'dot')
					.style('fill', d => color(d.value))
				.merge(dot) // update
					.transition().duration(dur)
						.attr('cx', d => x(d.bin) + width / 2)
						.attr('cy', h / 2)
						.attr('r', d => z(d.value))
						.style('fill', d => color(d.value));
		}

		// exit
		dot.exit().remove();

		// overlay
		var overlay = chart.selectAll('.overlay').data(data);

		// enter
		overlay.enter()
			.append('rect')
				.attr('class', 'overlay')
			.merge(overlay) // update
				.attr('x', d => x(d.bin))
				.attr('width', width)
				.attr('height', h)
				.style('fill', 'transparent');

		// exit
		overlay.exit().remove()
	},

	/**
	 * Render the chart against the given `data` which has the shape:
	 *
	 *  [{ bin: Date, value: int }]
	 *
	 */
	render: function (data, options = {}) {
		this.data = data;
		this.renderAxis(data, options);
		this.renderDots(data, options);
	},

	/**
	 * Update the chart against the given `data`.
	 */
	update: function (data) {
		this.render(data, {animate: true});
	}
};

module.exports = DotChart;
