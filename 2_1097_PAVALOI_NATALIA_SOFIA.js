        "use strict";

        const video_player= document.getElementById('video_player');
        const lista_video= document.getElementById('lista');
        const video = Array.from(lista_video.querySelectorAll('li'));
        const inapoibtn=document.getElementById("inapoibtn");
        const redabtn= document.getElementById("redabtn");
        const inaintebtn= document.getElementById("inaintebtn");
        const progressBar= document.getElementById("progressBar");
        const volumeBar= document.getElementById("volumeBar");
        const sub_container= document.getElementById('subtitrari');


        let i=0;
        
        video_player.src = video[i].dataset.src;
        video[i].classList.add('active');
        video_player.play();


        function loadVideo(vid){
            video.forEach(video => video.classList.remove('active'));
            vid.classList.add('active');
            video_player.src= vid.dataset.src;
            video_player.play();
          
            loadSubs(vid.dataset.src);
          
            i= video.indexOf(vid);
          }
          

        video.forEach(video => {
            video.addEventListener('click',() => loadVideo(video));
        });
 

        redabtn.addEventListener("click",() => {
    if (video_player.paused) {
        video_player.play();
    } else {
        video_player.pause();
    }
});

video_player.addEventListener("play",() => {
    redabtn.textContent= "Stop";
  });
  
  video_player.addEventListener("pause",() => {
    redabtn.textContent = "Reda";
  });


  inapoibtn.addEventListener("click", () => { 
    if(i<=0){i=video.length}
    else {i--}
    loadVideo(video[i]);
    redabtn.textContent= "Pause"
});

inaintebtn.addEventListener("click",() => { 
    if(i >= video.length){
        i = 0;
    }
    else{
        i++;
    }
    loadVideo(video[i]);
    redabtn.textContent = "Pause"
});

video_player.addEventListener("timeupdate",() => {
    progressBar.value= (video_player.currentTime/video_player.duration)*100 || 0;
});

progressBar.addEventListener("input",() => {
    video_player.currentTime= (progressBar.value/100)*video_player.duration;
});

volumeBar.addEventListener("input",() => {
    video_player.volume = volumeBar.value;
});

video_player.addEventListener("volumechange",() => {
    volumeBar.value = video_player.volume;
  });

  video_player.addEventListener("ended", () =>{
    inaintebtn.click(); 
});

function actIndex(){
    video.forEach((video, i) => {
        video.dataset.i = i;
    });
}

actIndex();

lista_video.addEventListener('click', (event) => {
    const clickedButton = event.target;

    if (clickedButton.classList.contains('susbtn') || 
        clickedButton.classList.contains('josbtn') || 
        clickedButton.classList.contains('stergebtn')) {
        
        const vid = clickedButton.closest('li');
        const j = parseInt(vid.dataset.i, 10);

        if (clickedButton.classList.contains('susbtn')  && j>0){
            lista_video.insertBefore(vid, video[j-1]); //din DOM
            [video[j-1], video[j]]= [video[j], video[j-1]]; //din js
        } else if (clickedButton.classList.contains('josbtn') && j< video.length-1){
            lista_video.insertBefore(video[j+1], vid);
            [video[j], video[j+1]]= [video[j+1], video[j]];
        } else if (clickedButton.classList.contains('stergebtn')){
            vid.remove(); //din DOM
            video.splice(j, 1); //din arrayul video

            if (video.length === 0){
                video_player.pause();
                video_player.src = ""; //sterge
            } else {
                if (j<= 0){
                    i= 0; 
                } else {
                    i=j-1; 
                }
                loadVideo(video[i]); //merge videoul de dinainte sau primul
        }

        actIndex();
    }}
});


let subs = [];
let currentSubs = [];

fetch("2_1097_PAVALOI_NATALIA_SOFIA.json")
  .then((response)=> {
    if (!response.ok) {
      throw new Error("Eroare la încarcarea subtitrari.json");
    }
    return response.json();
  })
  .then((data)=> {
    subs= data;
    loadSubs(video_player.src); 
  })
  .catch((error) => console.error("Eroare la subtitrari:", error));

function loadSubs(videoSrc){
    const videoKey = videoSrc.split("/").pop(); //ia video_1 singur
    currentSubs = subs[videoKey] || []; 
    sub_container.textContent= "";
  }

  video_player.addEventListener("timeupdate", ()=> {
    const currentTime=video_player.currentTime;
    const currentSubtitle= currentSubs.find(
      (sub) => currentTime >= sub.start && currentTime <= sub.end //verfifica sub si timpul
    );
  
    if (currentSubtitle) {
        sub_container.textContent= currentSubtitle.text;
    } else {
        sub_container.textContent= "";
    }
  });
  
  video_player.addEventListener("loadedmetadata",()=> {
  loadSubs(video_player.src);
});

lista_video.addEventListener("click", (e)=> {
  const videoElement= e.target.closest("li");
  if (videoElement){
    const videoSrc= videoElement.dataset.src;
    video_player.src= videoSrc;
    video_player.play();
  }
});