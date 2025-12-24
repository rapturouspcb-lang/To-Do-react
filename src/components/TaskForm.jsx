import React, { useState } from 'react'

export default function TaskForm({onAdd}){
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [priority, setPriority] = useState('medium')

  const submit = (e)=>{
    e.preventDefault()
    if(!title.trim()) return
    onAdd({title: title.trim(), date, priority})
    setTitle('')
    setDate('')
    setPriority('medium')
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-2">
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Task title" className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-[color:var(--card)]" />
      <input value={date} onChange={e=>setDate(e.target.value)} type="date" className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-[color:var(--card)]" />
      <select value={priority} onChange={e=>setPriority(e.target.value)} className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-[color:var(--card)]">
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <div className="md:col-auto">
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded">Add Task</button>
      </div>
    </form>
  )
}
