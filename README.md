# Library Management Frontend

Frontend aplikasi manajemen perpustakaan menggunakan Next.js 16, TypeScript, dan Shadcn UI.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | Shadcn UI (Radix UI) |
| Icons | Lucide React |
| Authentication | NextAuth.js v5 |
| State Management | TanStack Query v5 |
| Form Management | React Hook Form + Zod |
| HTTP Client | Axios |
| Testing | Playwright |

## Features

- ✅ Authentication (Login/Logout)
- ✅ Protected Routes
- ✅ Books CRUD (Create, Read, Update, Delete)
- ✅ Search dengan Debounce
- ✅ Sorting (Judul, Tahun, Stok)
- ✅ Pagination dengan URL Params
- ✅ Cover Image dengan Live Preview
- ✅ Error State Handling
- ✅ Responsive Design
- ✅ E2E Testing

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running di `https://main-story-test-be.vercel.app/api`

### Installation

```bash
# Clone repository
git clone <repository-url>
cd book-management-fe

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
```

### Environment Variables

Buat file `.env.local`:

```env
AUTH_SECRET=your-secret-key-min-32-chars-long
NEXT_PUBLIC_API_URL=https://main-story-test-be.vercel.app/api
```

### Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/          # Login page
│   ├── (dashboard)/
│   │   ├── layout.tsx         # Dashboard layout (Navbar + Sidebar)
│   │   ├── books/page.tsx     # Books CRUD page
│   │   └── page.tsx           # Redirect to /books
│   └── api/auth/              # NextAuth handlers
├── components/
│   ├── books/                 # Book components (Card, Form, Dialogs)
│   ├── shared/                # Shared components (Navbar, Sidebar, etc)
│   ├── providers/             # Context providers
│   └── ui/                    # Shadcn UI components
├── hooks/                     # Custom hooks
├── lib/                       # Utilities (axios, auth, queries)
├── schemas/                   # Zod validation schemas
└── types/                     # TypeScript types
```

## Testing

### E2E Tests (Playwright)

```bash
# Install browsers
npx playwright install

# Run tests
npx playwright test

# Run tests with UI
npx playwright test --ui

# Run specific test
npx playwright test tests/library.spec.ts
```

## API Integration

Frontend terintegrasi dengan backend NestJS:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/books` | GET | Get books (pagination, search, sort) |
| `/api/books` | POST | Create book |
| `/api/books/:id` | GET | Get book by ID |
| `/api/books/:id` | PATCH | Update book |
| `/api/books/:id` | DELETE | Delete book |

## License

MIT
