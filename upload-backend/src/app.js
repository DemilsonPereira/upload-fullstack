import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from "dotenv";
dotenv.config();

import { router } from './routes.js';

class App {
    constructor() {
        this.app = express();

        this.middlewares();
        this.router();

        this.port = process.env.PORT || 3000;
        this.uri = process.env.API_URL;
    }

    middlewares() {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.app.use(cors());
        this.app.use(morgan('dev'));
        mongoose.connect(
            `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URI}/`,
            {
                useNewUrlParser: true,
                connectTimeoutMS: 1000
            }
        )
            .then(function () {
                console.log("Connected to database");
            })
            .catch(function (err) {
                console.log("Connection failed", err);
            });

    }

    router() {
        this.app.use(router);
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Server is listening ${this.uri}:${this.port}`);
        });
    }
}

export {
    App
}