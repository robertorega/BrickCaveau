document.addEventListener("DOMContentLoaded", function() {
    
    // 1. CATTURA TUTTI GLI ELEMENTI HTML
    const checkboxesTema = document.querySelectorAll(".filtro-tema");
    const sliderUscita = document.getElementById("sliderUscita");
    const spanValoreUscita = document.getElementById("valoreUscita");
    const sliderRitiro = document.getElementById("sliderRitiro");
    const spanValoreRitiro = document.getElementById("valoreRitiro");
    const sliderPezzi = document.getElementById("sliderPezzi");
    const spanValorePezzi = document.getElementById("valorePezzi");
    
    // Elementi per Ordinamento
    const selectOrdinamento = document.getElementById("ordinamento");
    const grigliaCatalogo = document.querySelector(".grid-catalogo");
    
    const btnReset = document.getElementById("btnReset");
    const cards = document.querySelectorAll(".card-prodotto");
    const boxNessunRisultato = document.getElementById("nessun-risultato");

    // 2. FUNZIONE DI FILTRAGGIO LIVE (Mostra/Nascondi)
    function applicaFiltri() {
        const temiSelezionati = Array.from(checkboxesTema).filter(cb => cb.checked).map(cb => cb.value);
        const minUscitaVal = parseInt(sliderUscita.value);
        const maxRitiroVal = parseInt(sliderRitiro.value);
        const maxPezziVal = parseInt(sliderPezzi.value);
        
        spanValoreUscita.textContent = minUscitaVal;
        spanValorePezzi.textContent = maxPezziVal;
        
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

            const matchTema = temiSelezionati.length === 0 || temiSelezionati.includes(cardTema);
            const matchAnnoUscita = cardAnnoUscita >= minUscitaVal;
            
            let matchAnnoRitiro = false;
            if (maxRitiroVal === 2026) {
                matchAnnoRitiro = true; 
            } else {
                matchAnnoRitiro = (cardAnnoRitiro > 0 && cardAnnoRitiro <= maxRitiroVal);
            }

            const matchPezzi = cardPezzi <= maxPezziVal;

            if (matchTema && matchAnnoUscita && matchAnnoRitiro && matchPezzi) {
                card.style.display = "flex";
                prodottiVisibili++;
            } else {
                card.style.display = "none";
            }
        });

        if (prodottiVisibili === 0) {
            boxNessunRisultato.style.display = "block";
        } else {
            boxNessunRisultato.style.display = "none";
        }
    }

    // 3. FUNZIONE DI ORDINAMENTO MAGIC
    function ordinaCards() {
        // Se per caso la griglia non c'è (es. database vuoto), ferma tutto
        if (!grigliaCatalogo) return; 

        // Creiamo un array con tutte le card visibili o invisibili
        let cardsArray = Array.from(grigliaCatalogo.querySelectorAll('.card-prodotto'));
        const criterio = selectOrdinamento.value;

        // Ordiniamo l'array
        cardsArray.sort((a, b) => {
            if (criterio === 'nome-asc') {
                return a.dataset.nome.localeCompare(b.dataset.nome);
            } else if (criterio === 'nome-desc') {
                return b.dataset.nome.localeCompare(a.dataset.nome);
            } else if (criterio === 'codice-asc') {
                return parseInt(a.dataset.codice) - parseInt(b.dataset.codice);
            } else if (criterio === 'codice-desc') {
                return parseInt(b.dataset.codice) - parseInt(a.dataset.codice);
            } else if (criterio === 'pezzi-asc') {
                return parseInt(a.dataset.pezzi) - parseInt(b.dataset.pezzi);
            } else if (criterio === 'pezzi-desc') {
                return parseInt(b.dataset.pezzi) - parseInt(a.dataset.pezzi);
            }
            return 0;
        });

        // Svuotiamo la griglia e ri-appendiamo le card ordinate
        grigliaCatalogo.innerHTML = '';
        cardsArray.forEach(card => grigliaCatalogo.appendChild(card));
    }


    // 4. EVENT LISTENERS (Quelli che fanno scattare le funzioni)
    checkboxesTema.forEach(cb => cb.addEventListener("change", applicaFiltri));
    sliderUscita.addEventListener("input", applicaFiltri);
    sliderRitiro.addEventListener("input", applicaFiltri);
    sliderPezzi.addEventListener("input", applicaFiltri);
    
    // Quando l'utente cambia opzione nella tendina, ordina le card
    if(selectOrdinamento) {
        selectOrdinamento.addEventListener("change", ordinaCards);
    }

    // Tasto "Azzera Filtri"
    if (btnReset) {
        btnReset.addEventListener("click", function() {
            checkboxesTema.forEach(cb => cb.checked = false);
            sliderUscita.value = 2000;
            sliderRitiro.value = 2026;
            sliderPezzi.value = 5000; // Torna a 5000
            selectOrdinamento.value = "nome-asc"; // Torna all'ordinamento di default
            applicaFiltri();
            ordinaCards();
        });
    }

    // APPENA CARICA LA PAGINA: Mette i prodotti in ordine alfabetico (Nome A-Z)
    ordinaCards();
});
