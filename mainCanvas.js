var w,h;
w = document.documentElement.clientWidth;
h = document.documentElement.clientHeight;
let textPointArr;
let font;
let points;

class tPoint {
        constructor(x,y){
                this.pos = createVector(x,y);
                this.vel = createVector(0,0);
                this.acc = createVector(0,0);
                this.force = createVector(0,0);
                this.homePos = createVector(x,y);
        }
        return() {
                // desired_velocity = normalize(target - position) * max_velocity
                // steering = desired_velocity - velocity

                
        }
}

function preload() {
  font = loadFont('Inconsolata-Medium.otf');
}

function setup(){
        createCanvas(document.documentElement.clientWidth, document.documentElement.clientHeight);
        background(51);
        // textAlign(CENTER);
        textPointArr = font.textToPoints("Taylor Hudson", 0, 0, 10 ,{
                sampleFactor: 5,
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
                var p = textPointArr[i];
                var d = dist(p.x*10,(p.y*10 +height/4),mouseX,mouseY);
                if (d < 50){
                       
                }else{
                        point(p.x*10, p.y*10 +height/4);
                        strokeWeight(1);
                }
                
//                p.x * width / bounds.w +
//         sin(20 * p.y / bounds.h + millis() / 1000) * width / 30,
//       p.y * height / bounds.h
    
        //        console.log(textPointArr[i].x*w/2 + " " + textPointArr[i].y * h / 2)
       };

}