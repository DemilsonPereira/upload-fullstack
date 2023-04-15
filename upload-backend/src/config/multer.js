import multer from "multer";
import crypto from "crypto";
import path from "path";
import aws from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import { fileURLToPath } from 'url';
import * as dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp', 'uploads');


const storageTypes = {
    local: multer.diskStorage({
        destination: (request, file, cb) => {
            cb(null, tmpFolder);
        },
        filename: (request, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);

                file.key = `${hash.toString('hex')}-${file.originalname}`;

                cb(null, file.key);
            });
        }
    }),
    s3: multerS3({
        s3: new aws.S3(),
        bucket: process.env.S3_BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (request, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err);

                const fileName = `${hash.toString('hex')}-${file.originalname}`;

                cb(null, fileName);
            });
        }
    })
}

export default {
    dest: path.resolve(__dirname, tmpFolder),
    storage: storageTypes[process.env.STORAGE_TYPE],
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (request, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif'
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type.'));
        }
    },
};