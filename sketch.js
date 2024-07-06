let tsize = 50;  // tile size
let margin = 35;  // margin size
let tnumber = 20;  // number of points (larger row) 
let al1 = 0.1;
let al2 = 0.5;
let link;  // connections
let nlink;  // next connections

let idx;  // index used to interpolate between old and new connections

let bgcolor;  // background color
let randomizeButton;

let patternSlider;
let variabilitySlider;

let calorieValue = 0.005; // Calorie value per link
let eaters = 1; // Number of eaters

let ants = [];



        function preload() {
               font = loadFont('DINPro-Medium.ttf')
          

      }

function setup() {
  
  
//canvas1.position(300,0);
  
  createCanvas(1000, 1000);
 // bgcolor = color(133, 78, 14);

    bgColorStart = color(245, 192, 85);
  bgColorEnd = color(133, 78, 14);

  
  link = new Array(tnumber + 1).fill([]).map(() => new Array(tnumber + 1).fill(1));
  nlink = new Array(tnumber + 1).fill([]).map(() => new Array(tnumber + 1).fill(1));

  configTile();

  
 let g1 = createP('K O L A M O R A');
g1.style('font-size', '38px');
g1.style('fon', font);
g1.position(58, 34);
g1.style('color', '#854E0E'); 
  
  
   
    let d = createP('S C A L E');
d.style('font-size', '20px');
d.position(764, 64);
d.style('color', '#854E0E');
patternSlider = createSlider(1, 10, 1, 1);
patternSlider.position(760,126)
patternSlider.style("width","180px")
patternSlider.addClass("mySliders");  
  
  
  
  
randomizeButton = createButton("R A N D O M I Z E");
randomizeButton.class('custom-button'); // Add a custom class
randomizeButton.position(770, 910);
randomizeButton.size(180, 26);
randomizeButton.elt.style.lineHeight = '4px'; // Align text vertically
randomizeButton.elt.addEventListener('click', finClicked);
  
  
  let x = createP('A Generative Kolam  |  Indhu Kanth, 2023',eaters * 3);  
x.style('font-size', '16px');
x.position(58, 108); 
x.style('color', '#FFFFFF');
  
  
  // // Create sliders
  // patternSlider = createSlider(1, 10, 1, 1);
  // patternSlider.position(20, height + 10);

  // Create ants
  for (let i = 0; i < 160; i++) {
    ants.push(new Ant(random(width), random(height)));
  }

}

function draw() {
  
 // background(bgcolor);
  
   setGradient(0, 0, width, height, bgColorStart, bgColorEnd);
  let patternValue = patternSlider.value();
  translate(width / 2, height / 12);
  rotate(QUARTER_PI);
  imageMode(CENTER);

  if (idx <= 1) {
    drawTile(patternValue);
  }

  // Display ants
  for (let ant of ants) {
    ant.move();
    ant.display();
  }

  // Display number of eaters
  fill(255,212,162);
  
  textSize(20);
  rotate(-QUARTER_PI);
  text(`Feeder Count`, -420, height - 160);
    textSize(26);
  fill(255);

  text(` ${calculateEaters()* 2 }`, -370, height - 120);

    fill(255,212,162);

    textSize(20);
  
   text(`Weight in milligrams`, -86, height - 160);
    textSize(26);
    fill(255);

   text(`${calculateWeight()}`, -24, height - 120);



  // Display kolam dimensions and weight
  // textSize(30);
  // text(`Estimated Weight: ${calculateWeight()} milligrams`, 20, height - 280);
}

class Ant {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(random(2, 4));
  }

  move() {
    this.position.add(this.velocity);

    // Bounce off edges
    if (this.position.x < 0 || this.position.x > width) {
      this.velocity.x *= -1;
    }
    if (this.position.y < 0 || this.position.y > height) {
      this.velocity.y *= -1;
    }
  }

  display() {
    fill(0, 0, 0);
    noStroke();
    ellipse(this.position.x, this.position.y, 2, 8);
  }
}

function setGradient(x, y, w, h, c1, c2) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}


function finClicked() {
  configTile();
  eaters = calculateEaters();
}

function configTile() {
  idx = 0;

  // update ancient links
  for (let i = 0; i < link.length; i++) {
    for (let j = 0; j < link[0].length; j++) {
      link[i][j] = nlink[i][j];
    }
  }

  // create new links
  let limit = random(al1, al2);

  for (let i = 0; i < nlink.length; i++) {
    for (let j = i; j < nlink[0].length / 2; j++) {
      let l = 0;
      if (random(1) > limit) l = 1;

      nlink[i][j] = l;  // left-top
      nlink[i][nlink[0].length - j - 1] = l;  // left-bottom

      nlink[j][i] = l;  // top-left
      nlink[nlink[0].length - j - 1][i] = l;  // top-right

      nlink[nlink.length - 1 - i][j] = l;  // right-top
      nlink[nlink.length - 1 - i][nlink[0].length - j - 1] = l;  // right-top

      nlink[j][nlink.length - 1 - i] = l;  // bottom-left
      nlink[nlink[0].length - 1 - j][nlink.length - 1 - i] = l;  // bottom-right
    }
  }
}

function drawTile(patternValue) {
  let tnumber = patternSlider.value();
  noFill();
  stroke(255, 255, 242);
  strokeWeight(2);

  for (let i = 0; i < tnumber; i++) {
    for (let j = 0; j < tnumber; j++) {
      if ((i + j) % 2 == 0) {
        let t = map(idx, 0, 1, 0, 1); // Use map function to control the drawing progress

        // Use Perlin noise for uneven thickness
        let noiseVal = noise(i * 0.1, j * 0.1, frameCount * 0.01);
        let thickness = map(noiseVal, 0, 1, 1, 4.5);

        let top_left = tsize / 2 * lerp(0, link[i][j], t);
        let top_right = tsize / 2 * lerp(0, link[i + 1][j], t);
        let bottom_right = tsize / 2 * lerp(0, link[i + 1][j + 1], t);
        let bottom_left = tsize / 2 * lerp(0, link[i][j + 1], t);

        noFill();
        strokeWeight(thickness); // Set the stroke weight based on Perlin noise
        rect(i * tsize + margin, j * tsize + margin, tsize, tsize, top_left, top_right, bottom_right, bottom_left);

        fill(255);
        ellipse(i * tsize + tsize / 2 + margin, j * tsize + tsize / 2 + margin, 4);
      }
    }
  }

  // update index gradually
  idx += 0.1;
  idx = constrain(idx, 0,1);
}

function calculateEaters() {
  let totalLinks = 0;
  let tnumber = patternSlider.value();

  for (let i = 0; i < nlink.length; i++) {
    for (let j = 0; j < nlink[0].length; j++) {
      totalLinks += nlink[i][j];
    }
  }

  // Calculate number of eaters based on total links and calorie value
  let eaters = 1 + floor(totalLinks * calorieValue * tnumber);
  return eaters;
}

function calculateWeight() {
  let tnumber = patternSlider.value();
  // Assuming a thin layer of rice powder (thickness, say, 0.1 cm)
  let thickness = 0.1;
  // Calculate volume in cubic centimeters
  let volume = (tnumber * tsize) * (tnumber * tsize) * thickness;
  // Calculate weight in grams
  let weight = volume * 0.0045*(calculateEaters()/tnumber); // Assuming density of rice powder is 0.6 g/cm^3
  return weight.toFixed(2); // Displaying weight with 2 decimal places
}