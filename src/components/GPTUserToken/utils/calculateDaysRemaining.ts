const calculateDaysRemaining = (expirationTime: number | null): number => {
    // If expirationTime is null, return 0 days remaining
    if (expirationTime === null) {
        return 0;
    }

    const currentTime = new Date().getTime();
    const timeLeft = expirationTime - currentTime;

    // Check if the token is already expired
    if (timeLeft <= 0) {
        return 0;
    }

    // Calculate the days remaining
    const daysRemaining = Math.ceil(timeLeft / (1000 * 60 * 60 * 24)); // Convert from milliseconds to days
    return daysRemaining;
};

export default calculateDaysRemaining;
