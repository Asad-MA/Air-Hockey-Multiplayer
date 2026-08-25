# Air Hockey Multiplayer (Client) 🏒

A web-based multiplayer interface and client for real-time Air Hockey matches. Designed to let players log in, manage friend requests, send match challenges, chat live, and track global stats on the leaderboard.

The dedicated game matchmaking and room-authoritative server code runs in tandem via the [Air-Hockey-Colyseus-Server](https://github.com/Asad-MA/Air-Hockey-Colyseus-Server-) repository.

## Features

* **Real-Time Matchmaking & Challenges:** Send direct game challenges and play live matches.
* **Interactive Social System:** Real-time chat functionality and peer-to-peer friend requests.
* **Leaderboards:** Live statistics and global player rankings.
* **Authentication:** Secure user login and registration interface.

## Architecture & Structure

| Directory | Description |
| :--- | :--- |
| `controllers/` | Route handlers and business logic. |
| `models/` | Data schemas and database interactions. |
| `routes/` | Application routing configuration. |
| `services/` | Core services including leaderboard metrics and stats. |
| `views/` | Frontend templates and UI components. |
| `public/` | Static assets, client-side scripts, and stylesheets. |
| `ws-channel.js` | WebSocket integration for real-time client communication. |

## Tech Stack

* **Language:** JavaScript (Node.js)
* **Real-time Engine:** WebSockets / Colyseus integration architecture
