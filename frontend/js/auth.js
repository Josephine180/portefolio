document.addEventListener('DOMContentLoaded', () => {
  const authButton = document.getElementById('auth-button');
  if (!authButton) return console.error("Élément #auth-button introuvable dans le DOM");

  function renderAuthButton() {
    fetch('http://localhost:3000/auth/me', {
      method: 'GET',
      credentials: 'include' // ← Envoie le cookie HTTP-only
    })
    .then(res => {
      if (res.ok) {
        // L'utilisateur est connecté
        authButton.innerHTML = `<button id="logout-btn" class="nav-btn">Déconnexion</button>`;
        document.getElementById('logout-btn').addEventListener('click', () => {
          fetch('http://localhost:3000/auth/logout', {
            method: 'POST',
            credentials: 'include'
          }).then(() => {
            window.location.href = 'index.html';
          }).catch(err => {
            console.error('Erreur lors de la déconnexion :', err);
          });
        });
      } else {
        // L'utilisateur n'est pas connecté
        authButton.innerHTML = `<a href="login.html" class="nav-btn">Connexion</a>`;
      }
    })
    .catch(err => {
      console.error('Erreur lors de la vérification de session :', err);
      authButton.innerHTML = `<a href="login.html" class="nav-btn">Connexion</a>`;
    });
  }

  renderAuthButton();
});
