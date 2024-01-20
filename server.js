const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportLocalMongoose = require("passport-local-mongoose");
const session = require('express-session');
const fs = require('fs');
const nodemailer = require("nodemailer");
const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY');
const { google } = require('googleapis');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());
app.use(session({
    secret: "your-secret-key", // Changez ceci par une clé secrète appropriée
    resave: true,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/monagenda", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    birthdate: String,
    city: String,
    appointments: [String],
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Configurez ces informations avec vos propres données
const CLIENT_ID = '603571712241-q5ntc1stmk8b3npthhb3mdn0jmuimg2a.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:3000/resetMdp.html';
const REFRESH_TOKEN = 'votre_refresh_token';

// Créez un client OAuth2 avec vos informations d'identification
const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

// Configurez le client OAuth2 avec le jeton de rafraîchissement
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Configurez nodemailer avec le client OAuth2
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'votre_adresse_gmail@gmail.com',
        clientId: 603571712241-q5ntc1stmk8b3npthhb3mdn0jmuimg2a.apps.googleusercontent.com,
        clientSecret: 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,
        refreshToken: REFRESH_TOKEN,
        accessToken: oAuth2Client.getAccessToken(),
    },
});

// Fonction pour obtenir la date et l'heure formatées
function getFormattedDateTime() {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toLocaleTimeString('en-US', { hour12: false });
    return `${date} ${time}`;
}

// Endpoint pour s'inscrire (créer un compte)
app.post("/api/signup", async (req, res) => {
    try {
        const { username, password, email, birthdate, city } = req.body;

        console.log("Received data:", req.body);

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        console.log("Existing user:", existingUser);

        if (existingUser) {
            return res.status(400).json({ error: "Ce nom d'utilisateur ou cette adresse e-mail est déjà pris." });
        }

        const newUser = new User({ username, email, birthdate, city });

        // Utiliser la méthode `register` pour enregistrer le nouvel utilisateur
        User.register(newUser, password, async (err, user) => {
            if (err) {
                console.error('Erreur lors de l\'inscription :', err);
                return res.status(500).json({ error: 'Erreur lors de l\'inscription. Veuillez réessayer.' });
            }

            const mailOptions = {
                from: 'botville11@gmail.com',
                to: email,
                subject: 'Confirmation d\'inscription',
                text: `Bienvenue, ${username}! Votre compte a été créé avec succès.`,
            };

            // Envoyer l'e-mail de confirmation
            try {
                await transporter.sendMail(mailOptions);
                console.log('E-mail de confirmation envoyé avec succès.');
            } catch (error) {
                console.error('Erreur lors de l\'envoi de l\'e-mail de confirmation :', error);
            }

            // Authentifier l'utilisateur après l'inscription
            passport.authenticate("local")(req, res, () => {
                // Rediriger l'utilisateur vers la page profile.html
                res.redirect("/profile.html");

                // Écrire dans le fichier journal
                fs.appendFile('logs.txt', `Nouvelle inscription - Nom d'utilisateur: ${username}, Email: ${email}, Date: ${getFormattedDateTime()}\n`, (err) => {
                    if (err) {
                        console.error('Erreur lors de l\'écriture du journal :', err);
                    }
                });
            });
        });
    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
        res.status(500).json({ error: 'Erreur lors de l\'inscription. Veuillez réessayer.' });
    }
});

// Endpoint pour se connecter
app.post("/api/login", passport.authenticate("local"), (req, res) => {
    const username = req.user.username;

    // Rediriger l'utilisateur vers la page profile.html après la connexion réussie
    res.redirect("/profile.html");

    // Écrire dans le fichier journal
    fs.appendFile('logs.txt', `Connexion réussie - Nom d'utilisateur: ${username}, Date: ${getFormattedDateTime()}\n`, (err) => {
        if (err) {
            console.error('Erreur lors de l\'écriture du journal :', err);
        }
    });
});

// Endpoint pour se déconnecter
app.get("/api/logout", (req, res) => {
    try {
        const username = req.user.username; // Ajout pour obtenir le nom d'utilisateur

        req.logout(function(err) {
            if (err) {
                console.error('Erreur lors de la déconnexion :', err);
                res.status(500).json({ error: 'Erreur lors de la déconnexion. Veuillez réessayer.' });
            } else {
                // Ajouter la date, l'heure et le nom d'utilisateur dans le fichier journal
                fs.appendFile('logs.txt', `Déconnexion réussie - Nom d'utilisateur: ${username}, Date: ${getFormattedDateTime()}\n`, (err) => {
                    if (err) {
                        console.error('Erreur lors de l\'écriture du journal :', err);
                    }
                });

                res.json({ message: "Déconnexion réussie." });
            }
        });
    } catch (error) {
        console.error('Erreur lors de la déconnexion :', error);
        res.status(500).json({ error: 'Erreur lors de la déconnexion. Veuillez réessayer.' });
    }
});

// Nouvelle route pour récupérer les informations du profil
app.get("/api/profile", async (req, res) => {
    try {
        // Assurez-vous que l'utilisateur est connecté
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: "Non autorisé. Veuillez vous connecter." });
        }
    
        // Récupérez les informations du profil depuis la session utilisateur
        const userProfile = {
            username: req.user.username,
            email: req.user.email,
            birthdate: req.user.birthdate,
            city: req.user.city,
            appointments: req.user.appointments,
        };
    
        res.json(userProfile);
    } catch (error) {
        console.error('Erreur lors de la récupération du profil :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du profil. Veuillez réessayer.' });
    }
});

// Endpoint pour vérifier si l'utilisateur est connecté
app.get("/api/check-auth", (req, res) => {
    res.json({ isAuthenticated: req.isAuthenticated() });
});

// Endpoint pour traiter le paiement avec Stripe
app.post('/api/process-payment', async (req, res) => {
    const { token, amount, appointmentDate, appointmentTime } = req.body;

    try {
        // Créez une charge avec le token de carte et le montant
        const charge = await stripe.charges.create({
            source: token.id,
            amount,
            currency: 'usd', // Changez en votre devise
            description: 'Paiement pour rendez-vous',
        });

        // Ajoutez le rendez-vous à l'utilisateur
        req.user.appointments.push(`Rendez-vous le ${appointmentDate} à ${appointmentTime}`);
        await req.user.save();

        // Envoyez une réponse réussie au client
        res.json({ success: true });
    } catch (error) {
        console.error('Erreur lors du traitement du paiement:', error);
        res.status(500).json({ error: 'Erreur lors du traitement du paiement. Veuillez réessayer.' });
    }
});

app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;

    // Logique pour générer le lien de réinitialisation va ici
    const resetLink = 'https://example.com/reset-password?token=xyz123';

    // Configuration de l'e-mail
    const mailOptions = {
        from: 'votreadresse@gmail.com',
        to: email,
        subject: 'Réinitialisation de mot de passe',
        text: `Cliquez sur ce lien pour réinitialiser votre mot de passe: ${resetLink}`,
    };

    try {
        // Envoyer l'e-mail
        await transporter.sendMail(mailOptions);
        console.log('E-mail de réinitialisation envoyé avec succès');
        res.status(200).json({ message: 'E-mail de réinitialisation envoyé avec succès' });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail de réinitialisation:', error);
        res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'e-mail de réinitialisation' });
    }
});

// Dernière ligne pour démarrer le serveur
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
