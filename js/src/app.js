import scatterplot from './scatterplot.js';
import * as pym from 'pym.js';
import * as q from 'd3-queue';
import {csv} from 'd3';

NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];


function startUpPym(){
	var pymChild = new pym.Child({});
	pymChild.sendHeight();
	pymChild.sendMessage('childLoaded');
	// document.getElementById('methodology-link').addEventListener('click', function(e){
	// 	e.preventDefault();
	// 	var scrollTarget = e.target.href.split("#")[1] + "-methodology";
	// 	pymChild.scrollParentTo(scrollTarget);	
	// })
}


let dataSets =[
	{
		id:'2006',
		url: 'http://' + window.ROOT_URL + '/data/2006.csv'
	},
	{
		id:'2009',
		url: 'http://' + window.ROOT_URL + '/data/2009.csv'
	},
	{
		id:'ideal',
		url: 'http://' + window.ROOT_URL + '/data/ideal_scatter.csv'
	}
];

function slideInstructions(slideNumber, brokenModel){
	switch (slideNumber) {
		case 1:
			console.log('1');
			brokenModel.plotDots(2);
			break;
		case 2:
			console.log('2');
			break;
		case 3:
			console.log('3');
			brokenModel.plotDots(0);
			break;
		case 4:
			console.log('4');
			break;
		case 5:
			console.log('5');
			break;
		case 6:
			console.log('6');
			brokenModel.plotDots(1);
			break;
		case 7:
			console.log('7');
			break;

	}
}

function play(brokenModel){
	const player = setInterval(function(){
		if (document.querySelector('body').dataset.slide < window.totalSlides){
			document.querySelector(".data-button[data-direction='forward']").click();
		} else {
	        clearInterval(player);
	        console.log('cleared');
		}
	}, 3500)
}

window.addEventListener('load', function(e){

	startUpPym(); // Listen for the loaded event then run the pym stuff.
	console.log('window.loaded');

	const dataQueue = q.queue();
	dataSets.forEach(set => {
		dataQueue.defer(csv,set.url);
	});

	// Once all the d3-queue'ed datas are downloaded and ready to use, instantiate the scatter
	dataQueue.awaitAll(function(error, data){
		// console.log(error,data)
		data.forEach((d, i) => {
			dataSets[i].data = d;
		});

		const brokenModel = new scatterplot({
			container:document.getElementById('broken-model'),
			innerMargins:{ top: 10, right:10, bottom:25, left:25 },
			data:dataSets, // an array of objects with the datasets inside it
			initialIndex: 2
		});

		const dataButtons = document.querySelectorAll('.data-button');
		for (var button of dataButtons){
			button.addEventListener('click', function(e){
				const 	direction = e.target.dataset.direction,
						bodyElement = document.querySelector('body');
				let		currentSlide = parseInt(bodyElement.dataset.slide);
								
				if (direction == 'back'){
					currentSlide = currentSlide - 1 > 0 ? currentSlide - 1 : 1;
				} else if ( direction == 'forward'){
					currentSlide = currentSlide + 1 > window.totalSlides ? window.totalSlides : currentSlide + 1;
				} else {
					play(brokenModel);
				}

				bodyElement.dataset.slide = currentSlide;
				slideInstructions(currentSlide, brokenModel);
			});
		}

	});

	

});