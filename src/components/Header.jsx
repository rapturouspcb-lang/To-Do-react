import React from 'react'

export default function Header({setTab, tab, setTasks, tasks}){
  const clearCompleted = ()=>{
    setTasks(tasks.filter(t=>!t.completed))
  }

  const toggleTheme = ()=>{
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.setItem('todo.theme', isDark? 'dark' : 'light')
  }

  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Smart Productivity Todo</h1>
        <p className="text-sm text-slate-500">Title + date + priority • Filters • Tabs • Light/Dark</p>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={toggleTheme} className="px-3 py-2 rounded bg-slate-100 dark:bg-slate-800">Theme</button>
        <button onClick={clearCompleted} className="px-3 py-2 rounded bg-red-100 text-red-700">Clear Done</button>
      </div>
    </header>
  )
}
