'use strict';

exports.handle = handle;

const db = require('../../database/database');

function handle(hubot, message, task) {
  if (!hubot.isFromPrivate(message)) {
    return hubot.speak(message, getMessageForChannel(hubot));
  }

  const review = {
    key: task.key,
    message: task.options.message
  };

  return reviewFor(hubot, message, review);
}

function getMessageForChannel(hubot) {
  return hubot.speech('Opa! Pode me pedir o review no privado.').end();
}

function reviewFor(hubot, message, review) {
  postMessage(hubot, message, review);
  enqueue(hubot, message, review);
}

function postMessage(hubot, message, review) {
  const author = hubot.getUser(message);

  db.reviewChannel(hubot).then((channel) => {
    const reviewChannel = channel.channel_name ? channel.channel_name : hubot.getChannelByName('general').id;
    hubot.speakTo(reviewChannel, getChannelMessage(hubot, review, author));
  });
}

function getChannelMessage(hubot, review, author) {
  return hubot.speech().channel().append(review.message).replace('auth').replace('author', author).end();
}

function enqueue(hubot, message, review) {
  const username = hubot.getUser(message).name;
  db.enqueue(hubot, username, review.key);
}
