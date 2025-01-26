# Atlantis Art Gallery

A sophisticated online art gallery platform specializing in Atlantean-themed artwork, built with React, TypeScript, Tailwind CSS, and Supabase.

## 🌊 Overview

Atlantis Art Gallery is a full-featured e-commerce platform that allows art collectors to browse, inquire about, and purchase exclusive Atlantean-themed artwork. The platform includes both public-facing gallery features and an administrative interface for managing the collection.

## 🔧 Technical Stack

- **Frontend:**
  - React 18.3
  - TypeScript 5.5
  - Tailwind CSS 3.4
  - Vite 5.4
  - React Router DOM 6.22
  - Lucide React (for icons)

- **Backend/Database:**
  - Supabase (PostgreSQL)
  - Row Level Security (RLS)
  - Email.js for contact form

- **Payment Processing:**
  - Stripe integration (configured through payment links)

## 📋 Requirements

- Node.js 18+
- npm 9+
- Supabase account
- Email.js account
- Stripe account (for payment processing)

## 🚀 Getting Started

1. **Clone the repository**

```bash
git clone [repository-url]
cd atlantis-art-gallery
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start the development server**

```bash
npm run dev
```

## 🗄️ Database Schema

### Tables

1. **paintings**
   - `id` (uuid, primary key)
   - `title` (text)
   - `artist` (text)
   - `description` (text)
   - `price` (numeric)
   - `dimensions` (text)
   - `medium` (text)
   - `year` (text)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

2. **painting_images**
   - `id` (uuid, primary key)
   - `painting_id` (uuid, foreign key)
   - `url` (text)
   - `order` (integer)
   - `created_at` (timestamptz)

3. **painting_reports**
   - `id` (uuid, primary key)
   - `painting_id` (uuid, foreign key)
   - `url` (text)
   - `created_at` (timestamptz)

### Row Level Security (RLS)

- Public users: Read-only access to all tables
- Authenticated users: Full CRUD access to all tables

## 🔐 Authentication

The application uses Supabase Authentication with email/password login for administrative access.

### Admin Routes
- `/login` - Admin login page
- `/admin` - Admin dashboard (protected route)

## 📱 Components

### Pages
1. **Gallery** (`src/pages/Gallery.tsx`)
   - Main landing page
   - Displays all paintings in a grid layout
   - Features hero section with video background

2. **PaintingDetail** (`src/pages/PaintingDetail.tsx`)
   - Individual painting view
   - Image gallery
   - Painting details
   - Purchase button
   - Contact form
   - PDF report viewer

3. **Admin** (`src/pages/Admin.tsx`)
   - Protected admin dashboard
   - CRUD operations for paintings
   - Image management
   - PDF report management

4. **Login** (`src/pages/Login.tsx`)
   - Admin authentication

### Reusable Components
1. **Header** (`src/components/Header.tsx`)
   - Navigation component
   - Logo
   - Menu items

2. **PaintingCard** (`src/components/PaintingCard.tsx`)
   - Card component for painting preview
   - Used in gallery grid

3. **ContactForm** (`src/components/ContactForm.tsx`)
   - Inquiry form for paintings
   - Email.js integration

4. **PaintingForm** (`src/components/PaintingForm.tsx`)
   - Form for adding/editing paintings
   - Handles multiple images
   - PDF report upload

## 📡 API Integration

### Supabase Queries

1. **Gallery Paintings**
```typescript
const { data: paintingsData } = await supabase
  .from('paintings')
  .select(`
    *,
    painting_images (url, order),
    painting_reports (url)
  `)
  .order('created_at', { ascending: false });
```

2. **Single Painting**
```typescript
const { data: paintingData } = await supabase
  .from('paintings')
  .select(`
    *,
    painting_images (url, order),
    painting_reports (url)
  `)
  .eq('id', id)
  .single();
```

### Email.js Integration

Contact form configuration required in `src/components/ContactForm.tsx`:
```typescript
emailjs.sendForm(
  'YOUR_SERVICE_ID',
  'YOUR_TEMPLATE_ID',
  form,
  'YOUR_PUBLIC_KEY'
);
```

## 🎨 Styling

The project uses Tailwind CSS for styling with a custom color scheme focused on cyan and blue tones. Key color classes:

- Primary: `bg-cyan-600`, `text-cyan-600`
- Secondary: `bg-blue-900`
- Accents: `cyan-300`, `cyan-700`
- Backgrounds: `gray-50`, `gray-100`

## 🛠️ Development Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

## 📦 Production Build

1. Build the application:
```bash
npm run build
```

2. Preview the build:
```bash
npm run preview
```

## 🔍 Type Definitions

Key types are defined in `src/types.ts`:

```typescript
interface Painting {
  id: string;
  title: string;
  artist: string;
  description: string;
  price: number;
  imageUrls: string[];
  stripePaymentLink: string;
  dimensions: string;
  medium: string;
  year: string;
  pdfReport: string;
}
```

## 🚨 Error Handling

The application implements comprehensive error handling:
- Form validation
- API error handling
- Authentication error handling
- Loading states
- File upload validation

## 🔄 State Management

- Local state management using React hooks
- Supabase real-time subscriptions for data updates
- Form state handling with controlled components

## 🌐 Deployment

The application can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.