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
var themeval;
var oneTimeOnly = false;
var canv;
var dark = true;
var pointThemeVal;
var lightDark;
themeval = 0;
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
        // console.log((dist(this.pos.x, this.pos.y, this.target.x, this.target.y)));
        stroke(pointThemeVal);
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
    pointThemeVal = color(85, 230, 255);
    canv = createCanvas(document.documentElement.clientWidth, document.documentElement.clientHeight);
    canv.parent('canvContainer');
    background(themeval);
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
            pointThemeVal
        );
    }
    var html = `
        <span class="gr"> I'm an aspiring</span>
        <span class="bl">software engineer</span><span class="gr">.</span>

        <br>
        <span class="grSub">I review, develop, and test code. I am a junior at</span>
        <a id=\"schoollink\" href=\"https://www.lipscomb.edu\">Lipscomb University</a><span class="grSub">, studying software engineering.</span>
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
    introDiv.id("info");
    introDiv.position(width * .2, height * .3);
    introDiv.style("left", "20vw");
    introDiv.style("top", "30vh");
    introDiv.style("width", "60vw");
    introDiv.attribute("display", "block");
    introDiv.attribute("clear", "both");
    introDiv.style("overflow", "-moz-scrollbars-vertical");
    introDiv.style("overflow", "scroll");

    lightDark = createButton();
    var buttonHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-brightness-high-fill" viewBox="0 0 16 16">
    <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
  </svg>`

    lightDark.class("btn btn-dark");
    lightDark.html(buttonHTML)
    lightDark.position(width * .1, height * .1);
    lightDark.mousePressed(changeTheme);
    lightDark.style('height', '45px');
    lightDark.style('width', '45px');

    windowResize();
}

function changeTheme() {
    var r = document.querySelector(':root');
    if (dark == true) {
        r.style.setProperty("--background", "white");
        r.style.setProperty("--EmphText", "#C001FF");
        r.style.setProperty("--notEmphText", "#515151");
        r.style.setProperty("--subtext", "#8A8A8A");
        r.style.setProperty("--oppositeBackground", "black")
        dark = false;
        themeval = 255;
        pointThemeVal = color('#C001FF');
        var buttonHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" class="bi bi-moon-fill" viewBox="0 0 16 16">
        <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
      </svg>`
        var btns = document.getElementsByClassName("btn");
        for (var i = 0; i < btns.length; i++) {
            if (!btns[i].classList.contains("btn-dark")) {

                btns[i].classList.remove("btn-outline-light");
                btns[i].classList.add("btn-outline-dark");
            }
        }
        var cards = document.getElementsByClassName("card");
        for (var i = 0; i < cards.length; i++) {
            cards[i].classList.remove("bg-secondary");
            cards[i].classList.add("bg-light");
            cards[i].setAttribute('style', "background-color: white !important");
        }
    } else {
        r.style.setProperty("--background", "black");
        r.style.setProperty("--EmphText", "rgb(85, 230, 250)");
        r.style.setProperty("--notEmphText", "lightgrey");
        r.style.setProperty("--subtext", "grey");
        r.style.setProperty("--oppositeBackground", "white")

        dark = true;
        themeval = 0;
        pointThemeVal = color(85, 230, 255);
        var buttonHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-brightness-high-fill" viewBox="0 0 16 16">
        <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
      </svg>`
        var btns = document.getElementsByClassName("btn");
        for (var i = 0; i < btns.length; i++) {
            if (!btns[i].classList.contains("btn-dark")) {
                btns[i].classList.remove("btn-outline-dark");
                btns[i].classList.add("btn-outline-light");
            }

        }
        var cards = document.getElementsByClassName("card");
        for (var i = 0; i < cards.length; i++) {
            cards[i].classList.remove("bg-light");
            cards[i].classList.add("bg-secondary");
            cards[i].setAttribute('style', "background-color: var(--subtext) !important");

        }

    }
}

var resizedFinished;
$(window).resize(function() {

    clearTimeout(resizedFinished);
    resizedFinished = setTimeout(windowResize, 100);
})


function windowResize() {
    console.log("window Resized");
    var infoDivHeight = document.getElementById('info').clientHeight;
    if (windowHeight < (windowHeight * .3) + infoDivHeight) {
        hei = (windowHeight * .3) + infoDivHeight;
    } else {
        hei = windowHeight;
    }
    resizeCanvas(windowWidth, hei);
    width = document.documentElement.clientWidth;
    height = document.documentElement.clientHeight;
    drawPoints();

}

function draw() {
    background(themeval);
    for (var i = 0; i < points.length; i++) {
        points[i].steer();
        points[i].update();
        points[i].show();
    }
    var y = window.scrollY;


    // Transition on Scroll
    if (y > height * .1 && y < height) {
        oneTimeOnly = true;
        var s = 0;
        var alt = 0;
        var alt2 = 0;
        var t = 0;
        var oneTime = true;
        for (var i = 0; i < points.length; i++) {

            // Left Side
            if (((width * .001) + s) * 20 + alt > width * .175) {
                s = 0;
                t++;
                if (alt == 10) {
                    alt = 0;
                } else {
                    alt = 10;
                }
            }

            // Right Size
            if (i > points.length / 2 && oneTime == true) {
                alt2 = width * .8;
                t = 0;
                oneTime = false;
                s = 0;
            }


            //Down the middle
            //Down the middle
            // if (((width * .2)) + (s * 20) + alt > width * .8) {
            //     s = 0;
            //     t++;
            //     if (alt == 10) {
            //         alt = 0;
            //     } else {
            //         alt = 10;
            //     }
            // }

            points[i].target = createVector(((width * .001) + s) * 20 + alt + alt2, t * 10);
            s++
        }
    }
    if (y < height * .1 && oneTimeOnly == true) {
        oneTimeOnly = false;
        drawPoints();
    }
}

function drawPoints() {
    textPoints = font.textToPoints("Taylor Hudson", 0, 0, width / 12, {
        sampleFactor: .5,
        simplifyThreshold: 0
    });
    bounds = font.textBounds("Taylor Hudson", 0, 0, width / 12, { textalign: CENTER });
    var j = 0;
    for (var i = 0; i < textPoints.length; i++) {
        if (i > points.length || points[i] == null) {
            points[i] = new tPoint(
                textPoints[i].x + ((width - bounds.w) / 2),
                textPoints[i].y + ((height - bounds.h) * .2),
                textPoints[i].x + ((width - bounds.w) / 2) + i * random(0, .3), // + random(-300, 300),
                textPoints[i].y + ((height - bounds.h) / 2) - (500),
                pointThemeVal
            );
        } else {
            points[i].target = createVector(textPoints[i].x + ((width - bounds.w) / 2), textPoints[i].y + ((height - bounds.h) * .2));
        }
        j++;
    }
    if (j < points.length) {
        points = points.slice(0, j);
    }
}