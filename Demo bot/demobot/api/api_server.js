import { searchPackages } from './search.js';

export const config = {
  api: {
    bodyParser: true,
    externalResolver: true
  }
};

export default async function handler(req, res) {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const searchResults = await searchPackages(req.body);
    return res.status(200).json(searchResults);
  } catch (error) {
    console.error('Error in API handler:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}