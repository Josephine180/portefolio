import prisma from '../src/index.js';

export const createTrainingPlan = async (req, res) => {

  const { user_id, goal_type, goal_time }= req.body;
  if(!user_id || !goal_type || !goal_time) {
    return res.status(400).json({ error: 'Champs requis manquants'});
  }
  try {
    const plan = await prisma.trainingPlan.create({
      data: {
        user_id,
        goal_type,
        goal_time,
      },
    });
    res.status(201).json(plan);
  } catch (error) {
    console.error('Erreur création plan:', error);
    res.status(500).json({ error: 'Erreur serveur'});
  }
  };

export const getTrainingPlansByUser = async (req, res) => {
  const userId = parseInt(req.params.userId);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'ID invalide'});
  }

  try {
    const plans = await prisma.trainingPlan.findMany({
      where: { user_id: userId },
      include: {
        weeks: true,
        sessions: true,
      },
    });
    res.json(plans);
  } catch (error) {
    console.error('Erreur de récupération des plans:', error);
    res.status(500).json({ error: 'Erreur serveur'});
  }
  };

  export const getAllTrainingPlans = async (req, res) => {
    try {
      const plans = await prisma.trainingPlan.findMany({
        include: {
          weeks: true,
          sessions: true,
        },
      });
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
    }
  };