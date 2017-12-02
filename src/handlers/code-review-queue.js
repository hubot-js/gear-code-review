'use strict';

exports.handle = handle;
exports.getPendingReviews = getPendingReviews;
exports.listReviews = listReviews;

const db = require('../../database/database');

function handle(hubot, message) {
  const user = hubot.getUser(message);
  getPendingReviews(message, hubot).then((reviews) => {
    if (reviews.length === 0) {
      hubot.speak(message, getEmptyMessage(hubot, user), { as_user: true });
    } else {
      hubot.speak(message, getQueueMessage(hubot, user, reviews), { as_user: true });
    }
  });
}

function getPendingReviews(message, hubot) {
  return db.reviews(hubot);
}

function getEmptyMessage(hubot, user) {
  return hubot.speech().hello(user).append('Fique tranquilo: estamos com todos os reviews em dia.').end();
}

function getQueueMessage(hubot, user, reviews) {
  return hubot.speech().hello(user).append('Segue a lista de reviews pendentes:')
    .append(listReviews(hubot, reviews)).end();
}

function listReviews(hubot, reviews) {
  const speecher = hubot.speech().paragraph();

  reviews.forEach(review => speecher.item().bold(review.user).append(' está esperando por um review').line());

  return speecher.end();
}
