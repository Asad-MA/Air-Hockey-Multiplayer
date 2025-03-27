import {NotificationManager} from "../modules/notificationManager.js";
import messages from "../messages.js";

console.log("Lobby Room!!!");
const play = document.getElementById("play-online");

const status = document.getElementById("status");
const serverUrl = "ws://127.0.0.1:2567";
const client = new Colyseus.Client(serverUrl);
client.auth.token = sessionStorage.getItem("token");

console.log(messages.joiningOnline);

const notifier = new NotificationManager();

let ROOM;

play.addEventListener("click", () => {
  const n1 = notifier.push( 
    messages.joiningOnline.title , 
    messages.joiningOnline.description, 
    { type: 'info', duration: 0 }
  );
  client.joinOrCreate("LOBBY", { name: "LOBBY ROOM" })
    .then(room => {
      console.log("Room Joined Successfully!", room);
      notifier.remove(n1);
      notifier.push(
        messages.waitingForPlayer.title,
        messages.waitingForPlayer.description,
        { type: 'success', duration: 0 }
      );
      
      HandleRoom(room);
      ROOM = room;
    })
    .catch(e => {
      console.error("Error While Joining", e.message);
      notifier.push(
        'Error',
        `Error While Joining Room: ${e.message}`,
        { type: 'error', duration: 5000 }
      );
    });
});


function HandleRoom(room) {
  room.onMessage("match_found", async (message) => {
    console.log("Match Found: ", message);
    status.innerHTML = "Match Found!";


    room.leave();

    const newRoom = await client.joinById(message);

    console.log("New Room: ", newRoom);
    status.innerHTML = "Game Room Joined! " + newRoom.roomId;

    newRoom.onMessage('Players', (message) => {
      console.log("Players: ", message);
      const p = message.map((m) => m.name);
      status.insertAdjacentHTML("beforeend", `<br>Players: <br>${p.join("<br> ")}`);
    });

    newRoom.onLeave((code) => {
      console.log("client left the room", code);
    });

    // Redirect to game room
    // window.location.href = "/game";
  });
  room.onError((code, message) => {
    console.log("oops, error ocurred:");
    console.log(message);
    throw new Error("Room Left: " + code);
  });
  room.onLeave((code) => {
    console.log("client left the room", code);
    throw new Error("Room Left: " + code);
  });
  room.onMessage("error", (message) => {
    throw new Error(message);
  });
}



