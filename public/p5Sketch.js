// p5Sketch.js
console.log("p5Sketch.js loaded");

let data;
let xScale, yScale;

function preload() {
    data = loadJSON('data/readings.json');
}

function setup() {
    let canvas = createCanvas(800, 400);
    canvas.parent("p5Sketch");
    noLoop();  // Run draw() only once
    console.log("p5.js setup complete");

    let readings = data.readings;

    xScale = d3.scaleTime()
        .domain(d3.extent(readings, d => new Date(d.time)))
        .range([50, width - 20]);

    yScale = d3.scaleLinear()
        .domain([0, d3.max(readings, d => max(d.message.rco2, d.message.tvoc_index))])
        .range([height - 20, 20]);
}

function draw() {
    background(220);
    strokeWeight(2);

    // Draw x-axis
    stroke(0);
    line(50, height - 20, width - 20, height - 20);
    textAlign(CENTER);
    textSize(12);
    for (let i = 0; i <= 10; i++) {
        let x = map(i, 0, 10, 50, width - 20);
        let time = new Date(xScale.invert(x));
        line(x, height - 20, x, height - 15);
        text(nf(time.getHours(), 2) + ':' + nf(time.getMinutes(), 2), x, height - 2);
    }

    // Draw y-axis
    line(50, height - 20, 50, 20);
    textAlign(RIGHT);
    textSize(12);
    for (let i = 0; i <= 10; i++) {
        let y = map(i, 0, 10, height - 20, 20);
        let value = round(yScale.invert(y));
        line(50, y, 55, y);
        text(value, 45, y + 5);
    }

    // Draw rco2 line
    stroke(255, 0, 0);
    noFill();
    beginShape();
    for (let i = 0; i < data.readings.length; i++) {
        let x = xScale(new Date(data.readings[i].time));
        let y = yScale(data.readings[i].message.rco2);
        vertex(x, y);
    }
    endShape();

    // Draw tvoc_index line
    stroke(0, 0, 255);
    beginShape();
    for (let i = 0; i < data.readings.length; i++) {
        let x = xScale(new Date(data.readings[i].time));
        let y = yScale(data.readings[i].message.tvoc_index);
        vertex(x, y);
    }
    endShape();

    // Add labels
    fill(255, 0, 0);
    text("rco2", width - 40, height - 25);
    fill(0, 0, 255);
    text("tvoc_index", width - 40, height - 40);

    console.log("p5.js draw complete");
}
