const fs = require('fs');
async function run() {
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer sk-a602f2897ed640ed8d6fb3e668708987"
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [{ role: "user", content: "hello" }]
    })
  });
  console.log(await res.json());
}
run();
