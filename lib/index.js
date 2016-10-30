'use strict';

const d3 = require('d3');
const assign = require('object-assign');
const config = require('./config');

module.exports = class DotChart {
	constructor(opts) {
		this.set(opts);
		if (!this.axis) {
			this.margin = {top: 0, right: 0, bottom: 0, left: 0};
		}
		this.init();
	}

	/**
	 * Set configuration options.
	 */
	set(opts) {
		assign(this, config, opts);
	}

	/**
	 * Get all dimensions, sans margin.
	 */
	dimensions() {
		const {width, margin, height} = this;
		const w = width - margin.left - margin.right;
		const h = height - margin.top - margin.bottom;
		return [w, h];
	}

	/**
	 * Handle mouseover.
	 */
	onMouseOver() {
		const [w, h] = this.dimensions();
		const width = w / this.data.length;
		const m = d3.mouse(this.chart.node());
		const x = this.x.invert(m[0]);
		const i = this.xBisect(this.data, x, 1);
		const data = this.data[i - 1];
		this.mouseover(data);
	}

	/**
	 * Handle mouseleave.
	 */
	onMouseLeave() {
		this.mouseout();
	}

	/**
	 * Initialize the chart.
	 */
	init() {
		const { target, width, height, margin, axisPadding, tickSize } = this
		const { color, colorInterpolate, size, axis } = this
		const [w, h] = this.dimensions();

		this.chart = d3.select(target)
				.style('max-width', `${width}px`)
				.style('padding-top', `${height / w * width}px`)
			.append('svg')
				.attr('viewBox', `0 0 ${width} ${height}`)
			.append('g')
				.attr('transform', `translate(${margin.left}, ${margin.top})`)
				.on('mouseover', _ => this.onMouseOver())
				.on('mouseleave', _ => this.onMouseLeave());

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
	}

	/**
	 * Render axis.
	 */
	renderAxis(data, options) {
		const { chart, x, xAxis, nice, ease } = this;

		const xd = x.domain(d3.extent(data, d => d.bin));

		if (nice) {
			xd.nice();
		}

		(options.animate ? chart.transition() : chart)
			.select('.x.axis').call(xAxis);
	}

	/**
	 * Render dots.
	 */
	renderDots(data, options) {
		const { chart, x, z, ease, size, color, type, barPadding } = this;
		const [w, h] = this.dimensions();

		const width = w / data.length;

		// domains
		const zMax = d3.max(data, d => d.value);
		z.domain([0, zMax]);
		color.domain([0, zMax]);

		// dots
		const dot = chart.selectAll('.dot').data(data);
		const dur = options.animate ? 300 : 0;

		if (type == 'bar') {
			const barWidth = (w / data.length) - barPadding;
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
		const overlay = chart.selectAll('.overlay').data(data);

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
	}

	/**
	 * Render the chart against the given `data` which has the shape:
	 *
	 *  [{ bin: Date, value: int }]
	 *
	 */
	render(data, options = {}) {
		this.data = data;
		this.renderAxis(data, options);
		this.renderDots(data, options);
	}

	/**
	 * Update the chart against the given `data`.
	 */
	update(data) {
		this.render(data, {animate: true});
	}

	/**
	 * Destroy the chart instance
	 */
	destroy() {
	}
}
