var w,h;
w = document.documentElement.clientWidth;
h = document.documentElement.clientHeight;
let textPoints;
let font;
let points = new Array();
let bounds;
var fleeBool = true;
var drawText = false;
let lengths = [];
let links = [
        "https://github.com/taylorhudson42/SolarSimulation",
        "https://github.com/Lunatic-Labs/Project-Aim",
        "https://github.com/taylorhudson42/lu-printing-desktop"
];


class tPoint {
        constructor(x,y,x1,y1){
                this.pos = createVector(x1,y1);
                this.vel = createVector(0,0);
                this.acc = createVector(0,0);
                this.force = createVector(0,0);
                this.target = createVector(x,y);
                this.maxspeed = 10;
                this.maxforce = .6;
                this.color = color(255,255,255);
        }
        update(){
                this.pos.add(this.vel);
                this.vel.add(this.acc);
                this.acc.mult(0);
        }
        show(){
                stroke(this.color);
                point(this.pos.x,this.pos.y);
        }
        steer(){
                var arrive = this.arrive(this.target);
                var mouse = createVector(mouseX,mouseY);
                var flee = this.flee(mouse);

                arrive.mult(1);
                flee.mult(5);

                this.applyForce(arrive);
                if (fleeBool){
                        this.applyForce(flee);
                }

        }
        applyForce(f){
                this.acc.add(f);
        }
        seek(target){
                var desired = p5.Vector.sub(target,this.pos);
                desired.setMag(this.maxspeed);
                var steer = p5.Vector.sub(desired,this.vel);
                return steer;
        }
        flee(target){
                var desired = p5.Vector.sub(target, this.pos);
                var d = desired.mag();
                if (d < 50) {
                        desired.setMag(this.maxspeed);
                        desired.mult(-1);
                        var steer = p5.Vector.sub(desired, this.vel);
                        steer.limit(this.maxforce);
                        return steer;
                } else {
                        return createVector(0, 0);
                }             
        }
        arrive(target){
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
}

function preload() {
  font = loadFont("iAWriterDuospace-Regular.otf");
}

function setup(){
        createCanvas(document.documentElement.clientWidth, document.documentElement.clientHeight*.95);
        background(2);
        strokeWeight(3);
        textPoints = font.textToPoints("Taylor Hudson", 0, 0, 100 ,{
                sampleFactor: .3,
                simplifyThreshold: 0
              });
        bounds = font.textBounds("Taylor Hudson", 0, 0, 100, {textalign:CENTER});
        for (var i = 0; i<textPoints.length; i++){
                points[i] = new tPoint(
                        textPoints[i].x+((width-bounds.w)/2),
                        textPoints[i].y+((height-bounds.h)/2),
                        textPoints[i].x+((width-bounds.w)/2) + random(-300,300),
                        textPoints[i].y+((height-bounds.h)/2) + random(-300,300),
                        color(255,255,255)
                );
        }
        button = createButton('View Projects');
        button.center();
        button.position(AUTO, ((height-bounds.h)/2) + 20);

        button.mousePressed(function(){
                startTransition();
                this.remove();
        });
        button.class("btn btn-dark");
      
}

async function startTransition(){
        fleeBool = false;
        textPoints = [];
        let strings = ["Solar Simulation", "Project AIM", "Printing Interface"];
        let boundsWords = [];
        for (var i = 0; i<strings.length; i++){
                let word = font.textToPoints(strings[i], 0, 0, 90,{sampleFactor:.3, simplifyThreshold:0});
                textPoints = textPoints.concat(word);
                boundsWords[i] = font.textBounds(strings[i],0,0,90);
                lengths[i] = createVector(textPoints.length, textPoints.length-word.length);
                console.log("Word Lengths: "+ lengths[i].y);
        }
        console.log(textPoints.length);
        console.log(points.length);
        // for (var i = 0; i<points.length; i++){
        //         points[i].target = createVector(mouseX,mouseY);
        // }

        // await new Promise(r => setTimeout(r, 1000));
        
        var lnum = 0;
        var a = points.length;

        for (var i = 0; i<textPoints.length; i++){
                if (i>lengths[lnum].x){
                        lnum++;
                }
                points[i] = new tPoint(
                        textPoints[i].x+((width-boundsWords[lnum].w)/2),
                        textPoints[i].y+((height-boundsWords[lnum].h)/4*(lnum+1)),
                        points[i%a].pos.x,
                        points[i%a].pos.y,
                        color(255,255,255)
                );
        }
        // fleeBool = true;
      
        makeButtons(boundsWords);
        await new Promise(r => setTimeout(r, 1000));
        drawText = true;
}

async function makeButtons(bounds){
        await new Promise(r => setTimeout(r, 1000));
        console.log(links[0]);
        for (var i = 0; i <links.length; i++){
                solarDiv = createButton();
                console.log(bounds[i].h);
                solarDiv.position(bounds[i].x,(height-bounds[i].h)/4*(i) + 30);
                solarDiv.style("width:100%; opacity:0;height:25%");
                solarDiv.id(i);
                solarDiv.mouseOver(function(){
                        changeColor(this.id(), color(86,246,250));
                });
                solarDiv.mouseOut(function(){
                        changeColor(this.id(), color(255,255,255));
                })
                solarDiv.attribute("onclick","window.open(\""+links[i]+"\",'_blank', 'resizable=yes')");
        }
}

function changeColor(id, color){
        for (var i = lengths[id].y; i < lengths[id].x; i++){
                points[i].color = color;
        }
}

function draw(){
        background(0);
        for (var i = 0; i<points.length; i++){
                points[i].steer();
                points[i].update();
                points[i].show();                
       };
       let strings = ["Solar Simulation", "Project AIM", "Printing Interface"];
       let boundsWords = [];
        for (var i = 0; i<strings.length; i++){
                boundsWords[i] = font.textBounds(strings[i],0,0,90);
        }
       if (drawText == true) {
        //        console.log("?Test);");
                stroke(255);
                fill(255);
                textSize(90);
                textFont(font);
                text(strings[0], ((width-boundsWords[0].w)/2), (height-boundsWords[0].h)/4*(0+1));
                text(strings[1], ((width-boundsWords[1].w)/2), (height-boundsWords[1].h)/4*(1+1));
                text(strings[2], ((width-boundsWords[2].w)/2), (height-boundsWords[2].h)/4*(2+1));
        }
        
}