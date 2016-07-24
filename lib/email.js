import config from 'config';
import mailx from 'mailx';

const emailConfig = config.get('email');
const { host, password, user } = emailConfig;

export const checkForMessage = () => (
  new Promise((resolve, reject) => {
    const store = mailx.store('pop3', host, 110, user, password);
    store.connect((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(store);
    });
  })

  .then((store) => (
    new Promise((resolve, reject) => {
      store.getInboxMessages(1, (err, messages) => {
        store.close();

        if (err) {
          reject(err);
          return;
        }
        if (messages.length === 0) {
          reject('no messages');
          return;
        }
        resolve(messages[0]);
      });
    })
  ))

  .then((message) => message.attachments)

  .then((attachments) => {
    if (attachments.length === 0) {
      throw new Error('no attachments');
    }

    if (attachments[0].fileName.indexOf('.xml') === -1) {
      throw new Error('not the correct file type');
    }

    return attachments[0].content.toString();
  })
);
