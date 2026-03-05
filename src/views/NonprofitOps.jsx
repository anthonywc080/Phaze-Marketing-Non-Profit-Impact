import React, { useState } from 'react'
import ZoomWidget from '../components/widgets/ZoomWidget'
import GmailWidget from '../components/widgets/GmailWidget'
import DonationWidget from '../components/widgets/DonationWidget'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { Mail, Video, Linkedin, ChevronLeft, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useToast } from '../context/ToastContext'
import NarrativeArcBuilder from '../components/features/NarrativeArcBuilder'

const statusOrder = ['idea', 'drafting', 'review', 'scheduled']
const statusLabels = { idea: 'Ideation', drafting: 'Drafting', review: 'In Review', scheduled: 'Scheduled' }

export default function NonprofitOps() {
  const { tasks, updateTask } = useApp()
  const { showToast } = useToast()
  const [builderOpen, setBuilderOpen] = useState(false)

  function move(id, dir) {
    const t = tasks.find((x) => x.id === id)
    if (!t) return
    const idx = statusOrder.indexOf(t.status)
    const next = statusOrder[idx + dir]
    if (!next) return
    updateTask(id, { status: next })
    showToast('Task moved', 'success')
  }

  const sessions = [
    { id: 's1', title: 'Mentor Check-in', time: 'Mar 2 • 3:00 PM' }
  ]

  const emails = [
    { id: 'e1', from: 'Fundraiser Team', subject: 'Urgent: Campaign update', time: '1h', body: 'Please review the new campaign copy.' }
  ]

  function renderIcon(channel) {
    if (channel === 'gmail') return <Mail className="h-4 w-4" />
    if (channel === 'zoom') return <Video className="h-4 w-4" />
    return <Linkedin className="h-4 w-4" />
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen text-slate-900">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <ZoomWidget sessions={sessions} />
        <GmailWidget emails={emails} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Marketing Kanban</h3>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setBuilderOpen(true)}>Open Narrative Builder</Button>
          <Button variant="primary" onClick={() => { showToast('Saved board', 'success') }}>Save Board</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {statusOrder.map((status) => (
          <div key={status} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm min-h-[200px]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">{statusLabels[status]}</h4>
              <div className="text-xs text-slate-500">{tasks.filter(t => t.status === status).length}</div>
            </div>
            <div className="space-y-3">
              {tasks.filter(t => t.status === status).map((t) => (
                <div key={t.id} className="p-3 rounded-lg border border-slate-100 bg-white flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-100 text-slate-700">{renderIcon(t.channel)}</div>
                      <div className="font-medium">{t.title}</div>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{new Date(t.date).toLocaleDateString()}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={t.priority === 'high' ? 'priority-high' : t.priority === 'medium' ? 'priority-medium' : 'priority-low'}>{t.priority}</Badge>
                    <div className="flex gap-1">
                      <button onClick={() => move(t.id, -1)} className="p-1 rounded hover:bg-slate-50"><ChevronLeft className="h-4 w-4 text-slate-500" /></button>
                      <button onClick={() => move(t.id, 1)} className="p-1 rounded hover:bg-slate-50"><ChevronRight className="h-4 w-4 text-slate-500" /></button>
                    </div>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === status).length === 0 && (
                <div className="p-4 italic text-slate-500 border-2 border-dashed border-slate-200 rounded">Drop tasks here</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <NarrativeArcBuilder open={builderOpen} onClose={() => setBuilderOpen(false)} />
    </div>
  )
}
import React, { useState } from 'react'
import { useToast } from '../context/ToastContext'
import ZoomWidget from '../components/widgets/ZoomWidget'
import GmailWidget from '../components/widgets/GmailWidget'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

export default function NonprofitOps() {
  const [sessions] = useState([
    { id: 1, title: 'College Essay Mentorship', time: 'Tomorrow, 4:00 PM' },
  ])

  const [emails] = useState([
    { id: 1, from: 'Donor Relations', subject: 'New sponsorship question', body: 'Can we schedule a call?', time: '2h' },
    { id: 2, from: 'Student A', subject: 'Application help', body: 'I need assistance completing the form.', time: '5h' },
  ])

  const [tasks, setTasks] = useState({ todo: [{id:1,title:'Prep materials'}], inprogress: [{id:2,title:'Outreach emails'}], done: [{id:3,title:'Board update'}] })

  const { showToast } = useToast()

  function onDragEnd(result){
    const { source, destination } = result
    if(!destination) return
    const from = source.droppableId
    const to = destination.droppableId
    if(from === to){
      const col = Array.from(tasks[from])
      const [moved] = col.splice(source.index,1)
      col.splice(destination.index,0,moved)
      setTasks(t => ({...t, [from]: col}))
      return
    }
    const item = tasks[from][source.index]
    const fromCol = Array.from(tasks[from])
    fromCol.splice(source.index,1)
    const toCol = Array.from(tasks[to])
    toCol.splice(destination.index,0,item)
    setTasks(t => ({...t, [from]: fromCol, [to]: toCol}))
    showToast('Task moved', 'info')
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <GmailWidget emails={emails} />
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-semibold mb-3">Active Tasks</h4>
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-3 gap-4">
                {['todo','inprogress','done'].map((col) => (
                  <Droppable droppableId={col} key={col}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="bg-slate-50 p-3 rounded-xl min-h-[120px]">
                        <div className="font-semibold text-sm mb-2 capitalize">{col.replace('inprogress','in progress')}</div>
                        <div className="space-y-2">
                          {tasks[col].map((task, index) => (
                            <Draggable draggableId={`task-${task.id}`} index={index} key={task.id}>
                              {(prov) => (
                                <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="p-2 bg-white rounded-lg border flex items-center justify-between">
                                  <div>{task.title}</div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          </div>
        </div>

        <div className="space-y-4">
          <ZoomWidget sessions={sessions} />
        </div>
      </div>
    </div>
  )
}
