import { parseString } from 'xml2js';
import async from 'async';
import fs from 'fs';

export const parseMessages = (messages) => new Promise((resolve, reject) => {
  const parsedMessages = [];

  async.forEach(
      messages,
      (message, callback) => {
        parseString(message.content, (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          parsedMessages.push({
            content: result,
            subject: message.subject,
          });

          fs.writeFile(
            `log/${message.subject.replace(' ', '_')}-${Date.now()}.xml`,
            message.content,
            (writeFileErr) => {
              if (writeFileErr) {
                reject(writeFileErr);
              }
            }
          );

          callback();
        });
      },
      (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(parsedMessages);
      }
    );
});
