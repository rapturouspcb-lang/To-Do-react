import React from 'react'

const priorityColor = (p)=>{
  if(p==='high') return 'bg-red-200 text-red-800'
  if(p==='medium') return 'bg-yellow-200 text-yellow-800'
  return 'bg-green-200 text-green-800'
}

export default function TaskItem({task, onToggle, onRemove}){
  return (
    <li className="flex items-center justify-between p-3 rounded shadow-sm bg-[color:var(--card)]">
      <div className="flex items-center gap-3">
        <input type="checkbox" checked={task.completed} onChange={()=>onToggle(task.id)} />
        <div>
          <div className={`font-medium ${task.completed? 'line-through opacity-60':''}`}>{task.title}</div>
          <div className="text-xs text-slate-500">{task.date || 'No date'}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`${priorityColor(task.priority)} px-2 py-1 rounded text-sm`}>{task.priority}</span>
        <button onClick={()=>onRemove(task.id)} className="text-red-600">Delete</button>
      </div>
    </li>
  )
}
