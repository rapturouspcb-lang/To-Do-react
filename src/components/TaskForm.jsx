import React, { useState, useEffect } from 'react'
import { locations, getTimezoneByLocation, getCitiesByCountry } from '../data/locations'

const timezones = [
  { value: 'Asia/Karachi', label: 'Pakistan (PKT)' },
  { value: 'Asia/Kolkata', label: 'India (IST)' },
  { value: 'Asia/Dhaka', label: 'Bangladesh (BDT)' },
  { value: 'Asia/Riyadh', label: 'Saudi Arabia (KST)' },
  { value: 'Asia/Dubai', label: 'UAE (GST)' },
  { value: 'America/New_York', label: 'US Eastern (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'US Pacific (PST/PDT)' },
  { value: 'Europe/London', label: 'UK (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Central Europe (CET/CEST)' },
  { value: 'Australia/Sydney', label: 'Australia (AEST/AEDT)' },
  { value: 'Asia/Tokyo', label: 'Japan (JST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'UTC', label: 'UTC' }
]

export default function TaskForm({onAdd, editTask, onCancelEdit}){
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [priority, setPriority] = useState('medium')
  const [reminder, setReminder] = useState('')
  const [timezone, setTimezone] = useState(() => {
    try {
      return typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC'
    } catch {
      return 'UTC'
    }
  })
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [location, setLocation] = useState('')
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  // Initialize form when editing
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title || '')
      setDate(editTask.date || '')
      setPriority(editTask.priority || 'medium')
      setReminder(editTask.reminder || '')
      setTimezone(editTask.timezone || 'UTC')
      setLocation(editTask.location || '')
      setSelectedCountry('')
      setSelectedCity('')
    }
  }, [editTask])

  // Handle location and timezone sync
  const handleLocationChange = () => {
    if (selectedCountry && selectedCity) {
      const timezone = getTimezoneByLocation(selectedCountry, selectedCity)
      if (timezone) {
        setTimezone(timezone)
        setLocation(`${selectedCity}, ${selectedCountry}`)
      }
    }
  }

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setIsGettingLocation(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          console.log('Got coordinates:', latitude, longitude)
          
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`)
            if (response.ok) {
              const data = await response.json()
              console.log('Address data:', data)
              const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
              setLocation(address)
              setUseManualTimezone(false) // Switch to auto timezone
              setSelectedCountry('')
              setSelectedCity('')
            } else {
              throw new Error('API request failed')
            }
          } catch (error) {
            console.error('Address lookup failed:', error)
            setLocation(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`)
          }
          setIsGettingLocation(false)
        },
        (error) => {
          console.error('Geolocation error:', error)
          let errorMessage = 'Location access denied'
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please allow location access.'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable.'
              break
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.'
              break
            default:
              errorMessage = 'Unknown error occurred.'
          }
          
          setLocation(errorMessage)
          setIsGettingLocation(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    } else {
      setLocation('Geolocation not supported by your browser')
    }
  }

  const resetForm = () => {
    setTitle('')
    setDate('')
    setPriority('medium')
    setReminder('')
    const defaultTimezone = typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC'
    setTimezone(defaultTimezone)
    setSelectedCountry('')
    setSelectedCity('')
    setLocation('')
  }

  const submit = (e)=>{
    e.preventDefault()
    if(!title.trim()) return
    
    const taskData = {
      title: title.trim(),
      date,
      priority,
      reminder,
      timezone,
      location
    }
    
    if (editTask) {
      onAdd({ ...taskData, id: editTask.id, completed: editTask.completed })
    } else {
      taskData.id = Date.now()
      taskData.completed = false
      taskData.notified = false
      onAdd(taskData)
    }
    
    resetForm()
    if (onCancelEdit) onCancelEdit()
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Task title" className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-[color:var(--card)]" />
        <input value={date} onChange={e=>setDate(e.target.value)} type="date" className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-[color:var(--card)]" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <select value={priority} onChange={e=>setPriority(e.target.value)} className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-[color:var(--card)]">
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select value={timezone} onChange={e=> setTimezone(e.target.value)} className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-[color:var(--card)]">
          {timezones.map(tz => (
            <option key={tz.value} value={tz.value}>{tz.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <input value={reminder} onChange={e=>setReminder(e.target.value)} type="datetime-local" className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-[color:var(--card)]" placeholder="Reminder" />
      </div>
      
      <div className="space-y-2">
        <div className="flex gap-2">
          <button type="button" onClick={getCurrentLocation} disabled={isGettingLocation} className="px-3 py-2 bg-green-600 text-white rounded text-sm disabled:bg-gray-400 hover:bg-green-700 transition-colors">
            {isGettingLocation ? 'Getting...' : '📍 Current Location'}
          </button>

          <input 
            value={location} 
            onChange={e=>{setLocation(e.target.value); setSelectedCountry(''); setSelectedCity(''); setUseManualTimezone(true);}} 
            placeholder="Or type location manually" 
            className="flex-1 p-2 rounded border border-slate-200 dark:border-slate-700 bg-[color:var(--card)]"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <select 
            value={selectedCountry} 
            onChange={e=> {
              setSelectedCountry(e.target.value)
              setSelectedCity('')
              setLocation('')
            }} 
            className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-[color:var(--card)]"
          >
            <option value="">Select Country</option>
            {locations.map(loc => (
              <option key={loc.country} value={loc.country}>{loc.country}</option>
            ))}
          </select>
          <select 
            value={selectedCity} 
            onChange={e=> {
              setSelectedCity(e.target.value)
              handleLocationChange()
            }} 
            disabled={!selectedCountry}
            className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-[color:var(--card)] disabled:bg-gray-100"
          >
            <option value="">Select City</option>
            {getCitiesByCountry(selectedCountry).map(city => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex gap-2 justify-end">
        {editTask && onCancelEdit && (
          <button type="button" onClick={onCancelEdit} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
            Cancel
          </button>
        )}
        <button type="submit" className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          {editTask ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </form>
  )
}
