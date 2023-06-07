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
    showAlert();
    return;
  }

  var apiUrl = 'https://prasank02-pdf-search-api.hf.space/search';
  var formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', openAIKey);
  formData.append('text', question);

  spinnerContainer.style.display = 'flex'; // Show the spinner before making the API request
  document.body.classList.remove('blur'); // Remove blur from the background

  try {
    const response = await fetchWithTimeout(apiUrl, {
      method: 'POST',
      body: formData
    }, 300000); // Set the timeout duration to 5 minutes (120000 milliseconds)

    // if (!response.ok) {
    //   throw new Error(responseText);
    // }
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
      // throw new Error('Response error: ' + response.status + ' ' + response.statusText);
    }

    const data = await response.json();
    responseText.value = data.response;
  } catch (error) {
    // console.error('Error:', error);
    // responseText.value = 'Timeout occured while fetching the response';
    // responseText.value = 'An error occurred: ' + error;
    console.error('Error:', error);
    const errorString = error.message;
    const errorObject = JSON.parse(errorString);
    console.log(errorObject.detail); // Output: This model's maximum context length is 4097 tokens, however you requested 1204850 tokens (1204594 in your prompt; 256 for the completion). Please reduce your prompt; or completion length.
    responseText.value = 'An error occurred: ' + errorObject.detail;
  } finally {
    spinnerContainer.style.display = 'none'; // Hide the spinner after receiving the response or error
    document.body.classList.remove('blur'); // Remove blur from the background
  }
}

function fetchWithTimeout(url, options, timeout) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeout)
    )
  ]);
}

function showAlert() {
  swal("Error!", "Please fill in all the details", "error");
}

function clearResponse() {
  // Clear the response text
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
      setTimeout(function () {
        copyButton.textContent = 'Copy Response';
      }, 2000); // Reset the button text after 2 seconds
    })
    .catch(err => {
      console.error('Error copying text to clipboard:', err);
    });
}

function togglePasswordVisibility() {
  var passwordInput = document.getElementById('OpenAI');
  var toggleIcon = document.querySelector('.toggle-password');

  if (passwordInput.getAttribute('type') === 'password') {
    var textInput = document.createElement('input');
    textInput.setAttribute('type', 'text');
    textInput.setAttribute('class', 'form-control');
    textInput.setAttribute('id', 'OpenAI');
    textInput.setAttribute('placeholder', 'Enter API Key');
    textInput.value = passwordInput.value;

    passwordInput.parentNode.replaceChild(textInput, passwordInput);
    toggleIcon.classList.add('visible');
  } else {
    var passwordInput = document.createElement('input');
    passwordInput.setAttribute('type', 'password');
    passwordInput.setAttribute('class', 'form-control');
    passwordInput.setAttribute('id', 'OpenAI');
    passwordInput.setAttribute('placeholder', 'Enter API Key');
    passwordInput.value = textInput.value;

    textInput.parentNode.replaceChild(passwordInput, textInput);
    toggleIcon.classList.remove('visible');
  }
}

$(document).ready(function() {
  // Automatically resize textarea to fit content
  function autoResizeTextarea() {
    $(this).css('height', 'auto').height(this.scrollHeight);
  }

  // Listen for input event and trigger autoResizeTextarea()
  $('#response-text').on('input', autoResizeTextarea);
});
