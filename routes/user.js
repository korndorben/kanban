const express = require('express');
const router = express.Router();
const qrcode = require('qr-image');
// const marked = require('marked');
const auth = require('../middleware/socket.middleware');
const des = require('../util/descrypto');
const userservice = require('../services/pg.user.service.js');

/*
    appID: 'wxa2cda4c640f7a44a',
    appSecret: '081a080bba01f7b65b70af7d31702e45',


    { openid: 'o_BHRjkf8pTdgsCQh3-N_fXHxTLQ',
  nickname: '呢喃',
  sex: '1',
  province: '北京',
  city: '大兴',
  country: '中国',
  headimgurl: 'http://wx.qlogo.cn/mmopen/m1u9op8H1S3k1ZZmRzXnpmrgag02ibjkhhuqP0EOfAwXDK6O2ARQYFdnzVlEjNUFZxbrcCv4ibNxcVLwUPSFZiaiaw/0',
  privilege: [],
  unionid: 'ohWYAs6nISCEzsw-f1xIOUexD8jk',
  expires_in: '7200',
  refresh_token: '1A0CshCcbVFvA5ooDpkLNr9lZybpbP_GAMSI_2STzSEBYV2_I1z4wCHtqoXplsZKn7F7RZgS2RHOijX8d_YChjGiQzYYJElVKoW-XF8-eDA',
  appid: 'wx3207ade26406c657' }
    */
//微信端登录用页面
router.get('/auth/:uuid', function(req, res, next) {
    var uuid = req.params.uuid;
    var plainText = des.decryptDES(req.query.data, 'your-password-salt-here');
    var data = JSON.parse(plainText);
    res.io.in(uuid).emit('notify', {
        unionid: data.unionid
    })
    userservice.add(data).then(d => {
        /* 什么时候，唉一个WAP页面，点确认才登录 */
        res.json(`欢迎登录看板系统`)
    }).catch(err => {
        res.json(JSON.stringify(err))
        return
    })
})

//3 微信扫一扫打开此页面，该页面先要用户去授权
router.get('/url/:id', function(req, res, next) {
    res.redirect(`http://auth.mam.etao.cn/?returnUrl=http://${req.headers.host}/auth/${req.params.id}`)
})

//2 客户端使用src=图片地址?uuid=<uuid>，服务器端则以'http://${config.server}/url/uuid'为内容生成二维码图片
router.get('/qrimage', function(req, res, next) {
    var q = `http://${req.headers.host}/url/${req.query.uuid}`
    var img = qrcode.image(q, {
        size: 10,
        margin: 4,
        parse_url: true
    });
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    img.pipe(res);
})
router.get('/logout', function(req, res, next) {
    res.clearCookie('user');
    res.redirect('/login')
})

//二维码登录页面
router.get('/login', function(req, res, next) {
    res.render('login', { //1 生成UUID放到客户端，客户端加载完毕后直接连接服务器，服务器将其加入房间
        uuid: Math.random().toString(36).substr(10, 6),
        refer:req.query.returnUrl
    });
})
//微信端发送的登录指令
router.post('/login/:unionid', function(req, res, next) {
    userservice.user(req.params.unionid).then(d => {
        res.cookie('user', {
            unionid:d.unionid,
            nickname:d.nickname,
            headimgurl:d.headimgurl,
        }, {
            expires: new Date(Date.now() + 864000000),
            httpOnly: true,
        });
        res.json({
            code: 0,
            msg: 'ok',
            data: d
        })
        return;
    }).catch(err => {
        res.json({
            code: 1,
            msg: 'err',
            data: JSON.stringify(err)
        })
        return;
    })
})

module.exports = router;
