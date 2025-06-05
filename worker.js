addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const TOKEN_BOT = `7672506977:AAGu5iMSWzsMrAL8mh0k5jyu9SD9gN3a5yQ`
  const TELEGRAM_API_URL = `https://api.telegram.org/bot${TOKEN_BOT}/`;
  const url = new URL(request.url);

  if (url.pathname === "/webhook") {
    const payload = await request.json();
    
    const chatId = payload.message ? payload.message.chat.id : payload.callback_query.message.chat.id;
    const text = payload.message ? payload.message.text : null;
    
    if (text === "/start") {
      return sendInlineKeyboard(TELEGRAM_API_URL, chatId);
    }

    if (payload.callback_query) {
      const selectedModel = payload.callback_query.data;
      
      console.log(`User ${chatId} memilih model: ${selectedModel}`);
      
      await saveUserModelSelection(chatId, selectedModel);
      
      const promptMessage = `Anda memilih ${selectedModel}. Silakan kirim prompt untuk model tersebut.`;
      return sendMessage(TELEGRAM_API_URL, chatId, promptMessage);
    }

    const userModel = await getUserModelSelection(chatId);
    
    if (userModel) {
      const prompt = text;

      const models = {
        "openai": "https://ai.netorare.web.id/?openai=",
        "openai-large": "https://ai.netorare.web.id/?openai-large=",
        "openai-reasoning": "https://ai.netorare.web.id/?openai-reasoning=",
        "qwen-coder": "https://ai.netorare.web.id/?qwen-coder=",
        "llama": "https://ai.netorare.web.id/?llama=",
        "mistral": "https://ai.netorare.web.id/?mistral=",
        "unity": "https://ai.netorare.web.id/?unity=",
        "midijourney": "https://ai.netorare.web.id/?midijourney=",
        "rtist": "https://ai.netorare.web.id/?rtist=",
        "searchgpt": "https://ai.netorare.web.id/?searchgpt=",
        "evil": "https://ai.netorare.web.id/?evil=",
        "deepseek": "https://ai.netorare.web.id/?deepseek=",
        "claude-hybridspace": "https://ai.netorare.web.id/?claude-hybridspace=",
        "deepseek-r1": "https://ai.netorare.web.id/?deepseek-r1=",
        "deepseek-reasoner": "https://ai.netorare.web.id/?deepseek-reasoner=",
        "llamalight": "https://ai.netorare.web.id/?llamalight=",
        "llamaguard": "https://ai.netorare.web.id/?llamaguard=",
        "gemini": "https://ai.netorare.web.id/?gemini=",
        "gemini-thinking": "https://ai.netorare.web.id/?gemini-thinking=",
        "hormoz": "https://ai.netorare.web.id/?hormoz=",
        "hypnosis-tracy": "https://ai.netorare.web.id/?hypnosis-tracy=",
        "sur": "https://ai.netorare.web.id/?sur=",
        "sur-mistral": "https://ai.netorare.web.id/?sur-mistral=",
        "llama-scaleway": "https://ai.netorare.web.id/?llama-scaleway="
      };

      if (models[userModel]) {
        const apiUrl = `${models[userModel]}${encodeURIComponent(prompt)}`;
        try {
          const response = await fetch(apiUrl);
          const data = await response.text();
          return sendMessage(TELEGRAM_API_URL, chatId, data);
        } catch (error) {
          console.log(error); 
          return sendMessage(TELEGRAM_API_URL, chatId, "Gagal mengambil data dari model yang dipilih.");
        }
      } else {
        return sendMessage(TELEGRAM_API_URL, chatId, "Model yang dipilih tidak valid.");
      }
    } else {
      return sendMessage(TELEGRAM_API_URL, chatId, "Anda belum memilih model. Silakan pilih model terlebih dahulu.");
    }
  }

  return new Response("Not Found", { status: 404 });
}

async function sendInlineKeyboard(apiUrl, chatId) {
  const inlineKeyboard = {
    inline_keyboard: [
      [
        { text: "OpenAI GPT-4o-mini", callback_data: "openai" },
        { text: "OpenAI GPT-4o", callback_data: "openai-large" }
      ],
      [
        { text: "OpenAI o1-mini", callback_data: "openai-reasoning" },
        { text: "Qwen 2.5 Coder 32B", callback_data: "qwen-coder" }
      ],
      [
        { text: "Llama 3.3 70B", callback_data: "llama" },
        { text: "Mistral Nemo", callback_data: "mistral" }
      ],
      [
        { text: "Unity with Mistral Large", callback_data: "unity" },
        { text: "Midijourney musical transformer", callback_data: "midijourney" }
      ],
      [
        { text: "Rtist information generator", callback_data: "rtist" },
        { text: "SearchGPT realtime news", callback_data: "searchgpt" }
      ],
      [
        { text: "Evil Mode - Experimental", callback_data: "evil" },
        { text: "DeepSeek-V3", callback_data: "deepseek" }
      ],
      [
        { text: "Claude Hybridspace", callback_data: "claude-hybridspace" },
        { text: "DeepSeek-R1 Distill Qwen 32B", callback_data: "deepseek-r1" }
      ],
      [
        { text: "DeepSeek R1 - Full", callback_data: "deepseek-reasoner" },
        { text: "Llama 3.1 8B Instruct", callback_data: "llamalight" }
      ],
      [
        { text: "Llamaguard 7B AWQ", callback_data: "llamaguard" },
        { text: "Gemini 2.0 Flash", callback_data: "gemini" }
      ],
      [
        { text: "Gemini 2.0 Flash Thinking", callback_data: "gemini-thinking" },
        { text: "Hormoz 8b", callback_data: "hormoz" }
      ],
      [
        { text: "Hypnosis Tracy - Self-Help AI", callback_data: "hypnosis-tracy" },
        { text: "Sur AI Assistant", callback_data: "sur" }
      ],
      [
        { text: "Sur AI Assistant (Mistral)", callback_data: "sur-mistral" },
        { text: "Llama (Scaleway)", callback_data: "llama-scaleway" }
      ]
    ]
  };

  const url = `${apiUrl}sendMessage?chat_id=${chatId}&text=Silakan pilih model:&reply_markup=${encodeURIComponent(JSON.stringify(inlineKeyboard))}`;
  const response = await fetch(url);
  return new Response(await response.text(), { status: response.status });
}

async function sendMessage(apiUrl, chatId, message) {
  const watermark = "\n\n[Made with ❤️ by Sonzai X シ](https://t.me/November2k)";
  const fullMessage = `${message}${watermark}`;
  
  const url = `${apiUrl}sendMessage?chat_id=${chatId}&text=${encodeURIComponent(fullMessage)}&parse_mode=Markdown&disable_web_page_preview=true`;
  const response = await fetch(url);
  return new Response(await response.text(), { status: response.status });
}

async function saveUserModelSelection(userId, model) {
  console.log(`Menyimpan model ${model} untuk user ${userId}`);
  await MODEL_SELECTION.put(userId.toString(), model); 
}

async function getUserModelSelection(userId) {
  const model = await MODEL_SELECTION.get(userId.toString());
  return model;
}
        
