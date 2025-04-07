class MessageHandler {
    constructor() {
        this.handlers = {};
    }

    register(type, callback) {
        this.handlers[type] = callback;
    }

    handle(type, data) {
        // if (this.handlers[type]) {
        //     this.handlers[type](data);
        // } else {
        //     console.warn(`⚠️ No handler for message type: ${type}`);
        // }
    }
}

export default MessageHandler;
