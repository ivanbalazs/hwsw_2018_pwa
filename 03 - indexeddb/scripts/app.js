(function () {
    console.log('Application started');

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js')
            .then(() => {
                console.log('Service Worker Registered');
            });
    }

    updateOnlineStatus();

    coinSelected('BTC');
    checkDownloadedCurrencies();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
})();

async function downloadAndUpdateCharts(cryptoCurrency) {
    const exchangeRates = await downloadExchangeData(cryptoCurrency);
    showCharts(exchangeRates);
}

async function downloadExchangeData(cryptoCurrency) {
    const cryptoCurrencyData = await fetch(`https://min-api.cryptocompare.com/data/histoday?fsym=${cryptoCurrency}&tsym=USD&limit=31&e=CCCAGG`)
        .then(response => response.json());
    const usdToHuf = await fetch('https://api.exchangeratesapi.io/latest?base=USD&symbols=HUF')
        .then(response => response.json());
    const usdToHufRate = usdToHuf.rates[Object.keys(usdToHuf.rates)[0]];

    return cryptoCurrencyData.Data.map(dayData => ({
        timestamp: dayData.time,
        date: new Date(dayData.time * 1000),
        usd: dayData.close.toFixed(2),
        huf: (dayData.close * usdToHufRate).toFixed(2)
    }));
}

async function checkDownloadedCurrencies() {
    readCryptoKeys().then((savedCryptos) => {
        savedCryptos.forEach(crypto => document.getElementById(`${crypto.toLowerCase()}Fav`).checked = true)
    }).catch(() => console.log('read keys failed'));
}

async function coinSelected(selectedCryptoCurrency) {
    const cryptoCurrency = event ? event.target.value : selectedCryptoCurrency;
    let savedCryptos = [];
    try {
        savedCryptos = await readCryptoKeys();
    } catch (e) {
        console.log('read keys failed');
    }

    if (savedCryptos.length > 0 && savedCryptos.indexOf(cryptoCurrency) > -1) {
        const exchangeRates = await readCryptoHistoricalData(cryptoCurrency);
        if (exchangeRates) {
            setChartsIsHidden(false);
        }
        showCharts(exchangeRates);
    } else if (navigator.onLine) {
        setChartsIsHidden(false);
        downloadAndUpdateCharts(cryptoCurrency);
    } else {
        setChartsIsHidden(true);
    }
}

function updateOnlineStatus() {
    if (!navigator.onLine) {
        document.getElementById('offline').className = 'show';
        this.setFavoritesIsDisabled(true);
    } else {
        document.getElementById('offline').className = '';
        this.setFavoritesIsDisabled(false);
    }
}

function setFavoritesIsDisabled(isDisabled) {
    const checkboxes = document.getElementsByClassName('fav-checkbox');
    for (let checkbox of checkboxes) {
        isDisabled ? checkbox.setAttribute('disabled', true) : checkbox.removeAttribute('disabled');
    }
}

function setChartsIsHidden(isHidden) {
    document.getElementById('noData').hidden = !isHidden;
    document.getElementById('usd').hidden = isHidden;
    document.getElementById('huf').hidden = isHidden;
}

async function favouriteChanged(cryptoCurrency) {
    if (event.target.checked && navigator.onLine) {
        const exchangeRates = await downloadExchangeData(cryptoCurrency);
        saveCryptoToDB(cryptoCurrency, exchangeRates);
    } else {
        removeCryptoFromDB(cryptoCurrency);
    }
}