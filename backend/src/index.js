import { PrismaClient } from '../generated/prisma/index.js';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function importData() {
  try {
    console.log('Début de l\'import des données...');

    // 1. Lire les fichiers JSON des plans
    const planFiles = ['plan_5k.json', 'plan_10k.json', 'plan_21k.json', 'plan_42k.json'];
    const trainingPlansData = [];

    for (const fileName of planFiles) {
      try {
        const planData = JSON.parse(
          fs.readFileSync(path.join(process.cwd(), '..', 'data', fileName), 'utf8')
        );
        trainingPlansData.push(planData);
        console.log(`📄 Fichier ${fileName} lu avec succès`);
      } catch (error) {
        console.warn(`Impossible de lire ${fileName}:`, error.message);
      }
    }

    // 2. Nettoyer la base de données (optionnel - attention en production!)
    console.log(' Nettoyage de la base...');
    await prisma.feedback.deleteMany({});
    await prisma.session.deleteMany({});
    await prisma.trainingPlan.deleteMany({});
    await prisma.nutritionTip.deleteMany({});
    await prisma.user.deleteMany({});

    // 3. Créer un utilisateur de test
    console.log(' Création d\'un utilisateur de test...');
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password_hash: 'hashed_password_here',
      }
    });

    // 4. Traiter chaque plan d'entraînement
    console.log('Import des plans d\'entraînement...');
    
    let totalNutritionTips = [];
    
    for (const planData of trainingPlansData) {
      // Créer le plan
      const trainingPlan = await prisma.trainingPlan.create({
        data: {
          user_id: testUser.id,
          goal_type: planData.type,
          goal_time: planData.duration,
        }
      });

      let sessionCounter = 1;

      // Parcourir chaque semaine du plan
      for (const week of planData.weeks) {
        // Créer les tips nutritionnels pour cette semaine (éviter les doublons)
        const weekTips = new Set();
        
        for (const session of week.sessions) {
          if (session.nutrition_tips) {
            for (const tip of session.nutrition_tips) {
              weekTips.add(tip);
            }
          }
        }

        // Créer les tips uniques pour cette semaine
        const createdTips = [];
        for (const tipText of weekTips) {
          const nutritionTip = await prisma.nutritionTip.create({
            data: {
              week_number: week.week_number,
              plan_type: planData.type,
              tip_text: tipText
            }
          });
          createdTips.push(nutritionTip);
          totalNutritionTips.push(nutritionTip);
        }

        // Créer les sessions de cette semaine
        for (const session of week.sessions) {
          // Trouver le tip approprié pour cette session
          let nutritionTip = createdTips[0]; // Par défaut, le premier tip de la semaine
          
          if (session.nutrition_tips && session.nutrition_tips.length > 0) {
            // Chercher le tip exact ou utiliser le premier
            nutritionTip = createdTips.find(tip => 
              tip.tip_text === session.nutrition_tips[0]
            ) || createdTips[0];
          }

          // Si pas de tip pour cette semaine, utiliser un tip existant ou en créer un par défaut
          if (!nutritionTip && totalNutritionTips.length > 0) {
            nutritionTip = totalNutritionTips[0];
          } else if (!nutritionTip) {
            nutritionTip = await prisma.nutritionTip.create({
              data: {
                week_number: week.week_number,
                plan_type: planData.type,
                tip_text: "Hydratation recommandée après l'effort"
              }
            });
            totalNutritionTips.push(nutritionTip);
          }

          await prisma.session.create({
            data: {
              training_plan_id: trainingPlan.id,
              session_number: sessionCounter,
              date: new Date(Date.now() + (sessionCounter - 1) * 24 * 60 * 60 * 1000), // Dates simulées
              description: `${session.title} - ${session.description}`,
              duree: session.duration,
              completed: false,
              nutrition_tip_id: nutritionTip.id,
            }
          });

          sessionCounter++;
        }
      }
      
      console.log(`Plan "${planData.type}" avec ${sessionCounter - 1} sessions importé`);
    }

    console.log(' Import terminé avec succès!');
    
    // 5. Afficher un résumé
    const stats = await getStats();
    console.log('\n Résumé:');
    console.log(`- ${stats.users} utilisateurs`);
    console.log(`- ${stats.plans} plans d'entraînement`);
    console.log(`- ${stats.sessions} sessions`);
    console.log(`- ${stats.nutritionTips} tips nutritionnels`);

  } catch (error) {
    console.error('Erreur lors de l\'import:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function getStats() {
  const [users, plans, sessions, nutritionTips] = await Promise.all([
    prisma.user.count(),
    prisma.trainingPlan.count(),
    prisma.session.count(),
    prisma.nutritionTip.count(),
  ]);
  
  return { users, plans, sessions, nutritionTips };
}

// Exécuter le script
importData()
  .catch((error) => {
    console.error('Échec de l\'import:', error);
    process.exit(1);
  });
