objects=[];
status1="";

function setup(){
    canvas= createCanvas(640, 420);
    canvas.center();

    video= createCapture(VIDEO);
    video.size(640,420);
    video.hide();
}

function modelLoaded(){
    console.log("model loaded");
    status1=true;
}

function start(){
    objectDetector = ml5.objectDetector("cocossd", modelLoaded);
    document.getElementById("status").innerHTML = "Status: Detecting Objects";
    object_name = document.getElementById("object_name").value;
}

function gotResult(error, results){
    if(error){
        console.log(error);
    }
    console.log(results);
    objects= results;
}

function draw(){
    image(video,0,0,640,420);

    if(status1 != ""){
        objectDetector.detect(video, gotResult);
        
        for(i=0; i<objects.length; i++){
            document.getElementById("status").innerHTML = "Status: Objects Detetected";
            fill("red");
            percent= floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + "%", objects[i].x+15, objects[i].y+15);
            noFill();
            stroke("red");
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);

            if (objects[i].label == object_name){
                video.stop();
                objectDetector.detect(gotResult);    
                document.getElementById("object_status").innerHTML= object_name + " Found";
                synth = window.speechSynthesis;
                utterThis = new SpeechSynthesisUtterance(object_name +  "Found");
                synth.speak(utterThis);        
            } else{
                document.getElementById("object_status").innerHTML= object_name + " not Found";
            }
        }
    }
}