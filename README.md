# SwiftChat 💬

**SwiftChat** is a modern real-time chat application built with a lightweight tech stack including **React**, **TypeScript**, and **Socket.IO**. It delivers instant messaging through a clean and minimal user interface.

🌐 [Live Demo](https://swift-chat-fawn.vercel.app/)  
📁 [GitHub Repository](https://github.com/NikitaLiman/SwiftChat)

---

## 🧰 Technologies Used

### Frontend

- **React** – JavaScript library for building user interfaces
- **TypeScript** – Strongly typed JavaScript for better developer experience
- **SCSS** – CSS preprocessor for modular and powerful styling
- **Vite** – Fast development environment and bundler
- **Socket.IO-client** – Enables real-time communication on the client side

### Backend

- **Socket.IO-server** – Handles WebSocket-based real-time messaging
- **Node.js** – JavaScript runtime for the backend
- *(Note: Backend is embedded within the frontend in a minimal server using Socket.IO)*

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16.0.0 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NikitaLiman/SwiftChat.git
   cd SwiftChat

  ---
   
2.Install dependencies
   npm install
    # or
   yarn install

 ---  

3. Start the development server
   npm run dev
    # or
   yarn dev

🔁 Real-time Messaging
SwiftChat leverages Socket.IO to enable real-time communication between users. When a user joins, a socket connection is established, allowing messages to be sent and received instantly by all connected clients.

---

License
This project is licensed under the MIT License - see the LICENSE file for details.


