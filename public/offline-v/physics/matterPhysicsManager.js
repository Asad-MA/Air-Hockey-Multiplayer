// MatterPhysicsManager.js

class MatterPhysicsManager {
    constructor(scene) {
        this.scene = scene;
    }

    addGameObject(gameObject, options = {}) {
        // Adds the game object to the Matter physics world.
        // Options can be used to pass additional configuration.
        return this.scene.matter.add.gameObject(gameObject, options);
    }

    setCollideWorldBounds(gameObject) {
        // Matter doesn't have this directly, you would have to define it manually
        const bounds = this.scene.matter.world.bounds;
        gameObject.setCollidesWith(bounds);
    }

    setBounce(gameObject, value) {
        gameObject.setBounce(value);
    }

    setVelocity(gameObject, x, y) {
        gameObject.setVelocity(x, y);
    }

    setPosition(gameObject, x, y) {
        gameObject.setPosition(x, y);
    }

    addCollider(object1, object2, callback = null) {
        this.scene.matter.world.on('collisionstart', (event) => {
            for (const pair of event.pairs) {
                const { bodyA, bodyB } = pair;
                if (bodyA.gameObject === object1 && bodyB.gameObject === object2 || bodyA.gameObject === object2 && bodyB.gameObject === object1) {
                    if (callback) callback(object1, object2);
                }
            }
        });
    }

    setDrag(gameObject, dragX, dragY) {
        gameObject.setFrictionAir(dragX);  // For Matter, drag is handled via air friction
    }
}

export default MatterPhysicsManager;
