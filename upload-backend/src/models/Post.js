import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import fs from "fs";
import { promisify } from "util";
import aws from '@aws-sdk/client-s3';
dotenv.config();

const s3 = new aws.S3();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PostSchema = new mongoose.Schema({
    name: String,
    size: Number,
    key: String,
    url: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

PostSchema.pre('save', function () {
    if (!this.url) {
        this.url = `${process.env.API_URL}:${process.env.PORT}/files/${this.key}`;
    }
});

PostSchema.pre('remove', function () {
    if (process.env.STORAGE_TYPE === 's3') {
        return s3.deleteObject({
            Bucket: process.env.S3_BUCKET,
            Key: this.key,
        }).promise()
    } else {
        return promisify(fs.unlink)(
            path.resolve(__dirname, '..', '..', 'tmp', 'uploads', this.key)
        );
    }
});

export default mongoose.model('Post', PostSchema);
