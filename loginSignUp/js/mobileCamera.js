const video = document.getElementById("video");
let savedDescriptor = null; // 저장된 얼굴 디스크립터
const ws = new WebSocket('wss://9f83-110-12-48-34.ngrok-free.app/');  // 서버의 WebSocket URL로 변경해야 함 

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("../models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("../models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("../models"),
]).then(startWebcam);

function startWebcam() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.error(error);
    });
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  faceapi.matchDimensions(canvas, { height: video.height, width: video.width });

  const FRAME_BUFFER_SIZE = 10; // 프레임 버퍼 크기 설정
  let frameBuffer = []; // 프레임 버퍼 초기화

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();

    const resizedDetections = faceapi.resizeResults(detections, {
      height: video.height,
      width: video.width,
    });
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    if (detections.length > 0) {
      // 얼굴이 감지된 경우
      const faceDescriptor = detections[0].descriptor; // 첫 번째 얼굴의 디스크립터 가져오기
      frameBuffer.push(faceDescriptor); // 프레임 버퍼에 디스크립터 추가

      if (frameBuffer.length > FRAME_BUFFER_SIZE) {
        // 프레임 버퍼 크기 제한
        frameBuffer.shift(); // 가장 오래된 디스크립터 삭제하여 크기 조절
      }

      // 프레임 버퍼의 디스크립터를 평균화하여 저장
      const averagedDescriptor = averageDescriptors(frameBuffer);
      
      
      savedDescriptor = averagedDescriptor;
      // 저장된 디스크립터를 로컬 저장소에 저장
      localStorage.setItem("savedDescriptor", JSON.stringify(savedDescriptor));
   
       // 예제 코드 추가
       window.saveddDescriptor = savedDescriptor; // 전역 변수로 저장
      // 식별
      if (savedDescriptor) {
        const distance = faceapi.euclideanDistance(savedDescriptor, faceDescriptor);
        console.log("Distance:", distance);
        if (distance < 0.25) {
          console.log("Same person detected!");
          ws.send(JSON.stringify({ isMatch: true }));  // 서버로 true 전송
          // 동일한 사람으로 판별되면 할 작업 수행
        }
        else {
          console.log("Different person detected!")
          ws.send(JSON.stringify({ isMatch: false }));  // 서버로 false 전송
        }
      }
    }
  }, 5000);
});

// 디스크립터 배열의 각 요소를 평균화하는 함수
function averageDescriptors(descriptors) {
  const descriptorSize = descriptors[0].length;
  const averagedDescriptor = new Float32Array(descriptorSize).fill(0);
  descriptors.forEach((descriptor) => {
    for (let i = 0; i < descriptorSize; i++) {
      averagedDescriptor[i] += descriptor[i];
    }
  });
  for (let i = 0; i < descriptorSize; i++) {
    averagedDescriptor[i] /= descriptors.length;
  }

  return averagedDescriptor;
}




