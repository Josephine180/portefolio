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

export const markSessionAsCompleted = async (req, res) => {
  const sessionId = parseInt(req.params.id);
  try {
    const existingSession = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!existingSession) {
      return res.status(404).json({ error: "Session introuvable." });
    }

    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: { completed: true },
    });

    res.json(updatedSession);
  } catch (error) {
    console.error("Erreur PATCH session :", error);
    res.status(500).json({ error: "Impossible de marquer la session comme complétée." });
  }
};

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: { id: 'asc' }, // optionnel
    });
    res.json(sessions);
  } catch (error) {
    console.error("Erreur lors de la récupération des sessions :", error);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des sessions." });
  }
};

export const getSessionById = async (req, res) => {
  const sessionId = parseInt(req.params.id);
  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });
    if (!session) return res.status(404).json({ error: "Session non trouvée" });
    res.json(session);
  } catch (error) {
    console.error('Erreur GET session par id', error);
    res.status(500).json({ error: 'Erreur srveur' });
  }
};

export const SessionFeedback = async (req, res) => {
  const sessionId = parseInt(req.params.id);
  const {
    user_id,
    energy_level,
    fatigue_level,
    motivation_level,
    comment
  } = req.body;

  try {
    const feedback = await prisma.feedback.create({
      data: {
        session_id: sessionId,
        user_id,
        energy_level,
        fatigue_level,
        motivation_level,
        comment
      }
    });
    res.status(201).json(feedback);
  } catch (error) {
    console.error("Erreur création feedback :", error);
    res.status(500).json({ error: "Impossible d'ajouter le feedback" });
  }
};