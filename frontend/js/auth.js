// bouton connexion déconnexion
//simule si le user est connecté ou non
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
const authButton = document.getElementById('auth-button');

if (isLoggedIn) {
  authButton.innerHTML = `<button id="logout-btn" class="nav-btn">Déconnexion</button>`;
  document.getElementById(`logout-btn`).addEventListener('click', () => {
    localStorage.setItem('isLoggedIn', 'false');
    location.reload(); 
  });
} else {
  authButton.innerHTML = `<a href="login.html" class="nav-btn">Connexion</a>`;
}