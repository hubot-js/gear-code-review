'use strict';

exports.handle = handle;

const groupBy = require('group-by');
const db = require('../../database/database');

function handle(hubot, message) {
  db.ranking(hubot).then((reviewers) => {
    if (reviewers.length > 0) {
      hubot.speak(message, getMessage(hubot, reviewers));
    }
  });
}

function getMessage(hubot, reviewers) {
  return hubot.speech().append('code-review:codeReviewRanking.title')
    .append(getReviewers(hubot, reviewers)).end();
}

function getReviewers(hubot, reviewers) {
  const speecher = hubot.speech().paragraph();
  const group = map(reviewers).sort((a, b) => b.count - a.count);

  group.forEach(reviewer => speecher.item().bold(reviewer.name).separator('code-review:codeReviewRanking.list.partOne')
    .append(reviewer.count).append('code-review:codeReviewRanking.list.partTwo').line());

  speecher.line().append(thanks(hubot, group));

  return speecher.end();
}

function thanks(hubot, reviewers) {
  return hubot.speech().thanks(hubot.getUserByName(reviewers[0].name)).end();
}

function map(reviewers) {
  const internalMap = [];
  const group = groupBy(reviewers, 'user');

  Object.keys(group).forEach((key) => {
    internalMap.push({ name: key, count: group[key].length });
  });

  return internalMap;
}
