# Jules p5 lib extravaganza

Here is all the libs that run my ~~daily~~ nightly business, spaghetti and all.

Much is adapted from Ted Davis and others.

## Components

**palette**: saves color palettes, allows easy usage
**universal update**: boilerplating for easy sketch setup
**setupMidi**: use midi keyboards, absolute mess
**config helper** save configs to sketch and change with midi keyboard or manually
**setupAudio** use audio, includes shitty (suprisingly ok tho) beat detection and some calculated audio stuff for ease
**icons** color and reuse icons without refilling a million pixels in a draw loop
**helpers** helper stuff like an array manager and thing manager, useful!

## Demo

````

function setConfig() {
	// Midi overrides C values from other sources
	CONF.setMidi({
		// MIDI values are automatically smoothed cuz it's cool, this disables it if needed!
		NOEASE: ["colorIndex"],
		colorIndex: getMidiRound(5, 100)
		// NOTE: config has a lot of default values for things, like C.strokeWeight / C.count which are pre-mapped to midi keyboard / configs for unity and love
	})
	// defaults fall back if nothing in current configuration or from midi
	CONF.defaults({
		size: 10,
		strokeWeight: 5,
		colorIndex: 0
	});
	// set via midi or CONF.use(1)
	// act as defaults for presets which allows for saving configurations
	CONF.set([{
		size: 100,
		palette: "wolo"
	}, {
		size: 10,
		palette: "nizami"
	}]);
}

function setup() {
	createCanvas(windowWidth, windowHeight)
	// manually set used preset
	CONF.use(0)

	// magicks default setup
	setupLibs()
}

function draw() {
	// magic update for audio + config + midi + whatever


	updateLibs()
	// audio variables beatCount, barCount, ampAvg etc.
	P.setPreset(C.palette)

	push()
	translate(width / 2, height / 2)

	fill(P.getI(beatCount))

	rect(0, 0, C.size, C.size)
	noFill()

	stroke(P.getI(C.colorIndex))
	strokeWeight(C.strokeWeight)

	rect(0, 0, C.size + ampAvg, C.size + ampAvg)
	pop()

	// djbox movable with midi keyboard, can be used to unblind a dj if viz are projected on face NOTE: see pushpop above! will move with translates etc
	djBox()

}```
````

Notes:

- some stuff used to use ramda, might need to be loaded still
