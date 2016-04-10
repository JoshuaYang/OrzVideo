var btn_play = document.getElementById('btn-play');
var btn_pause = document.getElementById('btn-pause');

var orzVideo = new OrzVideo({
    container: document.getElementById('orz-video'),
    video: 'media/video.mp4',
    firstFrame: 'media/video_firstframe.jpg',
    endFrame: 'media/video_endframe.jpg',
    resetWhenEnd: true,
});


btn_play.addEventListener('click', function(){
    orzVideo.play();
}, false);

btn_pause.addEventListener('click', function(){
    orzVideo.pause();
}, false);
