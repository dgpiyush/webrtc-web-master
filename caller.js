let lc = new RTCPeerConnection();
let dc = lc.createDataChannel("channel");

dc.onopen = () => console.log("Data channel open");
dc.onmessage = e => {
  document.getElementById("chat").innerHTML += `<p><b>Peer:</b> ${e.data}</p>`;
};

lc.onicecandidate = e => {
  if (lc.iceGatheringState === "complete" || !e.candidate) {
    document.getElementById("localOffer").value = JSON.stringify(lc.localDescription);
  }
};

lc.createOffer()
  .then(o => lc.setLocalDescription(o))
  .then(() => console.log("Offer created and set"));

function submitAnswer() {
  const answer = document.getElementById("remoteAnswer").value;
  if (!answer) return alert("Paste the answer first!");
  lc.setRemoteDescription(JSON.parse(answer));
}

function sendMessage() {
  const msg = document.getElementById("msgBox").value;
  dc.send(msg);
  document.getElementById("chat").innerHTML += `<p><b>You:</b> ${msg}</p>`;
}
