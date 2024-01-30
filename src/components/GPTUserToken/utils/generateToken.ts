const generateToken = (): { token: string; expirationTime: number } => {
  // Define possible characters in the token
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  // Generate a 16-character random token
  const token = Array.from({ length: 16 }, () =>
    characters.charAt(Math.floor(Math.random() * charactersLength))
  ).join('');

  const generateExpirationTime = (daysValid: number): number => {
    const currentTime = new Date().getTime(); // Current time in milliseconds
    const expirationTime = currentTime + daysValid * 24 * 60 * 60 * 1000; // Add daysValid in milliseconds
    return expirationTime;
  };

  // Calculate the expiration time (30 days from now)
  const currentTime = new Date().getTime();
  const daysValid = 30; // Token is valid for 30 days
  const expirationTime = generateExpirationTime(daysValid);
    
  return {
    token,
    expirationTime,
  };
};

export default generateToken;
