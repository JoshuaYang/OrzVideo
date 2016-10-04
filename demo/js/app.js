var btn_load = document.getElementById('btn-load');

var btn_play = document.getElementById('btn-play');
var btn_pause = document.getElementById('btn-pause');
var btn_stop = document.getElementById('btn-stop');
var btn_get_paused = document.getElementById('btn-get-paused');

var btn_mute = document.getElementById('btn-mute');
var btn_unmute = document.getElementById('btn-unmute');
var btn_get_muted = document.getElementById('btn-get-muted');

var btn_get_current_time = document.getElementById('btn-get-current-time');


var orzVideo;

btn_load.addEventListener('click', function(){
    if(orzVideo !== undefined) return;

    orzVideo = new OrzVideo({
        container: document.getElementById('orz-video1'),
        video: 'media/video.mp4',
        mpg: 'media/video.mpg',
        // audio: 'media/video.aac',
        firstFrame: 'media/video_firstframe.jpg',
        endFrame: 'media/video_endframe.jpg',
        resetWhenEnd: true,
        muted: false,
        onplay: function(){
            console.log('==========play');
        },
        onpause: function(){
            console.log('==========pause');
        },
        onend: function(){
            console.log('==========end');
        },
        onclick: function(){
            console.log('==========click');
        }
    });
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

btn_get_paused.addEventListener('click', function(){
    alert(orzVideo.paused);
}, false);

btn_mute.addEventListener('click', function(){
    orzVideo.muted = true;
}, false);

btn_unmute.addEventListener('click', function(){
    orzVideo.muted = false;
}, false);

btn_get_muted.addEventListener('click', function(){
    alert(orzVideo.muted);
}, false);

btn_get_current_time.addEventListener('click', function(){
    alert(orzVideo.currentTime);
}, false);
