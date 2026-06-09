document.addEventListener("DOMContentLoaded", function() {
    
    // 🔥 NOVITÀ 1: Catturiamo i 3 SLIDER e i loro TESTI
    const checkboxesTema = document.querySelectorAll(".filtro-tema");
    
    const sliderUscita = document.getElementById("sliderUscita");
    const spanValoreUscita = document.getElementById("valoreUscita");
    
    const sliderRitiro = document.getElementById("sliderRitiro");
    const spanValoreRitiro = document.getElementById("valoreRitiro");
    
    const sliderPezzi = document.getElementById("sliderPezzi");
    const spanValorePezzi = document.getElementById("valorePezzi");
    
    const btnReset = document.getElementById("btnReset");
    const cards = document.querySelectorAll(".card-prodotto");
    const boxNessunRisultato = document.getElementById("nessun-risultato");

    function applicaFiltri() {
        // Estraiamo i dati
        const temiSelezionati = Array.from(checkboxesTema).filter(cb => cb.checked).map(cb => cb.value);
        
        // 🔥 NOVITÀ 2: Lettura dei 3 slider in real-time
        const minUscitaVal = parseInt(sliderUscita.value);
        const maxRitiroVal = parseInt(sliderRitiro.value);
        const maxPezziVal = parseInt(sliderPezzi.value);
        
        // Aggiorna i testi rossi a schermo
        spanValoreUscita.textContent = minUscitaVal;
        spanValorePezzi.textContent = maxPezziVal;
        
        // Se lo slider ritiro è al massimo (2026), scriviamo "Tutti" per far capire che fa passare tutto
        if (maxRitiroVal === 2026) {
            spanValoreRitiro.textContent = "Tutti";
        } else {
            spanValoreRitiro.textContent = maxRitiroVal;
        }

        let prodottiVisibili = 0;

        cards.forEach(card => {
            const cardTema = card.getAttribute("data-tema");
            const cardAnnoUscita = parseInt(card.getAttribute("data-anno-uscita"));
            const cardAnnoRitiro = parseInt(card.getAttribute("data-anno-ritiro"));
            const cardPezzi = parseInt(card.getAttribute("data-pezzi"));

            // CONDIZIONI DI FILTRAGGIO
            const matchTema = temiSelezionati.length === 0 || temiSelezionati.includes(cardTema);
            
            // 🔥 NOVITÀ 3: Logica matematica anni
            // L'anno di uscita del set deve essere MAGGIORE o UGUALE allo slider
            const matchAnnoUscita = cardAnnoUscita >= minUscitaVal;
            
            // Logica Ritiro: Se è a 2026 passa tutto. Altrimenti passa solo se è stato ritirato ( > 0) PRIMA o DURANTE l'anno selezionato.
            let matchAnnoRitiro = false;
            if (maxRitiroVal === 2026) {
                matchAnnoRitiro = true; 
            } else {
                matchAnnoRitiro = (cardAnnoRitiro > 0 && cardAnnoRitiro <= maxRitiroVal);
            }

            const matchPezzi = cardPezzi <= maxPezziVal;

            // Se passa tutti i test, si vede!
            if (matchTema && matchAnnoUscita && matchAnnoRitiro && matchPezzi) {
                card.style.display = "flex";
                prodottiVisibili++;
            } else {
                card.style.display = "none";
            }
        });

        // Mostra il div di errore se non c'è nessun match
        if (prodottiVisibili === 0) {
            boxNessunRisultato.style.display = "block";
        } else {
            boxNessunRisultato.style.display = "none";
        }
    }

    // 🔥 NOVITÀ 4: Agganciamo l'ascolto ai nuovi slider
    checkboxesTema.forEach(cb => cb.addEventListener("change", applicaFiltri));
    sliderUscita.addEventListener("input", applicaFiltri);
    sliderRitiro.addEventListener("input", applicaFiltri);
    sliderPezzi.addEventListener("input", applicaFiltri);

    // Reset Totale
    btnReset.addEventListener("click", function() {
        checkboxesTema.forEach(cb => cb.checked = false);
        sliderUscita.value = 2000;
        sliderRitiro.value = 2026;
        sliderPezzi.value = 8000;
        applicaFiltri();
    });
});