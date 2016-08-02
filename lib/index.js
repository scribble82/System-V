import { checkForMessages } from './email';
import { dataToDb } from './db';
import { parseMessages } from './parse';
import syslog from 'modern-syslog';

// TODO delete messages after retrieval.
const task = () => {
  console.log('Checking for new messages');
  checkForMessages()
    .then(parseMessages)
    .then(dataToDb)

    .catch((err) => {
      console.log(err); // eslint-disable-line no-console
      syslog.log(syslog.level.LOG_ERR, err, () => {});
    });
};

task();
setInterval(task, 15 * 60 * 1000);
