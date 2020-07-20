import express, { Application, Request, Response } from 'express';

const { randomBytes } = require('crypto');
import bodyParser from 'body-parser';
import cors from 'cors';

const app: Application = express();

app.use(bodyParser.json());
app.use(cors());

let weights: object[] = [];

app.get('/weights', (req: Request, res: Response) => res.send(weights));

app.post('/weights', (req: Request, res: Response) => {
    const id = randomBytes(4).toString('hex');
    const weight = req.body.weight;
    const today = new Date();

    const dateAdded = `${ today.getDay() }/${ today.getMonth() }/${ today.getFullYear() } ${ today.getHours() }:${ today.getMinutes() }`;

    const currentWeight = weights[id] = {
        id,
        weight,
        dateAdded,
    };

    weights.push(currentWeight);
    res.status(201).send(weights[id]);
});

// Todo fix the update path.
app.put('/weights/update/:weightId', (req: Request, res: Response) => {
    const id = req.body.id;
    weights[id] = {
        id,
        weight: req.body.weight,
    };

    res.status(200).send(weights[id]);
});

app.delete('/weights/:weightId', (req: Request, res: Response) => {
    const id = req.body.id;

    try {
        weights[id] = { id: '', weight: null, dateAdded: '' };
        res.status(204).send({ message: 'Success!' });
    } catch (error) {
        res.status(500).send({ message: id });
    }

});

app.listen(4000, () => console.log('Server running on weight server port 4000'));
