# Watchmen Prayer Movement Platform

## Project Overview
A comprehensive humanitarian digital learning platform that empowers spiritual growth through advanced technological solutions, with a focus on interactive training experiences and robust technical infrastructure.

## Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS + shadcn/ui components
- **Authentication**: Passport.js (Local, Google, Facebook, Apple)
- **Deployment**: Replit hosting

## Recent Changes
### August 27, 2025 - Security & Navigation Fixes
✓ Fixed critical security issue where partners had access to admin features
✓ Implemented proper role-based navigation in DashboardLayout  
✓ Partners now only see: Dashboard, Impact Reports, Settings
✓ Fixed routing issue where partners accessed admin dashboard via Impact Reports
✓ Added dedicated Training tab to partner dashboard
✓ Partners can now view training progress directly in their dashboard
✓ Prevented partners from accessing training content through Settings
✓ Created comprehensive ProjectsPage to fix 404 errors when browsing projects
✓ Added full edit/delete functionality for admin prayer events management
✓ Removed "Regional Leader" role option from registration form
✓ Admins retain full access to all management features
✓ Fixed date picker validation issues in project forms
✓ Simplified date handling logic to prevent "Invalid time value" errors
✓ Enhanced CurrentCampaigns component to handle NaN date warnings

### August 17, 2025 - Training System & Responsive Design Fixes
✓ Fixed admin dashboard "Create Training" button to use correct simple form
✓ Replaced complex TrainingFormDialog with working StructuredTrainingDialog
✓ Fixed training section content page TypeScript errors
✓ Corrected progress tracking logic (completed: true instead of false)
✓ Enhanced video player with YouTube, Vimeo, and direct file support
✓ Added proper URL conversion for YouTube embed format
✓ Fixed responsive design across all device sizes
✓ Implemented comprehensive responsive design with fluid typography
✓ Added automatic scroll-to-top functionality for all navigation
✓ Enhanced mobile menu with scroll-to-top on navigation
✓ Fixed broken book cover images with robust fallback system
✓ Enhanced image serving with proper CORS and MIME type headers
✓ Created ImageWithFallback component for deployment-ready image handling

## Project Architecture

### Frontend Structure
- **Pages**: Component-based routing with wouter
- **Components**: Modular UI components with consistent responsive design
- **Layouts**: RootLayout with responsive navbar and footer
- **Styling**: Responsive-first approach with mobile, tablet, and desktop breakpoints

### Responsive Design System
- **Breakpoints**: 
  - Mobile: < 640px
  - Tablet: 640px - 1023px  
  - Desktop: ≥ 1024px
- **Typography**: Fluid scaling using clamp() functions
- **Components**: All major components optimized for all screen sizes
- **Navigation**: Mobile-friendly hamburger menu with slide-out drawer

### Key Features
- Interactive training modules with video content
- Multi-role user system (watchman, partner, admin)
- Prayer event management and participation
- Donation system with Stripe integration
- Dashboard with role-based access control
- Responsive design across all devices

## Development Guidelines
- Use Tailwind CSS classes for responsive design
- Implement mobile-first approach
- Use clamp() functions for fluid typography
- Test on small (320px), medium (768px), and large (1024px+) screens
- Ensure touch-friendly interactions on mobile devices

## User Preferences
- Responsive design is critical for user accessibility
- Clean, modern design aesthetic with spiritual theme
- Focus on user experience across all device types