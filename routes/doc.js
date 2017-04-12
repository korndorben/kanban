const express = require('express');
const router = express.Router();
const config = require('../config.js');
const auth = require('../middleware/socket.middleware');
const docservice = require('../services/pg.doc.service');

router.get('/add', auth, function(req, res, next) {
    docservice.init().then(d => {
        res.redirect(`http://${config.server}/doc/edit${d[0].nextval}.html`)
        return
    }).catch(err => {
        res.json({
            code: 1,
            msg: 'err',
            data: JSON.stringify(err)
        })
    })
});
/* /doc/edit1357.html */
router.get('/edit:id.html', auth, function(req, res, next) {
    docservice.get(req.params.id).then(d => {
        res.render('doc.edit.html', {
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
router.get('/:id.html', auth, function(req, res, next) {
    docservice.get(req.params.id).then(d => {
        res.render('doc.html', {
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
    var content = req.body.content;
    if (!content) {
        res.json({
            code: 1,
            msg: 'content invalid',
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

    var title = req.body.title;
    if (!title) {
        res.json({
            code: 1,
            msg: 'title invalid',
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

    /*
    type = new,update
    */
    docservice[type]({
        id: id,
        title: title,
        content: content,
        author: author
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
module.exports = router;
