'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit2, Trash2 } from 'lucide-react'

interface Program {
  id: string
  programName: string
  requiredGwa: number
  minUnits: number
  allowFailingGrade: boolean
  active: boolean
}

interface ScholarshipProgramsProps {
  programs: Program[]
  setPrograms: (programs: Program[]) => void
}

export function ScholarshipPrograms({ programs, setPrograms }: ScholarshipProgramsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    programName: '',
    requiredGwa: 2.5,
    minUnits: 12,
    allowFailingGrade: false,
    active: true,
  })

  const handleAddProgram = () => {
    if (!formData.programName) {
      alert('Please enter program name')
      return
    }

    if (editingId) {
      setPrograms(
        programs.map((p) => (p.id === editingId ? { ...p, ...formData } : p))
      )
    } else {
      const newProgram: Program = {
        id: `PROG-${Date.now()}`,
        ...formData,
      }
      setPrograms([...programs, newProgram])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      programName: '',
      requiredGwa: 2.5,
      minUnits: 12,
      allowFailingGrade: false,
      active: true,
    })
    setIsFormOpen(false)
    setEditingId(null)
  }

  const handleEdit = (program: Program) => {
    setFormData({
      programName: program.programName,
      requiredGwa: program.requiredGwa,
      minUnits: program.minUnits,
      allowFailingGrade: program.allowFailingGrade,
      active: program.active,
    })
    setEditingId(program.id)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this program?')) {
      setPrograms(programs.filter((p) => p.id !== id))
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold">Scholarship Programs</h2>
          <p className="text-muted-foreground mt-1">Configure academic requirements</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Program
        </Button>
      </div>

      {isFormOpen && (
        <Card className="p-6 mb-6 bg-muted/50">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Program' : 'Create New Program'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Program Name *</label>
              <input
                type="text"
                placeholder="e.g., Merit Scholarship 2024"
                value={formData.programName}
                onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Required GWA</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="4"
                value={formData.requiredGwa}
                onChange={(e) => setFormData({ ...formData, requiredGwa: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">Minimum GWA requirement</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Minimum Units</label>
              <input
                type="number"
                min="0"
                value={formData.minUnits}
                onChange={(e) => setFormData({ ...formData, minUnits: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">Units must be enrolled</p>
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="allowFailing"
                checked={formData.allowFailingGrade}
                onChange={(e) =>
                  setFormData({ ...formData, allowFailingGrade: e.target.checked })
                }
                className="rounded"
              />
              <label htmlFor="allowFailing" className="text-sm font-medium">
                Allow failing grades
              </label>
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.checked })
                }
                className="rounded"
              />
              <label htmlFor="active" className="text-sm font-medium">
                Program is active
              </label>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleAddProgram} className="bg-primary">
              {editingId ? 'Update Program' : 'Create Program'}
            </Button>
            <Button onClick={resetForm} variant="outline">
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <Card key={program.id} className="p-6 flex flex-col">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-lg pr-2">{program.programName}</h3>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                    program.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {program.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Minimum GWA</p>
                  <p className="text-2xl font-bold text-primary">{program.requiredGwa.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Minimum Units</p>
                  <p className="text-lg font-semibold">{program.minUnits} units</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Failing Grades</p>
                  <p className="text-sm">
                    {program.allowFailingGrade ? 'Allowed' : 'Not Allowed'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t">
              <button
                onClick={() => handleEdit(program)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 hover:bg-muted rounded text-sm"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(program.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 rounded text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </Card>
        ))}
      </div>

      {programs.length === 0 && (
        <Card className="p-12 text-center text-muted-foreground">
          No scholarship programs configured. Create one to get started.
        </Card>
      )}
    </div>
  )
}
