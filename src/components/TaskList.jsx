import React from 'react'
import TaskItem from './TaskItem'

export default function TaskList({tasks, onToggle, onRemove, onEdit}){
  if(tasks.length===0) return <div className="py-6 text-center text-slate-500">No tasks found</div>

  return (
    <ul className="space-y-2">
      {tasks.map(t=> (
        <TaskItem key={t.id} task={t} onToggle={onToggle} onRemove={onRemove} onEdit={onEdit} />
      ))}
    </ul>
  )
}
