const fs = require('fs');

async function test() {
  const file = new Blob(['hello world'], { type: 'text/plain' });
  const formData = new FormData();
  formData.append('file', file, 'test.txt');

  const token = 'YOUR_TOKEN'; // wait, I can just read it from the local storage or fetch it somehow? No, I can't easily run fetch without token.
}
