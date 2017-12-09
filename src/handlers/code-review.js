'use strict';

exports.handle = handle;

const db = require('../../database/database');

function handle(hubot, message, task, params) {
  if (!hubot.isFromPrivate(message)) {
    return hubot.speak(message, getMessageForChannel(hubot));
  }

  const review = {
    key: task.key,
    message: task.options.message
  };

  return reviewFor(hubot, message, review, params);
}

function getMessageForChannel(hubot) {
  return hubot.speech('code-review:codeReview.private').end();
}

function reviewFor(hubot, message, review, params) {
  postMessage(hubot, message, review, params);
  enqueue(hubot, message, review);
}

function postMessage(hubot, message, review, params) {
  const author = hubot.getUser(message);

  db.reviewChannel(hubot).then((channel) => {
    const reviewChannel = channel.channel_name ? channel.channel_name : hubot.getChannelByName('general').id;
    hubot.speakTo(reviewChannel, getChannelMessage(hubot, review, author, params));
  });
}

function getChannelMessage(hubot, review, author, params) {
  return hubot.speech().channel().append(review.message)
    .replace('auth').replace('author', author).line().replace('reviewUrl', params[0]).end();
}

function enqueue(hubot, message, review) {
  const username = hubot.getUser(message).name;
  db.enqueue(hubot, username, review.key);
}
