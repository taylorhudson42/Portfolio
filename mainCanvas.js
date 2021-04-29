var w,h;
w = document.documentElement.clientWidth;
h = document.documentElement.clientHeight;
let textPoints;
let font;
let points = new Array();
let bounds;
class tPoint {
        constructor(x,y,x1,y1,color){
                this.pos = createVector(x1,y1);
                this.vel = createVector(0,0);
                this.acc = createVector(0,0);
                this.force = createVector(0,0);
                this.target = createVector(x,y);
                this.maxspeed = 10;
                this.maxforce = .6;
                this.color = color;
        }
        update(){
                this.pos.add(this.vel);
                this.vel.add(this.acc);
                this.acc.mult(0);
        }
        show(){
                point(this.pos.x,this.pos.y);
        }
        steer(){
                var arrive = this.arrive(this.target);
                var mouse = createVector(mouseX,mouseY);
                var flee = this.flee(mouse);

                arrive.mult(1);
                flee.mult(5);

                this.applyForce(arrive);
                this.applyForce(flee);

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
        createCanvas(document.documentElement.clientWidth, document.documentElement.clientHeight);
        background(2);
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
                        color(random(0,255),random(0,255),random(0,255))
                );
        }
        button = createButton('View Projects');
        button.center();
        button.mousePressed(function(){
                startTransition();
                this.remove();
        });
        button.class("btn btn-dark");
      
}

function startTransition(){
        textPoints = [];
        let strings = ["Solar Simulation", "Project AIM", "Printing Interface"];
        let lengths = [];
        let boundsWords = [];
        for (var i = 0; i<strings.length; i++){
                let word = font.textToPoints(strings[i], 0, 0, 90,{sampleFactor:.3, simplifyThreshold:0});
                textPoints = textPoints.concat(word);
                boundsWords[i] = font.textBounds(strings[i],0,0,90);
                lengths[i] = textPoints.length;
        }
        console.log(textPoints.length);
        console.log(points.length);
        var lnum = 0;
        for (var i = 0; i<textPoints.length; i++){
                if (i>lengths[lnum]){
                        lnum++;
                }
                if (i>=points.length){
                        points[i] = new tPoint(
                                textPoints[i].x+((width-boundsWords[lnum].w)/2),
                                textPoints[i].y+((height-boundsWords[lnum].h)/4*(lnum+1)),
                                points[i-1%points.length].pos.x,
                                points[i-1%points.length].pos.y
                        );
                }else{
                        // console.log(i);
                        points[i].target = createVector(
                                textPoints[i].x+((width-boundsWords[lnum].w)/2),
                                textPoints[i].y+((height-boundsWords[lnum].h)/4*(lnum+1))
                        );
                }
                // console.log(points[i%points.length]);
        }
        
        makeButtons(boundsWords);
}

async function makeButtons(bounds){
        await new Promise(r => setTimeout(r, 2000));
        let links = [
                "https://github.com/taylorhudson42/SolarSimulation",
                "https://github.com/Lunatic-Labs/Project-Aim",
                "https://github.com/taylorhudson42/lu-printing-desktop"
        ];
        console.log(links[0]);
        for (var i = 0; i <links.length; i++){
                solarDiv = createButton();
                console.log(bounds[i].h);
                solarDiv.position(bounds[i].x,(height-bounds[i].h)/4*(i) + 30);
                solarDiv.style("width:100%; opacity:0;height:25%");
                // solarSim = createButton("Explore Project");
                // solarSim.class("btn btn-dark");
                // solarDiv.child(solarSim);
                // solarSim.center();
                solarDiv.hover
                solarDiv.attribute("onclick","window.open(\""+links[i]+"\",'_blank', 'resizable=yes')");
        }
        


}

function draw(){
        background(0);
        
        for (var i = 0; i<points.length; i++){
                
                // stroke(random(0,255),random(0,255),random(0,255));
                // stroke(255,map(-dist(points[i].pos.x,points[i].pos.y, mouseX,mouseY),-width, 0, 0,255));
                stroke(255);
                points[i].steer();
                points[i].update();
                points[i].show();                
       };

}