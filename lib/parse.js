import { parseString } from 'xml2js';
import async from 'async';
import fs from 'fs';
import syslog from 'modern-syslog';

export const parseMessages = (messages) => new Promise((resolve, reject) => {
  const datasets = [];

  async.forEach(
      messages,
      (message, callback) => {
        const fileName = `log/${message.subject.replace(' ', '_')}-${Date.now()}.xml`;
        fs.writeFile(
          fileName,
          message.content,
          (writeFileErr) => {
            if (writeFileErr) {
              syslog.log(syslog.level.LOG_ERR, `Failed to write file ${fileName}`, () => {});
              callback();
              return;
            }

            parseString(message.content, (err, data) => {
              if (err) {
                syslog.log(syslog.level.LOG_ERR, `Failed to parse ${fileName}`, () => {});
                callback();
                return;
              }

              datasets.push(data);
              callback();
            });
          }
        );
      },
      (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(datasets);
      }
    );
});
