import * as d3 from 'd3';
import getTribColors from './getTribColors.js';

class scatterplot{

	constructor(options){
		const app = this;
		app.options = options;
		app.data = app.options.data;
		app.dataToChart = app.data[app.options.initialIndex].data;

		app.initChart(app.dataToChart);
	}

	initChart(){
		const 	app = this,
				container = d3.select(app.options.container),
				bbox = container.node().getBoundingClientRect(), 
				height=bbox.height,
				width=bbox.width,
				margin= app.options.innerMargins,
				innerHeight = height - margin.top - margin.bottom,
				innerWidth = width - margin.right - margin.left;

		


		// ----------------------------------
		// custom scales
		// ----------------------------------

		app.yScale = d3.scaleLinear()
			.range([innerHeight, 0])
			.domain([0,2]);

		const yAxis = d3.axisLeft(app.yScale)
			.tickSizeInner(2)
			.tickSizeOuter(0);

		// TODO: Get the real range of all three datasets.
		app.xScale = d3.scaleLinear()
			.range([0,innerWidth])
			.domain([0,1000000]);

		const xAxis = d3.axisBottom(app.xScale)
			.tickFormat(d3.format('$.3s'))
			.tickSizeOuter(0);
		// ----------------------------------
		// START MESSING WITH SVGs
		// ----------------------------------

		//Inserts svg and sizes it
		const svg = container
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        svg.append('g')
        	.attr('class', 'x axis')
        	.attr('transform', `translate(${margin.left},${innerHeight + margin.top})`)
        	.call(xAxis);

        svg.append('g')
        	.attr('class', 'y axis')
        	.attr('transform', `translate(${margin.left},${margin.top})`)
        	.call(yAxis);

		app.chartInner = svg.append('g')
			.classed('chartInner', true)
			.attr("width",innerWidth)
			.attr("height",innerHeight)
			.attr(`transform`,`translate(${ margin.left }, ${ margin.top })`);

		app.chartInner.append('line')
			.classed('one-line', true)
			.attr('x1', 0)
			.attr('x2', innerWidth + margin.right)
			.attr('y1', app.yScale(1))
			.attr('y2', app.yScale(1))
	        .style('stroke', getTribColors('trib-gray1'))
	        .style('stroke-width', 4)
	        .style('fill', 'transparent');

		app.chartInner.append('text')
			.classed('ratio-1axis-label', true)
			.attr('x', innerWidth)
			.attr('y', app.yScale(1))
			.attr('dy', "-0.6em")
			.text('Overvalued')
			.attr('text-anchor', 'end')

		app.chartInner.append('text')
			.classed('ratio-1axis-label', true)
			.attr('x', innerWidth)
			.attr('y', app.yScale(1))
			.attr('dy', "1.3em")
			.text('Undervalued')
			.attr('text-anchor', 'end')

		// const dots = chartInner
		// 	.selectAll('circle')
		// 	.data(app.dataToChart)
		// 	.enter()
		// 	.append('circle')
		// 	.attr('r', 5)
		// 	.attr('cx', d => app.xScale(d.HomePrice))
		// 	.attr('cy', d => app.yScale(d.Ratio))
		// 	.style('fill', 'blue')
		// 	.style('opacity', '.2');

		app.data.forEach( (data, index) => {
			app.plotRegressionLine(data.data, 'HomePrice', 'Ratio', index);
		})

		app.plotDots(app.options.initialIndex)
	}

	plotDots(index){
		const app = this;
		const transitionDuration = 1000;
		const data = app.data[index].data;
		// console.log(index, data);

		const dots = app.chartInner
			.selectAll('circle')
			.data(data)

		dots.enter()
			.append('circle')
			.attr('r', 3)
			// .style('fill', getTribColors('trib-blue2'))
			.style('opacity', '.2')
			.attr('cx', d => app.xScale(d.HomePrice))
			.attr('cy', d => app.yScale(d.Ratio))
			.attr('fill', d => {
				console.log(d.Ratio);
				return d.Ratio > 1 ? getTribColors('trib-red2') : getTribColors('trib-orange');
			});
		
		dots
			.transition()
			.duration(transitionDuration)
			.attr('cx', d => app.xScale(d.HomePrice))
			.attr('cy', d => app.yScale(d.Ratio))
			.attr('fill', d => {
				console.log(d.Ratio);
				return d.Ratio > 1 ? getTribColors('trib-red2') : getTribColors('trib-orange');
			})
		
		dots.exit()
			.transition()
			.duration(transitionDuration)
			.style('opacity', 0)
			.remove();
	}


	plotRegressionLine(data, xDataField, yDataField, lineID){
		// This holds logic to create a regression line. Needs a better method, but it draws a line
		const app = this;
		const XaxisData = data.map(function(d) { return parseInt(d[xDataField]); });
		const YaxisData = data.map(function(d) { return parseFloat(d[yDataField]); });
		
		const regression = leastSquaresequation(XaxisData,YaxisData);

		const regressionLine = d3.line()
	        .y(function(d) { return app.yScale(regression(d.HomePrice)) })
	        .x(function(d) { return app.xScale(d.HomePrice) });

		app.chartInner.append("path")
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
	// console.log(XaxisData, Yaxisdata);
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

module.exports = scatterplot;