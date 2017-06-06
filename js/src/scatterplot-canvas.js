import * as d3 from 'd3';
import getTribColors from './getTribColors.js';

class scatterplotCanvas{

	constructor(options){
		const app = this;
		app.options = options;
		app.data = app.options.data;
		app.dataToChart = app.data[app.options.initialIndex].data;

		app.initChart(app.dataToChart);
		// app.doesTheChartNeedAnExampleLabeled = true;
	}

	initChart(){
		const 	app = this,
				container = d3.select(app.options.container),
				bbox = container.node().getBoundingClientRect(), 
				height=bbox.height,
				width=bbox.width,
				margin = app.options.innerMargins,
				innerHeight = height - margin.top - margin.bottom,
				innerWidth = width - margin.right - margin.left;

				app.innerHeight = innerHeight;
				app.innerWidth = innerWidth;
				
		// ----------------------------------
		// custom scales
		// ----------------------------------

		app.yScale = d3.scaleLinear()
			.range([innerHeight, 0])
			.domain([0,2]);

		const yAxis = d3.axisLeft(app.yScale)
			.tickSizeInner(0)
			.tickSizeOuter(0);

		// TODO: Get the real range of all three datasets.
		app.xScale = d3.scaleLinear()
			.range([0,innerWidth])
			.domain([0,1000000]);

		const xAxis = d3.axisBottom(app.xScale)
			.tickSizeInner(0)
			.tickSizeOuter(0)
			.tickFormat(d3.format('$.1s'))
			.tickSizeOuter(0);
		// ----------------------------------
		// START MESSING WITH SVGs
		// ----------------------------------

		//Inserts svg and sizes it
		const svg = container
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style('position', 'absolute')
            .style('top', 0)
            .style('left', 0);

        // Add some horiz and vert grid lines
		const grid = svg.append('g')
			.classed('grid', true)
			.attr("width",innerWidth)
			.attr("height",innerHeight)
			.attr(`transform`,`translate(${ margin.left }, ${ margin.top })`);
		// ['x','y'].forEach((s, index) => {
		// 	let 	direction = s,
		// 			scale = app[`${s}Scale`],
		// 			min = scale.domain()[0],
		// 			max = scale.domain()[1],
		// 			tickNumber = scale.ticks().length,
		// 			stepInterval = (max - min) / (tickNumber - 1);
		// 	for (var i = min; i <= max; i += stepInterval){
	 //        	grid.append('line')
	 //        		.attr('class', `grid__line grid__line--${direction}`)
	 //        		.attr('x1', function(){
	 //        			return direction == "x" ? scale(i) : 0;
	 //        		})
	 //        		.attr('x2', function(){
	 //        			return direction == "x" ? scale(i) : innerWidth;
	 //        		})
	 //        		.attr('y1', function(){
	 //        			return direction == "x" ? 0 : scale(i);
	 //        		})
	 //        		.attr('y2', function(){
	 //        			return direction == "x" ? innerHeight : scale(i);
	 //        		})
	 //        		.style('stroke', '#000')
	 //        		.style('stroke-width', 1)
	 //        		.style('stroke-dasharray', 1)
	 //        		.style('fill', 'transparent');
		// 	}

		// })

        svg.append('g')
        	.attr('class', 'x axis')
        	.attr('transform', `translate(${margin.left},${innerHeight + margin.top + 5})`)
        	.call(xAxis)
	    	.selectAll('.domain')
        	.remove();


        svg.append('g')
        	.attr('class', 'y axis')
        	.attr('transform', `translate(${margin.left - 5},${margin.top})`)
        	.call(yAxis)
        	.selectAll('.domain')
        	.remove();

		// console.log(xAxis.ticks(10));

		app.chartInner = svg.append('g')
			.classed('chartInner', true)
			.attr("width",innerWidth)
			.attr("height",innerHeight)
			.attr(`transform`,`translate(${ margin.left }, ${ margin.top })`);

		app.chartInner.append('line')
			.classed('one-line', true)
			.attr('x1', 0)
			.attr('x2', innerWidth)
			.attr('y1', app.yScale(1))
			.attr('y2', app.yScale(1))
	        .style('stroke', getTribColors('trib-gray1'))
	        .style('stroke-width', 4)
	        .style('fill', 'transparent');


        svg.append('g')
        	.attr('class', 'regression-lines')
        	.attr('transform', `translate(${margin.left},${margin.top})`);

			// THE LABELING

			const labels = svg.append('g')
				.classed('labels', true);


			// white strokes
			labels.append('text')
				.classed('ratio-1axis-label', true)
				.attr('x', margin.left + 10 )
				.attr('y', app.yScale(1))
				.attr('dy', "0.1em")
				.text('Overvalued')
				.attr('text-anchor', 'start')
				.attr('stroke','white')
				.attr('stroke-width', 3);

			labels.append('text')
				.classed('ratio-1axis-label', true)
				.attr('x', margin.left + 10)
				.attr('y', app.yScale(1))
				.attr('dy', "2.1em")
				.text('Undervalued')
				.attr('text-anchor', 'start')
				.attr('stroke','white')
				.attr('stroke-width', 3);


			// regular,readable ones
			
			labels.append('text')
				.classed('ratio-1axis-label', true)
				.attr('x', margin.left + 10 )
				.attr('y', app.yScale(1))
				.attr('dy', "0.1em")
				.text('Overvalued')
				.attr('text-anchor', 'start')


			labels.append('text')
				.classed('ratio-1axis-label', true)
				.attr('x', margin.left + 10)
				.attr('y', app.yScale(1))
				.attr('dy', "2.1em")
				.text('Undervalued')
				.attr('text-anchor', 'start');

			if (app.options.meta.yAxisLabel){
				labels.append('text')
					.attr('class', 'class-label class-label--y')
					.text(app.options.meta.yAxisLabel)
					.style('font-family','Arial, sans-serif')
					.style('font-size','13px')
					.style('font-weight','bold')
					.attr('x', 0)
					.attr('y', margin.top + (innerHeight / 2))
					.attr('text-anchor', 'middle')
					.attr('dy', '1em')
					.attr('transform', `rotate(-90, 0, ${margin.top + (innerHeight / 2)})`);
			}

			if (app.options.meta.xAxisLabel){
				labels.append('text')
						.attr('class','class-label class-label--x')
						.text(app.options.meta.xAxisLabel)
						.style('font-family','Arial, sans-serif')
						.style('font-size','13px')
						.style('font-weight','bold')
						.attr('x', margin.left + (innerWidth / 2))
						.attr('y', height)
						.attr('dy', '-.3em')
						.attr('text-anchor', 'middle');
			}

      // Add the outer grid
		const outerGrid = svg.append('g')
			.classed('outer-grid', true)
			.attr("width",innerWidth)
			.attr("height",innerHeight)
			.attr(`transform`,`translate(${ margin.left }, ${ margin.top })`);

		outerGrid.append('rect')
			.attr('x', 0)
			.attr('y', 0)
			.attr('height', innerHeight)
			.attr('width', innerWidth)
			.style('stroke', 'black')
			.style('stroke-width', 1)
			.style('fill', 'transparent');


		// Add the two regression lines

		app.plotRegressionLine(app.data[0].data, 'HomePrice', 'Ratio', '2006')
		app.plotRegressionLine(app.data[1].data, 'HomePrice', 'Ratio', '2009')
		app.plotRegressionLine(app.data[2].data, 'HomePrice', 'Ratio', 'ideal')


		

		// Add an example to be labeled
		
		const 	exampleRatio = app.yScale(1.8),
				exampleMarketValue = app.xScale(150000),
				exampleCircleRadius = 8,
				exampleCircleStrokeWidth = 2,
				exampleLineLength = 25;

		// First the example circle
		labels.append('rect')
			.classed('example', true)
			.classed('example__circle', true)
			.classed('example--visible', true)
			.attr('height', exampleCircleRadius)
			.attr('width', exampleCircleRadius)
			.attr('x', exampleMarketValue)
			.attr('y', exampleRatio - (exampleCircleRadius / 2))
			.attr('fill', getTribColors('trib-orange'))
			.attr('stroke', 'black')
			.attr('stroke-width', exampleCircleStrokeWidth);

		labels.append('path')
			.classed('example', true)
			.classed('example__line', true)
			.classed('example--visible', true)
			.attr('d', function(){
				return `M${exampleMarketValue + exampleCircleRadius},${exampleRatio} 
						Q${exampleMarketValue + exampleCircleRadius + 19}, ${exampleRatio}  
						${exampleMarketValue + exampleCircleRadius + 19}, ${exampleRatio + 15}`;
			})
			.style('stroke', 'black')
			.style('stroke-width', 2)
			.style('fill', 'transparent');

		labels.append('text')
			.classed('example', true)
			.classed('example__text', true)
			.classed('example--visible', true)
			.text('One square = one home')
			.attr('x', exampleMarketValue + 5)
			.attr('y', exampleRatio + exampleCircleRadius + 20)
			.style('font-family','Arial, sans-serif')
			.style('font-size','13px')
			.style('font-weight','bold');

		const canvas = d3.select(app.options.container)
			.insert('canvas', 'svg')
			.attr('height', innerHeight)
			.attr('width', innerWidth)
			.style('position', 'absolute')
			.style('top', `${margin.top}px`)
			.style('background', 'rgba(255, 255, 0, .1)')
			.style('left', `${margin.left}px`);
		
		app.ctx = canvas.node().getContext('2d');

		// app.plotDots(app.options.initialIndex
		// console.log('ready to plot sqrs', canvas.node(), typeof(canvas));

		// app.plotDotsCanvas(app.options.initialIndex);


	}

