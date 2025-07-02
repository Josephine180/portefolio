document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('userPlans');
  const token = localStorage.getItem('token');

  if (!token) {
    container.innerHTML = `
      <p>Vous devez être connecté pour voir votre dashboard.</p>
      <button id="loginBtn">Se connecter</button>
    `;
    document.getElementById('loginBtn').addEventListener('click', () => {
      window.location.href = 'login.html';
    });
    return;
  }

  fetch('http://localhost:3000/training-plans/user/active-plan', {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('Impossible de récupérer le plan');
      return res.json();
    })
    .then(plan => {
      if (!plan) {
        container.innerHTML = '<p>Aucun plan actif associé à votre compte.</p>';
        return;
      }

      let html = `
        <h2>${plan.goal_type}</h2>
        <p><strong>Durée :</strong> ${plan.goal_time || 'Non spécifiée'}</p>
      `;

      plan.weeks.forEach(week => {
        html += `<h3>Semaine ${week.week_number}: ${week.description || ''}</h3><ul>`;

        week.sessions.forEach(session => {
          html += `
            <li>
              <strong>${session.title}</strong> - ${session.description} - Durée: ${session.duree} min
              <br>
              Statut: <span id="status-${session.id}">${session.completed ? 'Complétée' : 'Non complétée'}</span>
              <button data-session-id="${session.id}" class="completeSessionBtn" ${session.completed ? 'disabled' : ''}>
                Marquer comme complétée
              </button>
            </li>
          `;
        });

        html += `</ul>`;
      });

      container.innerHTML = html;

      // Ajouter les listeners sur les boutons pour compléter une séance
      document.querySelectorAll('.completeSessionBtn').forEach(button => {
        button.addEventListener('click', (e) => {
          const sessionId = e.target.getAttribute('data-session-id');
          completeSession(sessionId, token);
        });
      });
    })
    .catch(err => {
      container.innerHTML = `<p>Erreur lors du chargement du plan: ${err.message}</p>`;
      console.error(err);
    });
});

// Fonction pour marquer une séance comme complétée côté backend
function completeSession(sessionId, token) {
  fetch(`http://localhost:3000/sessions/${sessionId}/complete`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('Erreur lors de la mise à jour de la séance');
      return res.json();
    })
    .then(data => {
      document.getElementById(`status-${sessionId}`).innerText = 'Complétée';
      document.querySelector(`button[data-session-id="${sessionId}"]`).disabled = true;
    })
    .catch(err => {
      alert(err.message);
    });
}

