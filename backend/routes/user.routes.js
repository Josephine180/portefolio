import express from 'express';
import prisma from '../src/index.js';

const router = express.Router();

// Get /users : liste tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Get /users/:id : récupérer un utilisateur avec son id.
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id); // transformation de l'ID depuis l'URL en nombre(int)
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID invalide'});
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: id}, //on cherche l'utilisateur avec cet ID
    });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé'});
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur'});
  }
  }
);

// post un user : créer un utilisateur
router.post('/', async (req, res) => {
  const { email, password_hash, name } = req.body;
  // verification des champs obligatoires
  if (!email || !password_hash) {
    return res.status(400).json({ error: 'Email et mot de pass requis'});
  }
  // validation du format d'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Format d\'email invalide '});
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email }});
    if (existingUser) {
      return res.status(400).json({ error: 'Email deja utilisé'});
    }

    //creation de l'utilisateur
    const newUser = await prisma.user.create({
      data: { email, password_hash, name },
    });
    res.status(201).json(newUser);
  } catch(error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur'});
  }
});

// Put: met à jour l'utilisateur à partir de l'id
router.put('/:id', async(req, res) => {
  const id = parsInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID invalide'});
  }
  const { email, password_hash, name } = req.body;
  try {
    const updateUser = await prisma.user.update({
      where: {id},
      data: { email, password_hash, name },
    });
    res.json(updateUser);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur ou utilisateur non trouvé'});
  }
});

router.delete('/id', async(req, res) => {
  const id = parsInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID invalide'});
  }
  try {
    await prisma.user.delete({ where: { id }});
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur ou utilisateur non trouvé' });
  }
});

export default router;