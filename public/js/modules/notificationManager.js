class Notification {
    constructor(id, title, message, type, duration, dismissible, removeCallback) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.type = type;
        this.duration = duration;
        this.dismissible = dismissible;
        this.removeCallback = removeCallback;
        this.element = this.createElement();
    }

    createElement() {
        const notification = document.createElement('div');
        notification.id = this.id;
        notification.classList.add('notification', this.type);
        notification.innerHTML = `
            <div class="notif-icon">${this.getIcon()}</div>
            <div class="notif-content">
                <div class="notif-title">${this.title}</div>
                <div class="notif-message">${this.message}</div>
            </div>
            ${this.dismissible ? '<button class="notif-close">&times;</button>' : ''}
        `;

        const { background, borderColor, shadow } = this.getColor();
        Object.assign(notification.style, {
            padding: '20px 15px',
            background: background,
            color: '#fff',
            borderRadius: '8px',
            boxShadow: shadow,
            borderBottom: `4px solid ${borderColor}`,
            opacity: '1',
            transition: 'opacity 0.3s, transform 0.3s ease-in-out',
            cursor: this.dismissible ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'flex-start',
            fontSize: '14px',
            minWidth: '250px',
            maxWidth: '350px',
            gap: '12px'
        });

        const titleElement = notification.querySelector('.notif-title');
        Object.assign(titleElement.style, {
            fontWeight: 'bold',
            fontSize: '16px',
            marginBottom: '5px'
        });

        const titleMessage = notification.querySelector('.notif-message');
        Object.assign(titleMessage.style, {
            lineHeight: '1.5',
        });

        const iconElement = notification.querySelector('.notif-icon');
        Object.assign(iconElement.style, {
            fontSize: '20px'
        });

        if (this.dismissible) {
            const closeButton = notification.querySelector('.notif-close');
            Object.assign(closeButton.style, {
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer',
                // position: 'absolute',
                top: '0',
                right: '5px',
                padding: '2px'
            });
            closeButton.addEventListener('click', () => this.remove());
        }

        if (this.duration > 0) {
            setTimeout(() => this.remove(), this.duration);
        }

        return notification;
    }

    update(newTitle, newMessage) {
        this.title = newTitle;
        this.message = newMessage;
        this.element.querySelector('.notif-title').textContent = newTitle;
        this.element.querySelector('.notif-message').textContent = newMessage;
    }

    remove() {
        this.element.style.opacity = '0';
        this.element.style.transform = 'translateX(100%)';
        setTimeout(() => {
            this.element.remove();
            this.removeCallback(this.id);
        }, 300);
    }

    getColor() {
        switch (this.type) {
            case 'success': 
                return {
                    background: 'linear-gradient(90deg, rgba(107, 255, 141, 0.43),rgba(20, 31, 83, 0.67) 40%)',
                    borderColor: 'rgb(102 227 130)',
                    shadow: 'rgba(40, 167, 69, 0.5) 0px 4px 10px'
                };
            case 'error': 
                return {
                    background: 'linear-gradient(90deg, #dc35456e,rgba(20, 31, 83, 0.67) 40%)',
                    borderColor: '#dc3545',
                    shadow: 'rgba(220, 53, 69, 0.5) 0px 4px 10px'
                };
            case 'warning': 
                return {
                    background: 'linear-gradient(90deg, #ffc1076e,rgba(20, 31, 83, 0.67) 40%)',
                    borderColor: '#ffc107',
                    shadow: 'rgba(255, 193, 7, 0.5) 0px 4px 10px'
                };
            default: 
                return {
                    background: 'linear-gradient(90deg, #0078d76e,rgba(20, 31, 83, 0.67) 40%)',
                    borderColor: '#62baff',
                    shadow: 'rgba(98, 186, 255, 0.5) 0px 4px 10px'
                };
        }
    }

    getIcon() {
        switch (this.type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            default: return 'ℹ️';
        }
    }
}

class NotificationManager {
    constructor(containerId = 'notification-container') {
        this.container = document.getElementById(containerId) || this.createContainer(containerId);
        this.notifications = new Map();
        this.notificationId = 0;
    }

    createContainer(id) {
        const container = document.createElement('div');
        container.id = id;
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '0px',
            right: '0px',
            padding: '20px',
            zIndex: '1000',
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: '12px',
            alignItems: 'flex-end',
            overflowY: 'auto',
            overflowX: 'hidden',
            maxHeight: 'fit-content',
            height: '100%',
        });
        document.body.appendChild(container);
        return container;
    }

    generateId() {
        return `notif-${this.notificationId++}`;
    }

    push(title, message, { type = 'info', duration = 3000, dismissible = true } = {}) {
        const id = this.generateId();
        const notification = new Notification(id, title, message, type, duration, dismissible, (id) => this.remove(id));
        this.add(notification);
        return id;
    }

    add(notification) {
        this.container.prepend(notification.element);
        this.notifications.set(notification.id, notification);
    }

    update(id, newTitle, newMessage) {
        const notification = this.notifications.get(id);
        if (notification) {
            notification.update(newTitle, newMessage);
        }
    }

    remove(id) {
        const notification = this.notifications.get(id);
        if (notification) {
            notification.remove();
            this.notifications.delete(id);
        }
    }

    destroy() {
        this.notifications.forEach((_, id) => this.remove(id));
    }
}


// Usage Example:
// const notifier = new NotificationManager();
// const notifId = notifier.push('Task completed!', { type: 'success', duration: 5000 });
// setTimeout(() => notifier.update(notifId, 'Updated Content!'), 2000);
// setTimeout(() => notifier.destroy(), 7000);

// Adding a notification manually:
// const customNotification = new Notification('custom-1', 'Manual Notification', 'warning', 4000, true, (id) => notifier.remove(id));
// notifier.add(customNotification);


export { NotificationManager, Notification };

// Usage Example:
// const notifier = new NotificationManager();
// const notifId = notifier.showNotification('Task completed!', { type: 'success', duration: 5000 });
// setTimeout(() => notifier.updateNotification(notifId, 'Updated Content!'), 2000);
