/**
 * @author xialei <xialeistudio@gmail.com>
 */
var http = require('http'),
		_ = require('underscore'),
		queryString = require('querystring');
/**
 * 发起请求
 * @param path
 * @param data
 * @param method
 * @param headers
 * @param callback
 */
var request = function(path, data, method, headers, callback) {
	console.log(path);
	headers = _.extend(headers, {
		Cookie: 'appver=1.7.0',
		Referer: 'http://music.163.com/'
	});
	if (method == 'POST') {
		data = queryString.stringify(data);
		headers['Content-Type'] = 'application/x-www-form-urlencoded';
		headers['Content-Length'] = data.length;
	}
	var options = {
		host: 'music.163.com',
		port: 80,
		method: method,
		path: path,
		headers: headers
	};
	var req = http.request(options, function(res) {
		if (res.statusCode != 200) {
			callback(new Error('请求失败[code:' + res.statusCode + ']'));
		}
		else {
			var body = '';
			res.on('data', function(chunk) {
				body += chunk
			});
			res.on('end', function() {
				data = JSON.parse(body);
				if (data.code != 200) {
					callback(new Error('请求失败[code:' + data.code + ']'));
				}
				else {
					callback(null, data);
				}
			});
		}
	});
	if (method == 'POST') {
		req.write(data);
	}
	req.end();
};
//type参数说明
//var types = {
//	'1':'歌曲',
//	'10':'专辑',
//	'100':'歌手',
//	'1000':'歌单',
//	'1002':'用户',
//	'1004':'mv',
//	'1006':'歌词',
//	'1009':'主播电台'
//};
/**
 * 检测必填参数
 * @param s
 * @param offset
 * @param limit
 * @param type
 * @param callback
 */
var search = function(s, offset, limit, type, callback) {
	//参数检测
	if (_.isEmpty(s)) {
		callback(new Error('缺少参数s'));
		return;
	}
	//默认参数设置
	offset = offset || 0;
	limit = limit || 20;
	type = type || 1;
	//发起请求
	request('/api/search/pc', {
		s: s,
		offset: offset,
		limit: limit,
		type: type
	}, 'POST', {}, function(err, data) {
		if (err) {
			callback(err);
		}
		else {
			callback(null, data.result);
		}
	});
};
/**
 * 查看歌曲
 * @param id
 * @param callback
 */
var view = function(id, callback) {
	var query = queryString.stringify({
		id: id,
		ids: '[' + id + ']'
	});
	request('/api/song/detail?' + query, null, 'GET', {}, function(err, data) {
		if (err) {
			callback(err);
		}
		else {
			callback(null, data.songs[0]);
		}
	});
};
/**
 * 歌手专辑
 * @param id
 * @param offset
 * @param limit
 * @param callback
 */
var artistAlbums = function(id, offset, limit, callback) {
	offset = offset || 0;
	limit = limit || 10;
	var query = queryString.stringify({
		id: id,
		offset: offset,
		limit: limit,
		total: 'true'
	});
	request('/api/artist/albums/' + id + '?' + query, null, 'GET', {}, callback);
};
/**
 * 专辑
 * @param id
 * @param offset
 * @param limit
 * @param callback
 */
var album = function(id, offset, limit, callback) {
	offset = offset || 0;
	limit = limit || 10;
	var query = queryString.stringify({
		id: id,
		offset: offset,
		limit: limit,
		total: 'true',
		ext: 'true'
	});
	request('/api/album/' + id + '?' + query, null, 'GET', {}, function(err, data) {
		if (err) {
			callback(err);
		}
		else {
			callback(null, data.album);
		}
	});
};
/**
 * 歌单
 * @param id
 * @param callback
 */
var playlist = function(id, callback) {
	var query = queryString.stringify({
		id: id,
		updateTime: -1
	});
	request('/api/playlist/detail?' + query, null, 'GET', {}, function(err, data) {
		if (err) {
			callback(err);
		}
		else {
			callback(null, data.result);
		}
	});
};
/**
 * 歌词
 * @param id
 * @param callback
 */
var lyric = function(id, callback) {
	var query = queryString.stringify({
		os: 'pc',
		id: id,
		lv: '-1',
		kv: '-1',
		tv: '-1'
	});
	request('/api/song/lyric?' + query, null, 'GET', {}, function(err,data) {
		if(err){
			callback(err);
		}else{
			callback(null,data.lrc);
		}
	});
};
exports.search = search;
exports.view = view;
exports.artistAlbums = artistAlbums;
exports.album = album;
exports.playlist = playlist;
exports.lyric = lyric;