const multer = require('multer');
const path = require('path'); // Node.js module for working with file paths

// Set storage engine
module.exports = multer({
    storage: multer.diskStorage({}), // storage is the key, diskStorage is the value
    fileFilter: (req, file, cb) => { // fileFilter is a function that takes in req, file, and cb as arguments
        let ext = path.extname(file.originalname); // extname is a method that returns the extension of the file
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            cb(new Error('File type is not supported'), false);
            return;
        }
        cb(null, true); //cb is callback
    }
});
//now new file name will be stored in req.file.path and req.file.filename
//req.file.path is the path of the file

