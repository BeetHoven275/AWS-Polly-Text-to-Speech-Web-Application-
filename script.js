// 🔧 API Lambda Function URL
const API_URL = 'https://i55ytvo2d2ilgizob3mtuo7itm0lschr.lambda-url.us-east-1.on.aws/';

const textArea = document.getElementById('textInput');
const voiceId = document.getElementById('voiceId');
const formatSel = document.getElementById('format');
const convertBtn = document.getElementById('convertBtn');
const statusDiv = document.getElementById('status');
const resultDiv = document.getElementById('result');
const player = document.getElementById('player');
const downloadLink = document.getElementById('downloadLink');
const counter = document.getElementById('counter');

// Character counter
textArea.addEventListener('input', () => {
  counter.textContent = textArea.value.length + ' / ' + textArea.maxLength;
});

async function convertText() {
  const text = textArea.value.trim();
  if (!text) {
    statusDiv.textContent = 'Please enter some text first 🙏';
    return;
  }

  convertBtn.disabled = true;
  statusDiv.textContent = 'Converting...';
  resultDiv.classList.add('hidden');

  try {
    const payload = { text, voiceId: voiceId.value, format: formatSel.value };

    const resp = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    let data = await resp.json();
    // Lambda Function URL returns JSON with a body property
    if (data && typeof data.body === 'string') {
      try { data = JSON.parse(data.body); } catch(e) {}
    }

    const audioBase64 = data.audio;
    if (!audioBase64) throw new Error('Response does not contain audio data');

    // Play the audio in the player
    player.src = "data:audio/mp3;base64," + audioBase64;
    downloadLink.href = player.src;
    resultDiv.classList.remove('hidden');
    statusDiv.textContent = 'Conversion complete ✅';
  } catch (err) {
    console.error(err);
    statusDiv.textContent = 'An error occurred: ' + err.message;
  } finally {
    convertBtn.disabled = false;
  }
}

convertBtn.addEventListener('click', convertText);
