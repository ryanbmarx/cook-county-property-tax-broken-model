import scatterplotCanvas from './scatterplot-canvas.js';
import * as pym from 'pym.js';
import * as q from 'd3-queue';
import {csv} from 'd3';
import clickTrack from './click-track.js';


NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];


function startUpPym(){
	var pymChild = new pym.Child({});
	pymChild.sendHeight();
	pymChild.sendMessage('childLoaded');
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


function triggerTimerBar(duration){
	console.log("triggering bar")
	// We're going to align the css transition timing or our progress bar with the play interval
	const bar = document.querySelector('.progress-bar__bar');

	bar.style.animationDuration = `${duration}ms`;

	// start from zero, instantly
	bar.classList.remove('animating');

	// I'm just doing what Chris Coyier told me to do
	// https://css-tricks.com/restart-css-animation/
  	void bar.offsetWidth;

	// Then transtion to fullWidth
	bar.classList.add('animating');

}

function slideInstructions(slideNumber, brokenModel){
	const 	bar = document.querySelector('.progress-bar__bar'),
			slidesLabel = document.querySelector('#slides-label'),
			totalSlidesLabel = document.querySelector('#total-slides'),
			// dot = document.querySelector('.progress-bar__dot--static'),
			// pulseDot = document.querySelector('.progress-bar__dot--pulse'),
			examples = document.querySelectorAll('.labels .example');
			slidesLabel.innerHTML = `Slide ${slideNumber} of ${window.totalSlides}`;

	// bar.style.width = dot.style.left = pulseDot.style.left = `${100 / window.totalSlides * slideNumber}%`;
	
	switch (slideNumber) {
		case 1:
			// Fade in examples
			for (var example of examples){
				example.classList.add('example--visible');
			}
			highlightRegressionLine('none')
			brokenModel.plotDotsCanvas(2);
			break;
		case 2:
			// Fade out examples
			for (var example of examples){
				example.classList.remove('example--visible');
			}
			highlightRegressionLine('none')
			brokenModel.plotDotsCanvas(0);
			break;
		case 3:
			brokenModel.plotDotsCanvas(0);
			highlightRegressionLine('2006')
			break;
		case 4:
			highlightRegressionLine('none')
			brokenModel.plotDotsCanvas(1);
			break;
		case 5:
			highlightRegressionLine('2009')
			brokenModel.plotDotsCanvas(1);
			break;
	}
}
function highlightRegressionLine(id){
	
	const lines = document.querySelectorAll('.regression-line');
	for (var line of lines){
		if (line.classList.contains(`regression-line--${id}`)){
			line.style.opacity = 1;
		} else {
			line.style.opacity = 0;
		}
	}
}

window.addEventListener('load', function(e){

	startUpPym(); // Listen for the loaded event then run the pym stuff.
	console.log('window.loaded', window.totalSlides);

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

		const brokenModel = new scatterplotCanvas({
			container:document.getElementById('broken-model'),
			innerMargins:{ top: 10, right:10, bottom:40, left:40 },
			data:dataSets, // an array of objects with the datasets inside it
			initialIndex: 2, // Index of the data
			meta:{
				xAxisLabel: window.xAxisLabel,
				yAxisLabel: window.yAxisLabel
			}
		});
        
        // Display the first slide
		slideInstructions(1, brokenModel);

		const playInterval = 4500; // This is the speed between slides while "playing"
		const dataButtons = document.querySelectorAll('.data-button');

		for (var button of dataButtons){
			button.addEventListener('click', function(e){
				const 	direction = e.target.dataset.direction,
						bodyElement = document.querySelector('body');
				let		currentSlide = parseInt(bodyElement.dataset.slide);
								
				if (direction == 'back'){
					clickTrack('SCATTER: User clicked back');
					// If we're at the beginning, then go no farther back, otherwise, move back one.
					currentSlide = currentSlide - 1 > 0 ? currentSlide - 1 : 1;
					console.log(window.totalSlides, currentSlide);
					bodyElement.dataset.slide = currentSlide;
				} else if ( direction == 'forward'){
					clickTrack('SCATTER: User clicked fwd');
					// If we're at the end, then reset to 1, else move ahead one slide
					currentSlide = currentSlide + 1 > window.totalSlides ? 1 : currentSlide + 1;
					bodyElement.dataset.slide = currentSlide;
					console.log(window.totalSlides, currentSlide);

				} else if (direction == "play") {
					clickTrack('SCATTER: User clicked play');
					document.querySelector('body').dataset.playing = true;
					triggerTimerBar(playInterval);
					const player = setInterval(function(){
						if (document.querySelector('body').dataset.slide < window.totalSlides){
							triggerTimerBar(playInterval);
							document.querySelector(".data-button[data-direction='forward']").click();
						} else {
							document.querySelector('body').dataset.playing = false;
							clearInterval(player);
							console.log('cleared');
						}
					}, playInterval)
				} else {
					// Reset back to scene 1
					currentSlide = 1;
				}
				slideInstructions(currentSlide, brokenModel);
			});
		}

	});

	

});