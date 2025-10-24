# 🦷 WD Dental EHR - Electronic Health Records System

A modern, comprehensive dental practice management system built with React, TypeScript, and Supabase.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ecf8e)](https://supabase.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)](https://tailwindcss.com/)

---

## 🌟 Features

### 👨‍⚕️ **Clinical Workflows**
- ✅ **Patient Management** - Comprehensive patient records with demographics, medical history, and consent tracking
- ✅ **Dental Charting** - Interactive tooth diagram with FDI notation, findings, and color-coded status
- ✅ **Exam Forms** - Structured clinical examination with chief complaints, vitals, and dental assessments
- ✅ **Treatment Planning** - Multi-procedure treatment plans with cost estimates and status tracking
- ✅ **Odontogram** - Visual tooth mapping with surface-level findings
- 🚧 **Appointment Scheduling** - Calendar-based scheduling (in development)
- 🚧 **Billing & Invoicing** - Treatment invoicing and payment tracking (in development)

### 🏥 **Multi-Tenancy & Roles**
- **3-Level Hierarchy**: Walking Doctor (Parent) → Branch → Clinic
- **Role-Based Access Control (RBAC)**:
  - 🏥 Walking Doctor (Super Admin)
  - 🏢 Branch Owner
  - 🏪 Clinic Owner
  - 👨‍⚕️ Doctor
  - 💼 Front Desk
  - 🦷 Hygienist
  - 🩺 Assistant
- Data isolation per clinic with cross-clinic access for authorized roles

### 🔐 **Authentication & Security**
- Supabase Authentication with JWT tokens
- Role-based routing and dashboard access
- Secure environment variable management
- Row-level security ready

### 🎨 **Modern UI/UX**
- Responsive design for desktop, tablet, and mobile
- Beautiful gradient themes
- Smooth animations and transitions
- Accessible components (shadcn/ui)
- Intuitive navigation with role-specific sidebars

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Supabase** account (free tier available)
- **Git**

### 1️⃣ Clone Repository
```bash
git clone https://github.com/lijeuki/WDV2.git
cd WDV2
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Setup Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your Supabase credentials
# Get from: https://supabase.com/dashboard/project/_/settings/api
```

### 4️⃣ Setup Database
Follow the instructions in [`MANUAL_MIGRATION_GUIDE.md`](./MANUAL_MIGRATION_GUIDE.md) to:
1. Run the database schema migration
2. Populate seed data
3. Create demo user accounts

### 5️⃣ Setup Authentication
Follow [`AUTHENTICATION_SETUP.md`](./AUTHENTICATION_SETUP.md) to create demo accounts for all roles.

### 6️⃣ Start Development Server
```bash
npm run dev
```

Visit: http://localhost:5173

---

## 📁 Project Structure

```
WDV2/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components (shadcn/ui)
│   │   ├── forms/           # Clinical form components
│   │   ├── dental/          # Dental-specific components (charting, odontogram)
│   │   └── layouts/         # Layout components (DashboardLayout)
│   ├── pages/
│   │   ├── auth/            # Login page
│   │   ├── doctor/          # Doctor dashboard & workflows
│   │   └── front-desk/      # Front desk dashboard
│   ├── lib/
│   │   ├── auth/            # Authentication logic (Supabase Auth)
│   │   ├── supabase/        # Supabase client & utilities
│   │   └── api/             # API helper functions
│   └── types/               # TypeScript type definitions
├── supabase/
│   ├── migrations/          # Database schema migrations
│   └── seed_data.sql        # Initial seed data
├── public/                  # Static assets
└── docs/                    # Additional documentation
```

---

## 🧪 Demo Accounts

### Currently Implemented Dashboards:

#### ✅ **Doctor** - `doctor@clinic.com`
- Full patient list with search and filtering
- Clinical exam forms with dental charting
- Interactive odontogram with FDI notation
- Treatment planning with cost estimates
- Patient medical history and consent tracking

#### ✅ **Front Desk** - `desk@clinic.com`
- Appointment management dashboard
- Patient check-in and queue management
- Quick patient registration
- Billing overview

### 🚧 In Development:
- Walking Doctor dashboard (Super Admin)
- Branch Owner dashboard (Multi-clinic management)
- Clinic Owner dashboard (Clinic operations)
- Hygienist & Assistant workflows

**Setup Instructions**: See [`AUTHENTICATION_SETUP.md`](./AUTHENTICATION_SETUP.md) for detailed account creation steps.

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | TailwindCSS, shadcn/ui |
| **Backend** | Supabase (PostgreSQL, Auth, Storage) |
| **Routing** | React Router v6 |
| **State Management** | React Context API |
| **Date/Time** | date-fns |
| **Icons** | Lucide React |
| **Build** | Vite (ESBuild) |

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [`AUTHENTICATION_SETUP.md`](./AUTHENTICATION_SETUP.md) | **NEW** - Complete guide to setting up all user roles and demo accounts |
| [`MANUAL_MIGRATION_GUIDE.md`](./MANUAL_MIGRATION_GUIDE.md) | Database schema setup instructions |
| [`DEPLOYMENT_SUCCESS.md`](./DEPLOYMENT_SUCCESS.md) | Deployment checklist and info |
| [`QUICK_START.md`](./QUICK_START.md) | Quick start guide for developers |
| [`docs/ROLE_BASED_SYSTEM.md`](./docs/ROLE_BASED_SYSTEM.md) | Role definitions and dashboards |
| [`docs/ROLE_PERMISSIONS_MATRIX.md`](./docs/ROLE_PERMISSIONS_MATRIX.md) | Permissions matrix |
| [`docs/HighLevelArchi.md`](./docs/HighLevelArchi.md) | System architecture overview |

---

## 🔧 Development

### Available Scripts
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

### Code Quality
- ESLint configured for React + TypeScript
- TypeScript strict mode enabled
- Component-based architecture
- Consistent code formatting

---

## 🌐 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

Configuration file: [`vercel.json`](./vercel.json)

### Environment Variables for Production
Add these to your hosting platform:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

**Security Note**: Never commit `.env` files to git. Use `.env.example` as a template.

---

## 📋 Roadmap

### ✅ Phase 1 - Foundation (Complete)
- [x] Project setup with Vite + React + TypeScript
- [x] Supabase integration (Auth + Database)
- [x] Authentication system with role-based routing
- [x] Database schema (15 tables)
- [x] Base UI components library

### ✅ Phase 2 - Core Clinical Workflows (Complete)
- [x] Doctor dashboard
- [x] Patient management
- [x] Clinical exam forms
- [x] Dental charting with FDI notation
- [x] Treatment planning
- [x] Front desk dashboard

### 🚧 Phase 3 - Business Operations (In Progress)
- [ ] Appointment scheduling with calendar
- [ ] Billing & invoicing
- [ ] Payment tracking
- [ ] Insurance management
- [ ] Reporting & analytics

### 📋 Phase 4 - Advanced Features (Planned)
- [ ] Digital X-ray viewer
- [ ] Document management (consent forms, reports)
- [ ] Multi-language support (English, Indonesian)
- [ ] SMS/Email notifications
- [ ] Mobile app (React Native)
- [ ] Telemedicine features

### 🔐 Phase 5 - Enterprise Features (Planned)
- [ ] Advanced RBAC with custom permissions
- [ ] Audit logs and compliance
- [ ] Data export/import
- [ ] API for third-party integrations
- [ ] Advanced analytics dashboard
- [ ] Multi-clinic synchronization

---

## 🎯 Current Development Status

### Fully Functional:
- ✅ Authentication system (7 role types supported)
- ✅ Doctor dashboard with complete patient workflows
- ✅ Front desk dashboard with appointment management
- ✅ Patient management (CRUD operations)
- ✅ Clinical exam forms
- ✅ Dental charting (FDI notation)
- ✅ Treatment planning
- ✅ Database schema (15 tables)

### In Progress:
- 🚧 Walking Doctor dashboard
- 🚧 Branch Owner dashboard
- 🚧 Clinic Owner dashboard
- 🚧 Calendar-based appointment scheduling
- 🚧 Billing & invoicing workflows

### Pending:
- 📋 Image upload (X-rays, photos)
- 📋 Document management
- 📋 Reporting & analytics
- 📋 SMS/Email notifications

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software developed for Walking Doctors Indonesia.

---

## 👥 Team

**Walking Doctors Indonesia**
- Email: admin@walkingdoctors.co.id
- Website: [Coming Soon]

---

## 🐛 Known Issues

1. **Appointment calendar** - Calendar component needs optimization for better performance
2. **Image upload** - Supabase Storage integration for X-rays and photos pending
3. **Print functionality** - Treatment plans and invoices need print-friendly layouts
4. **Mobile responsiveness** - Some clinical forms need mobile layout adjustments
5. **Role dashboards** - Walking Doctor, Branch Owner, Clinic Owner dashboards in development

See [Issues](https://github.com/lijeuki/WDV2/issues) for full list.

---

## 📞 Support

- **Documentation**: Check the `/docs` folder and markdown files in root
- **Issues**: [GitHub Issues](https://github.com/lijeuki/WDV2/issues)
- **Setup Help**: See `AUTHENTICATION_SETUP.md` and `MANUAL_MIGRATION_GUIDE.md`

---

## 🎉 Acknowledgments

- [Supabase](https://supabase.com/) - Backend infrastructure
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [TailwindCSS](https://tailwindcss.com/) - Styling framework
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Vite](https://vitejs.dev/) - Build tool
- [React Router](https://reactrouter.com/) - Routing

---

## 🔗 Figma Design

View the original design: [Atomic Design for EHR System](https://www.figma.com/design/FouxV3d1VLAzkTkZ82vByj/Atomic-Design-for-EHR-System)

---

**Last Updated**: October 24, 2025  
**Version**: 1.0.0  
**Status**: 🚧 Active Development

---

## ⚠️ Important Notes

### Authentication Status
The system is configured for **7 user roles** but currently **only 2 roles have fully implemented dashboards**:
- ✅ **Doctor** - Complete workflows
- ✅ **Front Desk** - Complete workflows

Other roles (Walking Doctor, Branch Owner, Clinic Owner, Hygienist, Assistant) have:
- ✅ Authentication routing configured
- ✅ Database schema ready
- 🚧 Dashboards pending development

**To test the system**: Use `doctor@clinic.com` or `desk@clinic.com` accounts (see `AUTHENTICATION_SETUP.md` for setup).

### Data Access
All demo accounts can access data correctly when:
1. Database schema is migrated (see `MANUAL_MIGRATION_GUIDE.md`)
2. Seed data is populated
3. Auth users are linked to the `users` table
4. Proper clinic/branch associations are set

The authentication system handles role-based routing automatically after login.
