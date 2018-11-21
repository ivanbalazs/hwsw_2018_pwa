const notificationOptions = {
    body: 'Click to open charts!',
    vibrate: [100, 50, 100],
    data: {
        dateOfArrival: Date.now(),
        cryptoCurrency: 1
    },
    actions: [
        {
            action: 'search', title: 'Search for currency'
        }
    ]
};

function showCurrencySaveNotification(text, cryptoCurrency) {
    if ("Notification" in window && navigator.serviceWorker) {
        if (Notification.permission === "granted") {
            notificationOptions.data.cryptoCurrency = cryptoCurrency;
            showNotification(text);
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                if (permission === "granted") {
                    notificationOptions.data.cryptoCurrency = cryptoCurrency;
                    showNotification(text);
                }
            });
        }
    }
}

function showNotification(text) {
    navigator.serviceWorker.getRegistration().then(function (reg) {
        reg.showNotification(text, notificationOptions);
    });
}