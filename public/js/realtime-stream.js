console.log("Realtime Stream!");
const playerCount = document.getElementById("player-count");

const ws = new WebSocket("ws://192.168.43.251:3002");

ws.onopen = () => {
    console.log("Connected to WebSocket server");
    ws.send("Hello Server!");
};

ws.onmessage = (event) => {
    console.log("Message from server:", event.data);
    const data = JSON.parse(event.data);
    playerCount.innerText = data.message;
};
