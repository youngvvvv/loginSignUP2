var getData = localStorage.getItem("receivedMessages");
document.addEventListener('DOMContentLoaded', function () {
    const ws = new WebSocket('wss://9f83-110-12-48-34.ngrok-free.app/');
    const receivedMessagesDiv = document.getElementById('savedDescriptor');

    ws.onopen = function () {
        console.log('WebSocket connection established');
    };

    ws.onmessage = function (event) {
        console.log('Message from server: ', event.data);
        let receivedMessages = JSON.parse(localStorage.getItem('savedDescriptor')) || [];
        receivedMessages.push(event.data);
        localStorage.setItem('saved', JSON.stringify(receivedMessages));
        updateReceivedMessages();
    }; 
    
    

    function updateReceivedMessages() {
        const receivedMessages = JSON.parse(localStorage.getItem('savedDescriptor')) || [];
        receivedMessagesDiv.innerHTML = '';
        receivedMessages.forEach((msg, index) => {
            const messageElement = document.createElement('div');
            messageElement.textContent = `${index + 1}: ${msg}`;
            receivedMessagesDiv.appendChild(messageElement);
        });
    }

    var qrcodeText = "  https://9f83-110-12-48-34.ngrok-free.app/signUpMobile.html";
    new QRCode(document.getElementById("qrcodeImage"), {
        width: 200,
        height: 200,
        colorDark : "rgb(245,245,220)",
        colorLight : "rgb(85, 107, 47)",
        text: qrcodeText
    });


});


