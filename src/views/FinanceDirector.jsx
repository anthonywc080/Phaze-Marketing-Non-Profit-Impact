import React, { useState } from 'react'
import DonationWidget from '../components/widgets/DonationWidget'
import { useToast } from '../context/ToastContext'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { listenPipeline, setPipelineDoc } from '../firebase/firestore'
import { useEffect } from 'react'

export default function FinanceDirector(){
  const [donations, setDonations] = useState([{id:1,donor:'Seed Fund',amount:1200,time:'9:00 AM'}])
  const [pipeline, setPipeline] = useState({applied:[{id:1,name:'Sam'}], interviewing:[], accepted:[]})

  const { showToast } = useToast()
  const useFirestore = Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID)

  function addDonation(){
    const d = {id:Date.now(), donor:'NewOrg', amount:Math.floor(Math.random()*1000)+50, time:new Date().toLocaleTimeString()}
    if(useFirestore){
      // add via DonationWidget/Firestore or later; fall back for now
      showToast('Donation queued to Firestore', 'info')
    }
    setDonations(dn=>[d,...dn])
    showToast('Donation fetched', 'success')
  }

  function moveApplicant(id, from, to){
    setPipeline(p=>{
      const item = p[from].find(x=>x.id===id)
      const next = {...p, [from]:p[from].filter(x=>x.id!==id), [to]:[item,...p[to]]}
      if(useFirestore){
        // persist each column as a document under pipeline/{col}
        Object.keys(next).forEach(async (col)=>{
          try{ await setPipelineDoc(col, { items: next[col] }) }catch(e){ console.warn(e) }
        })
      }
      showToast('Applicant moved', 'info')
      return next
    })
  }

  useEffect(()=>{
    if(!useFirestore) return
    const unsub = listenPipeline((items)=>{
      // items is a map of docId -> data; expect docs with id 'applied','interviewing','accepted'
      const next = {applied:[], interviewing:[], accepted:[]}
      Object.keys(items).forEach(k=>{
        if(items[k] && items[k].items) next[k] = items[k].items
      })
      setPipeline(p=> ({...p, ...next}))
    })
    return unsub
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-semibold mb-3">Application Pipeline</h4>
            <DragDropContext onDragEnd={(result)=>{
              const { source, destination } = result
              if(!destination) return
              const from = source.droppableId
              const to = destination.droppableId
              if(from === to){
                const col = Array.from(pipeline[from])
                const [moved] = col.splice(source.index,1)
                col.splice(destination.index,0,moved)
                setPipeline(p=> ({...p, [from]: col}))
                return
              }
              const item = pipeline[from][source.index]
              const fromCol = Array.from(pipeline[from])
              fromCol.splice(source.index,1)
              const toCol = Array.from(pipeline[to])
              toCol.splice(destination.index,0,item)
              setPipeline(p=> ({...p, [from]: fromCol, [to]: toCol}))
              showToast('Applicant moved', 'info')
            }}>
              <div className="grid grid-cols-3 gap-4">
                {['applied','interviewing','accepted'].map(col => (
                  <Droppable droppableId={col} key={col}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="bg-slate-50 p-3 rounded-xl min-h-[120px]">
                        <div className="font-semibold text-sm mb-2 capitalize">{col}</div>
                        <div className="space-y-2">
                          {pipeline[col].map((app, index) => (
                            <Draggable key={app.id} draggableId={`app-${app.id}`} index={index}>
                              {(prov) => (
                                <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="p-2 bg-white rounded-lg border flex items-center justify-between">
                                  <div>{app.name}</div>
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
          <DonationWidget initial={donations} />
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h4 className="font-semibold mb-3">Quick Actions</h4>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={() => { addDonation(); }}>Simulate Donation</button>
          </div>
        </div>
      </div>
    </div>
  )
}
