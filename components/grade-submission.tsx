'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Check, X, AlertCircle } from 'lucide-react'

interface Scholar {
  id: string
  studentId: string
  fullName: string
  scholarshipId: string
  status: string
}

interface Program {
  id: string
  programName: string
  requiredGwa: number
  minUnits: number
  allowFailingGrade: boolean
  active: boolean
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

interface GradeSubmissionProps {
  submissions: Submission[]
  setSubmissions: (submissions: Submission[]) => void
  scholars: Scholar[]
  programs: Program[]
}

export function GradeSubmission({
  submissions,
  setSubmissions,
  scholars,
  programs,
}: GradeSubmissionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    scholarId: '',
    academicYear: '2024-2025',
    semester: 'First',
    gwa: 0,
    unitsEnrolled: 0,
    failedSubjects: 0,
    incompleteSubjects: 0,
  })

  const evaluateCompliance = (submission: Submission, program: Program | undefined) => {
    if (!program) return 'Unknown'
    
    const gwaValid = submission.gwa >= program.requiredGwa
    const unitsValid = submission.unitsEnrolled >= program.minUnits
    const noFailing = program.allowFailingGrade || submission.failedSubjects === 0

    return gwaValid && unitsValid && noFailing ? 'Compliant' : 'With Deficiency'
  }

  const handleAddSubmission = () => {
    if (!formData.scholarId) {
      alert('Please select a scholar')
      return
    }

    const newSubmission: Submission = {
      id: `SUB${submissions.length + 1}`,
      scholarId: formData.scholarId,
      scholarName: scholars.find((s) => s.id === formData.scholarId)?.fullName || '',
      ...formData,
      submissionStatus: 'Pending',
      submittedAt: new Date().toISOString().split('T')[0],
      verifiedBy: null,
      verifiedAt: null,
    }
    setSubmissions([...submissions, newSubmission])
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      scholarId: '',
      academicYear: '2024-2025',
      semester: 'First',
      gwa: 0,
      unitsEnrolled: 0,
      failedSubjects: 0,
      incompleteSubjects: 0,
    })
    setIsFormOpen(false)
  }

  const handleVerify = (id: string) => {
    const updated = submissions.map((s) => {
      if (s.id === id) {
        const scholar = scholars.find((sc) => sc.id === s.scholarId)
        const program = programs.find((p) => p.id === scholar?.scholarshipId)
        const complianceStatus = evaluateCompliance(s, program)

        return {
          ...s,
          submissionStatus: 'Verified',
          verifiedBy: 'Dr. Smith',
          verifiedAt: new Date().toISOString().split('T')[0],
        }
      }
      return s
    })
    setSubmissions(updated)
  }

  const handleReject = (id: string) => {
    setSubmissions(
      submissions.map((s) => (s.id === id ? { ...s, submissionStatus: 'Pending' } : s))
    )
  }

  const pendingSubmissions = submissions.filter((s) => s.submissionStatus === 'Pending')
  const verifiedSubmissions = submissions.filter((s) => s.submissionStatus === 'Verified')

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Grade Submissions</h2>
          <p className="text-muted-foreground mt-1">Manage semester grade submissions and verification</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Submission
        </Button>
      </div>

      {isFormOpen && (
        <Card className="p-6 mb-6 bg-muted/50">
          <h3 className="text-lg font-semibold mb-4">Record Grade Submission</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Scholar *</label>
              <select
                value={formData.scholarId}
                onChange={(e) => setFormData({ ...formData, scholarId: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">Select scholar</option>
                {scholars.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.studentId})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Academic Year</label>
              <input
                type="text"
                placeholder="e.g., 2024-2025"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option>First</option>
                <option>Second</option>
                <option>Summer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GWA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={formData.gwa}
                onChange={(e) => setFormData({ ...formData, gwa: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Units Enrolled</label>
              <input
                type="number"
                min="0"
                value={formData.unitsEnrolled}
                onChange={(e) => setFormData({ ...formData, unitsEnrolled: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Failed Subjects</label>
              <input
                type="number"
                min="0"
                value={formData.failedSubjects}
                onChange={(e) => setFormData({ ...formData, failedSubjects: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Incomplete Subjects</label>
              <input
                type="number"
                min="0"
                value={formData.incompleteSubjects}
                onChange={(e) =>
                  setFormData({ ...formData, incompleteSubjects: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleAddSubmission} className="bg-primary">
              Submit Grades
            </Button>
            <Button onClick={resetForm} variant="outline">
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            Pending Verification ({pendingSubmissions.length})
          </h3>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium">Scholar</th>
                    <th className="px-6 py-3 text-left font-medium">Academic Year</th>
                    <th className="px-6 py-3 text-left font-medium">GWA</th>
                    <th className="px-6 py-3 text-left font-medium">Units</th>
                    <th className="px-6 py-3 text-left font-medium">Failed</th>
                    <th className="px-6 py-3 text-left font-medium">Submitted</th>
                    <th className="px-6 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {pendingSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 font-medium">{sub.scholarName}</td>
                      <td className="px-6 py-4">{sub.academicYear}</td>
                      <td className="px-6 py-4 font-semibold text-primary">{sub.gwa.toFixed(2)}</td>
                      <td className="px-6 py-4">{sub.unitsEnrolled}</td>
                      <td className="px-6 py-4 text-center">{sub.failedSubjects}</td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {sub.submittedAt}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleVerify(sub.id)}
                          className="p-1 hover:bg-green-100 rounded text-green-600"
                          title="Verify"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(sub.id)}
                          className="p-1 hover:bg-red-100 rounded text-red-600"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pendingSubmissions.length === 0 && (
                <div className="p-6 text-center text-muted-foreground">
                  No pending submissions
                </div>
              )}
            </div>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            Verified Submissions ({verifiedSubmissions.length})
          </h3>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium">Scholar</th>
                    <th className="px-6 py-3 text-left font-medium">Academic Year</th>
                    <th className="px-6 py-3 text-left font-medium">GWA</th>
                    <th className="px-6 py-3 text-left font-medium">Compliance</th>
                    <th className="px-6 py-3 text-left font-medium">Verified By</th>
                    <th className="px-6 py-3 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {verifiedSubmissions.map((sub) => {
                    const scholar = scholars.find((s) => s.id === sub.scholarId)
                    const program = programs.find((p) => p.id === scholar?.scholarshipId)
                    const complianceStatus = evaluateCompliance(sub, program)

                    return (
                      <tr key={sub.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 font-medium">{sub.scholarName}</td>
                        <td className="px-6 py-4">{sub.academicYear}</td>
                        <td className="px-6 py-4 font-semibold text-primary">{sub.gwa.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              complianceStatus === 'Compliant'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {complianceStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">{sub.verifiedBy}</td>
                        <td className="px-6 py-4 text-xs text-muted-foreground">
                          {sub.verifiedAt}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {verifiedSubmissions.length === 0 && (
                <div className="p-6 text-center text-muted-foreground">
                  No verified submissions yet
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
