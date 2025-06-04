addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Telegram MOD APK Download</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; background: #f7f7f7; padding: 2rem; }
          .container { background: #fff; max-width: 500px; margin: auto; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px #0001;}
          h1 { color: #0088cc; }
          ul { margin: 1rem 0; }
          .note { color: #b00; font-size: 0.95em; margin-bottom: 1rem;}
          .download-btn {
            display: inline-block;
            padding: 0.8em 2em;
            background: #0088cc;
            color: #fff;
            border: none;
            border-radius: 4px;
            font-size: 1.2em;
            text-decoration: none;
            transition: background 0.2s;
          }
          .download-btn:hover { background: #005f8c; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Telegram MOD APK</h1>
          <h2>MOD Features</h2>
          <ul>
            <li>Premium Unlocked</li>
            <li>No ads</li>
            <li>Block sponsored channels</li>
            <li>Optimization</li>
          </ul>
          <div class="note">
            <strong>Note:</strong> Some Premium features are on the server side, so you can’t use them.<br>
            <br>
            <strong>Some Premium features in the MOD version:</strong>
            <ul>
              <li>Premium icons</li>
              <li>Pinned chats</li>
              <li>Premium stickers</li>
              <li>200 chats/folder</li>
            </ul>
          </div>
          <a class="download-btn" href="https://your-cdn.com/telegram-mod.apk" download>
            Download Telegram MOD APK
          </a>
        </div>
      </body>
    </html>
  `
  return new Response(html, {
    headers: { 'content-type': 'text/html' }
  })
}
