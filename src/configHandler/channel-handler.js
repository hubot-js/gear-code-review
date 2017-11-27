'use strict';

const Q = require('q');

const db = require('../db');

exports.handle = handle;

function handle(hubot, awnser) {
  const channel = hubot.getChannelByName(awnser);

  const deferred = Q.defer();

  if (!channel) {
    deferred.reject('Canal não encontrado.');
  } else {
    deferred.resolve('Ok. Canal configurado.');
    db.getDb().then(database => database.run('UPDATE channel SET channel_name = ?', channel.id));
  }

  return deferred.promise;
}
