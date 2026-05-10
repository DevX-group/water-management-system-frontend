# Water Management System - Frontend

A modern, responsive web application designed to streamline water utility management. This platform provides a comprehensive suite of tools for customers to monitor consumption and for administrators to manage billing, inquiries, and analytics.

## Key Features

 **Customer Portal**
- Interactive Dashboard: View real-time usage trends with Bar, Pie, and Mixed charts.
- Billing Management: Access billing history, view current dues, and upload payment proof.
- Meter Readings: User-friendly interface for submitting monthly meter readings with built-in validation.
- Inquiry System: Direct support channel with categorized inquiries and real-time status tracking.
- Notifications:  Integrated notification hub for bill alerts and system updates.

 **Administrator Portal**
- Business Intelligence: High-level overview of total income, overdue accounts, and peak usage.
- User & Subscription Management: Manage customer accounts and connection types (Metered/Non-metered).
- Service Desk: Respond to and resolve customer inquiries via a centralized management interface.
- Reporting: Generate and export detailed usage and financial reports.

## Tech Stack

- Framework: React 18 (TypeScript)
- Build Tool: Vite
- UI Components: Shadcn UI + Radix UI
- Styling: Tailwind CSS
- Icons:Lucide React
- State Management: React Context API

## Getting Started

1.Clone the repository :
   
git clone [https://github.com/kaweeshaweerasinghe/water-management-system-frontend.git]

2.Install dependencies:  npm install
3.Run the development server:  npm run dev

## Project Structure:
src/
├── components/     # Reusable UI components (Layout, UI, Charts)
├── contexts/       # React Context providers (Auth, Admin)
├── data/           # Mock data and constants
├── hooks/          # Custom React hooks (useInquiries, useToast)
├── lib/            # Utility functions (shadcn/ui utils)
├── pages/          # Full page components
├── services/       # API service layers
├── types/          # TypeScript interfaces/types
└── util/           # Helper scripts (PDF export, etc.)