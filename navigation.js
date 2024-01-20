// Ajoutez cette fonction pour mettre à jour le texte de connexion/déconnexion
function updateLoginText() {
    // Sélectionnez l'élément de lien par son ID
    const loginLinkElement = document.getElementById('login-link');

    // Effectuez une requête pour vérifier si l'utilisateur est connecté
    fetch('/api/check-auth')
        .then(response => response.json())
        .then(data => {
            // Mettez à jour le texte en fonction de l'état de connexion
            if (data.isAuthenticated) {
                loginLinkElement.textContent = 'Déconnexion';
            } else {
                loginLinkElement.textContent = 'Connexion';
            }
        })
        .catch(error => console.error('Erreur lors de la vérification de l\'authentification :', error));
}

// Ajoutez cette fonction pour gérer le clic sur "Prenez Rendez-vous"
function handleRendezVousClick() {
    try {
        // Vérifiez si l'utilisateur est connecté
        checkAuthentication((isAuthenticated) => {
            if (isAuthenticated) {
                // Si connecté, redirigez vers la page rendez-vous.html
                window.location.href = "rendez-vous.html";
            } else {
                // Si non connecté, redirigez vers la page de connexion
                window.location.href = "signin.html";
            }
        });
    } catch (error) {
        console.error("Erreur dans handleRendezVousClick :", error);
    }
}

// Ajoutez cette fonction pour gérer le clic sur "Connexion"
function handleConnexionClick() {
    // Vérifiez si l'utilisateur est connecté
    checkAuthentication((isAuthenticated) => {
        if (isAuthenticated) {
            // Si connecté, redirigez automatiquement vers la page profil.html
            window.location.href = "profile.html";
        } else {
            // Si non connecté, redirigez vers la page de connexion
            window.location.href = "signin.html";
        }
    });
}

// Fonction pour vérifier l'authentification côté client
function checkAuthentication(callback) {
    fetch("/api/check-auth") // Assurez-vous d'avoir une route appropriée sur votre serveur
        .then(response => response.json())
        .then(data => {
            callback(data.isAuthenticated);
            // Mettez à jour le texte de connexion/déconnexion
            updateLoginText();
        })
        .catch(error => {
            console.error("Erreur lors de la vérification de l'authentification :", error);
            callback(false);
        });
}

// Mettez à jour le texte de connexion/déconnexion lors du chargement de la page
updateLoginText();
