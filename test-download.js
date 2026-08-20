const http = require('http');

const req = http.request('http://localhost:8080/v1/mail/attachments/invalid-blob-just-to-test', {
  method: 'GET',
}, (res) => {
  console.log('Status:', res.statusCode);
  res.on('data', (d) => {
    process.stdout.write('got data');
  });
});
req.end();
