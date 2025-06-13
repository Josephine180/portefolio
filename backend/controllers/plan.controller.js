import prisma from '../src/index.js';

// creation d'un training plan
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

// récupérer un training plan d'un user
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

  // récupérer tous les training plans
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

  // récupérer un plan précis grâce à l'ID
  export const getTrainingPlanById = async (req, res) => {
    const planId = parseInt(req.params.planId);
    try {
      const plan = await prisma.trainingPlan.findUnique({
        where: { id: planId },
        include: {
          weeks: true,
          sessions: true,
        },
      });
      if (!plan) return res.status(404).json({ error: 'Plan non trouvé'});
      res.json(plan);
    } catch (error) {
      console.error("Erreur récupérer un plan par l'ID", error);
      res.status(500).json({ error: 'Erreur serveur'});
    }
  };