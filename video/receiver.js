const rc = new RTCPeerConnection();
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

let dc;

rc.ondatachannel = e => {
  dc = e.channel;
  dc.onopen = () => console.log("Data channel open");
  dc.onmessage = e => {
    document.getElementById("chat").innerHTML += `<p><b>Peer:</b> ${e.data}</p>`;
  };
};

rc.ontrack = e => {
  if (!remoteVideo.srcObject) {
    remoteVideo.srcObject = e.streams[0];
  }
};

navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
  localVideo.srcObject = stream;
  stream.getTracks().forEach(track => rc.addTrack(track, stream));
});

function setOffer() {
  const offer = document.getElementById("offer").value;
  if (!offer) return alert("Paste the offer first!");

  rc.setRemoteDescription(JSON.parse(offer))
    .then(() => rc.createAnswer())
    .then(answer => rc.setLocalDescription(answer))
    .then(() => {
      rc.onicecandidate = e => {
        if (!e.candidate) {
          document.getElementById("answer").value = JSON.stringify(rc.localDescription);
        }
      };
    });
}

function sendMessage() {
  const msg = document.getElementById("msgInput").value;
  dc.send(msg);
  document.getElementById("chat").innerHTML += `<p><b>You:</b> ${msg}</p>`;
}
