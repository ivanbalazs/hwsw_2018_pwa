const dbName = 'pwa-demo-idb';
const dbVersion = 1;

function initDB(version) {
    console.log('Init DB started');

    const db = new Dexie(dbName);
    db.version(version).stores({
        crypto: '&name, historicalData'
    });

    return db.crypto.count(count => console.log(`There is ${count} crypto in the db`));
}

function openDBForReadWrite(callbackOnOpen, callbackOnError) {
    new Dexie(dbName).open()
        .then(callbackOnOpen.bind(this))
        .catch(callbackOnError ? callbackOnError.bind(this) : handleDBError.bind(this));
}

function saveCryptoToDB(cryptoCurrency, data) {
    openDBForReadWrite(db => {
        db.table('crypto').add({name: cryptoCurrency, historicalData: data})
            .then(() => console.log(`Crypto currency (${cryptoCurrency}) data saved`, cryptoCurrency))
            .catch(e => console.log('Crypto save error: ', e));
    });
}

function removeCryptoFromDB(cryptoCurrency) {
    openDBForReadWrite(db => {
        db.table('crypto').delete(cryptoCurrency)
            .then(() => console.log(`Crypto currency (${cryptoCurrency}) data remove`))
            .catch(e => console.log('Crypto remove error: ', e));
    });
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