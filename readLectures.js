var readLectures = function(text, next) {
	var lines = text.split(/[\r\n]+/);

	var lectures = [];
	lines.forEach(function(line) {
		var parts = line.split(/\t/);
		//console.dir(parts);
		//if (parts.length < 2 || parts[0] == 'Lecture') return;
		if (parts[0] == '') return
		if (parts[0] == 'Lecture') return
		if (/, 20[0-9]+/.test(parts[0])) return
		lectures.push(parts[0]);
	});
	lectures.sort();
	return lectures;
};

var fs = require('fs');
var assert = require('assert');
var malbery = readLectures(fs.readFileSync('data/malbery.txt').toString());
var ChristianB = readLectures(fs.readFileSync('data/ChristianB.txt').toString());
var bol = readLectures(fs.readFileSync('data/bol.txt').toString());

assert(malbery.indexOf('Approaching corners 3') >= 0);
assert(ChristianB.indexOf('Lunch Special Lecture 20') >= 0);

var _ = require('underscore');

/*
fs.writeFileSync('malbery.all.txt', JSON.stringify(malbery, null, 2));
fs.writeFileSync('ChristianB.all.txt', JSON.stringify(ChristianB, null, 2));
fs.writeFileSync('bol.all.txt', JSON.stringify(bol, null, 2));
fs.writeFileSync('malbery.only.txt', JSON.stringify(_.difference(_.difference(malbery, ChristianB), bol), null, 2));
fs.writeFileSync('ChristianB.only.txt', JSON.stringify(_.difference(_.difference(ChristianB, malbery), bol), null, 2));
fs.writeFileSync('bol.only.txt', JSON.stringify(_.difference(_.difference(bol, malbery), ChristianB), null, 2));
fs.writeFileSync('mablery_ChristianB_bol.all.txt', JSON.stringify(_.union(_.union(malbery, ChristianB), bol), null, 2));
fs.writeFileSync('mablery_ChristianB.overlap.txt', JSON.stringify(_.intersection(malbery, ChristianB), null, 2));
fs.writeFileSync('mablery_bol.overlap.txt', JSON.stringify(_.intersection(malbery, bol), null, 2));
fs.writeFileSync('bol_ChristianB.overlap.txt', JSON.stringify(_.intersection(bol, ChristianB), null, 2));
fs.writeFileSync('mablery_ChristianB.not.bol.txt', JSON.stringify(_.difference(_.intersection(malbery, ChristianB), bol), null, 2));
fs.writeFileSync('bol_ChristianB.not.mablery.txt', JSON.stringify(_.difference(_.intersection(bol, ChristianB), malbery), null, 2));
fs.writeFileSync('mablery_bol.not.ChristianB.txt', JSON.stringify(_.difference(_.intersection(malbery, bol), ChristianB), null, 2));
*/

var raccoon = require('raccoon');
var async = require('async');
function addLikes(user, likes, next) {
  async.eachLimit(likes, 20, function(like, next) {
  	//console.log(like);
  	raccoon.liked(user, like, next);
  }, function(err) {
  	console.log("Done "+user+": "+err);
  	next(err);
  });
};

async.eachSeries([["bol", bol], ["ChristianB", ChristianB], ["malbery", malbery]],
	function(userData, next) {
		addLikes(userData[0], userData[1], next);
	},
	function(err) {
		console.log("Overall: "+err);

		async.eachSeries(["bol", "ChristianB", "malbery"], function(user, next) {
			raccoon.recommendFor(user, 10, function(results){
				console.log("Recommendations for "+user+":");
		  	console.dir(results);
		  	next();
			});	
		}, function(err) {
			console.log(err);
		});
		
	});
