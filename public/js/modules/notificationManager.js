class Notification {
    constructor(id, title, message, type, duration, dismissible, removeCallback, actions = []) {
        this.id = id;
        this.title = title;
        this.message = message;
        this.type = type;
        this.duration = duration;
        this.dismissible = dismissible;
        this.removeCallback = removeCallback;
        this.actions = actions;
        this.element = this.createElement();
    }


    createElement() {
        const notification = document.createElement('div');
        notification.id = this.id;
        notification.dataset.type = this.type;
        notification.classList.add('notification', this.type);
        notification.innerHTML = `
    <div class="notif-icon">${this.getIcon()}</div>
    <div class="notif-content">
        <div class="d-flex justify-between align-center">
        <div class="notif-title">${this.title}</div>
        <time style="margin-bottom" class="text-sm text-gray">11min ago</time>
        </div>
        <div class="notif-message text-sm">${this.message}</div>
        ${this.actions.length ? '<div class="notif-actions"></div>' : ''}
    </div>
    ${this.dismissible ? '<button class="notif-close">&times;</button>' : ''}
`;

if (this.actions.length) {
    const actionsContainer = notification.querySelector('.notif-actions');
    Object.assign(actionsContainer.style, {
        marginTop: '8px',
        display: 'flex',
        gap: '8px'
    });

    this.actions.forEach(action => {
        const button = document.createElement('button');
        button.innerHTML = action.label;
        Object.assign(button.style, {
            background: 'transparent',
            color: '#fff',
            border: `none`,
            borderRadius: '3px',
            padding: '5px 10px',
            fontSize: '13px',
            cursor: 'pointer',
        });
        button.addEventListener('click', () => {
            action.callback();
            this.remove(); // Optionally close after action
        });
        actionsContainer.appendChild(button);
    });
}



        const { background, borderColor, shadow } = this.getColor();
        Object.assign(notification.style, {
            padding: '20px 15px',
            background: background,
            color: '#fff',
            borderRadius: '5px 5px 2px 2px',
            boxShadow: shadow,
            borderBottom: `3px solid ${borderColor}`,
            opacity: '1',
            transition: 'opacity 0.3s, transform 0.3s ease-in-out',
            cursor: this.dismissible ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'flex-start',
            fontSize: '14px',
            minWidth: '250px',
            maxWidth: '400px',
            gap: '12px'
        });

        const titleElement = notification.querySelector('.notif-title');
        Object.assign(titleElement.style, {
            fontWeight: 'bold',
            fontSize: '15px',
            textTransform: 'uppercase',
            marginBottom: '5px'
        });

        const titleMessage = notification.querySelector('.notif-message');
        Object.assign(titleMessage.style, {
            lineHeight: '1.5',
        });

        const iconElement = notification.querySelector('.notif-icon');
        Object.assign(iconElement.style, {
            fontSize: '18px',
            background: this.getColor().glow
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
                top: '22px',
                right: '25px',
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
                    background: 'linear-gradient(90deg,rgba(34, 178, 156, 0.6),rgba(46, 45, 53, 0.6) 40%)',
                    borderColor: 'rgb(102 227 130)',
                    shadow: 'rgba(40, 167, 69, 0.5) 0px 4px 10px',
                    color: '#22b29d',
                    glow: 'rgb(34 178 157 / 30%)'
                };
            case 'error':
                return {
                    background: 'linear-gradient(90deg,rgba(237, 92, 97, 0.6),rgba(46, 45, 53, 0.6) 40%)',
                    borderColor: '#dc3545',
                    shadow: 'rgba(220, 53, 69, 0.5) 0px 4px 10px',
                    color: '#ed5c62',
                    glow: 'rgb(237 92 98 / 30%)'
                };
            case 'warning':
                return {
                    background: 'linear-gradient(90deg, #ffc1076e,rgba(46, 45, 53, 0.6) 40%)',
                    borderColor: '#ffc107',
                    shadow: 'rgba(255, 193, 7, 0.5) 0px 4px 10px',
                    color: '#f3c523',
                    glow: 'rgb(243 197 35 / 30%)'
                };
                case 'user':
                return {
                    background: 'transparent',
                    borderColor: 'transparent',
                    shadow: 'none',
                    color: '#323038',
                    glow: 'rgb(34 178 157 / 30%)'
                };
            default:
                return {
                    background: 'transparent',
                    borderColor: 'gray',
                    shadow: 'none',
                    color: '#323038',
                    glow: 'transparent',
                    border: '1px solid',
                };
        }
    }

    getIcon() {
        switch (this.type) {
            case 'success': return `<i style="background: ${this.getColor().color}" class="fa-solid fa-check"></i>`;
            case 'error': return `<i style="background: ${this.getColor().color}" class="fa-solid fa-xmark"></i>`;
            case 'warning': return `<i style="background: ${this.getColor().color}" class="fa-solid fa-exclamation"></i>`;
            case 'user': return `<i style="background: ${this.getColor().color}" class="fa-solid fa-user-astronaut"></i>`;
            default: return `<i style="background: ${this.getColor().color}; " class="fa-solid fa-user-astronaut"></i>`;
        }
    }
}

