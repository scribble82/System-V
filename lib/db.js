import async from 'async';
import config from 'config';
import Mariasql from 'mariasql';
import syslog from 'modern-syslog';

const dbConfig = config.get('db');
const { db, host, password, user } = dbConfig;

export const dataToDb = (datasets) => new Promise((resolve, reject) => {
  if (datasets.length === 0) {
    resolve();
    return;
  }

  const client = new Mariasql({
    db,
    host,
    user,
    password,
  });

  async.each(
    datasets,
    (dataset, callback) => {
      const details = dataset.Report.BillingDetail[0].Detail_Collection[0].Detail;
      const items = details.map((detail) => detail.$);

      async.each(
        items,
        (item, itemCallback) => {
          const keys = Object.keys(item);
          const columns = keys.map((key) => key.toLowerCase()).join(',');
          const questionMarks = keys.map(() => '?').join(',');
          const query = `insert into tbl_raw_reservation_data (${columns}) values (${questionMarks})`; // eslint-disable-line max-len
          const values = keys.map((key) => item[key]);

          client.query(
            query,
            values,
            itemCallback
          );
        },
        callback
      );
    },

    (err) => {
      if (err) {
        console.log(err); // eslint-disable-line no-console
        syslog.log(syslog.level.LOG_ERR, err, () => {});
      }

      client.end();
      resolve();
    }
  );
});
