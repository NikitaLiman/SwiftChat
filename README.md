# SwiftChat 💬

**SwiftChat** is a modern real-time chat application built with a lightweight tech stack including **React**, **TypeScript**, and **Socket.IO**. It delivers instant messaging through a clean and minimal user interface.

🌐 [Live Demo](https://swift-chat-fawn.vercel.app/)  
📁 [GitHub Repository](https://github.com/NikitaLiman/SwiftChat)

---

## 🧰 Technologies Used

### Frontend
- **Next.js**: React framework for server-rendered applications
- **TypeScript**: Type-safe JavaScript for better developer experience
- **JavaScript**: Core programming language for web development
- **HTML**: Markup language for web pages
- **SCSS**: Advanced CSS preprocessor for styling
- **Zustand**: Lightweight state management solution

### Backend
- **Next.js API Routes**: Serverless functions for backend logic
- **PostgreSQL**: Robust relational database for data storage
- **Prisma ORM**: Next-generation ORM for database access and migrations
- **Socket.IO-server** – Handles WebSocket-based real-time messaging

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm or yarn
- PostgreSQL database


1. Clone the repository
```bash
git clone https://github.com/your-username/SwiftChat.git
cd SwiftChat
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL="postgresql://username:password@localhost:5432/SwiftChat"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

4. Set up the database
```bash
npx prisma migrate dev
# or
yarn prisma migrate dev
```

5. Start the development server
```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Database Schema

The application uses PostgreSQL with Prisma ORM. The schema is defined in `prisma/schema.prisma`.

## State Management

Zustand is used for state management, providing a simple and efficient way to handle application state without the boilerplate of other state management libraries.

## Deployment

This application is deployed on Vercel. To deploy your own instance:

1. Push your code to a GitHub repository
2. Import the repository to Vercel
3. Configure the environment variables
4. Deploy

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.


