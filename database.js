const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./invoices.db');

db.serialize(() => {
    // Drop existing tables to reset
    db.run(`DROP TABLE IF EXISTS invoices`);
    db.run(`DROP TABLE IF EXISTS payments`);
    db.run(`DROP TABLE IF EXISTS customers`);

    // Create tables
    db.run(`CREATE TABLE customers (
        customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL UNIQUE
    )`);

    db.run(`CREATE TABLE invoices (
        invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        invoice_no TEXT,
        container_no TEXT,
        car_details TEXT,
        vin_no TEXT,
        shipping_towing REAL DEFAULT 0.0,
        attestation REAL DEFAULT 0.0,
        duty REAL DEFAULT 0.0,
        bill REAL DEFAULT 0.0,
        vat REAL DEFAULT 0.0,
        clearing REAL DEFAULT 0.0,
        lifter REAL DEFAULT 0.0,
        total_amount REAL NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    )`);

    db.run(`CREATE TABLE payments (
        payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        amount_received REAL NOT NULL,
        payment_date TEXT DEFAULT (date('now')),
        received_by TEXT,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    )`);

    // Insert customers
    const customers = ['ATAL 6 NO', 'HUMAYUN', 'DR HANIF', 'DR.FARIED', 'QARI NIAMAT', 'HAJI AHMAD', 'DR.MALIK'];
    customers.forEach(name => db.run(`INSERT INTO customers (customer_name) VALUES (?)`, [name]));

    // ATAL 6 NO - First 5 Invoices
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [1, null, null, 'SIENNA WHITE 2007', '5TDZK23C77S098485', 76.0, 471.84, 882.25, 471.84, 78.91, 2012.34, 31.5, 2012.34]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [1, null, null, 'ALTIMA WHITE 2013', '1N4AL3AP5DC901688', 76.0, 225.94, 1002.25, 436.44, 35.0, 1807.13, 31.5, 1807.13]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [1, null, null, 'ALTIMA BLACK 2015', '1N4AL3AP0FC267953', 76.0, 206.9, 877.25, 302.9, 35.0, 1529.55, 31.5, 1529.55]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [1, '9014.0', 'MSMU5484373', 'SIENNA 2TONE 2007', '5TDZK23C37S023489', 76.0, 251.43, 894.0, 251.43, 78.91, 1583.27, 31.5, 1583.27]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [1, null, null, 'ALTIMA TAN 2014', '1N4AL3AP0EC168838', 76.0, 350.03, 894.0, 449.71, 78.91, 1880.15, 31.5, 1880.15]);
    db.run(`INSERT INTO payments (customer_id, amount_received, received_by) VALUES (?, ?, ?)`, [1, 15217.0, 'Waheed']);

    // HUMAYUN - First 5 Invoices (corrected "HUMYOUN" typo)
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [2, null, null, 'ALTIMA BLACK 2019', '1N4BL4CW8KC200963', 76.0, 979.67, 901.25, 1131.8, 103.3, 3223.52, 31.5, 3223.52]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [2, '13184.0', 'TIIU4769940', 'SIENNA WHITE 2006', '5TDBA22C26S059436', 76.0, 232.07, 1029.5, 232.07, 78.9, 1680.04, 31.5, 1680.04]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [2, '13160.0', 'CAIU9745526', 'SENTRA GRAY 2012', '5TDKK3DC1CS263625', 76.0, 375.0, 904.5, 375.0, 100.8, 1862.8, 31.5, 1862.8]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [2, null, null, 'ALTIMA WHTIE 2013', '1N4AL3AP3DC168590', 76.0, 188.0, 904.5, 188.0, 100.8, 1488.8, 31.5, 1488.8]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [2, null, null, 'SONATABLUE 2013', '5NPEC4AC2DH676441', 76.0, 171.71, 904.5, 171.71, 100.8, 1456.22, 31.5, 1456.22]);
    db.run(`INSERT INTO payments (customer_id, amount_received, received_by) VALUES (?, ?, ?)`, [2, 15000.0, 'Waheed']);

    // DR HANIF - First 5 Invoices ("SHIPPING / TPWING" into shipping_towing)
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [3, '12492.0', 'TCNU1251897', 'ALTIMA GRAY 2021', '1N4BL4CV7MN343143', 4702.7, 781.23, 869.0, 31.5, 35.0, 6495.43, 0.0, 6495.43]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [3, null, null, 'CAMRY BLUE 2021', '4T1G11AK6MU522188', 3545.4, 1461.0, 869.0, 31.5, 67.9, 6050.8, 0.0, 6050.8]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [3, '12921.0', 'MSMU4135119', 'CAMRY GRAY 2020', '4T1K61AK5LU977642', 76.0, 1363.0, 851.0, 31.5, 103.3, 2424.8, 0.0, 2424.8]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [3, null, null, 'CAMRY BLACK 2020', '4T1G11AK2LU360557', 76.0, 1245.0, 851.0, 31.5, 103.3, 2306.8, 0.0, 2306.8]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [3, null, null, 'ALTIMA SILVER 2019', '1N4BL4EV1KC256697', 76.0, 615.0, 851.0, 31.5, 103.3, 1676.8, 0.0, 1676.8]);

    // DR.FARIED - First 5 Invoices ("TOWING" into shipping_towing)
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [4, null, null, 'AVALON BROON 2011', '4T1BK3DB2BU393815', 0.0, 370.2, 974.75, 807.45, 68.9, 2252.8, 31.5, 2252.8]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [4, null, null, 'LEXUS ES350 BEIGE', 'JTHBK1EG0A2411076', 0.0, 560.05, 824.75, 560.05, 68.9, 2045.25, 31.5, 2045.25]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [4, null, null, 'COROLLA WHITE 2020', 'JTDEPRAEXLJ080003', 88.44, 0.0, 824.75, 1207.57, 68.9, 2221.16, 31.5, 2221.16]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [4, null, null, 'LS430 SILVER 2004', 'JTHBN36F240139381', 0.0, 425.77, 826.0, 425.77, 90.87, 1799.91, 31.5, 1799.91]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [4, null, null, 'AVALON RED 2016', '4T1BK1EB3GU200565', 376.46, 0.0, 974.75, 648.08, 75.34, 2106.13, 31.5, 2106.13]);
    db.run(`INSERT INTO payments (customer_id, amount_received, received_by) VALUES (?, ?, ?)`, [4, 16028.0, 'Waheed']);

    // QARI NIAMAT - First 2 Invoices (only 2 in data)
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [5, null, null, '4RUNNER WHITE 2017', 'JTEBU5JR2H5480897', 76.0, 2139.61, 913.5, 2364.76, 80.0, 5605.37, 31.5, 5605.37]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [5, null, null, '4RUNNER WHITE 2009', 'JTEZU14R99K025650', 76.0, 876.36, 913.5, 1056.63, 80.0, 3033.99, 31.5, 3033.99]);
    db.run(`INSERT INTO payments (customer_id, amount_received, received_by) VALUES (?, ?, ?)`, [5, 22000.0, 'Waheed']);

    // HAJI AHMAD - First 5 Invoices ("SHIPPING" into shipping_towing)
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [6, null, null, 'ELANTRA GRAY 2022', 'KMHLL4AG1NU325548', 0.0, 0.0, 824.75, 100.0, 26.5, 982.75, 31.5, 982.75]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [6, null, null, '4RUNNER GRAY 2008', 'JTEBU14RX80130886', 0.0, 608.91, 974.75, 761.68, 68.9, 2445.74, 31.5, 2445.74]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [6, null, null, 'CAMARO RED 2018', '1G1FB3DX5J0128175', 0.0, 1170.27, 824.75, 1347.16, 68.9, 3442.58, 31.5, 3442.58]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [6, '6320.0', 'TGBU5162421', 'RAV4 PURPLE 2018', '2T3RFREVXJW771559', 0.0, 450.02, 826.0, 1188.62, 90.87, 2587.01, 31.5, 2587.01]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [6, null, null, 'IMPALA BLUE 2018', '2G1105S3XJ9136046', 0.0, 532.08, 826.0, 532.08, 90.87, 2012.53, 31.5, 2012.53]);
    db.run(`INSERT INTO payments (customer_id, amount_received, received_by) VALUES (?, ?, ?)`, [6, 20720.0, 'Waheed']);

    // DR.MALIK - First 5 Invoices ("TOWING" into shipping_towing)
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [7, '6378.0', 'MRKU4862877', '4RUNNER TAN 2005', 'JTEZU14R550062474', 0.0, 414.95, 1084.75, 731.25, 51.34, 2313.79, 31.5, 2313.79]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [7, null, null, 'SONATA WHITE 2019', '5NPE34AFXKH780263', 0.0, 461.58, 1084.75, 1110.25, 51.34, 2739.42, 31.5, 2739.42]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [7, null, null, 'COROLLA BLACK 2022', '5YFEPMAE4NP294891', 0.0, 0.0, 1084.75, 1013.0, 51.34, 2180.59, 31.5, 2180.59]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [7, '6584.0', 'BSIU9010115', 'YARIS WHITE 2019', '3MYDLBYVXKY518518', 0.0, 829.91, 844.75, 1030.8, 57.9, 2794.86, 31.5, 2794.86]);
    db.run(`INSERT INTO invoices (customer_id, invoice_no, container_no, car_details, vin_no, shipping_towing, attestation, duty, bill, vat, clearing, lifter, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [7, null, null, 'SENTRA BLUE 2021', '3N1AB8DV3MY207788', 0.0, 0.0, 844.75, 117.0, 57.9, 1051.15, 31.5, 1051.15]);
    db.run(`INSERT INTO payments (customer_id, amount_received, received_by) VALUES (?, ?, ?)`, [7, 16387.18, 'Waheed']);
});

module.exports = db;