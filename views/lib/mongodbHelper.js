const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);


module.exports = {
    ObjectId,
    find(cName,sql,callback){
      async function main(cName,sql,callback) {
      await client.connect();
      console.log('db已连接');
      const db = client.db('GloryOfKings');
      const collection = db.collection(cName);
      // 要执行的sql语句
      const findResult = await collection.find(sql).toArray();
      callback(findResult)
      return 'done.';
    }
        main(cName,sql,callback)
        .then(console.log)
        .catch(console.error)
        .finally(() => client.close());    
    },
    insert(cName,sql,callback){
      async function main(cName,sql,callback) {
      await client.connect();
      console.log('db已连接');
      const db = client.db('GloryOfKings');
      const collection = db.collection(cName);
      // 要执行的sql语句
      const insertResult = await collection.insertOne(sql);
      callback(insertResult)
      return 'done.';
    }
        main(cName,sql,callback)
        .then(console.log)
        .catch(console.error)
        .finally(() => client.close());    
    },
    update(cName,compare,sql,callback){
      async function main(cName,sql,callback) {
      await client.connect();
      console.log('db已连接');
      const db = client.db('GloryOfKings');
      const collection = db.collection(cName);
      // 要执行的sql语句
      const updateResult = await collection.updateOne(compare,{ $set: sql });
      callback(updateResult)
      return 'done.';
    }
        main(cName,sql,callback)
        .then(console.log)
        .catch(console.error)
        .finally(() => client.close());    
    },
    delete(cName,sql,callback){
      async function main(cName,sql,callback) {
      await client.connect();
      console.log('db已连接');
      const db = client.db('GloryOfKings');
      const collection = db.collection(cName);
      // 要执行的sql语句
      const deleteResult = await collection.deleteOne(sql)
      callback(deleteResult)
      return 'done.';
    } 
        main(cName,sql,callback)
        .then(console.log)
        .catch(console.error)
        .finally(() => client.close());    
    },
    
}