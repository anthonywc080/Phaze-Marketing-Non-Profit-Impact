import React, { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'

export default function NarrativeArcBuilder({ open, onClose }) {
  const { addTask } = useApp()
  const { showToast } = useToast()
  const [hook, setHook] = useState('')
  const [struggle, setStruggle] = useState('')
  const [solution, setSolution] = useState('')
  const [impact, setImpact] = useState('')
  const [loading, setLoading] = useState(false)

  async function generate() {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    const items = [
      { title: `Hook: ${hook}`, channel: 'linkedin', status: 'idea', priority: 'medium' },
      { title: `Struggle: ${struggle}`, channel: 'gmail', status: 'idea', priority: 'high' },
      { title: `Solution: ${solution}`, channel: 'zoom', status: 'idea', priority: 'medium' },
      { title: `Impact: ${impact}`, channel: 'linkedin', status: 'idea', priority: 'low' }
    ]
    items.forEach((t) => addTask(t))
    setLoading(false)
    showToast('Plan generated and added to Ideation', 'success')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={"Narrative Arc Builder"}>
      <div className="space-y-4">
        <div className="bg-pink-50 p-3 rounded-lg"><Input label="Who is the hero?" value={hook} onChange={setHook} placeholder="e.g., Teen coder" /></div>
        <div className="bg-orange-50 p-3 rounded-lg"><Input label="What is the obstacle?" value={struggle} onChange={setStruggle} placeholder="e.g., Lack of devices" /></div>
        <div className="bg-purple-50 p-3 rounded-lg"><Input label="What is the exact ask?" value={solution} onChange={setSolution} placeholder="e.g., Donate laptops" /></div>
        <div className="bg-green-50 p-3 rounded-lg"><Input label="What is the resolution?" value={impact} onChange={setImpact} placeholder="e.g., 100 students equipped" /></div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" loading={loading} onClick={generate}>Generate Plan</Button>
        </div>
      </div>
    </Modal>
  )
}
