import express from 'express';
import jaratok from './routes/jaratok.js'

const app = express();
const port = 3000;

app.use(express.json());

app.use('/jaratok', jaratok);


app.listen(port, () => {
    console.log(`Szerver fut: http://localhost:${port}`);
});