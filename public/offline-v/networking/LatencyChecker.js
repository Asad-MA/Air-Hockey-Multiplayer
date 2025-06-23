class LatencyChecker {
    constructor() {
        this.latency = 0;
    }

    start(network) {
        setInterval(() => {
            network.checkLatency();
        }, 3000);
    }

    update(serverTime) {
        const clientTime = Date.now();
        this.latency = clientTime - serverTime;
        console.log(`📶 Latency: ${this.latency}ms`);
    }
}

export default LatencyChecker;
