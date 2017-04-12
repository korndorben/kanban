const express = require('express');
const router = express.Router();
const config = require('../config.js');
const auth = require('../middleware/socket.middleware');
const docservice = require('../services/pg.doc.service');
const taskservice = require('../services/pg.task.service');

/* userstory.begin */
router.get(['/', '/list', '/chat'], auth, function(req, res, next) {
    res.render('us')
})

router.get('/kb:parentid.html', auth,function(req, res, next) {
    taskservice.get(req.params.parentid).then(d => {
        res.render('kb.html', {
            d:d[0],
            parentid:req.params.parentid
        })
    }).catch(err => {
        res.json({
            code: 1,
            msg: 'err',
            data: JSON.stringify(err)
        })
    })
})
router.get(['/doc:id.html','/task:id.html','/doc:id','/task:id'], auth, function(req, res, next) {
    console.log(req.params.id);
    let template = ''
    switch (req.url[1]) {
        case 'd':
            template = 'doc.html'
            break;
        case 't':
            template = 'task.html'
    }
    docservice.get(req.params.id).then(d => {
        res.render(template, {
            task: d[0] || {
                id: req.params.id,
                title: 'title',
                author: 'author',
                content: '',
                type: 'add'
            }
        })
    }).catch(err => {
        res.json({
            code: 1,
            msg: 'err',
            data: JSON.stringify(err)
        })
    })
})


router.post('/hubottasks', function(req, res, next) {
    docservice.search(req.body.k).then(d => {
        let letter = []
        letter.push(`共找到***${d.length}***篇与***${req.body.k}***相关的文档,[添加文档](http://${config.server}/doc/add)\n`)
        letter.push(`|编号|标题|最后修改时间|`)
        letter.push(`|:---|:---|:---|`)
        for (let i = 0; i < d.length; i++) {
            letter.push(`| #${d[i].id} | [${d[i].title}](//${config.server}/doc${d[i].id}.html) | ${d[i].lastupdated} |`)
        }
        console.log(letter.join('\n'));

        res.send(letter.join('\n'))
        return false;
    }).catch(err => {
        res.json({
            code: 1,
            msg: 'err',
            data: JSON.stringify(err)
        })
    })
})
module.exports = router;
