const pg = require('../util/pg');
db = module.exports = {};

const typedict={
    'us':0,
    'goal':1,
    'task':2
}

db.all = function () {
    return new Promise(function(resolve, reject) {
        pg.query(`
            select
                t.id,
                t.parentid,
                t.title,
                t.author,
                t.content,
                t.type as t,
                t.status,
                t.importance,
                t.estimate,
                t.hits,
                t.created,
                t.lastupdated,
                'update' as type
            from task t where t.parentid=0`).then(d => {
            resolve(d && d.rows)
        }).catch(err => {
            reject(err)
        })
    });
}
db.add = function(doc) {
    return new Promise(function(resolve, reject) {
        pg.query(`
insert into task(id,author,title,content,parentid,type,status,estimate,importance)
select $1,$2,$3,$4,$5,$6,$7,$8,$9 returning id;
            `, [doc.id, doc.author, doc.title, doc.content, doc.parentid, typedict[doc.t], doc.status, doc.estimate, doc.importance]).then(d => {
            resolve(d && d.rows)
        }).catch(err => {
            reject(err)
        })
    });
}
/*

id:1,
author:'a',
title:'a',
content:'a',
parentid:0,
type:'us',
status:'0',
estimate:'4'
importance:1
*/

// db.add({
//     id: 1,
//     author: 'a',
//     title: 'a',
//     content: 'a',
//     parentid: 0,
//     type: 0,
//     status: 0,
//     estimate: 4,
//     importance:1
// }).then(d => {
// })

db.get = function(id) {
    pg.query(`update task set hits=hits+1 where id = $1`, [id])
    return new Promise(function(resolve, reject) {
        pg.query(`
select
    t.id,
    t.parentid,
    t.title,
    t.author,
    t.content,
    t.type as t,
    t.status,
    t.importance,
    t.estimate,
    t.hits,
    t.created,
    t.lastupdated,
    'update' as type
from task t where t.id = $1`, [id]).then(d => {
            resolve(d && d.rows)
        }).catch(err => {
            reject(err)
        })
    });
}

db.by_parentid=function (parentid) {
    return new Promise(function(resolve, reject) {
        pg.query(`
            WITH RECURSIVE nodes(id,parentid) AS (
                SELECT s1.id,s1.parentid
                FROM task s1 WHERE parentid = $1
                    UNION
                SELECT s2.id, s2.parentid
                FROM task s2, nodes s1 WHERE s2.parentid = s1.id
            )
            SELECT
                t.id,
                t.author,
                t.title,
                t.content,
                t.hits,
                t.created,
                t.lastupdated,
                t.parentid,
                t.type as t,
                t.status,
                t.estimate,
                t.importance,
                'update' as type
            FROM nodes n
                left join task t on n.id = t.id;
            `,[parentid]).then(d => {
            resolve(d && d.rows)
        }).catch(err => {
            reject(err)
        })
    });
}

db.status = function (doc) {
    return new Promise(function(resolve, reject) {
        pg.query(`
update task set status = $2 where id = $1
            `,[doc.id,doc.status]).then(d => {
            resolve(d && d.rows)
        }).catch(err => {
            reject(err)
        })
    });
}
db.update = function(doc) {
    return new Promise(function(resolve, reject) {
        pg.query(`
update task set content = $2,author=$3,title=$4,importance=$5,estimate=$6,status=$7,type=$8,lastupdated=current_timestamp where id = $1
            `, [doc.id,doc.content, doc.author, doc.title,doc.importance,doc.estimate,doc.status,typedict[doc.t]]).then(d => {
            resolve(d && d.rows)
        }).catch(err => {
            reject(err)
        })
    });
}
