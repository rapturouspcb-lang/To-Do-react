import React from 'react'

export default function Filters({priority, setPriority, date, setDate}){
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
      <select value={priority} onChange={e=>setPriority(e.target.value)} className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-[color:var(--card)]">
        <option value="all">All priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-[color:var(--card)]" />
      <button onClick={()=>{setPriority('all'); setDate('')}} className="px-3 py-2 rounded bg-slate-100 dark:bg-slate-800">Reset</button>
    </div>
  )
}
