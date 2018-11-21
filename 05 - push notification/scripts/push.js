function updateSubscription() {
    navigator.serviceWorker.getRegistration().then(function (reg) {
        reg.pushManager.getSubscription().then(function(sub) {
            if (sub === null) {
                subscribeToPush()
            } else {
                console.log('Subscription object: ', sub);
            }
        });
    });
}

function subscribeToPush() {
    navigator.serviceWorker.ready.then(function(reg) {
        reg.pushManager.subscribe({
            userVisibleOnly: true
        }).then(function(sub) {
            console.log('Endpoint URL: ', sub.endpoint);
        }).catch(function(e) {
            if (Notification.permission === 'denied') {
                console.warn('Permission for notifications was denied');
            } else {
                console.error('Unable to subscribe to push', e);
            }
        });
    });
}