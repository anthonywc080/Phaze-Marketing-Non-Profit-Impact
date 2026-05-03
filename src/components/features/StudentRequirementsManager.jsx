import React, { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import { useToast } from '../../context/ToastContext'
import { Plus, Edit, Trash2, CheckCircle } from 'lucide-react'

const REQUIREMENT_TYPES = [
  { value: 'academic', label: 'Academic Requirements', description: 'GPA, grade level, courses' },
  { value: 'skills', label: 'Skills & Experience', description: 'Marketing, writing, design skills' },
  { value: 'availability', label: 'Availability', description: 'Hours per week, time commitment' },
  { value: 'application', label: 'Application Materials', description: 'Essays, portfolios, references' },
  { value: 'other', label: 'Other Requirements', description: 'Custom requirements' }
]

export default function StudentRequirementsManager({ requirements = [], onUpdateRequirements }) {
  const { showToast } = useToast()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRequirement, setEditingRequirement] = useState(null)
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    isRequired: true,
    details: ''
  })

  const resetForm = () => {
    setFormData({
      type: '',
      title: '',
      description: '',
      isRequired: true,
      details: ''
    })
    setEditingRequirement(null)
  }

  const openModal = (requirement = null) => {
    if (requirement) {
      setFormData(requirement)
      setEditingRequirement(requirement)
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      showToast('Title is required', 'warning')
      return
    }

    const newRequirement = {
      id: editingRequirement?.id || Date.now().toString(),
      ...formData
    }

    let updatedRequirements
    if (editingRequirement) {
      updatedRequirements = requirements.map(req =>
        req.id === editingRequirement.id ? newRequirement : req
      )
      showToast('Requirement updated', 'success')
    } else {
      updatedRequirements = [...requirements, newRequirement]
      showToast('Requirement added', 'success')
    }

    onUpdateRequirements(updatedRequirements)
    closeModal()
  }

  const handleDelete = (id) => {
    const updatedRequirements = requirements.filter(req => req.id !== id)
    onUpdateRequirements(updatedRequirements)
    showToast('Requirement deleted', 'success')
  }

  const getTypeInfo = (type) => {
    return REQUIREMENT_TYPES.find(t => t.value === type) || { label: type, description: '' }
  }

  const groupedRequirements = REQUIREMENT_TYPES.reduce((acc, type) => {
    acc[type.value] = requirements.filter(req => req.type === type.value)
    return acc
  }, {})

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold">Student Requirements</h3>
          <p className="text-sm text-slate-500 mt-1">Define what students need to qualify for your programs</p>
        </div>
        <Button variant="primary" onClick={() => openModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Requirement
        </Button>
      </div>

      {requirements.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <CheckCircle className="h-12 w-12 mx-auto" />
          </div>
          <h4 className="text-lg font-medium text-slate-900 mb-2">No requirements set</h4>
          <p className="text-slate-500 mb-6">Add requirements to help students understand what they need to qualify</p>
          <Button variant="primary" onClick={() => openModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Requirement
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {REQUIREMENT_TYPES.map(type => {
            const typeRequirements = groupedRequirements[type.value] || []
            if (typeRequirements.length === 0) return null

            return (
              <div key={type.value}>
                <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                  {type.label}
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    {typeRequirements.length}
                  </span>
                </h4>
                <div className="space-y-3">
                  {typeRequirements.map(requirement => (
                    <div key={requirement.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium text-slate-900">{requirement.title}</h5>
                            {requirement.isRequired && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                Required
                              </span>
                            )}
                          </div>
                          {requirement.description && (
                            <p className="text-sm text-slate-600 mb-2">{requirement.description}</p>
                          )}
                          {requirement.details && (
                            <p className="text-sm text-slate-500">{requirement.details}</p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => openModal(requirement)}
                            className="p-2 text-slate-400 hover:text-slate-600 rounded"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(requirement.id)}
                            className="p-2 text-slate-400 hover:text-red-600 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={isModalOpen} onClose={closeModal} title={editingRequirement ? 'Edit Requirement' : 'Add Requirement'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Requirement Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select type...</option>
              {REQUIREMENT_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
            {formData.type && (
              <p className="text-xs text-slate-500 mt-1">{getTypeInfo(formData.type).description}</p>
            )}
          </div>

          <Input
            label="Title"
            value={formData.title}
            onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
            placeholder="e.g., Minimum GPA of 3.0"
          />

          <Input
            label="Description"
            value={formData.description}
            onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
            placeholder="Brief description of the requirement"
          />

          <Input
            label="Additional Details (Optional)"
            value={formData.details}
            onChange={(value) => setFormData(prev => ({ ...prev, details: value }))}
            textarea
            placeholder="More detailed information or examples"
          />

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.isRequired}
              onChange={(e) => setFormData(prev => ({ ...prev, isRequired: e.target.checked }))}
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-700">This is a required qualification</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={closeModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editingRequirement ? 'Update' : 'Add'} Requirement
          </Button>
        </div>
      </Modal>
    </div>
  )
}