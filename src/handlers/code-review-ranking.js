'use strict';

exports.handle = handle;

const groupBy = require('group-by');
const db = require('../../database/database');

function handle(hubot, message) {
  db.ranking(hubot).then((reviewers) => {
    hubot.speak(message, getMessage(hubot, reviewers));
  });
}

function getMessage(hubot, reviewers) {
  return hubot.speech().append('Os maiores revisores de código da história são:')
    .append(getReviewers(hubot, reviewers)).end();
}

function getReviewers(hubot, reviewers) {
  const speecher = hubot.speech().paragraph();
  const group = map(reviewers).sort((a, b) => b.count - a.count);

  group.forEach(reviewer => speecher.item().bold(reviewer.name).separator('Revisou ')
    .append(reviewer.count).append(' pedidos de review!').line());

  speecher.line().append(thanks(hubot, group));

  return speecher.end();
}

function thanks(hubot, reviewers) {
  return hubot.speech().thanks(hubot.getUserByName(reviewers[0].name)).end();
}

function map(reviewers) {
  const map = [];
  const group = groupBy(reviewers, 'user');
  for (const key in group) map.push({ name: key, count: group[key].length });
  return map;
}
