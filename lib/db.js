import async from 'async';
import config from 'config';
import Mariasql from 'mariasql';

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
      console.log(items);
      callback();
    },
    (err) => {
      client.end();
      resolve();
    }
  );

  // client.query(
  //   'select * from tbl_reservation_data',
  //   null,
  //   { useArray: true },
  //   (err, rows) => {
  //     if (err) {
  //       reject(err);
  //       return;
  //     }
  //
  //     console.dir(rows);
  //   }
  // );
});
