import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import cors from 'cors';

import teacher from './routes/routes.js'

dotenv.config()

const app = express()

app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: []
}));
app.use(express.json());

app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    // Puedes enviar una respuesta de error al cliente o realizar otras acciones aquí
    res.status(500).send('Error interno del servidor');
});

app.get("/", (req, res)=>{
    res.json({"Hi":"Hello World"})
})

app.use('/api', teacher)

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);

})

export default app;
