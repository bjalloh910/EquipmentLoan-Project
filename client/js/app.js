// client/script.js
fetch('/api/hello')
  .then(res => res.json())
  .then(data => {
    document.getElementById('msg').innerText = data.message;
  });
