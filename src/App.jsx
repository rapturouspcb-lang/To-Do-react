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
  const [editTask, setEditTask] = useState(null)
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
            reminder: t.reminder ?? '',
            timezone: t.timezone ?? (typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC'),
            location: t.location ?? '',
            notified: t.notified ?? false,
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
    
    // Request notification permission
    if('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

// SAVE TASKS TO LOCAL STORAGE WHENEVER THEY CHANGE
useEffect(() => {
  if (tasks && tasks.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
}, [tasks]);

// CHECK FOR REMINDERS
useEffect(() => {
  const checkReminders = () => {
    const now = new Date()
    tasks.forEach(task => {
      if (task.reminder && !task.completed && !task.notified) {
        // Convert reminder time to current user's timezone for comparison
        const reminderTime = new Date(task.reminder)
        const reminderInUserTimezone = new Date(reminderTime.toLocaleString('en-US', {
          timeZone: task.timezone
        }))
        
        if (reminderInUserTimezone <= now) {
          // Show notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`Task Reminder: ${task.title}`, {
              body: `Don't forget to complete: ${task.title} (${task.timezone})`,
              icon: '/favicon.ico'
            })
          }
          
          // Mark as notified to avoid duplicate notifications
          setTasks(prev => prev.map(t => 
            t.id === task.id ? { ...t, notified: true } : t
          ))
        }
      }
    })
  }

  const interval = setInterval(checkReminders, 60000) // Check every minute
  
  // Check immediately on mount
  checkReminders()
  
  return () => clearInterval(interval)
}, [tasks])


   const addTask = (task)=>{
     if (editTask) {
       // Update existing task
       setTasks(prev => prev.map(t => t.id === editTask.id ? task : t))
       setEditTask(null)
     } else {
       // Add new task
       const newTask = {
         title: task.title ?? '',
         date: task.date ?? '',
         priority: task.priority ?? 'medium',
         reminder: task.reminder ?? '',
         timezone: task.timezone ?? (typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC'),
         location: task.location ?? '',
         notified: false,
         id: Date.now(),
         completed: false
       }
       setTasks(prev => [newTask, ...prev])
     }
   }

  const toggleComplete = (id)=>{
    setTasks(prev => prev.map(t => t.id===id?{...t,completed: !t.completed}:t))
  }

  const removeTask = (id)=> setTasks(prev => prev.filter(t=>t.id!==id))

  const editTaskHandler = (task)=>{
    setEditTask(task)
  }

  const cancelEdit = () => {
    setEditTask(null)
  }

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
          {editTask && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Editing: {editTask.title}
                </span>
              </div>
            </div>
          )}
          
          <TaskForm onAdd={addTask} editTask={editTask} onCancelEdit={cancelEdit} />
          
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
            <TaskList tasks={filtered} onToggle={toggleComplete} onRemove={removeTask} onEdit={editTaskHandler} />
          </div>
        </div>
      </div>
    </div>
  )
}