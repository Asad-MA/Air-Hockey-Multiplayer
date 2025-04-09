const getAgentMeta = (req) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgentString = req.headers["user-agent"];
    const parsedUserAgent = useragent.parse(userAgentString); // Parse details

    return {
        ip,
        browser: parsedUserAgent.family,      // Browser name (e.g., Chrome, Firefox)
        version: parsedUserAgent.major,       // Browser major version
        os: parsedUserAgent.os.family,        // OS (e.g., Windows, macOS, Linux)
        osVersion: parsedUserAgent.os.major,  // OS version
        device: parsedUserAgent.device.family // Device type (e.g., Desktop, Mobile)
    };
}


export default getAgentMeta;