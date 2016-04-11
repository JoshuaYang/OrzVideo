# OrzVideo
why there isn't a plugin that can play html5 inline video on iphone safari?

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
| muted       | boolean | set / get whether the video is muted     |
| currentTime | number  | set / get the current playback time in seconds |
| paused      | boolean | get whether the video is paused          |

### method

| name  | descripton                               |
| ----- | ---------------------------------------- |
| play  | begin playback                           |
| pause | pause playback                           |
| stop  | stop playback and revert play position to the beginning |