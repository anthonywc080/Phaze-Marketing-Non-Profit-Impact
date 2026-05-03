import React, { useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import Badge from '../ui/Badge'
import { useToast } from '../../context/ToastContext'

export default function ImpactNotesCapture({ taskId, onSaveImpactNote }) {
  const [modal, setModal] = useState(false)
  const [reflection, setReflection] = useState('')
  const [capturedPhoto, setCapturedPhoto] = useState(null)
  const { showToast } = useToast()

  const handleSubmit = () => {
    if (!reflection.trim() && !capturedPhoto) {
      showToast('Please add at least a reflection or a photo', 'warning')
      return
    }
    onSaveImpactNote(taskId, {
      reflection: reflection.trim(),
      photoUrl: capturedPhoto
    })
    showToast('Impact note saved! You helped the mission.', 'success')
    setModal(false)
    setReflection('')
    setCapturedPhoto(null)
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCapturedPhoto(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <Button
        variant="action"
        className="text-xs px-3 py-1"
        onClick={() => setModal(true)}
      >
        Share Impact Note
      </Button>

      <Modal open={modal} onClose={() => setModal(false)} title="Share Your Impact">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-600 mb-3">
              You just made a difference! Share how this task helped the mission.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">One-sentence reflection</label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What impact did this work have? How did it help?"
              maxLength={280}
              className="w-full p-3 rounded-lg border border-slate-200 bg-white text-slate-900 resize-none h-20"
            />
            <div className="text-xs text-slate-500 mt-1">{reflection.length}/280</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Upload a photo (optional)</label>
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center">
              {capturedPhoto ? (
                <div>
                  <img src={capturedPhoto} alt="Impact" className="w-24 h-24 rounded-lg mx-auto mb-3 object-cover" />
                  <Button variant="secondary" className="text-xs px-3 py-1" onClick={() => setCapturedPhoto(null)}>
                    Change photo
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <span className="block text-2xl mb-2">📸</span>
                  <span className="text-sm text-slate-600">Click to upload a photo of your work</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button variant="action" onClick={handleSubmit}>Save Impact Note</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
