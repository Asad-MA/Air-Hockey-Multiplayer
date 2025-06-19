import {NotificationManager} from "../modules/notificationManager.js";
import messages from "../messages.js";
import { config } from "../config.js";

jQuery(document).ready(function($) {
  console.log("Lobby Room!!!");
const play = $("[data-play-online]");

const status = document.getElementById("status");
const serverUrl = `ws://${config.baseUrl}:2567`;
const client = new Colyseus.Client(serverUrl);
client.auth.token = sessionStorage.getItem("token");

console.log(messages.joiningOnline);

const notifier = new NotificationManager();

let ROOM;


/*Connecting to the lobby/PublicRoom */

client.joinOrCreate("LOBBY" , {})
.then(room => {
  console.log("Room Joined Successfully!", room);

  room.onMessage("challenge_room", async (data) => {
    // alert(`Room Id: "${data.roomId}"`);
     window.location.href = "/play-live/" + data.roomId;
  })

  room.onLeave((code)=>{
    console.log("client left the room:: Please reconnect");
  })
})
.catch(e => {
  alert("Error While Joining Room: " + e.message);
})



/*END*/ 


play.on("click", () => {
  // const n1 = notifier.push( 
  //   messages.joiningOnline.title , 
  //   messages.joiningOnline.description, 
  //   { type: 'info', duration: 0 }
  // );
  client.joinOrCreate("MATCH_MAKING_QUEUE", { name: "LOBBY ROOM" })
    .then(room => {
      console.log("Room Joined Successfully!", room);
      // notifier.remove(n1);
      notifier.push(
        'Matchmaking...',
        'Searching for opponent...',
        new Date(),
        { type: 'loading', duration: 0,  }
      );
      
      HandleRoom(room);
      ROOM = room;
    })
    .catch(e => {
      // console.error("Error While Joining", e.message);
      notifier.push(
        'Error',
        `${e.message || "Unknown Error While Joining. Maybe you already in a room or server is down."}`,
        new Date(),
        { type: 'system', duration: 0 }
      );
    });
});


function HandleRoom(room) {
  room.onMessage("match_found", async (message) => {
    console.log("Match Found: ", message);
    notifier.push(
      messages.matchFound.title,
      messages.matchFound.description,
      new Date(),
      { type: 'success', duration: 0 }
    );

    


    room.leave();

    setTimeout(() => {
        // Redirect to game room
        window.location.href = "/play-live/" + message;
    }, 1000);

    

  

  });
  room.onMessage("error", async (message) => {
    console.log("Error WHile Joining Known: ", message);
    notifier.push(
      'Error',
      message,
      new Date(),
      { type: 'error', duration: 0 }
    );
  })
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
    notifier.push(
      'Error',
      message,
      new Date(),
      { type: 'error', duration: 0 }
    );
    // throw new Error(message);
  });
}




})