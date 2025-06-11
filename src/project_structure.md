# Mini Job Tracker - Full Stack Project Structure

## 📁 Project Hierarchy

```
mini-job-tracker/
├── 📁 components/
│   ├── JobForm.tsx
│   ├── JobTable.tsx
│   ├── JobAnalyzer.tsx
│   ├── EditJobModal.tsx
│   └── Layout.tsx
│
├── 📁 pages/
│   ├── index.tsx (Dashboard)
│   ├── add-job.tsx
│   ├── edit/[id].tsx
│   └── 📁 api/
│       ├── jobs/
│       │   ├── index.ts (GET, POST /api/jobs)
│       │   └── [id].ts (PUT, DELETE /api/jobs/:id)
│       └── analyze-job.ts (POST /api/analyze-job)
│
├── 📁 types/
│   └── job.ts
│
├── 📁 utils/
│   ├── jobStorage.ts
│   └── openai.ts
│
├── 📁 data/
│   └── jobs.json (Local storage file)
│
├── 📁 styles/
│   └── globals.css
│
├── package.json
├── tsconfig.json
├── next.config.js
└── tailwind.config.js
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with TypeScript
- **Tailwind CSS** for styling
- **React Hook Form** for form handling
- **Lucide React** for icons

### Backend
- **Next.js API Routes**
- **File System** for data persistence (jobs.json)
- **OpenAI API** for job analysis

### Key Features
- ✅ Add job applications with form validation
- ✅ Dashboard with job listings in table format
- ✅ Edit/Delete job entries
- ✅ AI-powered job description analysis
- ✅ Responsive design
- ✅ TypeScript for type safety

## 📋 Data Model

```typescript
interface Job {
  id: string;
  jobTitle: string;
  companyName: string;
  applicationLink: string;
  status: 'Applied' | 'Interviewing' | 'Rejected' | 'Offer';
  dateAdded: string;
  jobDescription?: string;
  aiAnalysis?: {
    summary: string;
    suggestedSkills: string[];
  };
}
```

## 🔌 API Endpoints

- `GET /api/jobs` - Fetch all job applications
- `POST /api/jobs` - Create new job application
- `PUT /api/jobs/[id]` - Update job application
- `DELETE /api/jobs/[id]` - Delete job application
- `POST /api/analyze-job` - Analyze job description with AI

## 📄 Pages Structure

1. **Dashboard (/)** - Main page showing job table and quick actions
2. **Add Job (/add-job)** - Form to add new job application
3. **Edit Job (/edit/[id])** - Form to edit existing job application

## 🎨 Design Features

- Modern, clean interface with Tailwind CSS
- Responsive design for mobile and desktop
- Status badges with color coding
- Modal dialogs for confirmations
- Loading states and error handling
- Smooth animations and transitions

## 🚀 Getting Started

1. Initialize Next.js project with TypeScript
2. Install dependencies (Tailwind, Lucide, etc.)
3. Set up the file structure
4. Create the data storage system
5. Build API endpoints
6. Develop frontend components
7. Integrate AI features
8. Test and deploy

This structure provides a solid foundation for a professional-looking job tracker application that demonstrates full-stack development skills while being practical and feature-rich.