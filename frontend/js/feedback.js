document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedbackForm');
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('sessionId');

  if (!sessionId) {
    alert("ID de session manquant !");
    window.location.href = 'dashboard.html';
    return;
  }

  // Vérifier que l'utilisateur est connecté via cookie HTTP-only
  fetch('http://localhost:3000/auth/me', {
    method: 'GET',
    credentials: 'include',
  })
    .then(async res => {
      if (!res.ok) throw new Error("Non connecté");
      return res.json();
    })
    .then(user => {
      // L'utilisateur est authentifié, on peut autoriser le feedback
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
          energy_level: parseInt(formData.get('energy_level')),
          fatigue_level: parseInt(formData.get('fatigue_level')),
          motivation_level: parseInt(formData.get('motivation_level')),
          comment: formData.get('comment') || '',
        };

        try {
          const response = await fetch(`http://localhost:3000/sessions/${sessionId}/feedback`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || "Erreur lors de l'envoi du feedback.");
          }

          alert("Feedback envoyé avec succès !");
          window.location.href = 'dashboard.html';
        } catch (error) {
          alert(`Erreur : ${error.message}`);
        }
      });
    })
    .catch(err => {
      alert("Tu dois être connecté pour donner un feedback.");
      window.location.href = 'login.html';
    });
});
