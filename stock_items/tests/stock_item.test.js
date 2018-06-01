const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost/stockitemtest';
const faker = require('faker');

// MongoClient.connect(url, (err, db) => {
//     console.log("connected");
//     db.close();
// }); 

let items = [];
for(let i = 0; i < 20; i++){
    let name = faker.commerce.productName();
    let description = faker.commerce.productAdjective();
    items.push({ name, description });
}


MongoClient.connect(url, async (err, client) => {
    if(err){
        console.log(err);
    }

    const db = client.db('stockitemtest');
    await db.dropCollection('stockitems').then(result=> {
        console.log(result);
    });

    await db.collection('stockitems').insertMany(items).then(result=> {
        console.log(result);
    });
    client.close();
}); 

