// transitionGraph.js
console.log("transitionGraph.js loaded");

let transitionData;
let xScale, yScale;
let currentStep = 0;
let maxSteps = 100;
let isPlaying = false;

function preload() {
    transitionData = loadJSON('data/readings.json');
}

function setup() {
    let canvas = createCanvas(800, 400);
    canvas.parent("transitionGraph");
    console.log("p5.js setup complete");

    let readings = transitionData.readings;

    xScale = d3.scaleTime()
        .domain(d3.extent(readings, d => new Date(d.time)))
        .range([50, width - 50]);

    yScale = d3.scaleLinear()
        .domain([0, d3.max(readings, d => Math.max(d.message.rco2, d.message.tvoc_index))])
        .range([height - 50, 50]);

    frameRate(30); // Set the frame rate to 30 FPS
}

function draw() {
    if (!isPlaying) {
        return;
    }

    background(220);

    let readings = transitionData.readings;
    let stepSize = Math.ceil(readings.length / maxSteps);
    let currentData = readings.slice(0, Math.min(currentStep * stepSize, readings.length));

    // Draw x-axis
    stroke(0);
    line(50, height - 50, width - 50, height - 50);
    textAlign(CENTER);
    textSize(12);
    for (let i = 0; i <= 10; i++) {
        let x = map(i, 0, 10, 50, width - 50);
        let time = new Date(xScale.invert(x));
        line(x, height - 50, x, height - 45);
        text(nf(time.getHours(), 2) + ':' + nf(time.getMinutes(), 2), x, height - 30);
    }

    // Draw y-axis
    line(50, height - 50, 50, 50);
    textAlign(RIGHT);
    textSize(12);
    for (let i = 0; i <= 10; i++) {
        let y = map(i, 0, 10, height - 50, 50);
        let value = round(yScale.invert(y));
        line(50, y, 55, y);
        text(value, 45, y + 5);
    }

    // Draw rco2 line
    stroke(255, 0, 0);
    noFill();
    beginShape();
    for (let i = 0; i < currentData.length; i++) {
        let x = xScale(new Date(currentData[i].time));
        let y = yScale(currentData[i].message.rco2);
        vertex(x, y);
    }
    endShape();

    // Draw tvoc_index line
    stroke(0, 0, 255);
    beginShape();
    for (let i = 0; i < currentData.length; i++) {
        let x = xScale(new Date(currentData[i].time));
        let y = yScale(currentData[i].message.tvoc_index);
        vertex(x, y);
    }
    endShape();

    // Add labels
    fill(255, 0, 0);
    text("rco2", width - 70, height - 65);
    fill(0, 0, 255);
    text("tvoc_index", width - 70, height - 80);

    // Update the step counter
    if (currentStep < maxSteps) {
        currentStep++;
    } else {
        noLoop(); // Stop the loop once the transition is complete
        isPlaying = false;
        document.getElementById("playButton").innerText = "Play";
    }
}

function playAnimation() {
    if (!isPlaying) {
        isPlaying = true;
        currentStep = 0;
        loop();
        document.getElementById("playButton").innerText = "Pause";
    } else {
        isPlaying = false;
        noLoop();
        document.getElementById("playButton").innerText = "Play";
    }
}
