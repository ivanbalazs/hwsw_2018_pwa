(function () {
    console.log('Application started');

    downloadAndUpdateCharts('BTC');
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