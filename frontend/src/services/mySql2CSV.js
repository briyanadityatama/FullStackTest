'use strict';

const stringify  = require('csv-stringify');
const util       = require('util');
const fs         = require('fs');
const path       = require('path');
const mysql      = require('mysql');
const async      = require('async');

const dbhost = process.argv[2];
const dbuser = process.argv[3];
const dbpass = process.argv[4];
const dbname = process.argv[5];
const query  = process.argv[6];

var db;

return new Promise((resolve, reject) => {

    db = mysql.createConnection({
        host     : dbhost,
        user     : dbuser,
        password : dbpass,
        database : dbname
    });

    db.connect((err) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            reject(err);
        } else {
            resolve(db);
        }
    });
})
.then(db => {
    return new Promise((resolve, reject) => {
        db.query(query,
        [ ],
        (err, results, fields) => {
            if (err) reject(err);
            else resolve({ results, fields });
        });
    });
})
.then(context => {
    // console.log(util.inspect(context.fields));
    // console.log(util.inspect(context.results));

    return new Promise((resolve, reject) => {
        const columns = context.fields.map(field => field.name);
        const stringifier = stringify({
            delimiter: ',',
            header: true,
            columns: columns
        });

        stringifier.on('readable', () => {
          var row;
          while (row = stringifier.read()) {
            process.stdout.write(row.toString());
          }
        });
        stringifier.on('error', err => {
            reject(err);
        });
        stringifier.on('finish', () => {
            db.end();
            resolve();
        });

        context.results.forEach(result => {
            var towrite = columns.map(column => result[column]);
            stringifier.write(towrite);
        });

        stringifier.end();
    });
})
.catch(err => { console.error(err.stack); });
