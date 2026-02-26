# DinasiMart 🛒

DinasiMart is a fast, responsive, modern full-stack quick-commerce application inspired by platforms like Blinkit. It allows users to browse daily essentials, view product availability across multiple local stores (with distance metrics), manage their cart in real-time, authenticate securely with Google, and permanently save their order history.

## 🚀 Features

- **Modern & Responsive UI:** Designed with a vibrant, Blinkit-inspired green and yellow theme, featuring box shadows, dynamic gradients, and smooth responsive layouts for both mobile and desktop.
- **Real-Time Cart Management:** Context API-driven state management provides instant updates to cart quantities, handling fees, delivery charges, and total checkout prices without page reloads.
- **Dynamic Multi-Vendor Support:** Products are dynamically mapped to various local shops. The app intelligently checks stock availability and sorts nearest grocery stores based on randomized distance metrics.
- **Secure Google Authentication:** Fully integrated Google OAuth 2.0 login flow using JWT (JSON Web Tokens) to fetch, verify, and persist genuine user profile data.
- **Persistent Order History:** Seamless transition from cart checkout to a persistent SQLite database, allowing users to safely view their past delivery orders, dates, and item breakdowns.
- **Smart Search & Autocomplete:** As-you-type search functionality directly querying the database for rapid product discovery.
- **Automated Database Seeding:** The backend automatically boots up with a fully populated SQLite database, featuring 50+ real-world grocery items mapped intelligently across 50 generic local shop names.

## 💻 Tech Stack

- **Frontend:** React.js, Vite, React Router DOM, React Context API, Vanilla CSS (CSS variables for theming), Lucide-React (Icons)
- **Authentication:** Google OAuth 2.0 (`@react-oauth/google`), JWT Decode
- **Backend:** Node.js, Express.js, RESTful APIs
- **Database:** SQLite (`sqlite3`)

## 📂 Project Structure

The project is structured into two main directories:

- `/client` - The Vite React frontend application.
- `/server` - The Node.js Express backend and SQLite database.

## 🛠️ Installation & Setup

To run this application locally, you will need to start both the backend server and the frontend client.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Git](https://git-scm.com/)

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/vinayakaudupa/dinasimart.git
cd dinasimart
\`\`\`

### 2. Setup the Backend Server
\`\`\`bash
# Install backend dependencies
npm install express cors sqlite3

# Start the Node.js server (Runs on port 3001)
node server/index.js
\`\`\`
*(Note: When you run the server for the first time, it will automatically create and seed the `db.sqlite` database file).*

### 3. Setup the Frontend Client
Open a **new** terminal window and navigate to the client folder:
\`\`\`bash
cd client

# Install frontend dependencies
npm install

# Start the Vite development server
npm run dev
\`\`\`

### 4. Configure Google Authentication (Optional)
To enable real Google Login, you need a Client ID:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project and configure the OAuth consent screen.
3. Create an **OAuth client ID** (Web application).
4. Add `http://localhost:5173` to the **Authorized JavaScript origins**.
5. Copy the Client ID.
6. Open `client/src/main.jsx` and replace `"YOUR_GOOGLE_CLIENT_ID_HERE"` with your actual key.

## 🌐 Usage

- Access the frontend web application at: **http://localhost:5173**
- The backend API runs at: **http://localhost:3001**

## 📝 API Endpoints Summary

- \`GET /api/categories\` - Fetch all product categories
- \`GET /api/items\` - Fetch all products
- \`GET /api/search?q=...\` - Search items by name
- \`GET /api/items/:id/shops\` - Get local shops carrying an item, sorted by distance
- \`POST /api/cart\` - Add an item to the persistent cart
- \`POST /api/orders\` - Place an order and clear the cart
- \`GET /api/orders\` - Retrieve user order history

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
