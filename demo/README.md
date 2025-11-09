# Legmint Demo Website

A fully functional demo of the Legmint legal document automation platform built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation & Setup

1. **Navigate to the demo directory:**
   ```bash
   cd demo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## 🌟 Demo Features

### ✅ Complete User Journey
- **Template Discovery**: Browse and filter legal templates by category, jurisdiction, and language
- **Template Details**: View comprehensive template information with sample previews
- **Guided Questionnaire**: Step-by-step form with validation and progress tracking
- **Legal Disclaimers**: Compliant disclaimer modal with consent tracking
- **Document Preview**: Real-time document generation with highlighting and comments
- **Multi-format Export**: Download documents in DOCX, PDF, or HTML formats

### ✅ Template Library
The demo includes 10 fully-specified templates:

**B2B Templates:**
- NDA (Mutual) - ⭐ Featured with complete questionnaire
- NDA (Unilateral)
- Master Service Agreement
- SaaS Subscription Agreement
- Data Processing Agreement (GDPR)
- Statement of Work

**B2C Templates:**
- Terms of Sale (Goods)
- Website Terms of Use

**P2P Templates:**
- Simple Loan Agreement
- Freelance Engagement Letter

### ✅ Advanced Features
- **Smart Filtering**: Dynamic search with category, jurisdiction, and language filters
- **Responsive Design**: Mobile-first design that works on all devices
- **State Management**: Persistent form data with Zustand
- **Validation**: Real-time form validation with helpful error messages
- **Progress Tracking**: Visual progress indicators throughout the journey
- **Risk Assessment**: Color-coded risk levels for each template

## 🎯 User Experience Highlights

### Template Discovery
- Hero section with value proposition
- Featured templates carousel
- Category-based browsing
- Advanced search and filtering
- Template popularity and ratings

### Questionnaire Experience
- Choice between "Guided" and "Professional" modes
- Multi-step form with progress tracking
- Jurisdiction and language selection
- Real-time validation and help text
- Auto-save functionality

### Document Generation
- Live document preview
- Variable highlighting and explanations
- Risk assessment and legal warnings
- Multiple export formats
- Download tracking and security

## 🔧 Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom components
- **Icons**: Heroicons
- **Forms**: React Hook Form with validation
- **State**: Zustand for global state management
- **UI Components**: Headless UI for accessibility

### Key Components

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage with template discovery
│   └── templates/[id]/    # Template detail and generation flow
├── components/            # Reusable UI components
│   ├── Header.tsx         # Navigation header
│   ├── TemplateCard.tsx   # Template display cards
│   ├── SearchFilters.tsx  # Advanced filtering
│   ├── QuestionnaireForm.tsx # Multi-step form
│   └── DisclaimerModal.tsx   # Legal compliance modal
└── lib/                   # Utilities and data
    ├── types.ts           # TypeScript interfaces
    ├── store.ts           # Zustand state management
    └── mockData.ts        # Demo data and templates
```

### Mock Data Structure
- **Templates**: 10 complete template definitions with metadata
- **Questionnaires**: Fully-specified form schemas with validation
- **Jurisdictions**: UK, US-DE, EU-BASE, Germany support
- **Languages**: English (UK/US), German, Czech

## 🎨 Design System

The demo implements a professional design system with:

- **Color Palette**: Primary blue theme with semantic colors
- **Typography**: Clean, readable font hierarchy
- **Components**: Consistent button styles, form elements, and cards
- **Spacing**: Systematic spacing using Tailwind's scale
- **Responsive**: Mobile-first responsive design
- **Accessibility**: WCAG-compliant color contrast and focus states

## 📱 User Flows

### 1. Template Discovery Flow
```
Landing Page → Browse Categories → Filter Templates → View Details → Start Generation
```

### 2. Document Generation Flow
```
Setup (Jurisdiction/Language) → Disclaimer Modal → Questionnaire → Preview → Download
```

### 3. Advanced Features
- Template comparison and related suggestions
- Progress persistence across sessions
- Error handling and validation feedback
- Legal compliance and risk warnings

## 🔒 Legal Compliance Features

### Disclaimer System
- Blocking modal before document generation
- Clear "not legal advice" warnings
- Terms of service and privacy policy consent
- Professional review recommendations

### Risk Management
- Template risk level indicators (Low/Medium/High)
- Jurisdiction-specific legal warnings
- Professional review recommendations
- Document watermarking options

## 🚧 Demo Limitations

This is a frontend demo with mock data. In production, you would need:

- **Backend API**: Real document generation service
- **Authentication**: User accounts and session management
- **Payment Processing**: Subscription or pay-per-use billing
- **Document Storage**: Secure file storage and retrieval
- **Legal Review**: Professional legal validation of templates
- **Analytics**: Usage tracking and user behavior analysis

## 🎯 Demo Scenarios

### Scenario 1: Business Owner (Guided Mode)
1. Visit homepage and browse B2B templates
2. Select "NDA (Mutual)" template
3. Choose "Guided Mode" for plain language questions
4. Complete questionnaire step-by-step
5. Review generated document with explanations
6. Download as DOCX for editing

### Scenario 2: Legal Professional (Professional Mode)
1. Use advanced filters to find specific template types
2. Select "Professional Mode" for legal terminology
3. Quickly complete form with grouped sections
4. Review document with legal commentary
5. Export as PDF for client review

### Scenario 3: International User
1. Filter by EU-BASE jurisdiction
2. Select German language
3. Generate localized document
4. See jurisdiction-specific clauses and formatting

## 📈 Performance & Optimization

- **Code Splitting**: Automatic route-based code splitting with Next.js
- **Bundle Size**: Optimized with tree-shaking and minimal dependencies
- **Loading States**: Smooth transitions and loading indicators
- **Caching**: Efficient state management and memoization
- **SEO Ready**: Server-side rendering with proper meta tags

## 🔄 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run lint
```

## 🎨 Customization

The demo is highly customizable:

- **Themes**: Modify colors in `tailwind.config.js`
- **Templates**: Add new mock templates in `lib/mockData.ts`
- **Components**: Extend UI components in `components/`
- **Flows**: Modify user journeys in page components
- **Validation**: Update form validation rules in questionnaire schemas

## 📊 Analytics Ready

The demo includes placeholder analytics events for:
- Template views and selections
- Questionnaire completion rates
- Document generation success
- Download format preferences
- User journey tracking

## 🌍 Internationalization

Demonstrates i18n architecture with:
- Language selection interface
- Jurisdiction-specific content
- Localized date and number formatting
- Translation key structure (ready for real i18n)

---

**Note**: This is a demonstration of the Legmint platform design and user experience. All generated documents are for demo purposes only and should not be used for actual legal agreements without proper legal review.