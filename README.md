# IIT KGP Animal Welfare Website

A modern, responsive website for IIT Kharagpur Animal Welfare NGO built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Responsive Design**: Works perfectly on all devices
- **Modern UI**: Clean, professional design with smooth animations
- **Database Integration**: Ready for Supabase integration
- **Type Safety**: Full TypeScript support
- **Optimized Performance**: Fast loading with optimized images
- **SEO Friendly**: Proper meta tags and structure

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (optional)
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── adopt/             # Adoption page
│   ├── blog/              # Blog pages
│   ├── donate/            # Donation page
│   ├── help/              # Help & contact page
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # UI components
│   ├── layout/           # Layout components
│   └── ...               # Other components
├── lib/                  # Utilities and configurations
│   ├── supabase.ts       # Database client
│   └── constants.ts      # App constants
├── hooks/                # Custom React hooks
├── styles/               # Global styles
└── supabase/            # Database migrations
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🗄️ Database Setup (Optional)

The app works without a database using fallback data, but you can set up Supabase for full functionality:

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key

### 2. Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Database Migration

Run these migrations in Supabase SQL Editor (in order):

1. `supabase/migrations/20250628185827_calm_frog.sql`
2. `supabase/migrations/20250810120000_membership.sql`

These add content tables and membership (`profiles`, `membership_payments`) with RLS.

## 📱 Pages

- **Home** (`/`): Landing page with hero section, stats, and mission
- **Adopt** (`/adopt`): Browse adoptable animals and permanent care residents
- **Donate** (`/donate`): Donation page with impact areas and payment options
- **Stories** (`/blog`): Blog posts about rescues and organization updates
- **Help** (`/help`): Contact information, FAQs, and volunteer opportunities

## 🎨 Customization

### Update Content

Edit constants in `lib/constants.ts`:

```typescript
export const APP_CONFIG = {
  name: 'Your Organization Name',
  tagline: 'Your Tagline',
  // ... other settings
}
```

### Add New Pages

1. Create a new folder in `app/`
2. Add a `page.tsx` file
3. Update navigation in `lib/constants.ts`

### Modify Styling

- Global styles: `styles/globals.css`
- Component styles: Use Tailwind classes
- Custom animations: Add to `styles/globals.css`

## 🖼️ Images

All images are sourced from Pexels for demonstration. Replace with your actual photos:

1. Update image URLs in components
2. Add images to `public/` folder
3. Update image paths accordingly

## 🔐 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_USE_FAKE_PAYMENTS=true
```

`NEXT_PUBLIC_USE_FAKE_PAYMENTS` toggles the simulated membership payment flow.

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

## 📞 Support

For questions or support, contact the development team or refer to the documentation.

## 📄 License

This project is for IIT Kharagpur Animal Welfare NGO.