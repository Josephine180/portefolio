
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const API_URL = 'http://localhost:3000/users';
    const response = await fetch(`${API_URL}/login`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      alert('Connexion réussie !');
      window.location.href = 'dashboard.html';
    } else {
      alert(data.error || 'Erreur lors de la connexion');
    }
  } catch (err) {
    console.error('Erreur:', err);
    alert('Erreur réseau ou serveur');
  }
});
