'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Search, Plus, Edit2, Trash2 } from 'lucide-react'

interface Scholar {
  id: string
  studentId: string
  fullName: string
  degreeProgram: string
  yearLevel: number
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

interface ScholarManagementProps {
  scholars: Scholar[]
  setScholars: (scholars: Scholar[]) => void
  programs: Program[]
}

export function ScholarManagement({ scholars, setScholars, programs }: ScholarManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    degreeProgram: '',
    yearLevel: 1,
    scholarshipId: '',
    status: 'Active',
  })

  const filteredScholars = scholars.filter((s) => {
    const matchesSearch =
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All Status' || s.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleAddScholar = () => {
    if (!formData.studentId || !formData.fullName) {
      alert('Please fill in all required fields')
      return
    }

    if (editingId) {
      setScholars(
        scholars.map((s) => (s.id === editingId ? { ...s, ...formData } : s))
      )
    } else {
      const newScholar: Scholar = {
        id: `S${scholars.length + 1}`,
        ...formData,
      }
      setScholars([...scholars, newScholar])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      studentId: '',
      fullName: '',
      degreeProgram: '',
      yearLevel: 1,
      scholarshipId: '',
      status: 'Active',
    })
    setIsFormOpen(false)
    setEditingId(null)
  }

  const handleEdit = (scholar: Scholar) => {
    setFormData({
      studentId: scholar.studentId,
      fullName: scholar.fullName,
      degreeProgram: scholar.degreeProgram,
      yearLevel: scholar.yearLevel,
      scholarshipId: scholar.scholarshipId,
      status: scholar.status,
    })
    setEditingId(scholar.id)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this scholar?')) {
      setScholars(scholars.filter((s) => s.id !== id))
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Scholar Management</h2>
          <p className="text-muted-foreground mt-1">Manage scholar records and assignments</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Scholar
        </Button>
      </div>

      {isFormOpen && (
        <Card className="p-6 mb-6 bg-muted/50">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Scholar' : 'Register New Scholar'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Student ID *</label>
              <input
                type="text"
                placeholder="e.g., 2024-001"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Full Name *</label>
              <input
                type="text"
                placeholder="Full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Degree Program</label>
              <input
                type="text"
                placeholder="e.g., BS Computer Science"
                value={formData.degreeProgram}
                onChange={(e) => setFormData({ ...formData, degreeProgram: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Year Level</label>
              <input
                type="number"
                min="1"
                max="4"
                value={formData.yearLevel}
                onChange={(e) => setFormData({ ...formData, yearLevel: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Scholarship Program</label>
              <select
                value={formData.scholarshipId}
                onChange={(e) => setFormData({ ...formData, scholarshipId: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="">Select program</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.programName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option>Active</option>
                <option>Pending Submission</option>
                <option>For Verification</option>
                <option>Compliant</option>
                <option>With Deficiency</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleAddScholar} className="bg-primary">
              {editingId ? 'Update Scholar' : 'Register Scholar'}
            </Button>
            <Button onClick={resetForm} variant="outline">
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Student ID or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-md text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>With Deficiency</option>
          <option>Pending Submission</option>
        </select>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Student ID</th>
                <th className="px-6 py-3 text-left font-medium">Full Name</th>
                <th className="px-6 py-3 text-left font-medium">Program</th>
                <th className="px-6 py-3 text-left font-medium">Year</th>
                <th className="px-6 py-3 text-left font-medium">Scholarship</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredScholars.map((scholar) => (
                <tr key={scholar.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 font-medium">{scholar.studentId}</td>
                  <td className="px-6 py-4">{scholar.fullName}</td>
                  <td className="px-6 py-4 text-xs">{scholar.degreeProgram}</td>
                  <td className="px-6 py-4">Year {scholar.yearLevel}</td>
                  <td className="px-6 py-4 text-xs">
                    {programs.find((p) => p.id === scholar.scholarshipId)?.programName}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        scholar.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {scholar.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(scholar)}
                      className="p-1 hover:bg-muted rounded"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(scholar.id)}
                      className="p-1 hover:bg-muted rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredScholars.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">No scholars found</div>
          )}
        </div>
      </Card>
    </div>
  )
}
