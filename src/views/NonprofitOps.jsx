import React, { useState } from 'react'
import { useToast } from '../context/ToastContext'
import ZoomWidget from '../components/widgets/ZoomWidget'
import GmailWidget from '../components/widgets/GmailWidget'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

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
