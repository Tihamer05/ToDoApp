const messageInput = document.querySelector('.message-input');
const chatBody = document.querySelector('.chat-body');
const sendMessageBtn = document.querySelector('#send-message');
const chatPopup = document.querySelector('.chatbot-popup');
const chatPopUpBtn = document.querySelector('#chat-btn');
const closeBot = document.querySelector('#close-chatbot');
const fileInput1 = document.querySelector('#file-input1');
const fileUpploadWrapper = document.querySelector('.file-upload-wrapper');
const fileCancelButton = document.querySelector('#file-cancel');

const API_KEY = 'AIzaSyBGH_BgY6KuO7tpRI2AIhz4Y642EF6xcUY';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null
    }
}

const chatHistory = [];

if (chatHistory.length > 20) {
    chatHistory.splice(0, chatHistory.length - 20);
}

const creatMessageElement = (content, ...classes) => {
    const div = document.createElement('div');
    div.classList.add('message', ...classes);
    div.innerHTML = content;
    return div;
}

const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector('.message-text');
    chatHistory.push({
        role: 'user',
        parts: [{text: userData.message}, ...(userData.file.data ? [{inline_data: userData.file}] : [])]
    });

    const requestOptions = {
        method:  'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            contents: chatHistory    
        })
        
    }

    try{
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.error.message);
        }
        const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,'$1').trim();
        messageElement.innerText = apiResponseText;

        chatHistory.push({
            role: 'model',
            parts: [{ text: apiResponseText}]
        });
    }catch (error){
        console.log(error);
        messageElement.innerText = 'Something went wrong! Please try again later!';
        messageElement.style.color = '#880808';
    }finally{
        userData.file = {};
        incomingMessageDiv.classList.remove('thinking');
        chatBody.scrollTo({top: chatBody.scrollHeight, behavior: 'smooth' });
    }
}

const handleOutgoingMessage = (e) =>{
    e.preventDefault();

    userData.message = messageInput.value.trim();
    messageInput.value = '';
    fileUpploadWrapper.classList.remove('file-uploaded');

    const messageContent = `<div class="message-text"></div>
                            ${userData.file.data ? `<img src='data:${userData.file.mime_type};base64, ${userData.file.data}' class='attachment'/>`: ''}`;

    const outgoingMessageDiv = creatMessageElement(messageContent, 'user-message');
    outgoingMessageDiv.querySelector('.message-text').innerHTML = userData.message;
    chatBody.appendChild(outgoingMessageDiv);

    chatBody.scrollTo({top: chatBody.scrollHeight, behavior: 'smooth' });

    setTimeout(() =>{
        const messageContent = `<svg class="bot-avatar" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024">
            <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z" fill="white"></path>
          </svg>
          <div class="message-text">
            <div class="thinking-indicator">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>`;
        
        const incomingMessageDiv = creatMessageElement(messageContent, 'bot-message', 'thinking');
        chatBody.appendChild(incomingMessageDiv);

        requestAnimationFrame(() => {
            chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: 'smooth' });
        });

        generateBotResponse(incomingMessageDiv);
    }, 600);
}

messageInput.addEventListener('keydown', (e) =>{
    const userMessage = e.target.value.trim();
    if(e.key === 'Enter' && userMessage){
        document.body.classList.remove('show-emoji-picker');
        handleOutgoingMessage(e);
    }
})



function closeChatbot() {
    chatPopup.classList.add('hidden');
    setTimeout(() => {
        chatPopup.style.display = 'none';
    }, 400);
    overlayMedia.style.display = 'none';
    overlayMedia.classList.remove('active');
}


chatPopUpBtn.addEventListener('click', () =>{
    chatPopup.style.display = chatPopup.style.display === 'block' ? 'none' : 'block';
    
    overlayMedia.classList.add('active');
    overlayMedia.style.display = 'block';

    setTimeout(() => {
        chatPopup.classList.remove('hidden');
        if(chatPopup.style.display === 'none'){
            overlayMedia.classList.remove('active');
        }
    }, 10);

    menu.classList.remove('active');
    overlay.classList.remove('active');
    
    
});

closeBot.addEventListener('click', closeChatbot);

fileInput1.addEventListener('change', () => {
    const file = fileInput1.files[0];
    if(!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        fileUpploadWrapper.querySelector('img').src = e.target.result;
        fileUpploadWrapper.classList.add('file-uploaded');
        const base64String = e.target.result.split(',')[1];

        userData.file = {
            data: base64String,
            mime_type: file.type
        }

        fileInput1.value = '';
    }

    reader.readAsDataURL(file);
});

fileCancelButton.addEventListener('click', () => {
    userData.file = {};
    fileUpploadWrapper.classList.remove('file-uploaded');
});

const picker = new EmojiMart.Picker({
    theme: 'dark',
    skinTonePosition: 'none',
    previwPosition: 'none',
    onEmojiSelect: (emoji) =>{
        const {selectionStart: start, selectionEnd: end} = messageInput;
        messageInput.setRangeText(emoji.native, start, end, 'end');
        messageInput.focus();
    },
    onClickOutside: (e) => {
        if(e.target.id === 'emoji-picker'){
            document.body.classList.toggle('show-emoji-picker');
        }else{
            document.body.classList.remove('show-emoji-picker');
        }
        
    }
});

document.querySelector('.chat-form').appendChild(picker);

sendMessageBtn.addEventListener('click', (e) => handleOutgoingMessage(e));
document.querySelector('#file-upload').addEventListener('click', () => fileInput1.click());

