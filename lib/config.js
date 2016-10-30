/**
 * Default config.
 */
module.exports = {
	// target element or selector to contain the svg
	target: '#chart',
	// width of chart
	width: 500,
	// height of chart
	height: 80,
	// margin
	margin: {top: 0, right: 40, bottom: 40, left: 40},
	// axis enabled
	axis: true,
	// axis padding
	axisPadding: 5,
	// axis tick size
	tickSize: 10,
	// nice round values for axis
	nice: false,
	// easing function for transitions
	ease: 'easeLinear',
	// dot size range, becomes height range for 'bar' type
	size: [2, 10],
	// type of chart: 'dot' or 'bar'
	type: 'dot',
	// bar padding for 'bar' type
	barPadding: 1,
	// color range
	color: ['rgb(230, 237, 244)', 'rgb(243, 43, 101)'],
	// color interpolation
	colorInterpolate: 'interpolateHcl',
	// mouseover callback for tooltips or value display
	mouseover: function () {},
	// mouseout callback for tooltips or value display
	mouseout: function () {}
};
