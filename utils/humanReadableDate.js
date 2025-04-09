const timestampToHummanReadable = (expiry) => {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const diff = expiry - now; // Difference in seconds
 
    if (diff <= 0) return "Expired";

    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(diff / 86400);

    // console.log( `${days}d` ,  `${hours}h` ,  `${minutes}m`);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
};



const durationToMs = (duration) => {
    const unit = duration.slice(-1); // Get last character (m, h, d)
    const value = parseInt(duration, 10); // Extract numeric value

    switch (unit) {
        case "m": return value * 60 * 1000; // Minutes to milliseconds
        case "h": return value * 60 * 60 * 1000; // Hours to milliseconds
        case "d": return value * 24 * 60 * 60 * 1000; // Days to milliseconds
        default: throw new Error("Invalid time format! Use m, h, or d.");
    }
};




export {
    timestampToHummanReadable as timeToStr,
    durationToMs as StrToTime
};


