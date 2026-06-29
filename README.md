# StockSense - Smart Inventory Tracker

## Overview

StockSense is a full-stack inventory management system designed for small and medium-sized businesses. It provides real-time inventory tracking, sales management, stock monitoring, dashboard analytics, and an AI-powered assistant that allows users to query inventory data using natural language.

The application consists of:

- Frontend: Next.js
- Backend: FastAPI
- Database: MySQL
- Authentication: JWT
- AI Assistant: Local Intent Engine + Context Engine + Hyperbolic LLM Fallback

---

## Features

### Inventory Management

- Create products
- Update products
- Delete products
- Track inventory quantities
- Monitor reorder levels
- View low-stock products
- View out-of-stock products

### Sales Management

- Record sales
- Automatically reduce inventory after sales
- Track revenue
- Monitor sales trends

### Dashboard Analytics

- Total products
- Total inventory units
- Low stock alerts
- Sales today
- Sales this month
- Revenue today
- Revenue this month
- Best-selling products
<img width="1366" height="758" alt="smart inventory page 1" src="https://github.com/user-attachments/assets/ae2370d0-1826-4ce7-bf24-18317b9e22b2" />
<img width="1354" height="639" alt="smart inventory page 2" src="https://github.com/user-attachments/assets/e97150a5-46d2-4a36-b91a-a4f681336f90" />
<img width="978" height="630" alt="smart inventory page 3" src="https://github.com/user-attachments/assets/802f65b1-580a-4b82-bc75-f86c73c748e6" />

<img width="960" height="534" alt="smart inventory page 4" src="https://github.com/user-attachments/assets/684e8628-9a27-47a1-af26-e26782b57674" />



### AI Assistant

Ask questions in natural language:

- What is my best-selling product?
- Which products are low in stock?
- How many products were sold today?
- How many products were sold yesterday?
- What is the revenue this month?
- What is the stock remaining for Coca Cola?
- What is the price of Coca Cola?
- When will Rice run out?

The AI assistant uses:

1. Context Resolution
2. Local Intent Matching
3. Hyperbolic LLM Fallback

---

# Project Structure

```text
StockSense/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── hooks/
│   ├── public/
│   ├── package.json
│   └── next.config.ts
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

# Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- ShadCN UI
- Axios

## Backend

- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication
- MySQL
- Hyperbolic API

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/stocksense.git

cd stocksense
```

---

# Backend Setup

Navigate to backend directory:

```bash
cd backend
```

Create virtual environment:

```bash
python -m venv .venv
```

Activate virtual environment.

### macOS/Linux

```bash
source .venv/bin/activate
```

### Windows

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# Backend Environment Variables

Create a `.env` file inside the backend folder:

```env
APP_NAME=StockSense

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=inventory_db

JWT_SECRET_KEY=your_secret_key

HYPERBOLIC_API_KEY=your_hyperbolic_api_key
```

---

# Start Backend Server

```bash
uvicorn app.main:app --reload
```

Backend runs on:

```text
http://localhost:8000
```

Swagger documentation:

```text
http://localhost:8000/docs
```

---

# Frontend Setup

Navigate to frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

or

```bash
pnpm install
```

---

# Frontend Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

# Start Frontend

```bash
npm run dev
```

or

```bash
pnpm dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

# API Endpoints

## Authentication

### Register

```http
POST /api/v1/auth/register
```

### Login

```http
POST /api/v1/auth/login
```

---

## Products

### Get Products

```http
GET /api/v1/products
```

### Create Product

```http
POST /api/v1/products
```

### Update Product

```http
PUT /api/v1/products/{id}
```

### Delete Product

```http
DELETE /api/v1/products/{id}
```

---

## Sales

### Create Sale

```http
POST /api/v1/sales
```

### Get Sales

```http
GET /api/v1/sales
```

---

## Dashboard

### Dashboard Summary

```http
GET /api/v1/dashboard
```

### Recent Activities

```http
GET /api/v1/dashboard/activities
```

### Low Stock Products

```http
GET /api/v1/dashboard/low-stock
```

---

## AI Assistant

### Query AI

```http
POST /api/v1/ai/query
```

Request:

```json
{
  "question": "What is my best selling product?",
  "history": []
}
```

Response:

```json
{
  "answer": "Coca Cola is the best selling product with 60 units sold."
}
```

---

# AI Architecture

The AI assistant follows a three-stage pipeline.

## Stage 1: Context Resolution

Handles follow-up questions such as:

```text
What is my best selling product?

Coca Cola is the best selling product.

Price of it?
```

The assistant resolves "it" to "Coca Cola".

---

## Stage 2: Local Intent Engine

Uses phrase matching and regular expressions for fast execution.

Examples:

```text
How many products were sold today?
```

```json
{
  "intent": "sales_today"
}
```

```text
Price of Coca Cola
```

```json
{
  "intent": "product_price",
  "product_name": "Coca Cola"
}
```

---

## Stage 3: Hyperbolic LLM

When no local intent is found:

```text
NO LOCAL MATCH
↓
Hyperbolic API
↓
Intent Extraction
↓
Database Query
↓
Answer
```

---

# Production Deployment

## Frontend

Recommended:

- Vercel
- Render
- Netlify

Build:

```bash
npm run build
```

Start:

```bash
npm run start
```

---

## Backend

Recommended:

- Render
- Railway
- Fly.io
- DigitalOcean

Production server:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

# Security

- JWT Authentication
- Password Hashing
- Protected Routes
- Environment Variable Secrets
- Database Validation
- Request Validation via Pydantic

---

# Future Improvements

- Barcode Scanning
- Supplier Management
- Purchase Orders
- Advanced Forecasting
- Multi-Store Inventory
- Email Notifications
- WhatsApp Alerts
- AI Analytics Dashboard

---

# License

MIT License

---

# Author

Group 7

BuildLabs Capstone Project

StockSense Smart Inventory Tracker
