// Fonction pour effectuer la connexion
async function signin() {
    const username = document.getElementById('signin-username').value;
    const password = document.getElementById('signin-password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            window.location.href = '/profile.html';
        } else {
            const data = await response.json();
            alert(`Erreur de connexion: ${data.error}`);
        }
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        alert("Erreur lors de la connexion. Veuillez réessayer.");
    }
}

// Fonction pour ouvrir le modal "Mot de passe oublié"
function openForgotPasswordModal() {
    const modal = document.getElementById('forgot-password-modal');
    modal.style.display = 'block';
}

// Fonction pour fermer le modal "Mot de passe oublié"
function closeForgotPasswordModal() {
    const modal = document.getElementById('forgot-password-modal');
    modal.style.display = 'none';
}

// Fonction pour envoyer le lien de réinitialisation du mot de passe
async function sendResetLink() {
    const email = document.getElementById('forgot-email').value;

    try {
        const response = await fetch('/api/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            alert("Un lien de réinitialisation a été envoyé à votre adresse e-mail.");
            closeForgotPasswordModal();
        } else {
            const responseData = await response.text();
            console.error("Erreur lors de l'envoi du lien de réinitialisation:", responseData);
            alert("Erreur lors de l'envoi du lien de réinitialisation. Veuillez réessayer.");
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi du lien de réinitialisation:", error);
        alert("Erreur lors de l'envoi du lien de réinitialisation. Veuillez réessayer.");
    }
}

// Fonction pour effectuer l'inscription
async function signup() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const email = document.getElementById('signup-email').value;
    const birthdate = document.getElementById('birthdate').value;
    const city = document.getElementById('city').value;

    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, email, birthdate, city }),
        });

        if (response.ok) {
            alert("Inscription réussie!");
            window.location.href = 'rendez-vous.html';
        } else {
            const data = await response.json();
            alert(`Erreur d'inscription: ${data.error}`);
        }
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        alert("Erreur lors de l'inscription. Veuillez réessayer.");
    }

    closeSignupModal();
}

// Fonction pour ouvrir le modal d'inscription
function openSignupModal() {
    const modal = document.getElementById('signup-modal');
    modal.style.display = 'block';
}

// Fonction pour fermer le modal d'inscription
function closeSignupModal() {
    const modal = document.getElementById('signup-modal');
    modal.style.display = 'none';
}
