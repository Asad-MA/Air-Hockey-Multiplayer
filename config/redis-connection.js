import { createClient } from 'redis';

// Create and configure Redis client
const client = createClient({
    username: 'default',
    password: 'kewM6kZ2drUhN5QAw3GI6wOtFfeaCj2j',
    socket: {
        host: 'redis-19697.c330.asia-south1-1.gce.redns.redis-cloud.com',
        port: 19697
    }
});

client.on('error', (err) => console.log('Redis Client Error', err.message));

// Connect Redis client
async function connectRedis() {
    await client.connect();
    console.log('Connected to Redis');
}

// Export the client and connection function
export { client, connectRedis };
