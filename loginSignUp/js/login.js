
var getData = localStorage.getItem("receivedMessages");
var qrcodeText = "  https://9f83-110-12-48-34.ngrok-free.app/loginMobile.html?data="+getData;
new QRCode(document.getElementById("qrcodeImage"), {
    width: 200,
    height: 200,
    colorDark : "rgb(245,245,220)",
    colorLight : "rgb(85, 107, 47)",
    text: qrcodeText
});


function setLocalData() {
    try {
        var stringData = document.getElementById("localDataInput").value;
        localStorage.setItem("stringData_", stringData);
        //makeCode();
        
    } catch (error) {
        console.error("Error setting data:", error);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const setLocalDataButton = document.getElementById("setLocalData");
    if (setLocalDataButton) {
        setLocalDataButton.addEventListener('click', setLocalData);
    }
});
document.addEventListener('DOMContentLoaded', function() {


    // WebSocket 연결
    const ws = new WebSocket('wss://9f83-110-12-48-34.ngrok-free.app/');
  
    ws.onopen = function() {
        console.log('WebSocket connection established');
        // 초기 로그인 상태를 false로 설정
        localStorage.setItem('loginStatus', 'false');
    };

    ws.onmessage = function(event) {
        console.log('Message from server:', event.data);
        const data = JSON.parse(event.data);

        //if (data.type === 'loginResponse') {
            // 서버로부터 받은 로그인 응답 처리
            updateLoginStatus(data.isMatch);
        
    };

    function updateLoginStatus(isMatch) {
        console.log('Updating login status:', isMatch);
        localStorage.setItem('loginStatus', JSON.stringify(isMatch));
        displayLoginStatus();
    }

    function displayLoginStatus() {
        const status = localStorage.getItem('loginStatus');
        console.log('Current login status:', status);
        // 필요하다면 로그인 상태를 표시하는 로직 추가
    }
});
