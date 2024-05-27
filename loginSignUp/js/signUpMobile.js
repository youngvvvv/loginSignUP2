document.addEventListener('DOMContentLoaded', function () {
    const ws = new WebSocket('wss://9f83-110-12-48-34.ngrok-free.app/');
    const video = document.getElementById("video");
    const signupButton = document.getElementById("signup");

    ws.onopen = function () {
        console.log('WebSocket connection established');
    };

    ws.onmessage = function (event) {
        console.log('Message from server: ' + event.data);
        let receivedMessages = JSON.parse(localStorage.getItem('savedDescriptor')) || [];
        receivedMessages.push(event.data);
        localStorage.setItem('savedDescriptor', JSON.stringify(receivedMessages));
        updateReceivedMessages();
    };

    // 'Capture & Send' 버튼 클릭 시 평균화된 얼굴 디스크립터를 서버로 전송
    signupButton.addEventListener('click', function() {
        captureAndSend();
    });


    function captureAndSend() {
        if (window.saveddDescriptor) {
            console.log('Sending averaged descriptor');
            ws.send(JSON.stringify(window.saveddDescriptor));
        } else {
            console.log('No descriptor to send');
        }
    }

    function updateReceivedMessages() {
        const receivedMessages = JSON.parse(localStorage.getItem('savedDescriptor')) || [];
        const receivedMessagesDiv = document.getElementById('savedDescriptor');
        receivedMessagesDiv.innerHTML = '';
        receivedMessages.forEach((msg, index) => {
            const messageElement = document.createElement('div');
            messageElement.textContent = `${index + 1}: ${msg}`;
            receivedMessagesDiv.appendChild(messageElement);
        });

    }

    window.onload = function() {
        updateReceivedMessages();
    }


});
