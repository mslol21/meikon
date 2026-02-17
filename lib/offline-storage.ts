"use client"

interface PendingRequest {
  id: string
  url: string
  method: string
  body: any
  timestamp: number
}

const STORAGE_KEY = "meikon_pending_sync"

export const offlineStorage = {
  saveRequest: (url: string, method: string, body: any) => {
    if (typeof window === "undefined") return

    const pending: PendingRequest[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    
    const newRequest: PendingRequest = {
      id: Math.random().toString(36).substring(7),
      url,
      method,
      body,
      timestamp: Date.now()
    }

    pending.push(newRequest)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pending))
    
    // Notify user
    console.log("Request saved for offline sync:", newRequest)
  },

  getPendingRequests: (): PendingRequest[] => {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
  },

  removeRequest: (id: string) => {
    if (typeof window === "undefined") return
    const pending: PendingRequest[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    const filtered = pending.filter(req => req.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  },

  clear: () => {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEY)
  }
}
