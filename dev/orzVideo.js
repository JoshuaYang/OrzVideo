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

    var useFixedVideo = isMobile;// && isiPhone;//'ontouchstart' in window;

    var defaultOptions = {
        resetWhenEnd: false,
        muted: false,
        onplay: function(){},
        onpause: function(){},
        onend: function(){},
        onclick: function(){}
    };


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
        this.loading = this.container.querySelector('.loading');
        this.video = document.createElement('video');
        this.firstFrame = new Image();
        this.endFrame = new Image();

        this.video.src = opts.video;
        this.video.muted = opts.muted;
        this.video.preload = '';

        this.firstFrame.src = opts.firstFrame;
        this.endFrame.src = opts.endFrame;
        this.resetWhenEnd = opts.resetWhenEnd;

        this.playHandler = opts.onplay;
        this.pauseHandler = opts.onpause;
        this.endHandler = opts.onend;
        this.clickHandler = opts.onclick;

        normalVideo_initStruct.call(this);
        normalVideo_initEvent.call(this);

        Object.defineProperties(this, {
            paused: {
                get: function(){
                    return this.video.paused;
                }
            },
            muted: {
                get: function(){
                    return this.video.muted;
                },
                set: function(val){
                    this.video.muted = val;
                }
            },
            currentTime: {
                get: function(){
                    return this.video.currentTime;
                },
                // set: function(val){
                //     this.video.currentTime = val;
                // }
            }
        });
    };

    NormalVideo.prototype.play = function(){
        if(!this.paused) return;

        this.video.play();
    };

    NormalVideo.prototype.pause = function(){
        if(this.paused) return;

        this.video.pause();
    };

    NormalVideo.prototype.stop = function(){
        this.video.pause();
        this.video.currentTime = 0;
        this.firstFrame.style.display = 'block';
        this.video.style.visibility = 'hidden';
    };

    function normalVideo_initStruct(){
        this.container.appendChild(this.video);
        this.container.appendChild(this.firstFrame);
        this.container.appendChild(this.endFrame);

        var container_position = getComputedStyle(this.container).position;

        this.loading.style.display = 'none';

        if(!container_position.match(/relative|absolute|fixed/i)){
            this.container.style.position = 'relative';
        }

        this.video.style.position = 'relative';
        this.video.style.zIndex = 2;
        this.video.style.visibility = 'hidden';
        this.video.classList.add('content');

        this.firstFrame.style.position = 'absolute';
        this.firstFrame.style.top = 0;
        this.firstFrame.style.left = 0;
        this.firstFrame.style.zIndex = 3;
        this.firstFrame.style.display = 'block';

        this.endFrame.style.position = 'absolute';
        this.endFrame.style.top = 0;
        this.endFrame.style.left = 0;
        this.endFrame.style.zIndex = 3;
        this.endFrame.style.display = 'none';
    }

    function normalVideo_initEvent(){
        var self = this;

        self.video.addEventListener('play', function(){
            self.firstFrame.style.display = 'none';
            self.endFrame.style.display = 'none';
            self.video.style.visibility = 'visible';

            self.flag_loading = setInterval(function(){
                if(self.prevTime == self.video.currentTime){
                    // loading
                    self.loading.style.display = 'block';
                }else{
                    // no loading
                    self.loading.style.display = 'none';

                    self.prevTime = self.video.currentTime;
                }
            }, 150);

            self.playHandler.call();
        }, false);

        self.video.addEventListener('pause', function(){
            normalVideo_stopLoading.call(self);
            self.pauseHandler.call();
        }, false);

        self.video.addEventListener('ended', function(){
            normalVideo_stopLoading.call(self);

            if(self.resetWhenEnd){
                self.firstFrame.style.display = 'block';
                self.video.style.visibility = 'hidden';
                self.video.currentTime = 0;
            }else{
                self.endFrame.style.display = 'block';
                self.video.style.visibility = 'hidden';
            }

            self.endHandler.call();
        }, false);

        self.video.addEventListener('click', function(){
            self.clickHandler.call();
        });
    }

    function normalVideo_stopLoading(){
        clearInterval(this.flag_loading);
        this.loading.style.display = 'none';
    }


    /* ============================================================ */
    var FixedVideo = function(opts){
        var self = this;

        this.container = opts.container;
        this.loading = this.container.querySelector('.loading');
        this.canvas = document.createElement('canvas');
        this.audio = new Audio();
        this.firstFrame = new Image();
        this.endFrame = new Image();
        this.loaded = false;
        this.autoplay = false;

        this.video = new jsmpeg(opts.mpg, {
            canvas: this.canvas,
            seekable: true,
            preload: true,
            forceCanvas2D: true,
            onload: function(){
                self.loaded = true;

                if(self.autoplay){
                    self.loading.style.display = 'none';
                    self.play();
                }
            },
            onfinished: function(){
                fixedVideo_endHandler.call(self);
            }
        });
        // this.audio.setAttribute('preload', '');

        this.hasAudio = opts.audio !== undefined;

        if(this.hasAudio){
            this.audio.src = opts.audio;
            this.audio.play();
            this.audio.pause();
        }


        this.ispaused = true;
        this.ismuted = opts.muted;

        this.firstFrame.src = opts.firstFrame;
        this.endFrame.src = opts.endFrame;
        this.resetWhenEnd = opts.resetWhenEnd;

        this.playHandler = opts.onplay;
        this.pauseHandler = opts.onpause;
        this.endHandler = opts.onend;
        this.clickHandler = opts.onclick;

        fixedVideo_initStruct.call(self);
        fixedVideo_initEvent.call(self);


        Object.defineProperties(this, {
            paused: {
                get: function(){
                    return this.ispaused;
                },
                set: function(val){
                    this.ispaused = val;
                }
            },
            currentTime: {
                get: function(){
                    return this.video.currentTime;
                }
            },
            muted: {
                get: function(){
                    return this.ismuted;
                },
                set: function(val){
                    if(val == this.ismuted) return;

                    this.ismuted = val;

                    if(this.hasAudio){
                        if(this.ismuted){
                            this.audio.pause();
                        }else{
                            this.audio.currentTime = this.currentTime;

                            if(!this.ispaused) this.audio.play();
                        }
                    }

                }
            }
        });
    };

    FixedVideo.prototype.play = function(){
        var self = this;

        if(!self.loaded){
            self.autoplay = true;

            // if(self.hasAudio){
                self.loading.style.display = 'block';
            // }

            return;
        }

        if(!self.paused) return;
        self.paused = false;

        self.video.play();

        if(self.hasAudio){
            if(self.ismuted){
                self.audio.pause();
            }else{
                self.audio.play();
            }
        }


        self.firstFrame.style.display = 'none';
        self.endFrame.style.display = 'none';
        self.canvas.style.visibility = 'visible';

        self.flag_loading = setInterval(function(){
            if(self.muted) return;
            if(!self.hasAudio) return;

            if(self.prevTime == self.currentTime){
                // loading
                self.loading.style.display = 'block';
                self.video.pause();
            }else{
                // no loading
                self.loading.style.display = 'none';

                self.prevTime = self.currentTime;
                self.video.play();
            }
        }, 150);

        self.playHandler.call();
    };

    FixedVideo.prototype.pause = function(){
        var self = this;

        if(!self.loaded){
            self.autoplay = false;
            self.loading.style.display = 'none';
            return;
        }

        if(self.paused) return;
        self.paused = true;

        self.video.pause();

        if(self.hasAudio){
            self.audio.pause();
        }


        fixedVideo_stopLoading.call(self);
        self.pauseHandler.call();
    };

    FixedVideo.prototype.stop = function(){
        var self = this;

        if(!self.loaded){
            self.autoplay = false;
            return;
        }

        self.paused = true;

        fixedVideo_stopLoading.call(self);

        self.video.stop();
        self.video.play();
        self.video.pause();

        if(self.hasAudio){
            self.audio.pause();
            self.audio.currentTime = 0;
        }


        self.firstFrame.style.display = 'block';
        self.canvas.style.visibility = 'hidden';
    };

    function fixedVideo_initStruct(){
        this.container.appendChild(this.canvas);
        this.container.appendChild(this.firstFrame);
        this.container.appendChild(this.endFrame);

        var container_position = getComputedStyle(this.container).position;

        this.loading.style.display = 'none';

        if(!container_position.match(/relative|absolute|fixed/i)){
            this.container.style.position = 'relative';
        }

        this.canvas.style.position = 'relative';
        this.canvas.style.zIndex = 2;
        this.canvas.style.display = 'block';
        this.canvas.classList.add('content');

        this.firstFrame.style.position = 'absolute';
        this.firstFrame.style.top = 0;
        this.firstFrame.style.left = 0;
        this.firstFrame.style.zIndex = 3;
        this.firstFrame.style.display = 'block';

        this.endFrame.style.position = 'absolute';
        this.endFrame.style.top = 0;
        this.endFrame.style.left = 0;
        this.endFrame.style.zIndex = 3;
        this.endFrame.style.display = 'none';
    }

    function fixedVideo_initEvent(){
        var self = this;

        self.canvas.addEventListener('click', function(){
            self.clickHandler.call();
        });
    }

    function fixedVideo_endHandler(){
        var self = this;

        self.paused = true;

        fixedVideo_stopLoading.call(self);

        self.video.stop();
        self.video.play();
        self.video.pause();

        if(self.hasAudio){
            self.audio.pause();
            self.audio.currentTime = 0;
        }


        if(self.resetWhenEnd){
            self.firstFrame.style.display = 'block';
            self.canvas.style.visibility = 'hidden';
        }else{
            self.endFrame.style.display = 'block';
            self.canvas.style.visibility = 'hidden';
        }

        self.endHandler.call();
    }

    function fixedVideo_stopLoading(){
        clearInterval(this.flag_loading);
        this.loading.style.display = 'none';
    }






    window.OrzVideo = OrzVideo;

    return OrzVideo;
}));
