import prisma from '../src/index.js';

export const createSession = async (req, res) => {
  console.log("Données reçues :", req.body);
  try {
    const {
      training_plan_id,
      week_id,
      session_number,
      session_order,
      date,
      title,
      description,
      duree,
      nutrition_tip_id,
    } = req.body;
    
    const session = await prisma.session.create({
      data: {
        training_plan_id,
        week_id,
        session_number,
        session_order,
        date: new Date(date),
        title,
        description,
        duree,
        nutrition_tip_id,
      },
    });
    res.status(201).json(session);
  } catch (error) {
    console.error(" Erreur création session", error);
    res.status(500).json({ error: "Erreur serveur lors de la création de la session"});
  }
};
