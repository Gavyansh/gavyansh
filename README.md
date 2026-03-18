# Gavyansh Premium Desi Cow Ghee

E-commerce website for Gavyansh Vedic Ghee – premium A2 Desi Cow Ghee, traditionally churned using the Bilona method.

## Features

- **Products**: Browse A2 Vedic Bilona Ghee and Gir Cow Ghee
- **Cart**: Add to cart, quantity control, localStorage persistence
- **Checkout**: Place orders with customer details; email confirmations (when configured)
- **Contact**: Contact form with backend submission and email alerts
- **Order & Contact Storage**: Data saved locally in `data/` for records

## Prerequisites

- Node.js 18+
- npm or yarn

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   - Copy `.env.example` to `.env`
   - Set `EMAIL_USER` and `EMAIL_PASS` (Gmail App Password) for order & contact emails
   - For Gmail 2FA: use an [App Password](https://support.google.com/accounts/answer/185833)

## Run Locally

### Development (hot reload)
```bash
npm run dev
```
Opens at **http://localhost:3000**

### Production build & serve (local deployment)
```bash
npm run serve
```
Builds the frontend and runs the server in production mode at **http://localhost:3000**

### Build only
```bash
npm run build
```

### Start production server (after build)
```bash
npm run start
```

## Backend API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Server health check |
| `/api/products` | GET | Product catalog |
| `/api/checkout` | POST | Place order |
| `/api/contact` | POST | Submit contact form |

## Data Storage

- **Orders**: `data/orders.json` (created on first order)
- **Contacts**: `data/contacts.json` (created on first submission)
- **Products**: `data/products.json` (editable without code changes)

## Project Structure

```
├── server/           # Backend API handlers
│   └── api/
├── src/              # React frontend
├── data/             # JSON storage (orders, contacts, products)
├── server.ts         # Express server entry
└── vite.config.ts
```
