/**
 * Utility functions for date and time handling, specifically for Colombia (UTC-5)
 */

/**
 * Returns a proper ISO string in UTC.
 * We use this to save to the database so that it's standard.
 */
export const getNowISO = (): string => {
  return new Date().toISOString();
};

/**
 * Returns just the date part in Colombia timezone (YYYY-MM-DD)
 */
export const getColombiaDateString = (): string => {
  const date = new Date();
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

/**
 * Returns the current time in Colombia (HH:mm)
 */
export const getColombiaTimeShort = (): string => {
  const date = new Date();
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Bogota',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
};

/**
 * Returns a local ISO string (YYYY-MM-DDTHH:mm:ss) for Colombia.
 * Useful for datetime-local inputs.
 */
export const getColombiaISO = (): string => {
  const date = new Date();
  const year = new Intl.DateTimeFormat('en', { timeZone: 'America/Bogota', year: 'numeric' }).format(date);
  const month = new Intl.DateTimeFormat('en', { timeZone: 'America/Bogota', month: '2-digit' }).format(date);
  const day = new Intl.DateTimeFormat('en', { timeZone: 'America/Bogota', day: '2-digit' }).format(date);
  const hour = new Intl.DateTimeFormat('en', { timeZone: 'America/Bogota', hour: '2-digit', hour12: false }).format(date);
  const minute = new Intl.DateTimeFormat('en', { timeZone: 'America/Bogota', minute: '2-digit' }).format(date);
  const second = new Intl.DateTimeFormat('en', { timeZone: 'America/Bogota', second: '2-digit' }).format(date);
  
  return `${year}-${month}-${day}T${hour === '24' ? '00' : hour}:${minute}:${second}`;
};

/**
 * Returns a display string forced to Colombia timezone.
 * Format: DD/MM/YYYY HH:mm
 */
export const formatColombia = (dateInput: any): string => {
  if (!dateInput) return '';
  try {
    let date: Date;
    if (dateInput.toDate && typeof dateInput.toDate === 'function') {
      date = dateInput.toDate();
    } else {
      date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    }
    
    if (!(date instanceof Date) || isNaN(date.getTime())) return String(dateInput);
    
    return new Intl.DateTimeFormat('es-CO', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  } catch (e) {
    return String(dateInput);
  }
};
