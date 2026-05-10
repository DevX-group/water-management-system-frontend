/**
 * Validation helpers for customer/user forms.
 * Extracted from UserManagementPage.tsx — logic unchanged.
 */

export const validateEmail = (email: string): boolean => {
  if (!email.trim()) return true; // Email is optional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/; // Expects 10 digits
  return phoneRegex.test(phone.replace(/\s+/g, ''));
};

export const validateNIC = (nic: string): boolean => {
  // Sri Lanka NIC: Either 9 digits + letter or 12 digits
  const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
  return nicRegex.test(nic.trim());
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validateAddress = (address: string): boolean => {
  return address.trim().length >= 5;
};
