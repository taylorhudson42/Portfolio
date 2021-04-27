var w,h;
w = document.documentElement.clientWidth;
h = document.documentElement.clientHeight;
let textPointArr;
let font;
let points = new Array();

class tPoint {
        constructor(x,y){
                this.pos = createVector(x,y);
                this.vel = createVector(0,0);
                this.acc = createVector(0,0);
                this.force = createVector(0,0);
                this.target = createVector(x,y);
        }
        update(){
                this.pos.add(this.vel);
                this.vel.add(this.acc);
        }
        show(){
                point(this.pos.x,this.pos.y);
        }
        steer(){
                var seek = this.seek(this.target);
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
}

function preload() {
  font = loadFont('Inconsolata-Medium.otf');
}

function setup(){
        createCanvas(document.documentElement.clientWidth, document.documentElement.clientHeight);
        background(51);
        textPointArr = font.textToPoints("Taylor Hudson", width/4, height/2, 100 ,{
                sampleFactor: .5,
                simplifyThreshold: 0
              });
        for (var i = 0; i<textPointArr.length; i++){
                points[i] = new tPoint(textPointArr[i].x,textPointArr[i].y);
        }
        // for (var i = 0; i<textPointArr.length; i++){
        //         // console.log(textPointArr[i].x *bounds.w+ " " + textPointArr[i].y * bounds.h)
        // };
}

function draw(){
        background(51);
        
        for (var i = 0; i<textPointArr.length; i++){
                
                stroke ("White");
                var p = createVector(textPointArr[i].x, textPointArr[i].y);
                var m = createVector(mouseX,mouseY);
                var d = dist(p.x,p.y,m.x,m.y);
                // points[i].steer();
                points[i].update();
                points[i].show();
                
                
//                p.x * width / bounds.w +
//         sin(20 * p.y / bounds.h + millis() / 1000) * width / 30,
//       p.y * height / bounds.h
    
        //        console.log(textPointArr[i].x*w/2 + " " + textPointArr[i].y * h / 2)
       };

}