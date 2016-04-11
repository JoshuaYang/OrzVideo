var btn_play = document.getElementById('btn-play');
var btn_pause = document.getElementById('btn-pause');
var btn_stop = document.getElementById('btn-stop');

var orzVideo = new OrzVideo({
    container: document.getElementById('orz-video'),
    video: 'media/video.mp4',
    firstFrame: 'media/video_firstframe.jpg',
    endFrame: 'media/video_endframe.jpg',
    resetWhenEnd: true,
    onplay: function(){
        console.log('==========play');
    },
    onpause: function(){
        console.log('==========pause');
    },
    onend: function(){
        console.log('==========end');
    }
});


btn_play.addEventListener('click', function(){
    orzVideo.play();
}, false);

btn_pause.addEventListener('click', function(){
    orzVideo.pause();
}, false);

btn_stop.addEventListener('click', function(){
    orzVideo.stop();
}, false);
