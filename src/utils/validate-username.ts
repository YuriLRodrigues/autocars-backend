export const validateUsername = (username: string): string => {
  const sanitizedUsername = username.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.]/g, '');

  return sanitizedUsername.charAt(0).toLowerCase() + sanitizedUsername.slice(1);
};
