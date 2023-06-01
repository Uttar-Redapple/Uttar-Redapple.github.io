let trim = (x) => {
    let value = String(x)
    return value.replace(/^\s+|\s+$/gm, '')
  }
let isEmpty = (value) => {
    if (value === null || value === undefined || trim(value) === '' || value.length === 0) {
      return true
    } else {
      return false
    }
  }
// Function to send a message to the ChatGPT API
async function sendMessage(message) {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo', // Update with the desired model
        messages: [{ role: 'system', content: 'You are a chatbot' }, { role: 'user', content: message }],
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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', // Replace with your actual API key
        },
      });
  
      const { choices } = response.data;
      const reply = choices[0].message.content;
      return reply;
    } catch (error) {
      console.error('Failed to send message to the ChatGPT API:', error);
      return null;
    }
  };
  // Function to convert text to speech
async function textToSpeech(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  }
if ("webkitSpeechRecognition" in window) {
    // Initialize webkitSpeechRecognition
    let speechRecognition = new webkitSpeechRecognition();

    // String for the Final Transcript
    let final_transcript = "";

    // Set the properties for the Speech Recognition object
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = document.querySelector("#select_dialect").value;

    // Callback Function for the onStart Event
    speechRecognition.onstart = () => {
        // Show the Status Element
        document.querySelector("#status").style.display = "block";
    };
    speechRecognition.onerror = () => {
        // Hide the Status Element
        document.querySelector("#status").style.display = "none";
    };
    speechRecognition.onend = () => {
        // Hide the Status Element
        document.querySelector("#status").style.display = "none";
    };

    speechRecognition.onresult = (event) => {
        // Create the interim transcript string locally because we don't want it to persist like final transcript
        let interim_transcript = "";

        // Loop through the results from the speech recognition object.
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }

        // Set the Final transcript and Interim transcript.
        document.getElementById('final').innerHTML = '';
        document.querySelector("#final").innerHTML = final_transcript;
        document.querySelector("#interim").innerHTML = interim_transcript;
    };

    // Set the onClick property of the start button
    document.querySelector("#start").onclick = () => {
        // Start the Speech Recognition
        document.querySelector("#final_bot").innerHTML = "";
        speechRecognition.start();
    };
    // Set the onClick property of the stop button
    document.querySelector("#stop").onclick = async () => {
        // Stop the Speech Recognition
        speechRecognition.stop();
        let user_speech=document.getElementById('final').innerHTML;
        document.getElementById('final').innerHTML = '';
        console.log('final_transcript',user_speech);
        if(!isEmpty(user_speech)){
        // Call ChatGPT API
        const reply = await sendMessage(user_speech);
        console.log('Chatbot:', reply);
         // Set the Final transcript and Interim transcript.
        document.querySelector("#final_bot").innerHTML = reply; 
        await textToSpeech(reply);  
        }else{
            await textToSpeech('wait'); 
        }
    };
} else {
    console.log("Speech Recognition Not Available");
}