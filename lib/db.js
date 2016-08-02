import async from 'async';
import config from 'config';
import Mariasql from 'mariasql';
import syslog from 'modern-syslog';

const dbConfig = config.get('db');
const { db, host, password, user } = dbConfig;

const itemToQuery = (tableName, item) => {
  const keys = Object.keys(item);
  const columns = keys.map((key) => key.toLowerCase()).join(', ');
  const questionMarks = keys.map(() => '?').join(', ');
  const query = `insert into ${tableName} (${columns}) values (${questionMarks})`; // eslint-disable-line max-len
  const values = keys.map((key) => item[key]);

  return {
    query,
    values,
  };
};

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
      const reportInfo = dataset.Report.table3[0].Detail_Collection[0].Detail[0].$;
      let query = itemToQuery('tbl_imported_reports', reportInfo);

      client.query(
        query.query,
        query.values,
        (err) => {
          if (err) {
            callback(err);
            return;
          }

          const data = dataset.Report.BillingDetail[0].Detail_Collection[0].Detail;
          const items = data.map((item) => item.$);

          async.each(
            items,
            (item, itemCallback) => {
              query = itemToQuery('tbl_raw_reservation_data', item);

              client.query(
                query.query,
                query.values,
                itemCallback
              );
            },
            callback
          );
        }
      );
    },

    (err) => {
      client.end();

      if (err) {
        reject(err);
        return;
      }

      resolve();
    }
  );
});
