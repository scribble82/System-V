import { checkForMessage } from './email';
import { parseString } from 'xml2js';

checkForMessage()
  .then((content) => {
    parseString(content, (err, result) => {
      console.log(err, result);
    });
  })
  .catch((err) => console.log(err));
