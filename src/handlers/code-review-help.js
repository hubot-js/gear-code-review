'use strict';

exports.handle = handle;
exports.getReviewTasks = getReviewTasks;

function handle(hubot, message) {
  hubot.speak(message, getMessage(hubot, hubot.getUser(message)));
}

function getMessage(hubot, user) {
  return hubot.speech().hello(user).append('Que tipo de tarefa você está fazendo?').append(getOptions(hubot)).end();
}

function getOptions(hubot) {
  const speecher = hubot.speech().paragraph();

  buildTasksDescription(hubot, speecher);

  return speecher.end();
}

function buildTasksDescription(hubot, speecher) {
  getReviewTasks(hubot).forEach(task => speecher.item().bold(task.trigger).separator().append(task.description).line());
}

function getReviewTasks(hubot) {
  return hubot.gears.filter(g => g.name === 'gear-code-review')[0]
                .tasks.filter(t => t.trigger === 'code-review');
}
