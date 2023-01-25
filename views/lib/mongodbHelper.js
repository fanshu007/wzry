const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);


module.exports = {
    ObjectId,
    find(dbName,cName,sql,callback){
      async function main(dbName,cName,sql,callback) {
      await client.connect();
      console.log('db已连接');
      const db = client.db(dbName);
      const collection = db.collection(cName);
      // 要执行的sql语句
      const findResult = await collection.find(sql).toArray();
      callback(findResult)
      return 'done.';
    }
        main(dbName,cName,sql,callback)
        .then(console.log)
        .catch(console.error)
        .finally(() => client.close());    
    },
    insert(dbName,cName,sql,callback){
      async function main(dbName,cName,sql,callback) {
      await client.connect();
      console.log('db已连接');
      const db = client.db(dbName);
      const collection = db.collection(cName);
      // 要执行的sql语句
      const insertResult = await collection.insertOne(sql);
      callback(insertResult)
      return 'done.';
    }
        main(dbName,cName,sql,callback)
        .then(console.log)
        .catch(console.error)
        .finally(() => client.close());    
    },
    update(dbName,cName,compare,sql,callback){
      async function main(dbName,cName,sql,callback) {
      await client.connect();
      console.log('db已连接');
      const db = client.db(dbName);
      const collection = db.collection(cName);
      // 要执行的sql语句
      const updateResult = await collection.updateOne(compare,{ $set: sql });
      callback(updateResult)
      return 'done.';
    }
        main(dbName,cName,sql,callback)
        .then(console.log)
        .catch(console.error)
        .finally(() => client.close());    
    },
    delete(dbName,cName,sql,callback){
      async function main(dbName,cName,sql,callback) {
      await client.connect();
      console.log('db已连接');
      const db = client.db(dbName);
      const collection = db.collection(cName);
      // 要执行的sql语句
      const deleteResult = await collection.deleteOne(sql)
      callback(deleteResult)
      return 'done.';
    } 
        main(dbName,cName,sql,callback)
        .then(console.log)
        .catch(console.error)
        .finally(() => client.close());    
    },
    
}