	plotDotsCanvas(index){
		// Following this: https://medium.freecodecamp.com/d3-and-canvas-in-3-steps-8505c8b27444
	
		// This is your SVG replacement and the parent of all other elements
		const 	app = this,
				customBase = document.createElement('custom'),
				custom = d3.select(customBase),
				rectWidth = 6, 
				rectHeight = rectWidth,
				ctx = app.ctx,
				transitionDuration = 400,
				colorScale = function(ratio){
					return ratio > 1 ? getTribColors('trib-red2') : getTribColors('trib-orange');
				}; 
		function dataBind(data)	{	
			// console.log('binding the data');
			// This is the data binding, which requires both a sleection and some data.
			// The result gives access to the enter(), update() and exit() sets.
			const join = custom.selectAll('custom.rect')
				.data(data);

			// not sure why I need to assign this to a var, but I will since I want to 
			// follow the tutorial closely
			const enterSet = join.enter()
				.append('custom')
				.attr('class', 'rect')
				.attr('x', d => app.xScale(d.HomePrice))
				.attr('y', d => app.yScale(d.Ratio))
				.attr('fillStyle', d => colorScale(d.Ratio))
				.transition()
				// .duration(transitionDuration)
				.attr('width', rectWidth)
				.attr('height', rectHeight);

				

			join
				// .attr('width', rectWidth)
				// .attr('height', rectHeight)
				.transition()
				// .duration(transitionDuration)
				.attr('x', d => app.xScale(d.HomePrice) - (rectWidth / 2))
				.attr('y', d => app.yScale(d.Ratio) - (rectHeight / 2))
				.attr('fillStyle', d => colorScale(d.Ratio));
			
			const exitSet = join.exit()
				  .transition()
				  // .duration(transitionDuration)
				  .attr('width', 0)
				  .attr('height', 0)
				  .remove();
		}

		function drawData(){
						console.log('drawing');

			// console.log('drawing the sqrs');
			// Start by clearing our "paint"
			ctx.clearRect(0, 0, app.innerWidth, app.innerHeight); // Clear the canvas.

			// loop through each of the elements I stashed in memory and
			// draw them to the canvas using the bound data-attributes
			const elements = custom.selectAll('custom.rect');
			// console.log(elements);
			elements.each(function(el, i) {	
				// console.log(el, i, this);
				const node = d3.select(this);
				ctx.globalAlpha = 0.4;
				ctx.fillStyle = node.attr('fillStyle');
				ctx.fillRect(node.attr('x'), node.attr('y'), node.attr('width'), node.attr('height'))
			});
		}
		dataBind(app.data[index].data);
		const t = d3.timer( function(elapsed){
			// console.log(elapsed)
			drawData();
			console.log(elapsed);
			if (elapsed > transitionDuration) t.stop();	
		})
		
	}

