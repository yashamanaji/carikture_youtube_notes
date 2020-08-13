const pageURL = window.location.href;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.type == "createnote") {
            let videoData = getVideoData();
            sendResponse(videoData);        }
        return true;
    }
);

function getVideoData() {
    const video = document.querySelector('video');
    video.pause();
    let timeStamp = prettyTime(video.currentTime);
    let videoTitle = document.querySelector('h1.title').firstChild.innerHTML;
    let uploader = document.querySelector('yt-formatted-string.ytd-channel-name').firstChild.innerHTML;
    let noteObject = new Object();
    noteObject.timeStamp = timeStamp;
    noteObject.videoTitle = videoTitle;
    noteObject.uploader = uploader;
    return noteObject;
}

function prettyTime(time){
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor(time % 3600 / 60);
    let seconds = Math.floor(time % 3600 % 60);

    let hDisplay = (hours > 0) ? `${hours}:` : "";
    let mDisplay = (minutes >= 0) ? `${minutes}:` : "";
    let sDisplay = (seconds >= 0) ? toTwoDigits(seconds) : ""
    return hDisplay + mDisplay + sDisplay;
}
function toTwoDigits(number){
    let formattedNumber = ("0" + number).slice(-2);
    return formattedNumber;
}