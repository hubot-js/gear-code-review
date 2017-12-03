'use strict';

exports.getReviewTasks = getReviewTasks;

function getReviewTasks(hubot) {
  return hubot.gears.filter(g => g.name === 'gear-code-review')[0]
                .tasks.filter(t => t.trigger === 'code-review');
}
