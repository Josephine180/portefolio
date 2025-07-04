import prisma from '../src/index.js';

// Création d'un training plan
export const createTrainingPlan = async (req, res) => {
  const { goal_type, goal_time } = req.body;
  const user_id = req.user.userId; // Récupérer depuis le token JWT
  
  if (!user_id || !goal_type || !goal_time) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  try {
    const plan = await prisma.trainingPlan.create({
      data: {
        goal_type,
        goal_time,
        user_id, 
      },
    });
    res.status(201).json(plan);
  } catch (error) {
    console.error('Erreur création plan:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupérer les training plans d'un user
export const getUserActiveTrainingPlan = async (req, res) => {
  const userId = req.user.userId; // depuis le token JWT

  try {
    // Trouver l'association UserTrainingPlan avec les détails du plan
    const userPlan = await prisma.userTrainingPlan.findFirst({
      where: { user_id: userId },
      include: {
        trainingPlan: {
          include: {
            weeks: {
              include: {
                sessions: {
                  include: {
                    nutritionTip: true,
                  }
                }
              }
            },
            sessions: {
              include: {
                nutritionTip: true
              }
            },
          }
        }
      }
    });

    if (!userPlan) {
      return res.status(404).json({ error: 'Aucun plan actif trouvé pour cet utilisateur' });
    }

    res.json(userPlan.trainingPlan);
  } catch (error) {
    console.error("Erreur récupération plan utilisateur", error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};



// Récupérer tous les training plans
export const getAllTrainingPlans = async (req, res) => {
  try {
    const plans = await prisma.trainingPlan.findMany({
      include: {
        weeks: {
          include: {
            sessions: {
              include: {
                nutritionTip: true
              }
            }
          },
        },
        sessions: {
          include: {
            nutritionTip: true
          }
        },
      },
    });
    res.json(plans);
  } catch (error) {
    console.error('Erreur récupération tous les plans:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Récupérer un plan précis grâce à l'ID
export const getTrainingPlanById = async (req, res) => {
  const planId = parseInt(req.params.planId);
  
  if (isNaN(planId)) {
    return res.status(400).json({ error: 'ID invalide' });
  }

  try {
    const plan = await prisma.trainingPlan.findUnique({
      where: { id: planId },
      include: {
        weeks: {
          include: {
            sessions: true,
          },
        },
        sessions: true,
      },
    });
    
    if (!plan) return res.status(404).json({ error: 'Plan non trouvé' });
    res.json(plan);
  } catch (error) {
    console.error("Erreur récupérer un plan par l'ID", error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Démarrer un training plan (associer un utilisateur à un plan existant)
export const startTrainingPlan = async (req, res) => {
  const userId = req.user.userId;
  const { training_plan_id } = req.body;

  if (!training_plan_id) {
    return res.status(400).json({ error: 'training_plan_id est requis' });
  }

  try {
    // Vérifier si le plan existe
    const planExists = await prisma.trainingPlan.findUnique({
      where: { id: training_plan_id }
    });

    if (!planExists) {
      return res.status(404).json({ error: 'Plan d\'entraînement non trouvé' });
    }

    // Vérifier si l'utilisateur n'a pas déjà commencé ce plan
    const existingUserPlan = await prisma.userTrainingPlan.findUnique({
      where: {
        user_id_training_plan_id: {
          user_id: userId,
          training_plan_id: training_plan_id
        }
      }
    });

    if (existingUserPlan) {
      return res.status(400).json({ error: 'Vous avez déjà commencé ce plan d\'entraînement' });
    }

    // Créer l'association utilisateur-plan
    const userTrainingPlan = await prisma.userTrainingPlan.create({
      data: {
        user_id: userId,
        training_plan_id: training_plan_id,
        started_at: new Date()
      },
      include: {
        trainingPlan: {
          include: {
            weeks: true,
            sessions: true,
          }
        }
      }
    });

    res.status(201).json(userTrainingPlan);
  } catch (error) {
    console.error('Erreur de démarrage du plan', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getUserActiveTrainingPlans = async (req, res) => {
  const userId = req.user.userId;
  console.log('UserID:', usrerId);

  try {
    // Trouver toutes les associations user-plan
    const userPlans = await prisma.userTrainingPlan.findMany({
      where: { user_id: userId },
      include: {
        trainingPlan: {
          include: {
            weeks: {
              include: {
                sessions: {
                  include: {
                    nutritionTip: true,
                  }
                }
              }
            },
            sessions: {
              include: {
                nutritionTip: true
              }
            },
          }
        }
      }
    });

    if (!userPlans.length) {
      return res.status(404).json({ error: 'Aucun plan actif trouvé pour cet utilisateur' });
    }

    // Extraire juste les trainingPlans pour simplifier le front
    const plans = userPlans.map(up => up.trainingPlan);

    res.json(plans);
  } catch (error) {
    console.error("Erreur récupération plans utilisateur", error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};