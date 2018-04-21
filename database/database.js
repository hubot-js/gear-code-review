
'use strict';

exports.reviews = reviews;
exports.enqueue = enqueue;
exports.dequeue = dequeue;
exports.ranking = ranking;
exports.register = register;
exports.reviewChannel = reviewChannel;
exports.count = count;

const db = require('../src/db');

function reviews(hubot, maxDate) {
  return db.getDb().then(dataBase => dataBase.all(getQueueQuery(maxDate)));
}

function enqueue(hubot, username, reviewKey, param) {
  return db.getDb().then(dataBase =>
    dataBase.run('INSERT INTO review_queue(user, type, date, param) VALUES(?, ?, ?, ?)',
      [username, reviewKey, currentTime(), param]));
}

function dequeue(hubot, author) {
  return db.getDb().then(dataBase => dataBase.run('DELETE FROM review_queue WHERE user = ?', author.name));
}

function getQueueQuery(maxDate) {
  const where = maxDate ? `WHERE date < '${maxDate.toJSON()}'` : '';
  return `SELECT * FROM review_queue ${where} ORDER BY date ASC`;
}

function ranking () {
  return db.getDb().then(dataBase => dataBase.all('SELECT * FROM reviewer_ranking'));
}

function register (hubot, review, reviewer) {
  return db.getDb().then(dataBase => dataBase.run('INSERT INTO reviewer_ranking(user, type, date) VALUES(?, ?, ?)',
    [reviewer.name, review.type, currentTime()]));
}

function count(hubot, author) {
  return db.getDb().then(dataBase =>
    dataBase.get('SELECT COUNT(1) as count FROM review_queue WHERE user = ?', author.name)
      .then(result => result.count));
}

function reviewChannel () {
  return db.getDb().then(dataBase => dataBase.get('SELECT * FROM channel'));
}

function currentTime() {
  return (new Date()).toJSON();
}
