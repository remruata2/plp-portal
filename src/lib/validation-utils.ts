/**
 * Validation utilities for Indian phone numbers and voter IDs
 */

// Indian Phone Number Validation
// Format: 10 digits starting with 6, 7, 8, or 9
export function validateIndianPhoneNumber(phone: string): { isValid: boolean; error?: string } {
  // Remove all spaces, hyphens, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check if it's exactly 10 digits
  if (!/^\d{10}$/.test(cleaned)) {
    return {
      isValid: false,
      error: 'Phone number must be exactly 10 digits'
    };
  }
  
  // Check if it starts with 6, 7, 8, or 9
  if (!/^[6-9]/.test(cleaned)) {
    return {
      isValid: false,
      error: 'Phone number must start with 6, 7, 8, or 9'
    };
  }
  
  return { isValid: true };
}

// Format phone number to standard format (10 digits)
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return cleaned;
}

// Indian Voter ID Validation
// Format: 3 letters followed by 7 digits (e.g., ABC1234567)
export function validateIndianVoterID(voterId: string): { isValid: boolean; error?: string } {
  // Remove all spaces and convert to uppercase
  const cleaned = voterId.replace(/\s/g, '').toUpperCase();
  
  // Check if it matches the pattern: 3 letters + 7 digits
  if (!/^[A-Z]{3}\d{7}$/.test(cleaned)) {
    return {
      isValid: false,
      error: 'Voter ID must be 3 letters followed by 7 digits (e.g., ABC1234567)'
    };
  }
  
  return { isValid: true };
}

// Format voter ID to standard format (uppercase, no spaces)
export function formatVoterID(voterId: string): string {
  const cleaned = voterId.replace(/\s/g, '').toUpperCase();
  return cleaned;
}

// Display voter ID in readable format (ABC 1234567)
export function displayVoterID(voterId: string): string {
  const cleaned = voterId.replace(/\s/g, '').toUpperCase();
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  }
  return cleaned;
}

// ABHA ID Validation (14 digits)
export function validateABHAID(abhaId: string): { isValid: boolean; error?: string } {
  const cleaned = abhaId.replace(/[\s\-]/g, '');
  
  if (!/^\d{14}$/.test(cleaned)) {
    return {
      isValid: false,
      error: 'ABHA ID must be exactly 14 digits'
    };
  }
  
  return { isValid: true };
}

// Format ABHA ID (14 digits, optionally with hyphens)
export function formatABHAID(abhaId: string): string {
  const cleaned = abhaId.replace(/[\s\-]/g, '');
  return cleaned;
}

// Display ABHA ID in readable format (XX-XXXX-XXXX-XXXX)
export function displayABHAID(abhaId: string): string {
  const cleaned = abhaId.replace(/[\s\-]/g, '');
  if (cleaned.length === 14) {
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}-${cleaned.slice(10)}`;
  }
  return cleaned;
}
