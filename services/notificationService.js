import { client } from '../config/redis-connection.js';

class NotificationService {
    constructor() {
        this.types = ['chat', 'challenge', 'invite' , 'friend'];
    }

    async send(userId, title, message, type, extra = {}) {
        if (!this.types.includes(type)) {
            throw new Error(`Unsupported notification type: ${type}`);
        }

        const payload = JSON.stringify({
            title,
            message,
            type,
            ...extra,
            timestamp: Date.now()
        });

        await client.publish(`notifications:${userId}`, payload);
        console.log(`Notification (${type}) sent to ${userId}`);
    }

    async storeOffline(userId, payload, ttlSeconds = 300) {
        const key = `offline_notifications:${userId}`;

        await client.rPush(key, JSON.stringify(payload));
        await client.expire(key, ttlSeconds); // expire after 5 minutes
        console.log(`Stored offline notification for ${userId} with TTL ${ttlSeconds}s`);
    }

    async fetchOffline(userId) {
        const key = `offline_notifications:${userId}`;
        const notifications = await client.lRange(key, 0, -1);
        await client.del(key); // Clear after sending
        return notifications.map(n => JSON.parse(n));
    }
}


export const notificationService = new NotificationService();

// Using Redis Stream for reliable deelivery
// class NotificationServiceR {
//     static async send(userId, type, message) {
//       const streamKey = `notifications:${userId}`;
  
//       await client.xAdd(streamKey, '*', { type, message });
//       await client.expire(`notifications:${userId}`, 300);
  
//       console.log(`Notification sent to ${userId}: ${message}`);
//     }
  
//     static async sendChat(userId, message) {
//       return this.send(userId, 'chat', message);
//     }
  
//     static async sendInvite(userId, message) {
//       return this.send(userId, 'invite', message);
//     }
  
//     static async sendChallenge(userId, message) {
//       return this.send(userId, 'challenge', message);
//     }
//   }
  
//   export default NotificationServiceR; 
