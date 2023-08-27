const socket = io();

const clientsTotal = document.getElementById('clients-total');

const feedback = document.getElementById('feedback');

const msgContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const msgForm = document.getElementById('message-form');
const msgInput = document.getElementById('message-input');

const mp3 = new Audio('/tone.mp3');


msgForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMsg();   
});

socket.on('clients-total', (data) =>{
    clientsTotal.innerHTML = `Total Client: ${data}`

});


function sendMsg() {
    if (msgInput.value === '') 
    return
    console.log('msg', msgInput.value);

    const data = {
        name: nameInput.value,
        message: msgInput.value,
        dateTime: new Date()
    }
    socket.emit('message', data);
    addMessageToUI(true, data);
    msgInput.value = '';
};

socket.on('chat-message', (data) => {
    mp3.play();
    addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data ){
    clearFeedback();
    const element = `
    <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
        <p class="message">
            ${data.message}
            <span>${data.name} 🔥 ${moment(data.dateTime).fromNow()}</span>
        </p>
    </li>`

    msgContainer.innerHTML += element;
    autoScroll();
}

function autoScroll(){
    msgContainer.scrollTo(0, msgContainer.scrollHeight);  
}

msgInput.addEventListener('focus',(e) =>{
    socket.emit('feedback', { 
        feedback:`${nameInput.value} is typing message ...`
    });
});

// msgInput.addEventListener('keypress',(e) =>{
//     socket.emit('feedback', { 
//         feedback:`${nameInput.value} is typing message`
//     });
// });

msgInput.addEventListener('blur',(e) =>{
    socket.emit('feedback', { 
        feedback:``
    });
});

socket.on('feedback', (data) => {
    clearFeedback();
    const element = ` 
        <li class="message-feedback">
            <p class="feedback" id="feedback">
                ${data.feedback}
            </p>
        </li>
    `
    msgContainer.innerHTML += element
})

function clearFeedback() {
    document.querySelectorAll('li.message-feeedback').forEach(element => {
        element.parentNode.removeChild(element)
    });
}