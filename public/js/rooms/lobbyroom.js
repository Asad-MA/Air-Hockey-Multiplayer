

console.log("Lobby Room!!!");

const status = document.getElementById("status");
const serverUrl = "ws://127.0.0.1:2567";
const client = new Colyseus.Client(serverUrl);
client.auth.token = sessionStorage.getItem("token");

console.log(client);

let ROOM ;

client.joinOrCreate("LOBBY" , {name: "LOBBY ROOM"})
.then(room => {
    console.log("Room Joined Successfully!" , room);
    // status.innerHTML = "Room Joined Successfully!";
   // setTimeout(() => {
        status.innerHTML = "Finding Opponent...";
   // }, 10);
    HandleRoom(room);
    ROOM = room;
})
.catch(e => {
    console.error("Error While Joining" , e.message);
    status.innerHTML = "Error While Joining";
});

const users = {}; // Store connected users' mouse positions

function HandleRoom(room) {
  room.onMessage("match_found", async (message) => {
    console.log("Match Found: ", message);
    status.innerHTML = "Match Found!";


     room.leave();

     const newRoom = await client.joinById(message);

        console.log("New Room: " , newRoom);
        status.innerHTML = "Game Room Joined! " + newRoom.roomId;

        newRoom.onMessage('Players', (message) => {
            console.log("Players: " , message);
            const p = message.map((m) => m.name);
            status.insertAdjacentHTML("beforeend" , `<br>Players: <br>${p.join("<br> ")}`);
        });

        newRoom.onLeave((code) => {
            console.log("client left the room" , code);
          });

    // Redirect to game room
    // window.location.href = "/game";
  });
}