class NotificationManager {
    constructor(containerId = 'notification-container', position = 'bottom-right', customStyle = null) {
        this.container = document.getElementById(containerId) || this.createContainer(containerId, position, customStyle);
        this.notifications = new Map();
        this.notificationId = 0;
    }
    

    // createContainer(id) {
    //     const container = document.createElement('div');
    //     container.id = id;
    //     Object.assign(container.style, {
    //         position: 'fixed',
    //         bottom: '0px',
    //         right: '0px',
    //         padding: '20px',
    //         zIndex: '1000',
    //         display: 'flex',
    //         flexDirection: 'column-reverse',
    //         gap: '12px',
    //         alignItems: 'flex-end',
    //         overflowY: 'auto',
    //         overflowX: 'hidden',
    //         maxHeight: 'fit-content',
    //         height: '100%',
    //     });
    //     document.body.appendChild(container);
    //     return container;
    // }

    createContainer(id, position, customStyle) {
        const container = document.createElement('div');
        container.id = id;
    
        const baseStyles = {
            position: 'fixed',
            zIndex: '1000',
            display: 'flex',
            gap: '12px',
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '10px'
        };
    
        if (customStyle) {
            Object.assign(container.style, baseStyles, customStyle);
        } else {
            switch (position) {
                case 'top':
                    Object.assign(container.style, baseStyles, {
                        top: '0px',
                        left: '0px',
                        right: '0px',
                        flexDirection: 'column',
                        alignItems: 'center',
                    });
                    break;
                case 'top-right':
                    Object.assign(container.style, baseStyles, {
                        top: '0px',
                        right: '0px',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                    });
                    break;
                case 'bottom':
                    Object.assign(container.style, baseStyles, {
                        bottom: '0px',
                        left: '0px',
                        right: '0px',
                        flexDirection: 'column-reverse',
                        alignItems: 'center',
                    });
                    break;
                default:
                    Object.assign(container.style, baseStyles, {
                        bottom: '0px',
                        right: '0px',
                        flexDirection: 'column-reverse',
                        alignItems: 'flex-end',
                    });
            }
        }
    
        document.body.appendChild(container);
    
         
        
    
        return container;
    }

    enableClearBtn(html = null){
        const clearBtn = document.createElement('button');
        clearBtn.innerHTML = html || 'Clear All';
        Object.assign(clearBtn.style, {
            background: '#555',
            color: 'white',
            border: 'none',
            padding: '6px 10px',
            marginBottom: '10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
        });
        clearBtn.addEventListener('click', () => this.destroy());
        this.container.appendChild(clearBtn);
    }
    

    generateId() {
        return `notif-${this.notificationId++}`;
    }

    push(title, message, { type = 'info', duration = 3000, dismissible = true, actions = [] } = {}) {
        const id = this.generateId();
        const notification = new Notification(
            id, title, message, type, duration, dismissible,
            (id) => this.remove(id),
            actions
        );
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
