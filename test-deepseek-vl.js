const fs = require('fs');
async function run() {
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer sk-a602f2897ed640ed8d6fb3e668708987"
    },
    body: JSON.stringify({
      model: "deepseek-vl",
      messages: [{ 
        role: "user", 
        content: [
          { type: "text", text: "What is this image?" },
          { type: "image_url", image_url: { url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" } }
        ]
      }]
    })
  });
  console.log(await res.json());
}
run();
