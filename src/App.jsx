import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import Filters from './components/Filters'

const STORAGE_KEY = 'todo.tasks.v1'
export default function App(){
  const [tasks, setTasks] = useState([])
  const [tab, setTab] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  useEffect(()=>{
    const raw = localStorage.getItem(STORAGE_KEY)
    if(raw){
      try{
        const parsed = JSON.parse(raw)
        if(Array.isArray(parsed)){
          const normalized = parsed.map(t=>({
            id: t.id ?? Date.now() + Math.floor(Math.random()*1000),
            title: t.title ?? '',
            date: t.date ?? '',
            priority: t.priority ?? 'medium',
            completed: !!t.completed
          }))
          setTasks(normalized)
        }
      }catch(err){
        console.warn('Failed to parse tasks from localStorage', err)
      }
    }
    const theme = localStorage.getItem('todo.theme') || 'light'
    document.documentElement.classList.toggle('dark', theme==='dark')
  }, [])

// SAVE TASKS TO LOCAL STORAGE WHENEVER THEY CHANGE
useEffect(() => {
  if (tasks && tasks.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
}, [tasks]);


  const addTask = (task)=>{
    const newTask = {
      title: task.title ?? '',
      date: task.date ?? '',
      priority: task.priority ?? 'medium',
      id: Date.now(),
      completed: false
    }
    setTasks(prev => [newTask, ...prev])
  }

  const toggleComplete = (id)=>{
    setTasks(prev => prev.map(t => t.id===id?{...t,completed: !t.completed}:t))
  }

  const removeTask = (id)=> setTasks(prev => prev.filter(t=>t.id!==id))

  const filtered = tasks.filter(t=>{
    if(tab==='active' && t.completed) return false
    if(tab==='completed' && !t.completed) return false
    if(priorityFilter!=='all' && t.priority!==priorityFilter) return false
    if(dateFilter && t.date!==dateFilter) return false
    return true
  })

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Header setTab={setTab} tab={tab} setTasks={setTasks} tasks={tasks} />

        <div className="mt-6 bg-[color:var(--card)] shadow-md rounded-lg p-4">
          <TaskForm onAdd={addTask} />
          <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <Filters
              priority={priorityFilter}
              setPriority={setPriorityFilter}
              date={dateFilter}
              setDate={setDateFilter}
            />
            <div className="mt-1 md:mt-0">
              <div className="inline-flex bg-slate-100 dark:bg-slate-800 rounded-md p-1">
                <button onClick={()=>setTab('all')} className={`px-3 py-1 rounded ${tab==='all'?'bg-white dark:bg-slate-700':''}`}>All</button>
                <button onClick={()=>setTab('active')} className={`px-3 py-1 rounded ${tab==='active'?'bg-white dark:bg-slate-700':''}`}>Active</button>
                <button onClick={()=>setTab('completed')} className={`px-3 py-1 rounded ${tab==='completed'?'bg-white dark:bg-slate-700':''}`}>Completed</button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <TaskList tasks={filtered} onToggle={toggleComplete} onRemove={removeTask} />
          </div>
        </div>
      </div>
    </div>
  )
}