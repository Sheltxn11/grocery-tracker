# Grocery Tracker - Frontend

A modern, beautiful React-based grocery expense tracking application with real-time data from MongoDB backend.

## Features

- 📊 **Real-time Expense Tracking** - Track purchases and payments with live updates
- 📈 **Visual Analytics** - Beautiful charts showing balance trends and purchase/payment comparisons
- 🎯 **Year-based Organization** - Automatic year collection management
- 💰 **Balance Tracking** - Running balance that carries over month-to-month and year-to-year
- 🎨 **Modern UI** - Glass-morphism design with smooth animations
- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop

## Setup

### Prerequisites
- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Backend server running (Flask + MongoDB)

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the frontend directory
cd frontend

# Step 3: Install dependencies
npm install
# or with bun
bun install

# Step 4: Configure environment
cp .env.example .env
# Edit .env and set your backend URL

# Step 5: Start the development server
npm run dev
# or with bun
bun dev
```

### Environment Configuration

Create a `.env` file with:

```env
VITE_API_URL=http://localhost:10000
```

Update this URL to your deployed backend in production.

## Backend Integration

The app connects to a Flask backend with MongoDB. Make sure your backend is running before starting the frontend.

**API Endpoints Used:**
- `GET /api/monthly-data?year={year}` - Fetch all months for a specific year
- `POST /api/transactions` - Add a new purchase or payment

## Technologies Used

This project is built with:

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **shadcn-ui** - Beautiful component library
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── AddTransactionButton.tsx
│   ├── ExpenseChart.tsx
│   ├── StatCard.tsx
│   └── TransactionList.tsx
├── hooks/              # Custom React hooks
│   └── useExpenseStore.ts  # Main state management
├── pages/              # Page components
│   └── Index.tsx       # Main dashboard
├── types/              # TypeScript type definitions
│   └── expense.ts
└── lib/                # Utilities
    └── utils.ts
```

## Development Notes

- The app automatically fetches data when you change years
- All calculations (balance, totals) are done by the backend
- Transactions are immediately reflected after submission
- Error states are handled gracefully with user-friendly messages
- No dummy data - all data comes from your MongoDB database

## Building for Production

```sh
npm run build
# or
bun build
```

The build output will be in the `dist/` directory.

## Deployment

You can deploy this project to:
- Vercel
- Netlify  
- GitHub Pages
- Any static hosting service

Make sure to update the `VITE_API_URL` environment variable in your deployment platform to point to your production backend.