	// plotDots(index){
	// 	const app = this;
	// 	const transitionDuration = 1000;
	// 	const data = app.data[index].data;

	// 	const dots = app.chartInner
	// 		.selectAll('circle')
	// 		.data(data)

	// 	dots.enter()
	// 		.append('circle')
	// 		.attr('r', 3)
	// 		// .style('fill', getTribColors('trib-blue2'))
	// 		.attr('cx', d => app.xScale(d.HomePrice))
	// 		.attr('cy', d => app.yScale(d.Ratio))
	// 		.style('opacity', .2)
	// 		.transition()
			
	// 		.duration(transitionDuration)
	// 		.attr('fill', d => {
	// 			return d.Ratio > 1 ? getTribColors('trib-red2') : getTribColors('trib-orange');
	// 		});
		
	// 	dots
	// 		.transition()
	// 		.duration(transitionDuration)
	// 		.attr('cx', d => app.xScale(d.HomePrice))
	// 		.attr('cy', d => app.yScale(d.Ratio))
	// 		.attr('fill', d => {
	// 			return d.Ratio > 1 ? getTribColors('trib-red2') : getTribColors('trib-orange');
	// 		})
		
	// 	dots.exit()
	// 		.transition()
	// 		.duration(transitionDuration)
	// 		.style('opacity', 0)
	// 		.remove();
	// }


