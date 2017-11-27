'use strict';

exports.handle = handle;

const queue = require('./code-review-queue');
const help = require('./code-review-help');
const db = require('../../database/database');

function handle(hubot, message) {
  const reviewer = hubot.getUser(message);
  const types = help.getReviewTasks(hubot);

  queue.getPendingReviews(message, hubot).then((reviews) => {
    if (reviews.length === 0) {
      const user = hubot.getUser(message);
      hubot.speak(message, getEmptyMessage(hubot, user));
      return;
    }

    const found = reviews.find(review => pick(message, hubot, types, review, reviewer));

    if (!found) {
      nothingToReview(message, hubot, reviewer);
      return;
    }

    doReview(message, hubot, reviewer, found);
  });
}

function getEmptyMessage(hubot, user) {
  return hubot.speech().hello(user).append('Fique tranquilo: estamos com todos os reviews em dia.').end();
}

function doReview(message, hubot, reviewer, review) {
  const author = hubot.getUserByName(review.user);
  db.count(hubot, author).then((count) => {
    notify(message, hubot, reviewer, author);
    thanks(message, hubot, reviewer, author);
    score(hubot, review, reviewer, author, count);
    dequeue(hubot, author);
  });
}

function notify(message, hubot, reviewer, author) {
  hubot.speakTo(author.id, getNotifyMessage(hubot, reviewer, author));
}

function thanks(message, hubot, reviewer, author) {
  hubot.speakTo(message.channel, getThanksMessage(hubot, reviewer, author));
}

function dequeue(hubot, author) {
  db.dequeue(hubot, author);
}

function score(hubot, review, reviewer, author, count) {
  for (let i = 0; i < count; i++) {
    db.register(hubot, review, reviewer);
  }
}

function getNotifyMessage(hubot, reviewer, author) {
  return hubot.speech().hello(author).append('Chegou a hora.').user(reviewer)
    .append('está vindo fazer o seu review.').end();
}

function getThanksMessage(hubot, reviewer, author) {
  return hubot.speech().thanks(reviewer).append('Pode pegar o banquinho porque o')
    .user(author).append('está esperando.').end();
}

function pick(message, hubot, reviews, review, reviewer) {
  const task = reviews.find(r => r.key === review.type);

  if (task) {
    return reviewerIsNotTheAuthor(review, reviewer);
  }

  return taskNotFound();
}

function reviewerIsNotTheAuthor(review, reviewer) {
  return review.user !== reviewer.name;
}

function taskNotFound() {
  return false;
}

function nothingToReview(message, hubot, reviewer) {
  hubot.speak(message, getNothingToReviewMessage(hubot, reviewer));
}

function getNothingToReviewMessage(hubot, reviewer) {
  return hubot.speech().hello(reviewer)
    .append('Os reviews pendentes têm configurações que impedem que você faça o review.').end();
}
