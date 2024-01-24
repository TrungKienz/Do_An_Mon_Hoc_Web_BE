const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const multer = require('multer');
const path = require('path');

class uploadFile {
    uploadFile(req, res) {
        const fileName = req.body.patientID;
        const dataDirectory = path.join(__dirname, '/data/dataInput');
        const storage = multer.diskStorage({
            destination: dataDirectory,
            filename: (req, file, cb) => {
                const fileName = req.body.patientID;
                cb(null, `${fileName}.gz`);
            },
        });
        const upload = multer({
            storage,
            fileFilter: (req, file, cb) => {
                cb(null, true);
            },
            limits: {
                fileSize: 1024 * 1024 * 1024 * 1024,
            },
        }).single('file');

        upload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // Xử lý lỗi từ multer
                console.log('Multer Error:', err);
                res.status(400).json({
                    error: 'Có lỗi xảy ra khi tải lên tệp tin.',
                });
            } else if (err) {
                // Xử lý lỗi khác
                console.log('Error:', err);
                res.status(500).json({
                    error: 'Có lỗi xảy ra khi tải lên tệp tin.',
                });
            } else {
                // Upload thành công
                res.send('Tệp tin đã được tải lên thành công!');
            }
        });
    }
}

module.exports = new uploadFile();
