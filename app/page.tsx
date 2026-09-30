'use client'

import { useState } from 'react'
import { DashboardView } from '@/components/dashboard'
import { ScholarManagement } from '@/components/scholar-management'
import { ScholarshipPrograms } from '@/components/scholarship-programs'
import { GradeSubmission } from '@/components/grade-submission'
import { Navigation } from '@/components/navigation'

type ViewType = 'dashboard' | 'scholars' | 'programs' | 'submissions' | 'compliance'

export default function Page() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')
  const [scholarData, setScholarData] = useState([
    {
      id: 'S001',
      studentId: '2024-001',
      fullName: 'Maria Santos',
      degreeProgram: 'BS Computer Science',
      yearLevel: 3,
      scholarshipId: 'MERIT-2024',
      status: 'Active',
    },
    {
      id: 'S002',
      studentId: '2024-002',
      fullName: 'Juan Cruz',
      degreeProgram: 'BS Engineering',
      yearLevel: 2,
      scholarshipId: 'GOV-2024',
      status: 'Active',
    },
    {
      id: 'S003',
      studentId: '2024-003',
      fullName: 'Ana Lopez',
      degreeProgram: 'BS Business',
      yearLevel: 4,
      scholarshipId: 'MERIT-2024',
      status: 'With Deficiency',
    },
  ])

  const [programsData, setProgramsData] = useState([
    {
      id: 'MERIT-2024',
      programName: 'Merit Scholarship 2024',
      requiredGwa: 3.0,
      minUnits: 12,
      allowFailingGrade: false,
      active: true,
    },
    {
      id: 'GOV-2024',
      programName: 'Government Scholarship 2024',
      requiredGwa: 2.5,
      minUnits: 12,
      allowFailingGrade: false,
      active: true,
    },
  ])

  const [submissionsData, setSubmissionsData] = useState([
    {
      id: 'SUB001',
      scholarId: 'S001',
      scholarName: 'Maria Santos',
      academicYear: '2024-2025',
      semester: 'First',
      gwa: 3.45,
      unitsEnrolled: 18,
      failedSubjects: 0,
      incompleteSubjects: 0,
      submissionStatus: 'Pending',
      submittedAt: '2024-09-15',
      verifiedBy: null,
      verifiedAt: null,
    },
    {
      id: 'SUB002',
      scholarId: 'S002',
      scholarName: 'Juan Cruz',
      academicYear: '2024-2025',
      semester: 'First',
      gwa: 2.8,
      unitsEnrolled: 15,
      failedSubjects: 0,
      incompleteSubjects: 1,
      submissionStatus: 'Verified',
      submittedAt: '2024-09-10',
      verifiedBy: 'Dr. Smith',
      verifiedAt: '2024-09-12',
    },
    {
      id: 'SUB003',
      scholarId: 'S003',
      scholarName: 'Ana Lopez',
      academicYear: '2024-2025',
      semester: 'First',
      gwa: 2.2,
      unitsEnrolled: 12,
      failedSubjects: 1,
      incompleteSubjects: 0,
      submissionStatus: 'Verified',
      submittedAt: '2024-09-08',
      verifiedBy: 'Dr. Smith',
      verifiedAt: '2024-09-09',
    },
  ])

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1">
        {currentView === 'dashboard' && (
          <DashboardView
            scholars={scholarData}
            submissions={submissionsData}
            programs={programsData}
          />
        )}
        {currentView === 'scholars' && (
          <ScholarManagement scholars={scholarData} setScholars={setScholarData} programs={programsData} />
        )}
        {currentView === 'programs' && (
          <ScholarshipPrograms programs={programsData} setPrograms={setProgramsData} />
        )}
        {currentView === 'submissions' && (
          <GradeSubmission
            submissions={submissionsData}
            setSubmissions={setSubmissionsData}
            scholars={scholarData}
            programs={programsData}
          />
        )}
      </main>
    </div>
  )
}
