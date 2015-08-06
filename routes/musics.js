/**
 * @author xialei <xialeistudio@gmail.com>
 */
var express = require('express');
var router = express.Router();
var music = require('../services/music');
/* GET users listing. */
router.get('/', function(req, res) {
	res.sendStatus(403);
});
//搜索
router.get('/search', function(req, res, next) {
	//res.send('respond with a resource');
	music.search(req.query.s, req.query.offset, req.query.limit, req.query.type, function(err, data) {
		if (err) {
			res.send({
				error: err.message
			});
		}
		else {
			res.send(data);
		}
	});
});
//歌手专辑
router.get('/artist/:id/albums', function(req, res, next) {
	music.artistAlbums(req.params.id, req.query.offset, req.query.limit, function(err, data) {
		if (err) {
			res.send({
				error: err.message
			});
		}
		else {
			res.send(data);
		}
	});
});
//专辑详情
router.get('/albums/:id', function(req, res, next) {
	music.album(req.params.id, req.query.offset, req.query.limit, function(err, data) {
		if (err) {
			res.send({
				error: err.message
			});
		}
		else {
			res.send(data);
		}
	});
});
//歌曲详情
router.get('/:id', function(req, res, next) {
	music.view(req.params.id, function(err, data) {
		if (err) {
			res.send({
				error: err.message
			});
		}
		else {
			res.send(data);
		}
	});
});
//歌单
router.get('/playlist/:id', function(req,res,next) {
	music.playlist(req.params.id, function(err,data) {
		if (err) {
			res.send({
				error: err.message
			});
		}
		else {
			res.send(data);
		}
	});
});
//歌词
router.get('/:id/lyric', function(req,res,next) {
	music.lyric(req.params.id, function(err,data) {
		if (err) {
			res.send({
				error: err.message
			});
		}
		else {
			res.send(data);
		}
	});
});
module.exports = router;
