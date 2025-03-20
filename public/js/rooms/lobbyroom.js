console.log("Lobby Room!!!");

// ...
const serverUrl = "ws://127.0.0.1:2567";
const client = new Colyseus.Client(serverUrl);

let ROOM ;

client.join("LOBBY" , {name: "LOBBY ROOM"})
.then(room => {
    console.log("Room Joined Successfully!" , room);
    HandleRoom(room);
    ROOM = room;
})
.catch(e => {
    console.error("Error While Joining" , e.message);
});

const users = {}; // Store connected users' mouse positions

function HandleRoom(room) {
    room.onMessage("type", data => {
        users[data.id] = { x: data.x, y: data.y };
        renderUsers();
    });

    document.getElementById('gameCanvas').addEventListener("mousemove", (event) => {
        if (room) {
            room.send("type", {
                x: event.clientX,
                y: event.clientY,
                id: "user_" + Math.random().toString(36).substr(2, 9),
                timestamp: Date.now()
            });
        }
    });
}

function renderUsers() {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (const id in users) {
        const user = users[id];
        // ctx.clearRect(0 , 0 , canvas.width , canvas.height)
        ctx.beginPath();
        ctx.arc(user.x, user.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
    }
}

