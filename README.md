# 🚀 EzyBuyy – Agentic AI E-commerce Platform

EzyBuyy is a **next-generation AI-native e-commerce platform** that transforms traditional online shopping into an **interactive conversational experience**.

Instead of static browsing, users interact with a **stateful AI shopping agent** that can:

- Recommend products
- Answer product questions
- Understand natural language queries
- Negotiate product prices in real time

The platform also provides an **AI Copilot for admins** that automates product onboarding using **computer vision and generative AI**.

---

# 🧠 Core Idea

Traditional e-commerce platforms are static.

Users search → browse → checkout.

EzyBuyy introduces **Agentic Commerce**, where an **AI agent acts like a virtual shopkeeper**.

Users can interact naturally:

```
User: I need shoes for running
AI: Here are some running shoes you might like

User: Show cheaper ones
AI: Here are similar shoes under ₹3000

User: Can you give a discount?
AI: I can offer 8% off if you checkout today.
```

---

# ✨ Key Features

## 🤖 Conversational AI Shopping Agent

A **stateful AI assistant** that enables natural shopping conversations.

Capabilities:

- Natural language product search
- Context-aware conversations
- Product Q&A
- Price negotiation
- Order tracking queries

Example conversation:

```
User: Show me red sneakers
AI: Here are some red sneakers.

User: Show cheaper ones
AI: Here are options under ₹2500.

User: Can I get a discount?
AI: I can offer a 10% discount today.
```

---

## 🤝 AI-Powered Price Negotiation

A unique feature rarely seen in e-commerce platforms.

### Workflow

1. User asks for discount
2. AI checks product **minimum allowed price**
3. Negotiation engine evaluates:
   - user history
   - price margin
   - negotiation logic
4. AI generates **counter-offer**
5. If accepted → **discount token generated**

Example:

```
Product Price: ₹5000
User Offer: ₹4200

AI Response:
"That's a bit low, but I can offer ₹4600."
```

---

## 🧠 Multi-Agent AI Architecture

The AI system is built using **LangChain + LangGraph**.

Instead of one AI, the system uses **multiple specialized agents**.

### Agent Flow

```
User Input
   |
   v
Supervisor Agent
   |
   +---- Product Search Agent
   |
   +---- Negotiation Agent
   |
   +---- Order Agent
```

### Agents

**Supervisor Agent**

Routes user queries to the correct specialist agent.

**Product Search Agent**

Converts vague queries into structured product search.

Example:

```
User Query:
"Outfit for a summer wedding"

Converted To:

category: clothing
style: formal
season: summer
```

**Negotiation Agent**

Handles price bargaining and generates counter-offers.

**Order Agent**

Handles queries like:

```
Where is my order?
```

---

# ⚡ AI Product Onboarding (Admin Copilot)

Uploading products manually takes time.

EzyBuyy uses **Vision AI** to automate product creation.

### Workflow

Admin uploads product image →

Gemini Vision analyzes the image →

AI generates:

- Product title
- Product description
- Product tags
- Product category

Example output:

```
Title:
Nike Air Max Running Shoes

Description:
Lightweight breathable sneakers designed for everyday running and comfort.

Category:
Footwear > Men > Sneakers

Tags:
running, sports, sneakers, nike
```

---

# 🖥️ Frontend Architecture

Built using **React + Vite** for fast performance.

### Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI framework |
| Redux Toolkit | Global state |
| React Router v7 | Routing |
| TailwindCSS | Styling |
| ShadCN UI | UI components |
| Axios | API calls |

---

# 📄 Frontend Pages

### Public Pages

- Homepage
- Shop (product listing)
- Product Details
- About Us
- Contact Us
- Login / Signup / OTP

### User Dashboard

- Profile Management
- Order History
- Address Management
- Cart & Checkout

### Admin Dashboard

- Analytics
- Product Management
- AI Product Upload
- Order Management
- User Management

---

# ⚙️ Backend Architecture

Backend built using **Node.js + Express.js** following **MVC architecture**.

### Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Backend framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Bcrypt | Password hashing |
| Zod | Request validation |
| Multer | File uploads |
| Cloudinary | Image storage |
| Razorpay | Payment gateway |

---

# 🏗️ MVC Architecture

```
Client Request
     |
     v
Route
     |
     v
Middleware (Auth / Validation)
     |
     v
Controller
     |
     v
Model / Database
     |
     v
Response
```

---

# 🤖 AI Layer

AI functionality lives inside a dedicated **agent module**.

```
server/agent/
```

### Modules

**chat/**

Conversational AI system.

Contains:

- Supervisor Node
- Product Search Node
- Negotiation Node

**product-analysis/**

Vision AI for automatic product generation.

---

# 📂 Project Structure

```
ezybuyy
|
|-- client
|   |-- src
|   |   |-- components
|   |   |-- pages
|   |   |-- services
|   |   |-- slices
|   |   |-- App.jsx
|   |
|   |-- package.json
|
|-- server
|   |-- agent
|   |   |-- chat
|   |   |   |-- nodes
|   |   |   |-- graph.js
|   |   |
|   |   |-- product-analysis
|   |
|   |-- controllers
|   |-- models
|   |-- routes
|   |-- config
|   |-- index.js
|
|-- package.json
```

---

# 🔐 Security

Security measures implemented:

- JWT authentication
- Password hashing using bcrypt
- Request validation using Zod
- Secure Razorpay payments
- Cloudinary image storage

---

# 🚀 Installation

## Clone the repository

```
[git clone https://github.com/yourusername/ezybuyy.git](https://github.com/Ayushsotiya/Ecommerce_clothing)
```

## Install dependencies
Root 
```npm install```

Frontend

```
cd client
npm install
```

Backend

```
cd server
npm install
```

---

## Setup environment variables

Create `.env` file inside **server**

```
PORT=5000
MONGODB_URI=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_SECRET=

GEMINI_API_KEY=
```

---

## Run the project

Root 
```
npm run dev
```

---

# 📊 Future Improvements

- Vector database for semantic product search
- Personalized AI shopping assistant
- Voice-based shopping
- Dynamic pricing models
- AI recommendation engine

---

# 👨‍💻 Author

**Ayush Sotiya**

B.Tech Computer Science

GitHub  
[https://github.com/yourusername](https://github.com/Ayushsotiya?tab=repositories)

---

# ⭐ Support

If you like this project, please give it a **star ⭐ on GitHub**.
