# StockSense — Smart Inventory Tracker

A modern, AI-powered inventory management frontend built for a university capstone project.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Data fetching | TanStack Query v5 |
| Forms | React Hook Form + Zod |
| HTTP | Axios (JWT interceptor) |
| Auth state | React Context |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the API URL

Create a `.env.local` in the project root (one is already included):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── dashboard/page.tsx
│   ├── products/
│   │   ├── page.tsx            # Product list
│   │   ├── new/page.tsx        # Create product
│   │   └── [id]/
│   │       ├── page.tsx        # Product detail
│   │       └── edit/page.tsx   # Edit product
│   ├── inventory/page.tsx
│   ├── sales/page.tsx
│   └── ai/page.tsx
│
├── components/
│   ├── layout/                 # AppShell, Sidebar, Topbar, ProtectedRoute
│   ├── dashboard/              # StatCard, RecentActivityFeed, LowStockWarning
│   ├── products/               # ProductForm, DeleteConfirmDialog
│   ├── inventory/              # StockForms (AddStockForm, RemoveStockForm)
│   ├── sales/                  # RecordSaleForm
│   ├── ai/                     # ChatWindow, ChatInput
│   └── ui/                     # Base shadcn/ui components
│
├── services/                   # Axios API functions
│   ├── auth.ts
│   ├── products.ts
│   ├── inventory.ts
│   ├── sales.ts
│   ├── dashboard.ts
│   └── ai.ts
│
├── hooks/                      # TanStack Query hooks
│   ├── useProducts.ts
│   ├── useInventory.ts
│   ├── useSales.ts
│   └── useDashboard.ts
│
├── contexts/
│   └── AuthContext.tsx          # JWT auth state
│
├── providers/
│   └── ReactQueryProvider.tsx
│
├── lib/
│   ├── axios.ts                # Axios client + interceptors
│   ├── utils.ts                # cn(), formatCurrency(), etc.
│   └── validations.ts          # Zod schemas
│
└── types/
    └── index.ts                # All TypeScript interfaces
```

---

## Expected FastAPI Endpoints

The frontend expects these REST endpoints from your FastAPI backend:

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/auth/login` | OAuth2 form login → JWT |
| POST | `/auth/register` | Create user |
| GET | `/auth/me` | Get current user |

### Products
| Method | Path | Description |
|---|---|---|
| GET | `/products` | List (paginated, filterable) |
| GET | `/products/{id}` | Single product |
| POST | `/products` | Create |
| PUT | `/products/{id}` | Update |
| DELETE | `/products/{id}` | Delete |
| GET | `/products/categories` | All unique categories |

### Inventory
| Method | Path | Description |
|---|---|---|
| GET | `/inventory/movements` | Paginated history |
| POST | `/inventory/add` | Add stock |
| POST | `/inventory/remove` | Remove stock |

### Sales
| Method | Path | Description |
|---|---|---|
| GET | `/sales` | Paginated history |
| POST | `/sales` | Record sale |

### Dashboard
| Method | Path | Description |
|---|---|---|
| GET | `/dashboard` | Aggregated stats + activity + low-stock |

### AI
| Method | Path | Description |
|---|---|---|
| POST | `/ai/query` | Natural language inventory query |

---

## Features

- **Authentication** — JWT login/register, protected routes, auto-redirect
- **Dashboard** — 6 stat cards, recent activity feed, low-stock warnings
- **Products** — CRUD, search, category filter, pagination, delete modal
- **Inventory** — Add/remove stock modals, full movement history table
- **Sales** — Record sales with estimated total preview, paginated history
- **AI Assistant** — Chat interface with suggestion chips, loading states, clear button
- **Responsive** — Mobile sidebar, responsive tables, works on all screen sizes
