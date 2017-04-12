const Pool = require('pg').Pool;
const pg = require('../util/pg');
db = module.exports = {};


/* 从13上复制数据至本地数据库 */
// const config = require('../config.js');
// const ppg = new Pool(config.pg_pro);
// db.etl = function () {
//     ppg.query(`select w.openid,w.nickname,w.sex,w.province,w.city,w.country,w.headimgurl,w.unionid,w.role
//     from wxuser w`).then(d=>{
//         for (user of d.rows) {
//             db.add(user)
//         }
//     }).catch(err=>{
//     })
// }
// db.etl();

db.user = function(unionid) {
    return new Promise(function(resolve, reject) {
        pg.query(`
select w.openid,w.nickname,w.sex,w.province,w.city,w.country,w.headimgurl,w.unionid,w.role
from wxuser w
where w.unionid=$1
            `, [unionid]).then(d => {
            resolve(d && d.rows[0])
        }).catch(err => {
            reject(err)
        })
    });
}

db.add = function(user) {
    return new Promise(function(resolve, reject) {
        pg.query(`
insert into wxuser(openid,nickname,sex,province,city,country,headimgurl,unionid,role,realname,permission)
select $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11
            `, [user.openid,
            user.nickname,
            user.sex,
            user.province,
            user.city,
            user.country,
            user.headimgurl,
            user.unionid,
            user.role,
            user.realname,
            user.permission
        ]).then(d => {
            resolve(d && d.rows)
        }).catch(err => {
            reject(err)
        })
    });
}

// db.add({
//     openid:'oym8BtN0oYXvuxF_ULbj6RdRwBsE',
//     nickname:'龙龙',
//     sex:'1',
//     province:'Beijing',
//     city:'Haidian',
//     country:'China',
//     headimgurl:'http://wx.qlogo.cn/mmopen/PiajxSqBRaEJSMMpDyuicgoan3icE533ObhupqjxHibJ3fWw55ziaEpG8JJBr6Nic4Y5bfBgdxXMrVK91FBXgQ1kGDoQ/0',
//     unionid:'ohWYAswTXVtd8nHD9P3P7pSsUuXE',
//     role:'1111',
//     realname:'玉龙',
//     permission:'0'
// })


db.list=function () {
    return new Promise(function(resolve, reject) {
        pg.query(`
select
u.openid,
u.nickname,
u.sex,
u.province,
u.city,
u.country,
u.headimgurl,
u.unionid,
u.role,
u.realname,
u.permission
from wxuser u
            `).then(d => {
            resolve(d && d.rows)
        }).catch(err => {
            reject(err)
        })
    });
}

// db.list()
