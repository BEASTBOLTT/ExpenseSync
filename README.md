# 👛 ExpenseSync (WalletBuddy)

> **A modern, full-stack personal finance and group expense-sharing platform. Track income and expenses, manage collaborative group spaces (trips, flats, projects), split bills with multiple split models, minimize debt settlements using greedy cash-flow algorithms, and visualize financial health through interactive analytics.**

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-5-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![ImageKit](https://img.shields.io/badge/ImageKit-Cloud_Storage-05B4FF?style=for-the-badge&logo=imagekit&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 🌐 Live Demo

🔗 **[https://expense-sync-three.vercel.app/](https://expense-sync-three.vercel.app/)**

GitHub Repository: **[https://github.com/BEASTBOLTT/ExpenseSync](https://github.com/BEASTBOLTT/ExpenseSync)**

---

# ✨ Features

### 🔐 Authentication & User Profile
- User registration and login with encrypted passwords (bcryptjs)
- JWT authentication with secure HTTP-only cookies and token blacklisting on logout
- Complete profile customization: update avatar, name, date of birth, and gender
- Avatar uploads processed via Multer and hosted in the cloud using ImageKit

### 💸 Personal Transaction Management
- Add, view, edit, and delete Income (Credit) and Expense (Debit) transactions
- Grouped chronological transactions view (Today, Yesterday, Date-grouped)
- Real-time search and filter by type (All, Income, Expense) and month
- Pre-populated transaction editing modal/page
- Upload receipt attachments for transaction verification

### 👥 Collaborative Group Spaces
- Create collaborative spaces for **Trips, Flats, Projects, Events**, or custom groups
- Assign custom icons/emojis and cover images for each space
- Add registered and virtual/mock members to spaces
- Real-time balance badges for each space card (`you get ₹X`, `you owe ₹X`, `all settled`)

### 🧮 Multi-Model Split Calculator
- **Equal Split:** Distributes cost equally, absorbing precision remainders in paise
- **Exact Amount Split:** Assign precise custom amounts to each member
- **Percentage Split:** Split expenses by defined percentage shares (must equal 100%)
- **Shares / Ratio Split:** Split expenses proportionally based on member weightages

### ⚖️ Debt Simplification Algorithm
- Integrated **greedy cash-flow minimization** algorithm
- Reduces multi-party debt webs down to the minimum number of direct settlement payments
- Record direct settlement transactions to reconcile outstanding debts

### 📊 Rich Analytics & Visual Trends
- **Net Summary Cards:** Instant view of total Income, total Expense, and Net balance
- **Spending by Category:** Pure SVG donut chart breakdown with percentage and category tags
- **Monthly Trends:** Pure SVG dual-bar chart comparing Income vs. Expense over time
- **Multi-Filter Scope:** Analyze data by time period (*This Month, Last 3M, Last 6M, Custom Range*) and source (*All, Personal, From Spaces*)

### 🌓 Custom Aesthetic & Theming
- Hand-crafted warm palette for both Light and Dark modes
- Dark/Light mode toggle persisted in `localStorage`
- Fully responsive layout optimized for Desktop, Tablet, and Mobile devices

---

# 🛠 Tech Stack

## Frontend

- **React 19** — Component-driven UI architecture
- **Vite 8** — Next-generation frontend build tool
- **Tailwind CSS 4** — Utility-first styling with modern styling engine
- **React Router 8 (v7)** — Hash routing and navigation state
- **Axios** — HTTP client configured for cross-origin credentials and interceptors
- **Pure SVG Charts** — Custom zero-dependency vector data visualizations

## Backend

- **Node.js 22 & Express.js 5** — RESTful backend API with native async error routing
- **MongoDB & Mongoose 9** — Document database with schema validation and aggregation pipelines
- **JSON Web Tokens (JWT)** — Stateless authentication via secure HTTP-only cookies
- **bcryptjs** — Password hashing and salt encryption
- **Multer** — In-memory multipart/form-data upload handling
- **ImageKit Node.js SDK** — Cloud storage and image CDN optimization
- **Cookie-Parser & CORS** — Configured for secure cross-origin session management

---

# 📂 Project Structure

```text
ExpenseSync/
│
├── Backend/
│   ├── server.js                        # Server entry point & DB connection
│   ├── package.json
│   └── src/
│       ├── app.js                       # Express app configuration & middlewares
│       ├── config/
│       │   └── db.js                    # MongoDB Mongoose connection
│       ├── controllers/
│       │   ├── account.controllers.js   # Account profile controllers
│       │   ├── analytics.controller.js  # Analytics & chart aggregations
│       │   ├── auth.controller.js       # Register, login, logout, user info
│       │   ├── category.controller.js   # Custom & default categories
│       │   ├── space.controller.js      # Spaces, expenses, balances & settlements
│       │   └── transaction.controller.js# Income/Expense CRUD operations
│       ├── middlewares/
│       │   ├── auth.middleware.js       # JWT & blacklist validation
│       │   └── error.middleware.js      # Global error handling
│       ├── models/
│       │   ├── account.model.js
│       │   ├── category.model.js
│       │   ├── space.models.js
│       │   ├── tokenBlacklist.model.js
│       │   ├── transaction.model.js
│       │   └── user.model.js
│       ├── routes/
│       │   ├── account.routes.js
│       │   ├── analytics.routes.js
│       │   ├── auth.routes.js
│       │   ├── category.routes.js
│       │   ├── space.routes.js
│       │   └── transaction.routes.js
│       └── services/
│           ├── debtSimplifier.service.js# Cash-flow minimization algorithm
│           ├── imgStorage.service.js    # ImageKit upload integration
│           └── splitCalculator.service.js# Bill splitting math engine
│
└── Frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── app.routes.jsx               # Route definitions
        ├── main.jsx
        ├── index.css                    # Tailwind CSS imports & theme fonts
        ├── components/
        │   ├── BottomBar.jsx            # Mobile navigation bar
        │   ├── Layout.jsx               # Persistent app layout shell
        │   ├── Sidebar.jsx              # Desktop navigation sidebar
        │   └── TopActions.jsx           # Dark mode toggle & profile avatar
        ├── context/
        │   └── app.context.jsx          # Theme & responsive viewport context
        ├── hooks/
        │   └── useApp.js
        └── features/
            ├── auth/
            │   ├── auth.context.jsx
            │   ├── hooks/
            │   ├── pages/ (Login.jsx, Register.jsx)
            │   └── services/
            ├── home/
            │   ├── hooks/
            │   ├── pages/ (Home.jsx)
            │   └── services/
            ├── transactions/
            │   ├── hooks/
            │   ├── pages/ (TransactionsPage.jsx, AddTransactionPage.jsx, TransactionDetailPage.jsx)
            │   └── services/
            ├── spaces/
            │   ├── components/
            │   ├── hooks/
            │   ├── pages/ (SpacesPage.jsx, CreateSpacePage.jsx, SpaceDetailPage.jsx, MembersPage.jsx)
            │   └── services/
            ├── analytics/
            │   ├── hooks/
            │   ├── pages/ (AnalyticsPage.jsx)
            │   └── services/
            └── profile/
                ├── hooks/
                ├── pages/ (Profile.jsx, EditProfile.jsx)
                └── services/
```

---

# ⚙️ Environment Variables

## Backend (`Backend/.env`)

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## Frontend (`Frontend/.env`)

```env
# Leave empty during local development (Vite proxy forwards requests)
# In production, set to your deployed backend URL (no trailing slash)
VITE_API_BASE_URL=
```

---

# 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB instance (local or MongoDB Atlas)
- ImageKit account (for cloud image storage)

---

### 1. Clone the Repository

```bash
git clone https://github.com/BEASTBOLTT/ExpenseSync.git
cd ExpenseSync
```

### 2. Install & Configure Backend

```bash
cd Backend
npm install
```

Create `.env` inside `Backend/` with your configuration, then start the server:

```bash
npm run dev
```
Backend runs on: `http://localhost:3000`

### 3. Install & Configure Frontend

```bash
cd ../Frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

# 📌 API Routes

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :----: | -------- | ----------- |
| `POST` | `/register` | Register new user & initialize profile account |
| `POST` | `/login` | Authenticate user & issue JWT cookie |
| `POST` | `/logout` | Invalidate token and clear cookie |
| `GET`  | `/user` | Get currently authenticated user details |

### 👤 Profile & Accounts (`/api/accounts`)
| Method | Endpoint | Description |
| :----: | -------- | ----------- |
| `GET`  | `/get-account` | Fetch full profile account information |
| `PUT`  | `/edit-profile` | Update profile fields (name, DOB, gender, avatar) |
| `PUT`  | `/update-account` | Update avatar image only |
| `DELETE`| `/delete-account` | Delete user account |

### 💸 Transactions (`/api/transactions`)
| Method | Endpoint | Description |
| :----: | -------- | ----------- |
| `POST` | `/create-transaction` | Create new Income or Expense transaction |
| `GET`  | `/get-all-transactions` | Fetch transactions (filters: type, category, date) |
| `GET`  | `/get-transaction/:transactionId` | Fetch transaction details by ID |
| `PUT`  | `/update-transaction/:transactionId` | Edit existing transaction |
| `DELETE`| `/delete-transaction/:transactionId`| Remove transaction |

### 🏷️ Categories (`/api/categories`)
| Method | Endpoint | Description |
| :----: | -------- | ----------- |
| `GET`  | `/` | Get categories (filterable by `?type=income\|expense`) |
| `POST` | `/` | Create custom category |
| `PUT`  | `/:categoryId` | Update custom category |
| `DELETE`| `/:categoryId`| Delete custom category |

### 👥 Spaces & Bill Splitting (`/api/spaces`)
| Method | Endpoint | Description |
| :----: | -------- | ----------- |
| `GET`  | `/` | Fetch all spaces with user's net balance |
| `POST` | `/` | Create space (with type, icon, cover image) |
| `GET`  | `/:spaceId` | Get space details and members |
| `PUT`  | `/:spaceId` | Update space metadata |
| `DELETE`| `/:spaceId` | Delete space (creator only) |
| `POST` | `/:spaceId/members` | Add member to space |
| `DELETE`| `/:spaceId/members/:memberId` | Remove member from space |
| `POST` | `/:spaceId/expenses` | Add group expense with split configuration |
| `GET`  | `/:spaceId/expenses` | List all expenses within space |
| `GET`  | `/:spaceId/balances` | Get raw member balances |
| `GET`  | `/:spaceId/simplified-balances` | Compute simplified debts (minimum transactions) |
| `POST` | `/:spaceId/settle` | Record payment settlement between members |
| `GET`  | `/:spaceId/settlements` | Fetch settlement transaction history |

### 📊 Analytics (`/api/analytics`)
| Method | Endpoint | Description |
| :----: | -------- | ----------- |
| `GET`  | `/summary` | Income, Expense, and Net totals by date/source |
| `GET`  | `/by-category` | Category spending breakdown with totals & counts |
| `GET`  | `/trends` | Monthly income vs. expense aggregate trends |

---

# 🧠 Core Algorithms

### 1. Greedy Debt Simplification
When sharing expenses in large groups, direct peer-to-peer debts create complicated transaction chains. The Debt Simplification engine computes the net balance of every participant and matches the largest debtor with the largest creditor iteratively:
$$\text{Settlement Amount} = \min(|\text{Debtor Net}|, \text{Creditor Net})$$
This guarantees the **minimum number of cash transfers** required to fully settle all debts.

### 2. Remainder-Absorbing Split Calculations
To prevent floating-point inaccuracies in multi-user currency splitting, all amounts are internally computed in **paise** (integers). Any fractional division remainder is absorbed deterministically by the first payer, ensuring:
$$\sum \text{Split Shares} \equiv \text{Total Amount}$$

---

# 🚀 Deployment

### Frontend (Vercel)
- Set Environment Variable: `VITE_API_BASE_URL=https://your-backend.onrender.com`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

### Backend (Render / Railway)
- Set Environment Variables:
  - `NODE_ENV=production`
  - `CLIENT_URL=https://expense-sync-three.vercel.app` *(ensure NO trailing slash)*
  - `MONGO_URI`, `JWT_SECRET`, `IMAGEKIT_PRIVATE_KEY`
- Build Command: `npm install`
- Start Command: `node server.js`

---

# 🚧 Future Improvements

- 🔔 Push and email reminders for outstanding debts
- 💱 Multi-currency support with live exchange rate conversion
- 🧾 OCR Receipt scanning for automatic line-item expense parsing
- 📥 Export financial reports (PDF & CSV)
- 🎯 Budgeting & Category spending limits with alerts
- 📱 Native mobile application via React Native / Capacitor

---

# 👨‍💻 Author

**Devam Pandey**

- GitHub: [@BEASTBOLTT](https://github.com/BEASTBOLTT)
- Project Repository: [ExpenseSync](https://github.com/BEASTBOLTT/ExpenseSync)
- Live Application: [WalletBuddy](https://expense-sync-three.vercel.app/)

---

## ⭐ Support

If you found this project helpful or interesting, please consider giving it a **⭐ on GitHub!**
