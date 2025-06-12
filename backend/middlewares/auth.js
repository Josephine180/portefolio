import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '123';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ error: 'Token manquant' });

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};

export default authenticate;