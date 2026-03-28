import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString()
}

export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString()
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'unread': return 'bg-red-500'
    case 'read': return 'bg-blue-500'
    case 'replied': return 'bg-green-500'
    case 'archived': return 'bg-gray-500'
    default: return 'bg-gray-500'
  }
}

export const calculatePagination = (currentPage: number, totalPages: number) => {
  const pages: number[] = []
  const maxVisible = 5
  
  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i)
      }
    }
  }
  
  return pages
}

