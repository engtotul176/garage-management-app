/**
 * Bangladesh Phone Number, Email, and Vehicle Number Validators
 */

export const isValidBDPhone = (phone: string): boolean => {
  // Matches Bangladesh mobile numbers: +8801... or 01... (11 digits)
  const bdPhoneRegex = /^(?:\+88)?01[3-9]\d{8}$/;
  return bdPhoneRegex.test(phone.trim());
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidBDVehicleNo = (vehicleNo: string): boolean => {
  return vehicleNo.trim().length >= 5;
};
