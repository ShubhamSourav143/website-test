# Website Test Project

A modern, responsive website testing project built with Next.js, TypeScript, and Tailwind CSS. This is a learning/testing environment for implementing authentication, membership systems, and modern web development practices.

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

The app works without a database using fallback data, but you can set up Supabase for full functionality. This project uses a separate Supabase instance for testing purposes:

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key

### 2. Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_USE_FAKE_PAYMENTS=true
```

### 3. Run Database Migration

Run all migrations in your Supabase SQL editor (in order):

1. `supabase/migrations/20250628185827_calm_frog.sql`
2. `supabase/migrations/20250810120000_membership.sql`
3. `supabase/migrations/20250811000100_articles_quiz.sql`

These create initial content tables, `profiles` and `membership_payments` with secure RLS policies, plus Articles (posts/likes/comments/follows) and Quiz (quizzes/questions/attempts). The quiz migration seeds one public quiz with a sample question.

## 📱 Pages

- **Home** (`/`): Landing page with hero section, stats, and mission
- **Adopt** (`/adopt`): Browse adoptable animals and permanent care residents
- **Donate** (`/donate`): Donation page with impact areas and payment options
- **Stories** (`/blog`): Blog posts about rescues and organization updates
- **Help** (`/help`): Contact information, FAQs, and volunteer opportunities
- **Dashboard** (`/dashboard`): User dashboard for authenticated members
- **Profile** (`/profile`): User profile and settings management
- **Login/Register** (`/login`, `/register`): Authentication pages
- **Membership** (`/membership`): Membership onboarding and payment simulation

## 🧭 Navigation & Layout

- Site-wide navigation is defined in the App Router layout and client header/sidebar.
- Guests: Header shows a "Join" button. Sidebar shows public routes.
- Authenticated users: Header shows a profile dropdown (Profile/Settings, Logout). Sidebar includes: Dashboard, Articles, Quiz, Foster, Feed, Profile, plus public routes.
- Sidebar is fixed on desktop and becomes a slide-out drawer on mobile.

## 📝 Articles (Posts)

- Data model: `posts`, `post_likes`, `comments`, `follows`, `profiles.public_posts`.
- RLS: Everyone can read public posts; members can create posts and interact (like/comment); authors can edit/delete their posts.
- UI:
  - List: `app/articles/page.tsx`
  - View: `app/articles/[id]/page.tsx` (with like/unlike)
  - New: `app/articles/new/page.tsx` (redirects non-members to membership)

## 🧩 Quiz System

- Data model: `quizzes`, `quiz_questions`, `quiz_attempts`.
- RLS: Public can read public quizzes/questions; members can access member-only quizzes; attempts require auth (and membership if member-only).
- UI:
  - List: `app/quiz/page.tsx`
  - Take: `app/quiz/[id]/page.tsx`
  - Results: `app/quiz/results/[attemptId]/page.tsx` (shows percentile)
- **Articles** (`/articles`): Public posts listing. Members can create posts at `/articles/new` and like/comment. 
- **Quiz** (`/quiz`): Quiz list and taking quizzes. Some quizzes may be members-only. Results at `/quiz/results/[attemptId]`.

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

- Global styles: `app/globals.css`
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

- `NEXT_PUBLIC_USE_FAKE_PAYMENTS` defaults to enabled unless set to `false`.
- When enabled, the site accepts payment codes like `R500` anywhere code input is supported.
- Membership accepts codes with minimum `R199`.

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

This is a testing/learning project. The actual implementation will be used for a different organization website.