# Unpaid UI

A production-grade React application with a scalable, professional folder structure.

## 🚀 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Vitest** - Testing framework
- **ESLint & Prettier** - Code quality and formatting

## 📁 Project Structure

```
src/
├── assets/          # Static assets (images, icons)
├── components/      # Reusable React components
│   ├── common/      # Shared components (Card, Modal, etc.)
│   ├── ui/          # Base UI components (Button, Input, etc.)
│   ├── layout/      # Layout components (Header, Footer, etc.)
│   └── forms/       # Form-specific components
├── context/         # React context providers
├── hooks/           # Custom React hooks
├── pages/           # Page-level components
├── services/        # API and external service integrations
│   ├── api/         # API client and endpoints
│   ├── auth/        # Authentication services
│   └── data/        # Data transformation services
├── store/           # State management (Redux, Zustand, etc.)
├── router/          # Route configuration
├── utils/           # Utility functions
├── constants/       # Application constants
├── types/           # TypeScript type definitions
├── config/          # Configuration files
└── styles/          # Global styles and CSS
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run test         # Run tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
npm run type-check   # Run TypeScript type checking
```

## 🧪 Testing

The project uses Vitest for testing. Tests should be placed in `__tests__` directory or co-located with components using `.test.tsx` or `.spec.tsx` suffix.

## 📝 Code Style

- **ESLint** - Enforces code quality and best practices
- **Prettier** - Ensures consistent code formatting
- **TypeScript** - Provides type safety

Run `npm run lint:fix` and `npm run format` before committing.

## 🎨 Features

- ⚡ Fast development with Vite
- 🔒 Type-safe with TypeScript
- 🎨 Component-based architecture
- 🌙 Dark mode support
- 📱 Responsive design
- 🧪 Comprehensive testing setup
- 🗂️ Organized folder structure

## 📄 License

MIT
