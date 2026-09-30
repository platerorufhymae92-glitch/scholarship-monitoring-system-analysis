'use client'

import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle, Clock, Users, FileCheck } from 'lucide-react'

interface Scholar {
  id: string
  studentId: string
  fullName: string
  degreeProgram: string
  yearLevel: number
  scholarshipId: string
  status: string
}

interface Submission {
  id: string
  scholarId: string
  scholarName: string
  academicYear: string
  semester: string
  gwa: number
  unitsEnrolled: number
  failedSubjects: number
  incompleteSubjects: number
  submissionStatus: string
  submittedAt: string
  verifiedBy: string | null
  verifiedAt: string | null
}

interface Program {
  id: string
  programName: string
  requiredGwa: number
  minUnits: number
  allowFailingGrade: boolean
  active: boolean
}

interface DashboardViewProps {
  scholars: Scholar[]
  submissions: Submission[]
  programs: Program[]
}

const KPICard = ({
  title,
  value,
  icon: Icon,
  description,
  variant = 'default',
}: {
  title: string
  value: number | string
  icon: React.ComponentType<{ className?: string }>
  description: string
  variant?: 'default' | 'success' | 'warning' | 'alert'
}) => {
  const variants = {
    default: 'bg-blue-50 text-blue-900 border-blue-200',
    success: 'bg-green-50 text-green-900 border-green-200',
    warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
    alert: 'bg-red-50 text-red-900 border-red-200',
  }

  return (
    <Card className={`p-6 border ${variants[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          <p className="text-xs mt-2 opacity-70">{description}</p>
        </div>
        <Icon className="w-8 h-8 opacity-50" />
      </div>
    </Card>
  )
}

export function DashboardView({ scholars, submissions, programs }: DashboardViewProps) {
  const totalScholars = scholars.length
  const pendingSubmissions = submissions.filter((s) => s.submissionStatus === 'Pending').length
  const verifiedSubmissions = submissions.filter((s) => s.submissionStatus === 'Verified').length
  const compliantScholars = scholars.filter((s) => s.status === 'Active').length
  const deficiencyCount = scholars.filter((s) => s.status === 'With Deficiency').length

  const recentSubmissions = submissions.slice(-5).reverse()

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Scholarship monitoring at a glance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <KPICard
          title="Total Scholars"
          value={totalScholars}
          icon={Users}
          description="Active scholar records"
          variant="default"
        />
        <KPICard
          title="Pending Submissions"
          value={pendingSubmissions}
          icon={Clock}
          description="Awaiting verification"
          variant="warning"
        />
        <KPICard
          title="Verified Submissions"
          value={verifiedSubmissions}
          icon={FileCheck}
          description="Processed submissions"
          variant="success"
        />
        <KPICard
          title="Compliant Scholars"
          value={compliantScholars}
          icon={CheckCircle}
          description="Meeting requirements"
          variant="success"
        />
        <KPICard
          title="With Deficiency"
          value={deficiencyCount}
          icon={AlertCircle}
          description="Need attention"
          variant="alert"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Submissions</h3>
          <div className="space-y-3">
            {recentSubmissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No submissions yet</p>
            ) : (
              recentSubmissions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between pb-3 border-b last:border-b-0">
                  <div>
                    <p className="font-medium text-sm">{sub.scholarName}</p>
                    <p className="text-xs text-muted-foreground">
                      {sub.academicYear} - {sub.semester} Semester
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      sub.submissionStatus === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {sub.submissionStatus}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Scholarship Programs</h3>
          <div className="space-y-3">
            {programs.map((prog) => (
              <div key={prog.id} className="pb-3 border-b last:border-b-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{prog.programName}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Min GWA: {prog.requiredGwa} | Min Units: {prog.minUnits}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {prog.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
