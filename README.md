Medifinds 🏥
Medifinds is a modern, full-stack dual-portal web and mobile platform designed to bridge the gap between customers seeking medicines and local partner pharmacies. Featuring real-time inventory tracking, live delivery monitoring, AI-driven demand forecasting, and an encrypted digital prescription vault, Medifinds streamlines healthcare accessibility.

🚀 Core Features
👤 Customer Portal
Smart Search & Auto-Complete: Instantly find medicines and tablets with dynamic query matching and visual image uploads.

Nearby Pharmacy Locator & Map Integration: Locate partner pharmacies (centered around Coimbatore), view store ratings, operating hours, addresses, and route directions. Out-of-stock items are clearly dimmed.

Encrypted Digital Prescription Vault: Securely store prescriptions, capture new ones directly via device camera, and share them seamlessly with doctors or pharmacies.

Live Delivery Tracking: Monitor active orders with real-time delivery partner tracking, complete with the agent's name, direct call option, and star rating.

Integrated Wallet & Secure Checkout: Manage funds, apply promotional discounts, and pay securely via Wallet, UPI (Google Pay, PhonePay, Paytm), or Cash on Delivery (COD).

Family & Personal Health Reminders: Set customizable medication schedules and low-stock alerts.

Multi-Language Support: Switch instantly between English, Tamil, Hindi, Malayalam, and Telugu.

Theme Engine: Fully customizable Light and Dark mode options.

24/7 AI Health Assistant: Persistent chatbot ready to assist with medication info, dosage reminders, and FAQs.

🛡️ Pharmacy Admin (Domain) Portal
Store Overview Dashboard: Real-time metrics tracking total inventory, low stock items, expiry warnings, and daily sales.

Live Customer Orders: Instant synchronization of customer orders straight to the pharmacy queue.

Medicine Inventory Manager: Update stock levels and availability status that instantly reflects on the customer-facing map.

Expiry Alerts & Tracker: Automated tracking of medicines expiring within 30 days.

POS Terminal & Billing: Built-in invoice management and payment tracking.

Gemini AI Demand Forecast: Predictive analytics helping pharmacies manage stock and minimize waste.

Data Export & Audit: Export comprehensive sales and inventory reports in Excel (.xls) and PDF formats.

🛠️ Tech Stack (Recommended Architecture)
Frontend: React / Next.js / Tailwind CSS for a responsive, minimalist, and clean UI/UX.

State Management & i18n: Context API / Redux Toolkit, react-i18next for localization.

Backend: Node.js with Express (or Python FastAPI).

Database & Real-time Sync: PostgreSQL / MongoDB with WebSockets or Firebase for live admin order sync and delivery updates.

Maps & Geolocation: Google Maps API.

📂 Project Structure
Plaintext
medifinds/
├── client/                     # Frontend Application
│   ├── public/                 # Static Assets & Logos
│   └── src/
│       ├── components/         # Reusable UI (Collapsible Sidebar, Cards, Modals)
│       ├── contexts/           # ThemeContext, LanguageContext, AuthContext
│       ├── pages/              # Customer Portal & Admin Portal views
│       └── styles/             # Global CSS & Tailwind configuration
├── server/                     # Backend API & WebSockets
│   ├── models/                 # Database Schemas (Users, Medicines, Orders, Vault)
│   ├── routes/                 # API Endpoints (Auth, Cart, Inventory, Wallet)
│   └── utils/                  # AI Demand Forecast & Export Helpers
└── README.md
⚙️ Getting Started & Installation
Clone the Repository:

Bash
git clone https://github.com/your-username/medifinds.git
cd medifinds
Install Dependencies (Client & Server):

Bash
# Install root/server dependencies
npm install

# Install client dependencies
cd client
npm install
Configure Environment Variables:
Create a .env file in the root directory and configure your database URI, Google OAuth client keys, and Google Maps API key.

Run the Application:

Bash
# Run backend server
npm run server

# Run client application
cd client
npm run start
