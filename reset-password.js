// reset-password.js

// Fonction pour envoyer un lien de réinitialisation par email
async function sendResetLink() {
    try {
        // Récupérer l'adresse e-mail fournie par l'utilisateur
        const userEmail = document.getElementById('forgot-email').value;

        // Vérifier si une adresse e-mail a été fournie
        if (!userEmail) {
            alert("Veuillez entrer une adresse e-mail.");
            return;
        }

        // Envoyer une requête POST au serveur pour générer un lien de réinitialisation
        const response = await fetch('/api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail }),
        });

        // Vérifier si la requête a réussi (status 200 OK)
        if (response.ok) {
            alert("Un email de réinitialisation a été envoyé à votre adresse.");
        } else {
            const data = await response.json();
            alert(`Erreur lors de l'envoi du lien de réinitialisation: ${data.error}`);
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi du lien de réinitialisation:", error);
        alert("Erreur lors de l'envoi du lien de réinitialisation. Veuillez réessayer.");
    }
}

// Fonction pour réinitialiser le mot de passe
async function resetPassword() {
    try {
        // Récupérer le nouveau mot de passe et la confirmation
        const newPassword = document.getElementById('new-password').value;
        const confirmNewPassword = document.getElementById('confirm-new-password').value;

        // Vérifier si les mots de passe correspondent
        if (newPassword !== confirmNewPassword) {
            alert("Les mots de passe ne correspondent pas.");
            return;
        }

        // Récupérer le token de réinitialisation du mot de passe depuis l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const resetToken = urlParams.get('token');

        // Envoyer une requête POST au serveur pour réinitialiser le mot de passe
        const response = await fetch('/api/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newPassword, resetToken }),
        });

        // Vérifier si la requête a réussi (status 200 OK)
        if (response.ok) {
            alert("Le mot de passe a été réinitialisé avec succès.");
            // Rediriger l'utilisateur vers la page de connexion
            window.location.href = '/signin.html';
        } else {
            const data = await response.json();
            alert(`Erreur lors de la réinitialisation du mot de passe: ${data.error}`);
        }
    } catch (error) {
        console.error("Erreur lors de la réinitialisation du mot de passe:", error);
        alert("Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.");
    }
}
