import config from 'config';
import mailx from 'mailx';

const emailConfig = config.get('email');
const { host, password, user } = emailConfig;

export const checkForMessages = () => (
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
      store.getInboxMessages(0, (err, messages) => {
        store.close();

        if (err) {
          reject(err);
          return;
        }

        resolve(messages);
      });
    })
  ))

  .then((messages) => {
    const messagesWithAttachments = messages.filter(
      (message) => (
        message.attachments.length > 0 &&
        message.attachments[0].fileName.indexOf('.xml') !== -1
      )
    );

    return messagesWithAttachments.map(
      (message) => ({
        content: message.attachments[0].content.toString(),
        subject: message.subject,
      })
    );
  })
);
