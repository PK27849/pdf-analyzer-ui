function showFileName(input) {
    if (input.files && input.files[0]) {
      var fileName = input.files[0].name;
      document.getElementById('file-label').innerHTML = fileName;
    }
  }

  async function run(event) {
    event.preventDefault();
  
    var fileInput = document.getElementById('file');
    var file = fileInput.files[0];
  
    var openAIInput = document.getElementById('OpenAI');
    var openAIKey = openAIInput.value;
  
    var questionInput = document.getElementById('question');
    var question = questionInput.value;
  
    var spinnerContainer = document.getElementById('spinner');
    var responseText = document.getElementById('response-text');
    responseText.value = '';
  
    // Validate required fields
    if (!file || !openAIKey || !question) {
      // responseText.value = 'Please fill in all the required fields.';
      showAlert();
      return;
    }
  
    var apiUrl = 'http://127.0.0.1:8000/search';
    var formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', openAIKey);
    formData.append('text', question);
  
    spinnerContainer.style.display = 'flex'; // Show the spinner before making the API request
    document.body.classList.remove('blur'); // Remove blur from the background
    try {
      // document.body.classList.add('blur'); // Apply blur to the background
  
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Error occurred while fetching the response.');
      }
  
      const data = await response.json();
      responseText.value = data.response;
    } catch (error) {
      console.error('Error:', error);
      responseText.value = 'Error occurred while fetching the response.';
    } finally {
      spinnerContainer.style.display = 'none'; // Hide the spinner after receiving the response or error
      document.body.classList.remove('blur'); // Remove blur from the background
    }
  }

  function showAlert() {
    swal("Error!", "Please fill all the details", "error");
  }

  

function clearResponse(){
  // clear the response text
  var responseText = document.getElementById('response-text');
  responseText.value = '';
}

function copyResponse() {
  var responseTextArea = document.getElementById('response-text');
  var textToCopy = responseTextArea.value;

  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      console.log('Text copied to clipboard:', textToCopy);

      // Optionally provide feedback to the user
      var copyButton = document.getElementById('copy-button');
      copyButton.textContent = 'Copied!';
      setTimeout(function() {
        copyButton.textContent = 'Copy Response';
      }, 2000); // Reset the button text after 2 seconds
    })
    .catch(err => {
      console.error('Error copying text to clipboard:', err);
    });
}


