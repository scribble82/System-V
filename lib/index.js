import { checkForMessages } from './email';
import { parseMessages } from './parse';
import syslog from 'modern-syslog';

// TODO poll every 15 mins
checkForMessages()
  .then(parseMessages)

  .catch((err) => {
    console.log(err); // eslint-disable-line no-console
    syslog.log(syslog.level.LOG_ERR, err, () => {});
  });
