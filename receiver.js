let rc = new RTCPeerConnection();
let dc;

rc.ondatachannel = e => {
  dc = e.channel;
  dc.onopen = () => console.log("Data channel open");
  dc.onmessage = e => {
    document.getElementById("chat").innerHTML += `<p><b>Peer:</b> ${e.data}</p>`;
  };
};

rc.onicecandidate = e => {
  if (rc.iceGatheringState === "complete" || !e.candidate) {
    document.getElementById("localAnswer").value = JSON.stringify(rc.localDescription);
  }
};

function submitOffer() {
  const offer = document.getElementById("remoteOffer").value;
  if (!offer) return alert("Paste the offer first!");
  rc.setRemoteDescription(JSON.parse(offer))
    .then(() => rc.createAnswer())
    .then(answer => rc.setLocalDescription(answer))
    .then(() => console.log("Answer created and set"));
}

function sendMessage() {
  const msg = document.getElementById("msgBox").value;
  dc.send(msg);
  document.getElementById("chat").innerHTML += `<p><b>You:</b> ${msg}</p>`;
}
