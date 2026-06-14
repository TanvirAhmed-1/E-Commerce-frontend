# Modern E-Commerce & POS Admin Dashboard Frontend

A state-of-the-art, high-performance, and visually stunning e-commerce frontend built using Next.js 16 (App Router), TypeScript, and Tailwind CSS. The application is integrated with a secure local authentication system (JWT + HttpOnly Cookies) and a Redux Toolkit state management store.

## 🚀 Key Features

### 🎨 Visuals & Aesthetics
* **Starry Night Animations:** Interactive animated starry backgrounds utilizing `framer-motion` on login and signup paths.
* **Premium Product Sliders:** Smooth, crossfading product showcases with detailed descriptions built using Framer Motion's `AnimatePresence`.
* **Plus Jakarta Sans Typography:** Styled with the modern, high-end *Plus Jakarta Sans* typeface optimized for reading and interface readability.
* **Responsive Layout:** Pixel-perfect presentation spanning ultra-wide desktop monitors down to mobile viewport widths.

### 🔑 Authentication & Security
* **Credential-Based Login & Signup:** Secured proxy route handlers (`/api/login`, `/api/sign-up`, `/api/logout`) communicating with the backend.
* **HttpOnly Session Cookies:** JWT authentication tokens are safely stored in secure, server-managed HttpOnly cookies, protecting the client from XSS exploits.
* **Google OAuth Ready:** Pre-designed social sign-in interface containing branding assets for google authentication.

### ⚙️ State Management & APIs
* **Redux Toolkit & RTK Query:** Complete application state sync and cache management using Redux Base Slices.
* **Dynamic Sliders & Carousel:** Direct binding with backend `/sliders` API using the custom `useGetHomeSlidersQuery` hook.
* **Smart Search Overlay:** Real-time search query lookup utilizing debounced user inputs for zero-latency lookup.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 16.2.9](https://nextjs.org) (App Router, SSR, Server Components)
* **Styling:** [Tailwind CSS](https://tailwindcss.com) (Modern design tokens, responsive layout grid)
* **Animation:** [Framer Motion](https://www.framer.com/motion/) (Starry night environment, slide transitions)
* **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/) & [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
* **Forms & Validation:** [React Hook Form](https://react-hook-form.com/) (Zod-compatible validation schemas)
* **Icons:** [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)

---

## 📁 Project Structure

```bash
├── src/
│   ├── app/                      # Next.js App Router (Layouts & Routes)
│   │   ├── (commonLayout)/       # Main website layouts & pages
│   │   ├── api/                  # Proxy API Route handlers (Auth/Sessions)
│   │   ├── login/                # Log in page route
│   │   ├── sign-up/              # Sign up page route
│   │   └── layout.tsx            # Global application shell
│   ├── components/
│   │   ├── shared/               # Reusable components (Navbar, Footer, Input)
│   │   └── ui/                   # Shadcn/Custom base UI elements (Button, Slider)
│   ├── constants/                # Static configuration & dummy layouts
│   ├── lib/
│   │   ├── Providers/            # Redux & Persist context wrappers
│   │   └── utils.ts              # Styling helpers (cn utility)
│   ├── redux/                    # Redux Toolkit store & API slices
│   └── utils/                    # Common helper utilities (getImageUrl, stars)
```

---

## ⚙️ Configuration & Environment

To run this application locally, ensure you create a `.env.local` file in the root directory:

```env
# URL pointing to your backend API server
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api
```

---

## 🏃‍♂️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Launch Local Development Server
```bash
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) (or your designated port) inside your web browser.

### 3. Build Production Bundle
```bash
npm run build
```
This command compiles the frontend into static assets and optimized pages inside the `.next` directory.
