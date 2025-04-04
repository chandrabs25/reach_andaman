# Andaman Explorer - Installation Guide

This document provides instructions for installing and running the Andaman Explorer website.

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

## Installation Steps

1. Extract the zip file to your preferred location
2. Navigate to the project directory:
   ```
   cd andaman-travel
   ```
3. Create a `.env.local` file in the root directory with the following content:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret
   ```
4. Install all dependencies:
   ```
   npm install
   ```
5. Build the project:
   ```
   npm run build
   ```
6. Start the development server:
   ```
   npm run dev
   ```
7. Open your browser and navigate to http://localhost:3000

## Admin Access

To access the admin panel:
1. Navigate to http://localhost:3000/admin/login
2. Use the default credentials:
   - Email: admin@example.com
   - Password: password

## Vendor Access

To access the vendor portal:
1. Navigate to http://localhost:3000/vendor
2. Use the default credentials:
   - Email: vendor@example.com
   - Password: password

## Troubleshooting

If you encounter any issues during installation or running the application:

1. Make sure all dependencies are installed correctly:
   ```
   npm install
   ```
2. Clear the Next.js cache:
   ```
   rm -rf .next
   ```
3. Restart the development server:
   ```
   npm run dev
   ```

## Dependencies Added

The following key dependencies have been added to fix UI component errors:

- @radix-ui/react-checkbox
- @radix-ui/react-label
- @radix-ui/react-slot
- @radix-ui/react-tabs
- @radix-ui/react-select
- class-variance-authority
- clsx
- lucide-react
- tailwind-merge
- tailwindcss-animate

These dependencies are required for the UI components used in the admin panel and throughout the application.
#   r e a c h _ a n d a m a n  
 