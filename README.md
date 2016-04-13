# OrzVideo
A plugin that can play video inline cross all browsers, **include iphone safari**. This will generator a native html5 video tag in most browsers, and will draw .mpg video on a canvas in iphone safari with a corresponding audio.

> this plugin depends on jsmpeg

## API

### layout

> a loading layout with class '.loading' is necessary when the network is bad.

```html
<div id="orz-video">
  <div class="loading"></div>
</div>
```

### Constructor

```javascript
var orzVideo = new OrzVideo({...options});
```

### options

| name         | type     | default   | descripton                               |
| ------------ | -------- | --------- | ---------------------------------------- |
| container    | dom      | necessary | the initial container of the video plugin |
| video        | string   | necessary | file path, the video source, recommend .mp4 |
| mpg          | string   | necessary | file path, the mpg source that used on iPhone |
| audio        | string   | necessary | file path, the sound source that used on iPhone |
| firstFrame   | string   | necessary | file path, the first frame of video, use as poster |
| endFrame     | string   | necessary | file path, the last frame of video       |
| resetWhenEnd | boolean  | false     | whether reset play position to the beginning when play end, |
| muted        | boolean  | false     | whether to be muted when initialised     |
| onplay       | function | null      | called when play                         |
| onpause      | function | null      | called when pause                        |
| onend        | function | null      | called when reach the end                |

### property

| name        | type    | descriptons                              |
| ----------- | ------- | ---------------------------------------- |
| currentTime | number  | get the current playback time in seconds（tip：there's issue of setter function in jsmpeg, so it's forbidden now） |
| paused      | boolean | get whether the video is paused          |
| muted       | boolean | set / get whether the video is muted     |

### method

| name  | descripton                               |
| ----- | ---------------------------------------- |
| play  | begin playback                           |
| pause | pause playback                           |
| stop  | stop playback and revert play position to the beginning |