import express from 'express';
import { searchPackages } from './api/search.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Habilitar CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/api', (req, res) => {
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

app.post('/api', async (req, res) => {
    try {
        const searchResults = await searchPackages(req.body);
        res.json(searchResults);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 