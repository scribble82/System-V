import { checkForMessage } from './email';

checkForMessage()
  .then((content) => console.log(content))
  .catch((err) => console.log(err));
