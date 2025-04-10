// ArcadePhysicsManager.js

class ArcadePhysicsManager {
    constructor(scene) {
        this.scene = scene;
    }

    addGameObject(gameObject, options = {}) {
        // For Arcade Physics, add the object to the physics system.
        // Note: Arcade's add.existing doesn't accept additional options, so options can be used for custom setups.
        this.scene.physics.add.existing(gameObject);
        return gameObject;
    }

    setCollideWorldBounds(gameObject) {
        gameObject.setCollideWorldBounds(true);
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
        console.log(this.scene);
        this.scene.physics.add.collider(object1, object2, callback , null, this.scene);
    }

    setDrag(gameObject, dragX, dragY) {
        gameObject.setDrag(dragX, dragY);
    }
}

export default ArcadePhysicsManager;
