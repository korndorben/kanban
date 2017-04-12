const pg = require('../util/pg');
db = module.exports = {};

db.init = function () {
    return new Promise(function(resolve, reject) {
        pg.query(`select nextval('docs_id_seq'),'new' as type`).then(d => {
            resolve(d && d.rows)
        }).catch(err => {
            reject(err)
        })
    });
}
// var conn = require('../util/conn')
// db.test = function() {
//     conn.read.query `select id,title,content from taskentities`.then(d => {
//         for (let doc of d) {
//             db.add({
//                 id:doc.id,
//                 author: 'admin',
//                 title: doc.title,
//                 content: doc.content
//             });
//         }
//     })
// }
// setTimeout(function() {
//     db.test()
// }, 1000)

db.add = function(doc) {
    return new Promise(function(resolve, reject) {
        pg.query(`
insert into docs(id,author,title,content)
select $1,$2,$3,$4 returning id;
            `, [doc.id,doc.author, doc.title, doc.content]).then(d => {
            resolve(d && d.rows)
        }).catch(err => {
            reject(err)
        })
    });
}

// db.add({
//     author: 'zbk',
//     title: 'minio',
//     content: 'asdfasdf'
// }).then(d=>{
// })

db.get = function(id) {
    return new Promise(function(resolve, reject) {
        pg.query(`select d.id,d.author,d.title,d.content,d.hits,d.created,d.lastupdated,'update' as type from docs d where d.id = $1`, [id]).then(d => {
            resolve(d && d.rows)
        }).catch(err => {
            reject(err)
        })
    });
}

db.update = function (doc) {
    return new Promise(function(resolve, reject) {
        pg.query(`
update docs set content = $1,author=$2,title=$3,lastupdated=current_timestamp where id = $4
            `,[doc.content,doc.author,doc.title,doc.id]).then(d => {
            resolve(d && d.rows)
        }).catch(err => {
            reject(err)
        })
    });
}
// db.update({
//     id:1353,
//     content:'1233211234567'
// })

// db.get(1)
db.search = function(k) {
    return new Promise(function(resolve, reject) {
        pg.query(`select d.id,d.author,d.title,d.content,d.hits,d.created,d.lastupdated from docs d where d.title ~ $1 or d.content ~ $1`, [k]).then(d => {
            resolve(d && d.rows)
        }).catch(err => {
            reject(err)
        })
    });
}

db.tasks = function () {
    return new Promise(function(resolve, reject) {
        pg.query(`
select d.id,d.author,d.title,d.content,d.hits,d.created,d.lastupdated from docs d
            `).then(d => {
            resolve(d && d.rows)
        }).catch(err => {
            reject(err)
        })
    });
}

// db.search('asd')
