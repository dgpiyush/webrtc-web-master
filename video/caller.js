const lc = new RTCPeerConnection();
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

let dc = lc.createDataChannel("chat");

dc.onopen = () => console.log("Data channel open");
dc.onmessage = e => {
  document.getElementById("chat").innerHTML += `<p><b>Peer:</b> ${e.data}</p>`;
};

lc.ontrack = e => {
  if (!remoteVideo.srcObject) {
    remoteVideo.srcObject = e.streams[0];
  }
};

navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
  localVideo.srcObject = stream;
  stream.getTracks().forEach(track => lc.addTrack(track, stream));

  return lc.createOffer();
}).then(offer => {
  return lc.setLocalDescription(offer);
}).then(() => {
  lc.onicecandidate = e => {
    if (!e.candidate) {
      document.getElementById("offer").value = JSON.stringify(lc.localDescription);
    }
  };
});

function setAnswer() {
  const answer = document.getElementById("answer").value;
  if (!answer) return alert("Paste the answer first!");
  lc.setRemoteDescription(JSON.parse(answer));
}

function sendMessage() {
  const msg = document.getElementById("msgInput").value;
  dc.send(msg);
  document.getElementById("chat").innerHTML += `<p><b>You:</b> ${msg}</p>`;
}
