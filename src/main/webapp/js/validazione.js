document.addEventListener("DOMContentLoaded", function() {
    
    
    const form = document.getElementById("formRegistrazione");
    const emailInput = document.getElementById("email");
    const emailFeedback = document.getElementById("emailFeedback");

    if (!form) return;

    /*chiamata Fetch API*/
    
    // L'evento 'blur' scatta non appena l'utente clicca fuori dal campo email
    emailInput.addEventListener("blur", function() {
        const emailValue = emailInput.value.trim();
        
        // Se il campo è vuoto, puliamo il feedback e ci fermiamo
        if (emailValue.length === 0) {
            emailFeedback.textContent = "";
            return;
        }

        // Chiamata asincrona al server
        const url = "checkEmailServlet?email=" + encodeURIComponent(emailValue);

        fetch(url)
            .then(response => response.json())
            .then(data => {
                // Leggiamo il valore booleano 'esiste' dal JSON
                if (data.esiste) {
                    emailFeedback.textContent = "Attenzione: questa email è già registrata!";
                    emailFeedback.style.color = "#DC2626"; // feedback negativo
                } else {
                    emailFeedback.textContent = "Email disponibile!";
                    emailFeedback.style.color = "#16A34A"; // feedback positivo
                }
            })
            .catch(error => {
                console.error("Errore durante la chiamata AJAX:", error);
            });
    });

    /* validazione regex */
    
    form.addEventListener("submit", function(event) {
        
        event.preventDefault();

        document.getElementById("errorNome").textContent = "";
        document.getElementById("errorCognome").textContent = "";
        document.getElementById("errorPassword").textContent = "";
        document.getElementById("errorTelefono").textContent = "";

        let formValido = true;
        let primoCampoErrato = null; 

        
        const regexLettere = /^[a-zA-ZÀ-ÿ\s']{2,50}$/; // Solo lettere, spazi e apostrofi (min 2, max 50)
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Formato standard email
        const regexPassword = /^.{8,}$/; // Almeno 8 caratteri qualsiasi
        const regexTelefono = /^[0-9]{9,10}$/; // Solo numeri, da 9 a 10 cifre

        // Controllo Nome
        const inputNome = document.getElementById("nome");
        if (!regexLettere.test(inputNome.value.trim())) {
            document.getElementById("errorNome").textContent = "Inserisci un nome valido (solo lettere).";
            formValido = false;
            if (!primoCampoErrato) primoCampoErrato = inputNome;
        }

        // Controllo Cognome
        const inputCognome = document.getElementById("cognome");
        if (!regexLettere.test(inputCognome.value.trim())) {
            document.getElementById("errorCognome").textContent = "Inserisci un cognome valido (solo lettere).";
            formValido = false;
            if (!primoCampoErrato) primoCampoErrato = inputCognome;
        }

        // Controllo Email
        if (!regexEmail.test(emailInput.value.trim())) {
            emailFeedback.textContent = "Formato email non valido.";
            emailFeedback.style.color = "#DC2626";
            formValido = false;
            if (!primoCampoErrato) primoCampoErrato = emailInput;
        }

        
        // se l'email era già in uso
        if (emailFeedback.textContent.includes("già registrata")) {
            formValido = false;
            if (!primoCampoErrato) primoCampoErrato = emailInput;
        }

        // Controllo Password
        const inputPassword = document.getElementById("password");
        if (!regexPassword.test(inputPassword.value.trim())) {
            document.getElementById("errorPassword").textContent = "La password deve contenere almeno 8 caratteri.";
            formValido = false;
            if (!primoCampoErrato) primoCampoErrato = inputPassword;
        }

        // Controllo Telefono
        const inputTelefono = document.getElementById("telefono");
        if (!regexTelefono.test(inputTelefono.value.trim())) {
            document.getElementById("errorTelefono").textContent = "Inserisci un numero di telefono valido (9 o 10 cifre).";
            formValido = false;
            if (!primoCampoErrato) primoCampoErrato = inputTelefono;
        }

        
        if (!formValido) {
            
            primoCampoErrato.focus();
        } else {
            
            form.submit();
        }
    });
});