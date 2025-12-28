import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSafeDate(dateValue: string | Date | null | undefined, formatStr: string = 'MMM dd, yyyy'): string {
  if (!dateValue) return 'TBD';
  
  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
    if (isNaN(date.getTime())) return 'TBD';
    
    return format(date, formatStr);
  } catch (error) {
    console.warn('Date formatting error:', error);
    return 'TBD';
  }
}
