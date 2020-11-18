const express = require('express');
const router = express.Router();
const emailValidator = require("email-validator");
const xlsx = require("xlsx");
const mysql = require('mysql');
const fileUpload = require('express-fileupload');
const papa = require('papaparse');
const idValidator = require('validator-sa');
router.use(fileUpload());

// Loops through a JSON variable to categorize fields as 'Protected' or 'Unprotected'
function classify(json) {
    let favouriteSnackIsProtected, idIsProtected, firstNameIsProtected, lastNameIsProtected, emailIsProtected, cellphoneIsProtected, genderIsProtected, ethnicityIsProtected, religionIsProtected = 'Unprotected';
    const genders = ['Male', 'Female', 'Other', 'Undisclosed', 'Refused'];
    const religions = ['Christianity', 'Islam', 'Other', 'Undisclosed', 'Hinduism', 'Taoism', 'Buddhism', 'Judaism', 'African traditional belief', 'Confucian', 'Baha\'is', 'No religion', 'Refused'];
    const ethnicities = ['Black', 'White', 'Coloured', 'Indian/Asian', 'Other', 'Unspecified'];

    try {
        for (let i = 0; i < Object.keys(json.data).length; i++) {
            if (json.data[i].national_id != null || json.data[i].national_id != undefined) {
                if (idValidator.isValidSouthAfricanIDNumber(json.data[i].national_id.replace(/\s/g, ''))) {
                    idIsProtected = 'Protected';
                } else {
                    idIsProtected = 'Unprotected';
                }
            } else {
                idIsProtected = 'Unprotected';
            }

            firstNameIsProtected = 'Unprotected';
            lastNameIsProtected = 'Unprotected';
            favouriteSnackIsProtected = 'Unprotected';

            if (json.data[i].email_address != null || json.data[i].email_address != undefined) {
                if (emailValidator.validate(json.data[i].email_address)) {
                    emailIsProtected = 'Protected';
                } else {
                    emailIsProtected = 'Unprotected';
                }
            } else {
                emailIsProtected = 'Unprotected';
            }

            if (json.data[i].cellphone_number != null || json.data[i].cellphone_number != undefined) {
                let trimmed = json.data[i].cellphone_number.replace('+27', '0').replace(/\s/g, '');
                let numberRegex = /^0(6|7|8){1}[0-9]{1}[0-9]{7}$/;

                if (numberRegex.test(trimmed) === true) {
                    cellphoneIsProtected = 'Protected';
                } else {
                    cellphoneIsProtected = 'Unprotected';
                }
            } else {
                cellphoneIsProtected = 'Unprotected';
            }

            if (json.data[i].gender != null || json.data[i].gender != undefined) {
                for (k = 0; k < genders.length; k++) {
                    if (json.data[i].gender.toUpperCase() == genders[k].toUpperCase()) {
                        genderIsProtected = 'Protected'
                        break;
                    } else {
                        genderIsProtected = 'Unprotected';
                    }
                }
            } else {
                genderIsProtected = 'Unprotected';
            }

            if (json.data[i].ethnicity != null || json.data[i].ethnicity != undefined) {
                for (q = 0; q < ethnicities.length; q++) {
                    if (json.data[i].ethnicity.toUpperCase() == ethnicities[q].toUpperCase()) {
                        ethnicityIsProtected = 'Protected'
                        break;
                    } else {
                        ethnicityIsProtected = 'Unprotected';
                    }
                }
            } else {
                ethnicityIsProtected = 'Unprotected';
            }

            if (json.data[i].religion != null || json.data[i].religion != undefined) {
                for (z = 0; z < religions.length; z++) {
                    if (json.data[i].religion.toUpperCase() == religions[z].toUpperCase()) {
                        religionIsProtected = 'Protected'
                        break;
                    } else {
                        religionIsProtected = 'Unprotected';
                    }
                }
            }

            json.data[i].national_id = idIsProtected;
            json.data[i].first_name = firstNameIsProtected;
            json.data[i].last_name = lastNameIsProtected;
            json.data[i].email_address = emailIsProtected;
            json.data[i].cellphone_number = cellphoneIsProtected;
            json.data[i].gender = genderIsProtected;
            json.data[i].ethnicity = ethnicityIsProtected;
            json.data[i].religion = religionIsProtected;
            json.data[i].favourite_snack = favouriteSnackIsProtected;
        }
        return json;
    } catch (e) {
        console.log(e.name + ': ' + e.message);
        return false;
    }
}

