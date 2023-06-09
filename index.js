// Access the DOM elements
const recordButton = document.getElementById('record');
const stopButton = document.getElementById('stop');
// const playButton = document.getElementById('play');
const audioElement = document.getElementById('audio');
const chatElement = document.getElementById('chats');

let mediaRecorder;
let recordedChunks = [];


function timeNow() {
  return new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// Callback function when the user clicks the record button
function startRecording() {
  recordedChunks = [];
  const constraints = { audio: true };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.addEventListener('dataavailable', handleDataAvailable);
      mediaRecorder.start();
    })
    .catch(error => {
      console.error('Error accessing microphone:', error);
    });

  recordButton.disabled = true;
  stopButton.disabled = false;
}

// Callback function when the user clicks the stop button
function stopRecording() {
  mediaRecorder.stop();
  recordButton.disabled = false;
  stopButton.disabled = true;
  setTimeout(()=>{
    playRecording()
  },1500)
}

// Callback function when data is available after recording
function handleDataAvailable(event) {
  recordedChunks.push(event.data);
}

// Callback function when the user clicks the play button
async function playRecording() {
  try{
    const blob = new Blob(recordedChunks, { type: 'audio/webm' });
    let new_message = document.createElement('div');
    new_message.className = "container darker";
    new_message.innerHTML = `<img src="bandmember.jpg" alt="Avatar" class="right" style="width:100%;">
    <audio id="audio" src = "${blob}" controls></audio>
    <span class="time-left">${timeNow()}</span>`;
    chatElement.appendChild(new_message);
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');
  
    let response = await fetch('https://demo.slotsdiamond.com/api/v1/message', {
    // let response = await fetch('http://localhost:5000/api/v1/message', {
      method: 'POST',
      body: formData,
    });
  
    let data = await response.json();
    console.log('Audio uploaded successfully ==> ',data);
    let new_reply = document.createElement('div');
    new_reply.className = "container";
    new_reply.innerHTML = ` <img src="avatar_g2.jpg" alt="Avatar" style="width:100%;">
    <audio id="audio" src = "${data.data.url}" controls autoplay></audio>
    <span class="time-right">${timeNow()}</span>`;
    chatElement.appendChild(new_reply);
    // audioElement.src = data.data.url;
    // audioElement.play();
  }catch(e){
    console.log(e)
  }
}

// Event listeners for buttons
recordButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);
// playButton.addEventListener('click', playRecording);
