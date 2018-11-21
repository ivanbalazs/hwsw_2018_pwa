function showCharts(exchangeRates) {
    const timeSeries = exchangeRates.map(data => data.date);
    generateChart('usd', timeSeries, exchangeRates.map(data => data.usd));
    generateChart('huf', timeSeries, exchangeRates.map(data => data.huf));
}

function generateChart(chartName, timeSeries, dataSeries) {
    const chart = c3.generate({
        bindto: `#${chartName}`,
        data: {
            x: 'x',
            columns: [
                ['x', ...timeSeries],
                [chartName.toUpperCase(), ...dataSeries]
            ]
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d'
                }
            }
        }
    });
}