function writeMeta(fileType, fileName, json) {
    try {
        connection = mysql.createConnection({
            host: 'popi-db-do-user-8330663-0.b.db.ondigitalocean.com',
            port: 25060,
            database: 'defaultdb',
            user: 'doadmin',
            password: 'zadszp92tgcfnkmd'
        });

        console.log('db connection set');
        
        connection.connect(function (e) {
            if (e) {
                console.error(e.name + ': ' + e.message + '\n\n\n' + e.stack);
            }
        });

        console.log('db connected');
        
        try {
            json.data.forEach((item, index) => {
                for (key in item) { //key is your field_name
                    value = item[key]; //value is your actual field value for field_name;
                    let sql = "INSERT INTO meta (datastore_name, datastore_type, field_name, category) VALUES ('" + fileName + "', '" + fileType + "', '" + key + "', '" + value + "')";
                    connection.query(sql, function (result) {
                        console.log('Inserted: ' + key + ' ' + value);
                    });
                }
            })
            return true;
        } finally {
            connection.end();
        }
    } catch (e) {
        console.log(e.name + ': ' + e.message + '\n\n\n' + e.stack);
        return false;
    }
}

// Server view.pug to client
router.get('/view', (req, res) => {
    let connection = null;
    let databaseError, queryError = false;
    let rows = [];

    try {
        connection = mysql.createConnection({
            host: 'popi-db-do-user-8330663-0.b.db.ondigitalocean.com',
            port: 25060,
            database: 'defaultdb',
            user: process.env.USERNAME,
            password: process.env.PASSWORD
        });
        connection.connect(function (e) {
            if (e) {
                console.error(e.name + ': ' + e.message + '\n\n\n' + e.stack);
            }
        });
        try {
            connection.query("SELECT * FROM meta", function (e, result) {
                if (Object.keys(result).length != 0) {
                    for (let n = 0; n < result.length; n++) {
                        let row = {
                            'datastore_id': result[n].datastore_id,
                            'datastore_name': result[n].datastore_name,
                            'datastore_type': result[n].datastore_type,
                            'field_name': result[n].field_name,
                            'category': result[n].category
                        }
                        rows.push(row);
                    }

                    return res.render('viewdb', {
                        rows: rows
                    });
                } else {
                    queryError = true;
                    return res.render('viewdb', {
                        queryError: queryError
                    });
                }
            });
        } finally {
            connection.end();
        }
    } catch (e) {
        console.log(e.name + ': ' + e.message + '\n\n\n' + e.stack);
        databaseError = true;
        return res.render('index', {
            databaseError: databaseError
        });
    }
});

// Serve menu.pug to client
router.get('/classify', (req, res) => {
    res.render('menu');
});

// Receive file upload from client and call classify()
router.post('/classify', function (req, res) {
    let uploadFail, wrongFile, classifyFail, queryError = false;
    if (!req.files || Object.keys(req.files).length === 0) {
        uploadFail = true;
        return res.render('menu', {
            uploadFail: uploadFail
        });
    } else {
        let fileFullName = req.files.popiFile.name;
        let nameSplit = fileFullName.split(".");
        let filetype = nameSplit.pop();
        let fileName = nameSplit.shift();
        let classifyResult, writeMetaResult;
        if (filetype == 'txt') {
            try {
                parsedFile = papa.parse(req.files.popiFile.data.toString('utf8'), {
                    header: true
                });
                delete parsedFile.meta;
                delete parsedFile.errors;
                classifyResult = classify(parsedFile);
                if (classifyResult == false) {
                    classifyFail = true;
                    return res.render('menu', {
                        classifyFail: classifyFail
                    });
                } else {
                    writeMetaResult = writeMeta(filetype, fileName, classifyResult)
                    if (writeMetaResult) {
                        res.redirect('/view');
                    } else {
                        queryError = true;
                        res.render('menu', {
                            queryError: queryError
                        });
                    }
                }
            } catch (e) {
                console.log(e.name + ': ' + e.message + '\n\n\n' + e.stack);
                classifyFail = true;
                return res.render('menu', {
                    classifyFail: classifyFail
                });
            }
        } else if (filetype == 'xlsx') {
            let data = xlsx.read(req.files.popiFile.data);
            let sheetName = data.SheetNames[0];
            let parsedData = xlsx.utils.sheet_to_json(data.Sheets[sheetName]);
            let formattedData = {
                "data": parsedData
            };
            classifyResult = classify(formattedData);
            if (classifyResult == false) {
                classifyFail = true;
                return res.render('menu', {
                    classifyFail: classifyFail
                });
            } else {
                writeMetaResult = writeMeta(filetype, fileName, classifyResult)
                if (writeMetaResult) {
                    res.redirect('/view');
                } else {
                    queryError = true;
                    res.render('menu', {
                        queryError: queryError
                    });
                }
            }
        } else if (filetype == 'json') {
            classifyResult = classify(JSON.parse(req.files.popiFile.data.toString('utf8')));
            if (classifyResult == false) {
                classifyFail = true;
                return res.render('menu', {
                    classifyFail: classifyFail
                });
            } else {
                writeMetaResult = writeMeta(filetype, fileName, classifyResult)
                if (writeMetaResult) {
                    res.redirect('/view');
                } else {
                    queryError = true;
                    res.render('menu', {
                        queryError: queryError
                    });
                }
            }
        } else {
            wrongFile = true;
            res.render('menu', {
                wrongFile: wrongFile
            });
        }
    }
});

module.exports = router;
