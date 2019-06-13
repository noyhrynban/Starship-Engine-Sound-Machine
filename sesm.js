var audioCtx  = new (window.AudioContext || window.webkitAudioContext)();
var gainNode = audioCtx.createGain();
	// Gain
	gainNode.gain.value = 1;
var biquadFilter = audioCtx.createBiquadFilter();
// Lowpass Biquad Filter
biquadFilter.type = "lowpass";
biquadFilter.frequency.value = 120;

var bufferSize = 2048;
var whiteNoise = audioCtx.createScriptProcessor(bufferSize, 1, 1);

whiteNoise.onaudioprocess = function(e) {
	var output = e.outputBuffer.getChannelData(0);
	for (var i = 0; i < bufferSize; i++) {
		output[i] = Math.random() * 2 - 1;
	}
}
whiteNoise.connect(biquadFilter);
biquadFilter.connect(gainNode);
gainNode.connect(audioCtx.destination)
audioCtx.suspend();

var playing = false;

function playPauseButtonClick() {
	playing = !playing;
	if (playing) {
		console.log('start playing')
		var hideStyleEl = document.getElementById("desaturatedStyle");
		hideStyleEl.sheet.deleteRule(0);
		
		if(audioCtx.state === 'suspended') {
			console.log('resumed');
			audioCtx.resume();
		} else {
			console.log('engaged');
			engage();
		}
	} else {
		console.log('stop playing')
		var hideStyleEl = document.getElementById("desaturatedStyle");
		hideStyleEl.sheet.insertRule(".mybackground {filter: grayscale(1);-webkit-filter: grayscale(1);}", 0);
		
		audioCtx.suspend();
	}
}

document.addEventListener("keydown", function (e) {
	if(e.keyCode == 38) {
		gainNode.gain.value += .1;
	} else if(e.keyCode == 40) {
		gainNode.gain.value -= .1;
	}
	console.log('gain: ', gainNode.gain.value);
}, false);