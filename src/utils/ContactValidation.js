export const validatePhoneNumber = (phone) => {
    // Simple validation: starts with + and country code, followed by digits
    const regex = /^\+\d{1,3}\d{4,14}$/;
    return regex.test(phone);
  };
  