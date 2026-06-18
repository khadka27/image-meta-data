const fs = require('fs');
async function test() {
  const formData = new FormData();
  // Create a dummy image file
  const buffer = Buffer.from('dummy image content');
  const blob = new Blob([buffer], { type: 'image/jpeg' });
  formData.append('files', blob, 'test1.jpg');
  formData.append('operation', 'edit');
  formData.append('metadata', JSON.stringify({ Make: 'Apple', Model: 'iPhone 15' }));

  try {
    const res = await fetch('http://localhost:3000/api/exif/bulk', {
      method: 'POST',
      body: formData
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Body:', text.substring(0, 200));
  } catch(e) {
    console.log('Fetch error:', e);
  }
}
test();