	plotRegressionLine(data, xDataField, yDataField, lineID){
		// This holds logic to create a regression line. Needs a better method, but it draws a line
		const app = this;
		const XaxisData = data.map(function(d) { return parseInt(d[xDataField]); });
		const YaxisData = data.map(function(d) { return parseFloat(d[yDataField]); });
		
		const regression = leastSquaresequation(XaxisData,YaxisData);

		const regressionLine = d3.line()
	        .y(function(d) { return app.yScale(regression(d.HomePrice)) })
	        .x(function(d) { return app.xScale(d.HomePrice) });

		d3.select('.regression-lines').append("path")
			.classed('regression-line', true)
			.classed(`regression-line--${lineID}`, true)
	        .datum(data)
	        .style('stroke', getTribColors('trib-grey2'))
	        .style('stroke-width', 2)
	        // .style('stroke-dasharray', '3,5')
	        .style('fill', 'transparent')
	        .attr("d", regressionLine);
	}
}
// This function creates a least-squares regression line
function leastSquaresequation(XaxisData, Yaxisdata) {
	
	var ReduceAddition = function(prev, cur) { return prev + cur; };
    
    // finding the mean of Xaxis and Yaxis data
    var xBar = XaxisData.reduce(ReduceAddition) * 1.0 / XaxisData.length;
    var yBar = Yaxisdata.reduce(ReduceAddition) * 1.0 / Yaxisdata.length;

    var SquareXX = XaxisData.map(function(d) { return Math.pow(d - xBar, 2); })
      .reduce(ReduceAddition);
    
    var ssYY = Yaxisdata.map(function(d) { return Math.pow(d - yBar, 2); })
      .reduce(ReduceAddition);
      
    var MeanDiffXY = XaxisData.map(function(d, i) { return (d - xBar) * (Yaxisdata[i] - yBar); })
      .reduce(ReduceAddition);
      
    var slope = MeanDiffXY / SquareXX;
    var intercept = yBar - (xBar * slope);
  
	// returning regression function
    return function(x) {
      return (x * slope) + intercept
    }

}

module.exports = scatterplotCanvas;