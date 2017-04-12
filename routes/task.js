const express = require('express');
const router = express.Router();
const config = require('../config.js');
const auth = require('../middleware/socket.middleware');
const taskservice = require('../services/pg.task.service');
const docservice = require('../services/pg.doc.service');
const tips = {
    'add': {
        'us':'新增用户故事',
        'task':'新增任务'
    },
    'update':  {
        'us':'编辑用户故事',
        'task':'编辑任务'
    },
}

router.post('/all', auth, function(req, res, next) {
    taskservice.all().then(d => {
        res.json({
            code: 0,
            msg: 'ok',
            data: d
        })
    }).catch(err => {
        res.json({
            code: 1,
            msg: 'err',
            data: JSON.stringify(err)
        })
    })
})
router.post('/by_parentid:parentid',auth, function(req, res, next) {
    taskservice.by_parentid(req.params.parentid).then(d => {
        /*
            'us':0,
            'goal':1,
            'task':2
        */
        // let tree = util.listToTree(d, {
        //     idKey: 'id',
        //     parentKey: 'parentid',
        //     childrenKey: 'children'
        // });
        res.json({
            code: 0,
            msg: 'ok',
            data: d
        })
    }).catch(err => {
        res.json({
            code: 1,
            msg: 'err',
            data: JSON.stringify(err)
        })
    })
})
router.get('/add', auth, function(req, res, next) {
    let parentid = req.query.parentid || '';
    let t = req.query.t || ''
    docservice.init().then(d => {
        res.redirect(`http://${config.server}/task/edit${d[0].nextval}.html?t=${t}&parentid=${parentid}`)
        return
    }).catch(err => {
        res.json({
            code: 1,
            msg: 'err',
            data: JSON.stringify(err)
        })
    })
});
router.get('/edit:id.html', auth, function(req, res, next) {
    taskservice.get(req.params.id).then(d => {
        let s = d[0] || {}
        res.render('task.edit.html', {
            task: s,
            id: req.params.id,
            parentid: req.query.parentid || 0,
            type: s.type || 'add',
            _title: tips[s.type || 'add'][req.query.t],
            t: req.query.t,
            status: 0
        })
    }).catch(err => {
        res.json({
            code: 1,
            msg: 'err',
            data: JSON.stringify(err)
        })
    })
})
router.get('/:id.html', auth, function(req, res, next) {
    taskservice.get(req.params.id).then(d => {
        let s = d[0] || {}
        res.render('task.html', {
            task: s || {},
            id: req.params.id,
            parentid: req.query.parentid || 0,
            type: s.type || 'add',
            status: 0
        })
    }).catch(err => {
        res.json({
            code: 1,
            msg: 'err',
            data: JSON.stringify(err)
        })
    })
})

router.post('/status.html',auth, function(req, res, next) {
    var id = req.body.id;
    if (!id) {
        res.json({
            code: 1,
            msg: 'id invalid',
            data: {}
        })
        return;
    }

    var status = req.body.status;
    if (!status) {
        res.json({
            code: 1,
            msg: 'status invalid',
            data: {}
        })
        return;
    }
    taskservice.status({
        id: id,
        status: status
    }).then(d => {
        res.json({
            code: 0,
            msg: 'ok',
            data: d
        })
    }).catch(err => {
        res.json({
            code: 1,
            msg: 'err',
            data: JSON.stringify(err)
        })
    })
})
router.post('/:id.html', auth, function(req, res, next) {
    var id = req.body.id;
    if (!id) {
        res.json({
            code: 1,
            msg: 'id invalid',
            data: {}
        })
        return;
    }
    var parentid = req.body.parentid;
    if (!parentid) {
        res.json({
            code: 1,
            msg: 'parentid invalid',
            data: {}
        })
        return;
    }

    var title = req.body.title;
    if (!title) {
        res.json({
            code: 1,
            msg: 'title invalid',
            data: {}
        })
        return;
    }
    var importance = req.body.importance;
    if (!importance) {
        res.json({
            code: 1,
            msg: 'importance invalid',
            data: {}
        })
        return;
    }
    var estimate = req.body.estimate;
    if (!estimate) {
        res.json({
            code: 1,
            msg: 'estimate invalid',
            data: {}
        })
        return;
    }
    var author = req.body.author;
    if (!author) {
        res.json({
            code: 1,
            msg: 'author invalid',
            data: {}
        })
        return;
    }
    var content = req.body.content;
    if (!content) {
        res.json({
            code: 1,
            msg: 'content invalid',
            data: {}
        })
        return;
    }
    var status = req.body.status;
    if (!status) {
        res.json({
            code: 1,
            msg: 'status invalid',
            data: {}
        })
        return;
    }
    var type = req.body.type;
    if (!type) {
        res.json({
            code: 1,
            msg: 'type invalid',
            data: {}
        })
        return;
    }
    var t = req.body.t;
    if (!t) {
        res.json({
            code: 1,
            msg: 't invalid',
            data: {}
        })
        return;
    }

    /*
    type = new,update
    */
    taskservice[type]({
        id: id,
        author: author,
        title: title,
        content: content,
        parentid: parentid,
        status: status,
        estimate: estimate,
        importance: importance,
        t: t
    }).then(d => {
        res.json({
            code: 0,
            msg: 'ok',
            data: {}
        })
    }).catch(err => {
        res.json({
            code: 1,
            msg: 'err',
            data: JSON.stringify(err)
        })
    })
})
module.exports = router;
