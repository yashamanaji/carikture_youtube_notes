$.ajax({
    type:'GET',
    url:"http://app.bhaktividhan.com/internship/postgetserver/chrome_extension/data.json",
    dataType:'json',
    success: function(data){
        var notes_array = [];
        $.each(data.youtubenotes.dQw4w9WgXcQ.allNotes, function(index, item){
            $.each(item, function(key, value){
                console.log(key + ': ' + value + '\n');
                
            });
            console.log('\n');
        });
    }
});

//Create and return note making tab elements
function createMakeNoteTabButton() {
    const noteTabButton = document.createElement("button");
    noteTabButton.innerHTML = "Make Note";
    noteTabButton.className = "tablinks";
    noteTabButton.addEventListener("click", (event) => openTab(event, "make-note"));
    return noteTabButton;
}
function createMakeNoteTabContent() {
    const noteTabDiv = document.createElement("div");
    noteTabDiv.id = "make-note";
    noteTabDiv.className = "tabcontent";
    const makeNoteHeading = document.createElement("h3");
    makeNoteHeading.innerHTML = "Make Notes";
    noteTabDiv.appendChild(makeNoteHeading);
    return noteTabDiv;
}

function createNoteForm(){
    //Note form elements
    let formDiv = document.createElement('div');
    formDiv.setAttribute("id", "form-div");
    let noteInputField = document.createElement('textarea');
    noteInputField.setAttribute("placeholder", "Take a note");
    noteInputField.style.cssText = `height: 16px; overflow-y: hidden`;
    noteInputField.addEventListener('input', textAreaAdjust, false); //Auto resize on input
    noteInputField.name = "inputfield";
    noteInputField.rows = "1";
    noteInputField.maxLength = "16000";
    noteInputField.id = "note-text-input";

    let privateCheckboxLabel = document.createElement('label');
    privateCheckboxLabel.for = "private-checkbox";
    privateCheckboxLabel.innerHTML = "Make this note private";

    let privateCheckbox = document.createElement('input');
    privateCheckbox.type = "checkbox";
    privateCheckbox.id = "private-checkbox";

    let noteSubmitButton = document.createElement('button');
    noteSubmitButton.name = "save-button";
    noteSubmitButton.innerHTML = "Save";
    noteSubmitButton.addEventListener("click", () => saveNoteObject(privateCheckbox, noteInputField));

    formDiv.appendChild(noteInputField);
    formDiv.appendChild(privateCheckboxLabel);
    formDiv.appendChild(privateCheckbox);
    formDiv.appendChild(noteSubmitButton);
    return formDiv;
}
//for auto-resizing text area
function textAreaAdjust(){
    this.style.height = "auto";
    this.style.height = (this.scrollHeight) + "px";
}

function getNotesForVideo(url){
    //get notes from server for url
}

function saveNoteObject(privateCheckbox, noteInputField) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: "createnote"}, (response) => {
            let noteObject = new Object();
            noteObject.noteText = noteInputField.value;
            noteInputField.value = "";
            noteObject.url = pageURL;
            noteObject.timeStamp = response.timeStamp;
            noteObject.videoTitle = response.videoTitle;
            noteObject.uploader = response.uploader;
            noteObject.universalTime = new Date().getTime();
            noteObject.uploadedToServer = false;
            noteObject.reporters = [];
            noteObject.likers = [];
            noteObject.private = privateCheckbox.checked;
            privateCheckbox.checked = false;
            saveToLocalStorage(noteObject);
            
            // Posting data to server 

           /* let vars = "title="+noteObject.videoTitle+"&url="+pageURL+"&creator="+noteObject.uploader+"&timestamp="+noteObject.timeStamp+"&inputText="+noteObject.noteText;
            console.log(vars);
            let xhr = new XMLHttpRequest();
            xhr.open("POST", 'http://app.bhaktividhan.com/internship/postgetserver/chrome_extension/insert.php', true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200) {
                console.log('Inserted'); // Request finished. Do processing here.
                }
            }
            xhr.send(vars);  */

            var formData = {
                'title' : noteObject.videoTitle,
                'url' : noteObject.videoURL,
                'creator' : noteObject.uploader,
                'timestamp' : noteObject.timeStamp,
                'inputText' : noteObject.text //for get email 
            };

            $.ajax({
                url: "http://app.bhaktividhan.com/internship/postgetserver/chrome_extension/insert.php",
                method: "POST",
                data: formData,
                success: function () {
                    console.log("Success");
                }
            });
        });
    });
}

function postNotesToServer(noteArray) {

}
function saveToLocalStorage(noteObject) {
    savedNotes.push(noteObject);
    localStorage.setItem("notes", JSON.stringify(savedNotes));
}


function hideTabContent() {
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }
}
function openTab(event, tabName) {
    hideTabContent();
    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";
}

function createMakeNoteTab() {
    tabButtonDiv.appendChild(createMakeNoteTabButton());
    const makeNoteTabContent = createMakeNoteTabContent();
    makeNoteTabContent.appendChild(createNoteForm());
    tabContentDiv.appendChild(makeNoteTabContent);
}
function populateViewNotesTab() {
    viewNotesMadeDiv.innerHTML = "";
    savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    savedNotes.forEach(addNoteDivToViewNotes);
}

function addNoteDivToViewNotes(noteObject) {
    const noteDiv = document.createElement("div");
    noteDiv.className = "view-note-div";
    const noteText = document.createElement("p");
    noteText.innerHTML = noteObject.noteText;
    const noteURL = document.createElement("a");
    noteURL.innerHTML = noteObject.videoTitle;
    noteURL.href = noteObject.videoURL;
    noteURL.target="_blank";
    noteURL.rel="noopener noreferrer";
    const noteUploader = document.createElement("p");
    noteUploader.innerHTML = noteObject.uploader;
    const noteTimeStamp = document.createElement("p");
    noteTimeStamp.innerHTML = noteObject.timeStamp;
    noteDiv.appendChild(noteURL);
    noteDiv.appendChild(noteUploader);
    noteDiv.appendChild(noteTimeStamp);
    noteDiv.appendChild(noteText);
    viewNotesMadeDiv.appendChild(noteDiv);
}
//Variable declarations
let pageURL;
let notesForVideo = getNotesForVideo();
let savedNotes = JSON.parse(localStorage.getItem("notes")) || [];

//Query selectors
const tabContent = document.getElementsByClassName("tabcontent");
const tabLinks = document.getElementsByClassName("tablinks");
const tabButtonDiv = document.querySelector("#tabs");
const tabContentDiv = document.querySelector("#tabcontentarea");
const loginTabButton = document.querySelector("#login-tab-btn");
const viewnotesTabButton = document.querySelector("#viewnotes-tab-btn");
const viewNotesMadeDiv = document.getElementById("notes-made");


//Add event listeners
loginTabButton.addEventListener("click", (event) => openTab(event, "login"));
viewnotesTabButton.addEventListener("click", (event) => openTab(event, "view-notes"));
viewnotesTabButton.addEventListener("click", () => populateViewNotesTab());

//Run on page load
window.onload = (function() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        pageURL = tabs[0].url
        if (pageURL.indexOf("https://www.youtube.com/watch?") != -1) {
                createMakeNoteTab();
        }
    });
});
hideTabContent();
loginTabButton.click();