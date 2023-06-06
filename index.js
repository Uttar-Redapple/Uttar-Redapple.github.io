// Access the DOM elements
const recordButton = document.getElementById('record');
const stopButton = document.getElementById('stop');
// const playButton = document.getElementById('play');
const audioElement = document.getElementById('audio');

let mediaRecorder;
let recordedChunks = [];

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
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');
  
    let response = await fetch('http://staging.redappletech.com:4002/api/v1/message', {
      method: 'POST',
      body: formData,
    });
  
    let data = await response.json();
    console.log('Audio uploaded successfully ==> ',data);
    audioElement.src = data.data.url;
    audioElement.play();
  }catch(e){
    console.log(e)
  }
}

// Event listeners for buttons
recordButton.addEventListener('click', startRecording);
stopButton.addEventListener('click', stopRecording);
// playButton.addEventListener('click', playRecording);
