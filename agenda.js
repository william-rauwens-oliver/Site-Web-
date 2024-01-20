// agenda.js

document.addEventListener("DOMContentLoaded", function () {
    // Appel à une fonction qui récupère les rendez-vous depuis le serveur
    getAndDisplayAppointments();
});

function getAndDisplayAppointments() {
    // Faire une requête GET au serveur pour récupérer les rendez-vous
    fetch('http://localhost:3000/api/appointments')
        .then(response => response.json())
        .then(appointments => {
            // Afficher les rendez-vous sur la page
            const appointmentsListContainer = document.getElementById("appointmentsList");

            if (appointments.length === 0) {
                appointmentsListContainer.innerHTML = "<p>Aucun rendez-vous programmé.</p>";
            } else {
                appointments.forEach(appointment => {
                    const appointmentElement = document.createElement("div");
                    appointmentElement.innerHTML = `<strong>Date:</strong> ${appointment.date}, <strong>Heure:</strong> ${appointment.time}, <strong>Client:</strong> ${appointment.client}`;
                    appointmentsListContainer.appendChild(appointmentElement);
                });
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des rendez-vous:', error);
        });
}