let sound;
let beats = [];
let beatIndex = 0;
let circles = [];
let isPlaying = false;
let bgImage;

function preload() {
  console.log('Preloading assets...');
  sound = loadSound('SMC_001.wav', loaded, failed);
  loadBeats('SMC_001_2_1_1_a.txt');
  bgImage = loadImage('image.png');  // Ensure the background image is in the same directory
}

function loaded() {
  console.log('Sound loaded successfully.');
}

function failed(err) {
  console.error('Failed to load sound:', err);
}

function setup() {
  createCanvas(800, 600);
  console.log('Setup complete.');

  // Add an event listener to the start button
  document.getElementById('startButton').addEventListener('click', startAudio);
}

function startAudio() {
  if (!isPlaying && sound.isLoaded()) {
    sound.play();
    isPlaying = true;
    console.log('Sound is playing.');
    document.getElementById('startButton').style.display = 'none'; // Hide the button after starting
  } else {
    console.error('Sound is not loaded or already playing.');
  }
}

function draw() {
  if (bgImage) {
    background(bgImage);  // Draw the background image
  } else {
    background(0);  // Fallback background
  }

  if (isPlaying) {
    let currentTime = sound.currentTime();
    if (beatIndex < beats.length && currentTime >= beats[beatIndex]) {
      visualizeBeat();
      beatIndex++;
    }

    for (let i = circles.length - 1; i >= 0; i--) {
      circles[i].update();
      circles[i].display();
      if (circles[i].isFinished()) {
        circles.splice(i, 1);
      }
    }
  }
}

function loadBeats(file) {
  console.log(`Loading beats from ${file}...`);
  loadStrings(file, function(data) {
    beats = data.map(Number);
    console.log('Beats loaded:', beats);
    if (beats.length > 0) {
      console.log('Beats are successfully loaded.');
    } else {
      console.error('No beats found in the file.');
    }
  }, function(err) {
    console.error('Failed to load beats:', err);
  });
}

function visualizeBeat() {
  console.log('Visualizing beat at index', beatIndex);
  circles.push(new Circle(random(width), random(height), random(10, 50), color(random(255), random(255), random(255))));
}

class Circle {
  constructor(x, y, size, col) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.col = col;
    this.lifespan = 255;
  }

  update() {
    this.size += 2;
    this.lifespan -= 5;
  }

  display() {
    noFill();
    stroke(this.col.levels[0], this.col.levels[1], this.col.levels[2], this.lifespan);
    strokeWeight(2);
    ellipse(this.x, this.y, this.size, this.size);
  }

  isFinished() {
    return this.lifespan < 0;
  }
}
