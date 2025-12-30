/**
 * Cron Expression Helper
 * Validates and provides human-readable descriptions for cron expressions
 */

export interface CronValidationResult {
  valid: boolean;
  error?: string;
  description?: string;
}

/**
 * Validate cron expression format
 */
export function validateCronExpression(expression: string): CronValidationResult {
  if (!expression || typeof expression !== 'string') {
    return {
      valid: false,
      error: 'Cron expression is required'
    };
  }

  const parts = expression.trim().split(/\s+/);
  
  if (parts.length !== 5) {
    return {
      valid: false,
      error: 'Invalid format. Expected 5 parts: minute hour day month dayOfWeek',
      description: 'Format: minute hour day month dayOfWeek'
    };
  }

  // Basic validation for each part
  const ranges = [
    { min: 0, max: 59, name: 'minute' },
    { min: 0, max: 23, name: 'hour' },
    { min: 1, max: 31, name: 'day' },
    { min: 1, max: 12, name: 'month' },
    { min: 0, max: 6, name: 'dayOfWeek' }
  ];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const range = ranges[i];
    
    // Allow wildcards and special characters
    if (part === '*' || part === '?') continue;
    
    // Check for valid characters
    if (!/^[\d\*\/\-\,]+$/.test(part)) {
      return {
        valid: false,
        error: `Invalid character in ${range.name} field`,
        description: `The ${range.name} field contains invalid characters`
      };
    }
  }

  // If valid, generate description
  const description = getCronDescription(expression);
  
  return {
    valid: true,
    description
  };
}

/**
 * Get human-readable description of cron expression
 */
export function getCronDescription(expression: string): string {
  if (!expression) return '';
  
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) return 'Invalid cron expression format';

  const [minute, hour, day, month, dayOfWeek] = parts;

  // Common patterns
  const patterns: Record<string, string> = {
    '0 0 * * *': 'Every day at midnight (00:00)',
    '0 0 * * 0': 'Every Sunday at midnight',
    '0 0 1 * *': 'First day of every month at midnight',
    '*/5 * * * *': 'Every 5 minutes',
    '*/15 * * * *': 'Every 15 minutes',
    '0 * * * *': 'Every hour at minute 0',
    '0 0,12 * * *': 'Twice daily at midnight and noon',
    '0 9 * * 1-5': 'Every weekday at 9:00 AM',
    '0 0 1 1 *': 'Every January 1st at midnight',
  };

  if (patterns[expression]) {
    return patterns[expression];
  }

  // Parse and describe
  let description = 'Runs ';

  // Minute
  if (minute === '*') {
    description += 'every minute';
  } else if (minute === '0') {
    description += 'at the start of the hour';
  } else if (minute.startsWith('*/')) {
    const interval = minute.substring(2);
    description += `every ${interval} minute${interval !== '1' ? 's' : ''}`;
  } else if (minute.includes(',')) {
    description += `at minutes ${minute}`;
  } else {
    description += `at minute ${minute}`;
  }

  // Hour
  if (hour !== '*') {
    if (hour === '0') {
      description += ' of midnight';
    } else if (hour.startsWith('*/')) {
      const interval = hour.substring(2);
      description += `, every ${interval} hour${interval !== '1' ? 's' : ''}`;
    } else if (hour.includes(',')) {
      description += `, at hours ${hour}`;
    } else if (hour.includes('-')) {
      description += `, between hours ${hour}`;
    } else {
      description += `, at hour ${hour}`;
    }
  }

  // Day
  if (day !== '*') {
    if (day.startsWith('*/')) {
      const interval = day.substring(2);
      description += `, every ${interval} day${interval !== '1' ? 's' : ''}`;
    } else if (day.includes(',')) {
      description += `, on days ${day}`;
    } else if (day.includes('-')) {
      description += `, on days ${day}`;
    } else {
      description += `, on day ${day} of the month`;
    }
  }

  // Month
  if (month !== '*') {
    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (month.includes(',')) {
      const months = month.split(',').map(m => monthNames[parseInt(m)] || m).join(', ');
      description += `, in ${months}`;
    } else if (month.includes('-')) {
      const [start, end] = month.split('-');
      description += `, from ${monthNames[parseInt(start)] || start} to ${monthNames[parseInt(end)] || end}`;
    } else {
      description += `, in ${monthNames[parseInt(month)] || month}`;
    }
  }

  // Day of week
  if (dayOfWeek !== '*') {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (dayOfWeek.includes(',')) {
      const days = dayOfWeek.split(',').map(d => dayNames[parseInt(d)] || d).join(', ');
      description += `, on ${days}`;
    } else if (dayOfWeek.includes('-')) {
      const [start, end] = dayOfWeek.split('-');
      description += `, from ${dayNames[parseInt(start)] || start} to ${dayNames[parseInt(end)] || end}`;
    } else if (dayOfWeek.includes('1-5')) {
      description += ', on weekdays (Monday-Friday)';
    } else {
      description += `, on ${dayNames[parseInt(dayOfWeek)] || dayOfWeek}`;
    }
  }

  return description;
}

