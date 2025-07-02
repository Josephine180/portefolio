document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const programId = params.get('programId');
  const container = document.getElementById('programDetails');

  if (!programId) {
    container.innerText = "Aucun programme sélectionné.";
    return;
  }

  fetch(`http://localhost:3000/training-plans/id/${programId}`)
    .then(res => {
      if (!res.ok) throw new Error('Programme non trouvé');
      return res.json();
    })
    .then(program => {
      container.innerHTML = `
        <h2>${program.goal_type}</h2>
        <p><strong>Durée :</strong> ${program.goal_time || 'Non spécifiée'}</p>
        <p><strong>Nombre de semaines :</strong> ${program.weeks.length}</p>
        <ul>
          ${program.weeks.map(week => `
            <li><strong>Semaine ${week.week_number} :</strong> ${week.description}</li>
          `).join('')}
        </ul>
        <button id="startButton" style="margin-top: 20px;">Commencer</button>
      `;

      document.getElementById('startButton').addEventListener('click', () => startPlan(programId));
    })
    .catch(err => {
      console.error(err);
      container.innerText = "Erreur lors du chargement du programme.";
    });
});

function startPlan(programId) {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = `login.html?redirect=dashboard.html&programId=${programId}`;
    return;
  }

  fetch('http://localhost:3000/training-plans/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ training_plan_id: parseInt(programId) })
  })
  .then(res => {
    if (!res.ok) throw new Error('Impossible de démarrer le plan');
    return res.json();
  })
  .then(() => {
    window.location.href = 'dashboard.html';
  })
  .catch(err => {
    alert(err.message);
  });
}
