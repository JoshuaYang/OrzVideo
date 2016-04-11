(function(factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        console.log('OrzVideo load with commonJS');
        module.exports = factory();
    } else {
        console.log('OrzVideo load with normal');
        factory();
    }
}(function() {
    function merge() {
        var obj = {},
            i = 0,
            il = arguments.length,
            key;

        for (; i < il; ++i) {
            for (key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    obj[key] = arguments[i][key];
                }
            }
        }

        return obj;
    }

    var ua = window.navigator.userAgent.toLowerCase();
    var isMobile = ua.match(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile/i) !== null && ua.match(/Mobile/i) !== null;
    var isiPhone = ua.match(/iphone/i) !== null;
    var isAndroid = ua.match(/android/i) !== null;

    var useFixedVideo = isMobile && isiPhone;

    var defaultOptions = {
        resetWhenEnd: false,
        onplay: function(){},
        onpause: function(){},
        onend: function(){}
    };


    /**
     * necessary options:
     * container
     * video
     * firstFrame
     * endFrame
     * resetWhenEnd
     *
     * onplay
     * onpause
     * onend
     *
     * mpeg
     * audio
     */

    var OrzVideo = function(opts) {
        var options = merge({}, defaultOptions, opts);

        if(!useFixedVideo){
            return new NormalVideo(options);
        }else{
            return new FixedVideo(options);
        }
    };


    /* ============================================================ */
    var NormalVideo = function(opts){
        this.container = opts.container;
        this.video = document.createElement('video');
        this.firstFrame = document.createElement('img');
        this.endFrame = document.createElement('img');

        this.video.src = opts.video;
        this.firstFrame.src = opts.firstFrame;
        this.endFrame.src = opts.endFrame;
        this.resetWhenEnd = opts.resetWhenEnd;

        this.playHandler = opts.onplay;
        this.pauseHandler = opts.onpause;
        this.endHandler = opts.onend;

        normalVideo_initStruct.call(this);
        normalVideo_initEvent.call(this);
    };

    NormalVideo.prototype.play = function(){
        this.firstFrame.style.display = 'none';
        this.endFrame.style.display = 'none';

        this.video.play();
    };

    NormalVideo.prototype.pause = function(){
        this.video.pause();
    };

    NormalVideo.prototype.stop = function(){
        this.video.pause();
        this.video.currentTime = 0;
        this.firstFrame.style.display = 'block';
    };

    function normalVideo_initStruct(){
        this.container.appendChild(this.video);
        this.container.appendChild(this.firstFrame);
        this.container.appendChild(this.endFrame);

        var container_position = getComputedStyle(this.container).position;

        if(!container_position.match(/relative|absolute|fixed/i)){
            this.container.style.position = 'relative';
        }

        this.video.style.position = 'relative';
        this.video.style.zIndex = 1;

        this.firstFrame.style.position = 'absolute';
        this.firstFrame.style.top = 0;
        this.firstFrame.style.left = 0;
        this.firstFrame.style.zIndex = 2;
        this.firstFrame.style.display = 'block';

        this.endFrame.style.position = 'absolute';
        this.endFrame.style.top = 0;
        this.endFrame.style.left = 0;
        this.endFrame.style.zIndex = 2;
        this.endFrame.style.display = 'none';
    }

    function normalVideo_initEvent(){
        var self = this;

        self.video.addEventListener('play', function(){
            self.playHandler.call(this);
        }, false);

        self.video.addEventListener('pause', function(){
            self.pauseHandler.call(this);
        }, false);

        self.video.addEventListener('ended', function(){
            if(self.resetWhenEnd){
                self.firstFrame.style.display = 'block';
                self.video.currentTime = 0;
            }else{
                self.endFrame.style.display = 'block';
            }

            self.endHandler.call(this);
        }, false);
    }





    /* ============================================================ */
    var FixedVideo = function(opts){

    };








    window.OrzVideo = OrzVideo;

    return OrzVideo;
}));
