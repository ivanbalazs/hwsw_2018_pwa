const dbVersion = 1;
const dbName = `pwa-demo-idb-${version}`;

async function initDB() {
    const db = new Dexie(dbName);
    db.version(dbVersion).stores({
        crypto: '&name, historicalData',
    });

    return db.open();
}

function openDBForReadWrite(callbackOnOpen, callbackOnError) {
    new Dexie(dbName).open()
        .then(callbackOnOpen.bind(this))
        .catch(callbackOnError ? callbackOnError.bind(this) : handleDBError.bind(this));
}

async function readCryptoKeys() {
    return await new Promise(((resolve, reject) => openDBForReadWrite(async db => {
        const keys = await db.table('crypto').toCollection().uniqueKeys();
        resolve(keys);
    }, () => {
        reject([])
    })));
}

async function readCryptoHistoricalData(cryptoCurrency) {
    return await new Promise((resolve => openDBForReadWrite(async db => {
        const exchangeRates = await db.table('crypto').where({name: cryptoCurrency}).toArray();
        console.log('Data: ', exchangeRates[0].historicalData);
        resolve(exchangeRates[0].historicalData);
    })));
}

function handleDBError(e) {
    if (e.name === 'NoSuchDatabaseError') {
        initDB(dbVersion);
    } else {
        console.log(e);
    }
}
