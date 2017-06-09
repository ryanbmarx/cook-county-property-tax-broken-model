import scatterplotCanvas from './scatterplot-canvas.js';
import * as pym from 'pym.js';
import * as q from 'd3-queue';
import {csv, selectAll} from 'd3';
import clickTrack from './click-track.js';


// NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
// HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];





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

			
			selectAll('.labels .example').classed('example--visible', true);
			
			highlightRegressionLine('none')
			brokenModel.plotDotsCanvas(2);
			break;
		case 2:
			// Fade out examples
			selectAll('.labels .example').classed('example--visible', false);
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
			selectAll('.labels .example').classed('example--visible', false);
			highlightRegressionLine('2009')
			brokenModel.plotDotsCanvas(1);
			break;
	}
}
function highlightRegressionLine(id){
	
	const lines = document.querySelectorAll('.regression-line');
	for (var lineCounter=0; lineCounter<lines.length; lineCounter++){
		const line = lines[lineCounter];
		console.log(lines, line, line.dataset, line.getAttribute('data-regression-line'));
		if (line.getAttribute('data-regression-line') == `regression-line--${id}` ){
			line.style.opacity = 1;
		} else {
			line.style.opacity = 0;
		}
	}
}

window.addEventListener('load', function(e){
	
	// Listen for the loaded event then run the pym stuff.

	var pymChild = new pym.Child({});
		pymChild.sendHeight();
		pymChild.sendMessage('childLoaded');
		
	const dataQueue = q.queue();
	dataSets.forEach(set => {
		dataQueue.defer(csv,set.url);
	});

	// Once all the d3-queue'ed datas are downloaded and ready to use, instantiate the scatter
	dataQueue.awaitAll(function(error, data){
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

		
		for (var buttonCounter=0; buttonCounter < dataButtons.length; buttonCounter++){
			
			const button = dataButtons[buttonCounter];
			
			button.addEventListener('click', function(e){
				const 	direction = this.dataset.direction,
						bodyElement = document.querySelector('body');
				let		currentSlide = parseInt(bodyElement.dataset.slide);
				
				// console.log(this);

				switch(direction){
					case 'back':
						clickTrack('SCATTER: User clicked back');
						// If we're at the beginning, then go to the last slide, otherwise, move back one.
						currentSlide = currentSlide - 1 > 0 ? currentSlide - 1 : window.totalSlides;
						bodyElement.dataset.slide = currentSlide;
						break;

					case 'forward':
						clickTrack('SCATTER: User clicked fwd');
						// If we're playing, and at the end, then kill playing and leave things
						// where they are so the reader can read the final slide. If we're not 
						// playing and at the end, then come back around to the first slide. Otherwise, 
						// keep going.
						if (currentSlide + 1 > window.totalSlides){
								currentSlide = 1;
						} else {
							// NOT AT THE END
							currentSlide = currentSlide + 1;	
						}
						bodyElement.dataset.slide = currentSlide;
						break;

					case 'play':
						// track the click
						clickTrack('SCATTER: User clicked play');
						// console.log('playing')
						if (bodyElement.dataset.playing == true){
						
							// if the graphic ALREADY IS playing, then stop it, but leave the current 
							// slide as is The button will read "stop" so this really is the stop button.
							// bodyElement.dataset.playing = false;
							// console.log('clearing');
							clearInterval(player);
							document.querySelector('body').dataset.playing = false;

						} else {

							// if the graphic is not playing, then reset to 1 and start playing
							currentSlide = 1;
							document.querySelector('body').dataset.playing = true;
							triggerTimerBar(playInterval);
							
							// This timer will advance every <playInterval> milliseconds by similuating
							// a click on the next button.
							const player = setInterval(function(){
								// console.log(currentSlide, window.totalSlides, currentSlide < window.totalSlides)
								if (parseInt(bodyElement.dataset.slide) < window.totalSlides){
									// console.log('keep intervaling');
									// keep advancing if we are not at the last slide.
									triggerTimerBar(playInterval);
									document.querySelector(".data-button[data-direction='forward']").click();

								} else {
									
									// Stop the timer when we reach the last slide.
									bodyElement.dataset.playing = false;
									clearInterval(this);
									// console.log('cleared');

								}
							}, playInterval);
						}
						break;
					default:
						// Otherwise, just head back to one.
						currentSlide = 1;
						bodyElement.dataset.slide = currentSlide;
						break;
				}				
				slideInstructions(currentSlide, brokenModel);
			});
		}

	});

	

});