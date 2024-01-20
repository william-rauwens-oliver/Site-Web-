// Calendar + Payment JavaScript

// Fonction appelée lors de la soumission du formulaire de rendez-vous
async function submitPaymentAndAppointment() {
    const selectedDate = document.getElementById('selectedDate').value;
    const selectedTime = document.getElementById('selectedTime').value;

    try {
        // Vérifier si un rendez-vous existe déjà à la date et à l'heure spécifiées
        const response = await fetch(`/api/check-appointment?date=${selectedDate}&time=${selectedTime}`);
        const data = await response.json();

        if (data.isTaken) {
            alert('Désolé, l\'heure sélectionnée est déjà prise. Veuillez choisir une autre heure.');
        } else {
            // Continuer avec le traitement du formulaire et du paiement
            alert('Rendez-vous réservé avec succès!');

            // Ajouter le code pour enregistrer le rendez-vous sur le serveur
            await saveAppointment(selectedDate, selectedTime);

            // Continuer avec le traitement du paiement
            submitPayment();
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du rendez-vous:', error);
        alert('Un rendez-vous est deja prit à cette date. Veuillez réessayer.');
    }
}

// Fonction pour enregistrer le rendez-vous sur le serveur
async function saveAppointment(date, time) {
    try {
        const response = await fetch('/api/save-appointment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date, time }),
        });

        if (!response.ok) {
            const data = await response.json();
            console.error('Erreur lors de l\'enregistrement du rendez-vous:', data.error);
            alert('Erreur lors de l\'enregistrement du rendez-vous. Veuillez réessayer.');
        }
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement du rendez-vous:', error);
        alert('Erreur lors de l\'enregistrement du rendez-vous. Veuillez réessayer.');
    }
}

// Calendar + Payment JavaScript

// Fonction appelée lors de la soumission du formulaire de paiement
async function submitPayment() {
    const cardNumber = document.getElementById('cardNumber').value;
    const expDate = document.getElementById('expDate').value;
    const cvc = document.getElementById('cvv').value;

    // Vérifiez que les champs de carte sont remplis
    if (!cardNumber || !expDate || !cvc) {
        alert('Veuillez remplir tous les champs de la carte.');
        return;
    }

    // Créez un token de carte avec les informations fournies
    const stripe = Stripe('YOUR_PUBLISHABLE_KEY');
    const { token, error } = await stripe.createToken('card', { number: cardNumber, exp_month: expDate.slice(0, 2), exp_year: expDate.slice(2), cvc });

    if (error) {
        console.error('Erreur lors de la création du token Stripe:', error);
        alert('Erreur lors du traitement du paiement. Veuillez réessayer.');
        return;
    }

    try {
        // Envoyez le token de carte au serveur pour effectuer le paiement
        const response = await fetch('/api/process-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, amount: 1000 }), // Ajoutez le montant du paiement
        });

        if (response.ok) {
            alert('Paiement effectué avec succès!');
        } else {
            const data = await response.json();
            console.error('Erreur lors du traitement du paiement:', data.error);
            alert('Erreur lors du traitement du paiement. Veuillez réessayer.');
        }
    } catch (error) {
        console.error('Erreur lors du traitement du paiement:', error);
        alert('Erreur lors du traitement du paiement. Veuillez réessayer.');
    }
}