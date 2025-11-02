/** @format */

import dotenv from "dotenv";

dotenv.config();

import express from "express";
import { connectDB } from "./src/dbConfig.js";
import drugRouter from "./routers/drugRoutes.js";
import categoryRouter from "./routers/categoryRoutes.js";
import inventoryRouter from './routers/inventoryRoutes.js';
import invoiceRouter from './routers/invoiceRoutes.js';
import prescriptionRouter from './routers/prescriptionRoutes.js';
import userRouter from './routers/userRoutes.js';
import ordersRouter from './routers/ordersRouter.js';

const app = express();
// Body parsers: JSON, urlencoded and a text fallback for requests missing Content-Type
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: '*/*' }));

// If body was parsed as text (fallback), try to parse as JSON so req.body becomes an object
app.use((req, res, next) => {
    if (typeof req.body === 'string') {
        const s = req.body.trim();
        if (s.length === 0) {
            req.body = {};
        } else {
            try {
                req.body = JSON.parse(s);
            } catch (e) {
                // leave as string if not JSON
            }
        }
    }
    next();
});

// Mount routers after body parsers
app.use("/drugs", drugRouter);
app.use("/categories", categoryRouter);
app.use('/inventories', inventoryRouter);
app.use('/invoices', invoiceRouter);
app.use('/prescriptions', prescriptionRouter);
app.use('/users', userRouter);
app.use('/orders', ordersRouter);

app.get('/', (req, res) => res.send('Pharmacy management server is running'));

connectDB()
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, (error) => {
            if (error) {
                console.error('Error listen starting the server', error);
            } else {
                console.log(`Server is running on http://localhost:${PORT}`);
            }
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });