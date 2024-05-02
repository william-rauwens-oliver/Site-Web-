// fonction est appelée après la connexion de l'utilisateur
async function loadUserProfile() {
    try {
        const response = await fetch('/api/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const userData = await response.json();
            displayUserProfile(userData);
            showAppointments(); // Appel de la nouvelle fonction pour afficher les rendez-vous
        } else {
            console.error('Erreur lors du chargement du profil:', response.statusText);
        }
    } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
    }
}

function displayUserProfile(user) {
    document.getElementById('username').textContent = 'Nom d\'utilisateur: ' + user.username;
    document.getElementById('email').textContent = 'Email: ' + user.email;
    document.getElementById('birthdate').textContent = 'Date de naissance: ' + user.birthdate;
    document.getElementById('city').textContent = 'Ville: ' + user.city;
}

function displayAppointments(appointments) {
    const appointmentsSection = document.getElementById('appointments');
    appointmentsSection.innerHTML = ''; // Efface le contenu précédent

    if (appointments.length > 0) {
        const appointmentsList = document.createElement('ul');

        appointments.forEach(appointment => {
            const listItem = document.createElement('li');
            listItem.textContent = `Rendez-vous le ${appointment.date} à ${appointment.time}`;
            appointmentsList.appendChild(listItem);
        });

        appointmentsSection.appendChild(appointmentsList);
    } else {
        appointmentsSection.textContent = 'Aucun rendez-vous pris.';
    }
}

// Ajoutez cette fonction pour afficher les rendez-vous dans l'agenda
function showAppointments() {
    const agendaSection = document.getElementById('agenda');
    const appointmentList = document.getElementById('appointment-list');

    // Effacez les anciens rendez-vous
    appointmentList.innerHTML = '';

    // Récupérez les rendez-vous depuis le serveur (vous devrez implémenter cette partie)
    // Par exemple, vous pouvez ajouter une nouvelle route sur votre serveur pour récupérer les rendez-vous de l'utilisateur
    // et les renvoyer au format JSON.

    // Exemple fictif de récupération des rendez-vous depuis le serveur
    fetch('/api/appointments')
        .then(response => response.json())
        .then(appointments => {
            if (appointments.length > 0) {
                // Affichez les rendez-vous dans la liste
                appointments.forEach(appointment => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `Rendez-vous le ${appointment.date} à ${appointment.time}`;
                    appointmentList.appendChild(listItem);
                });
            } else {
                // Aucun rendez-vous trouvé
                const noAppointments = document.createElement('p');
                noAppointments.textContent = 'Aucun rendez-vous trouvé.';
                appointmentList.appendChild(noAppointments);
            }

            // Affichez la section de l'agenda
            agendaSection.style.display = 'block';
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des rendez-vous:', error);
            // Gérez l'erreur ici
        });
}

function logout() {
    try {
        // Envoyez une requête au serveur pour gérer la déconnexion
        fetch('/api/logout', {
            method: 'GET',
        })
        .then(response => {
            if (response.ok) {
                // Redirigez l'utilisateur vers la page d'accueil après la déconnexion réussie
                window.location.href = 'index.html';
            } else {
                console.error('Erreur lors de la déconnexion:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Erreur lors de la déconnexion:', error);
            // Gérez l'erreur ici
        });
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        // Gérez l'erreur ici
    }
}
// Exemple d'utilisation :
loadUserProfile();