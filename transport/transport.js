import config from 'config';
import fs from 'fs';
import Mariasql from 'mariasql';
import rowMap from './rowMap';

const dbConfig = config.get('db');
const { db, host, password, user } = dbConfig;

new Promise((resolve, reject) => {
  fs.readFile('./transport/lastrow.txt', 'utf8', (err, data) => {
    if (err) {
      return reject();
    }

    return resolve(parseInt(data, 10));
  });
})
.then(
  (lastId) => {
    const client = new Mariasql({
      db,
      host,
      user,
      password,
    });

    client.query(
      `select * from tbl_raw_reservation_data where id > ${lastId}`,
      (err, rows) => {
        if (err) {
          console.log(err);
          return;
        }

        rows.forEach(
          (row) => {
            const columns = [];
            const values = [];

            Object.keys(rowMap).forEach(
              (columnName) => {
                if (row[columnName]) {
                  columns.push(rowMap[columnName]);
                  values.push(row[columnName]);
                }
              }
            );
            const questionMarks = columns.map(() => '?');

            client.query(
              'delete from tbl_reservation_data where confirmation_number = ?',
              [row.confirm_number],
              (deleteErr) => {
                if (deleteErr) {
                  console.log(deleteErr);
                }

                const query = `insert into tbl_reservation_data (${columns.join(', ')}) values (${questionMarks})`; // eslint-disable-line max-len

                client.query(
                  query,
                  values,
                  (insertErr) => {
                    if (insertErr) {
                      console.log(insertErr);
                      return;
                    }

                    console.log('wrote', row.id);

                    fs.writeFile('./transport/lastrow.txt', row.id, (fileErr) => {
                      if (fileErr) {
                        console.log(fileErr);
                        return;
                      }
                    });
                  }
                );
              }
            );
          }
        );
      }
    );

    client.end();
  }
);
