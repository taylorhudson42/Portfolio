var w, h;
w = document.documentElement.clientWidth;
h = document.documentElement.clientHeight;
let textPoints;
let font;
let points = new Array();
let bounds;
var fleeBool = true;
var drawText = false;
let lengths = [];
var light, dark;
var oneTimeOnly = false;
var canv;
light = 255;
dark = 10;
let links = [
    "https://github.com/taylorhudson42/SolarSimulation",
    "https://github.com/Lunatic-Labs/Project-Aim",
    "https://github.com/taylorhudson42/lu-printing-desktop"
];


class tPoint {
    constructor(x, y, x1, y1, color) {
        this.pos = createVector(x1, y1);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.force = createVector(0, 0);
        this.target = createVector(x, y);
        this.maxspeed = 10;
        this.maxforce = .4;
        this.color = color;
    }
    update() {
        this.pos.add(this.vel);
        this.vel.add(this.acc);
        this.acc.mult(0);
    }
    show() {
        stroke(this.color);
        point(this.pos.x, this.pos.y);
    }
    steer() {
        var arrive = this.arrive(this.target);
        var mouse = createVector(mouseX, mouseY);
        var flee = this.flee(mouse);

        arrive.mult(1);
        flee.mult(5);

        this.applyForce(arrive);
        if (fleeBool) {
            this.applyForce(flee);
        }

    }
    applyForce(f) {
        this.acc.add(f);
    }
    seek(target) {
        var desired = p5.Vector.sub(target, this.pos);
        desired.setMag(this.maxspeed);
        var steer = p5.Vector.sub(desired, this.vel);
        return steer;
    }
    flee(target) {
        var desired = p5.Vector.sub(target, this.pos);
        var d = desired.mag();
        var fade = 200
            // if(d<fade){
            //         this.color = color(map(d,0,fade,85,255,true),map(d,0,fade,230,255,true),map(d,0,fade,250,255,true));
            // }else{
            //         this.color = color(85,230,250);

        // }

        if (d < 75) {
            desired.setMag(this.maxspeed);
            desired.mult(-1);
            var steer = p5.Vector.sub(desired, this.vel);
            steer.limit(this.maxforce);
            return steer;
        } else {

            return createVector(0, 0);
        }
    }
    arrive(target) {
        var desired = p5.Vector.sub(target, this.pos);
        var d = desired.mag();
        var speed = this.maxspeed;
        if (d < 100) {
            speed = map(d, 0, 100, 0, this.maxspeed);
        }
        desired.setMag(speed);
        var steer = p5.Vector.sub(desired, this.vel);
        steer.limit(this.maxforce);
        return steer;
    }
    changeColor(color) {
        this.color = color;
    }
}

function preload() {
    font = loadFont("iAWriterDuospace-Regular.otf");
}

function setup() {
    canv = createCanvas(document.documentElement.clientWidth, document.documentElement.clientHeight);
    canv.parent('canvContainer');
    background(dark);
    strokeWeight(3);


    textPoints = font.textToPoints("Taylor Hudson", 0, 0, width / 12, {
        sampleFactor: .5,
        simplifyThreshold: 0
    });
    bounds = font.textBounds("Taylor Hudson", 0, 0, width / 12, { textalign: CENTER });
    for (var i = 0; i < textPoints.length; i++) {

        points[i] = new tPoint(
            textPoints[i].x + ((width - bounds.w) / 2),
            textPoints[i].y + ((height - bounds.h) * .2),
            textPoints[i].x + ((width - bounds.w) / 2) + i * random(0, .3), // + random(-300, 300),
            textPoints[i].y + ((height - bounds.h) / 2) - (500),
            color(85, 230, 250)
        );
    }
    var html = `
        <span class="gr"> I'm an aspiring</span>
        <span class="bl">software engineer</span>
        <span class="gr">.</span>

        <br>
        <span class="grSub">I review, develop, and test code. I am a sophomore at</span>
        <a id=\"schoollink\" href=\"https://www.lipscomb.edu\">Lipscomb University</a>
        <span class="grSub">, studying software engineering.</span>
        <br>
        <br>
        <span class="gr">I want to make</span>
        <span class="bl">creative</span>
        <span class="gr">and</span>
        <span class="bl">useful</span>
        <span class="gr">projects.</span>
        <br>
        <span class="grSub">I have experience working with front-end as well as back-end applications. I've worked with JavaScript, Python, Java, C++, C, Ruby, and Swift.</span>
        <br><br>
        <span class="gr">About </span>
        <span class="bl">Me</span>
        <br>
        <span class="grSub">I grew up in Cincinnati, Ohio where I quickly became fond of computing. I enjoy developing personally interesting projects and discussing the capabilities of advanced computing. I spend most my time exercising, reading, and enjoying time with friends and family.</span>
    `;
    introDiv = createDiv(html);
    introDiv.parent('infoContainer');
    introDiv.position(width * .2, height * .3);
    introDiv.style("left", "20vw");
    introDiv.style("top", "30vh");
    introDiv.style("width", "60vw");
    introDiv.attribute("display", "block");
    introDiv.style("max-height", "70vh");
    introDiv.attribute("clear", "both");
    introDiv.style("overflow", "-moz-scrollbars-vertical");
    introDiv.style("overflow", "scroll");

    introSmall = createDiv();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    width = document.documentElement.clientWidth;
    height = document.documentElement.clientHeight;

}

function draw() {
    background(0);
    for (var i = 0; i < points.length; i++) {
        points[i].steer();
        points[i].update();
        points[i].show();
    }
    var y = window.scrollY;
    if (y > height * .1 && y < height) {
        oneTimeOnly = true;
        var interval = int(map(y, 0, h / 2, 0, points.length, true));
        // var alt = true;
        // for (var i = 0; i < interval; i++) {
        //     if (alt == true) {
        //         points[i].target = createVector(width * .175, int(map(i, 0, points.length, height * .3, height)));
        //         alt = false;
        //     } else {
        //         points[i].target = createVector(width * .825, int(map(i, 0, points.length, height * .3, height)));
        //         alt = true;
        //     }

        // }
        var s = 0;
        var alt = 0;
        var alt2 = 0;
        var t = 0;
        var oneTime = true;
        for (var i = 0; i < points.length; i++) {
            if (((width * .001) + s) * 20 + alt > width * .175) {
                s = 0;
                t++;
                if (alt == 10) {
                    alt = 0;
                } else {
                    alt = 10;
                }
            }

            if (i > points.length / 2 && oneTime == true) {
                alt2 = width * .8;
                t = 0;
                oneTime = false;
                s = 0;
            }

            points[i].target = createVector(((width * .001) + s) * 20 + alt + alt2, height * .3 + t * 10);
            s++
        }
    }
    if (y < height * .1 && oneTimeOnly == true) {
        oneTimeOnly = false;
        textPoints = font.textToPoints("Taylor Hudson", 0, 0, width / 12, {
            sampleFactor: .5,
            simplifyThreshold: 0
        });
        bounds = font.textBounds("Taylor Hudson", 0, 0, width / 12, { textalign: CENTER });
        for (var i = 0; i < points.length; i++) {
            points[i].target = createVector(textPoints[i].x + ((width - bounds.w) / 2), textPoints[i].y + ((height - bounds.h) * .2));
        }
    }
}