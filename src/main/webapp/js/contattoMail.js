		document.addEventListener("DOMContentLoaded", function() {
			const form = document.getElementById("contatti");
			if (form) {
				form.addEventListener("submit", function(event){
					event.preventDefault();
					
					const nick = document.getElementById("nome").value.trim();
					const email = document.getElementById("email").value.trim();
					const body = document.getElementById("messaggio").value.trim();
					
					const destinatari = "s.esposito176@studenti.unisa.it, r.rega24@studenti.unisa.it";
							
					const oggetto = "Nuovo messaggio da "+nick;
					const bodyMail = "Dettagli:\nNome: "+nick+"\nEmail: "+email+"\nMessaggio:\n"+body;
							
					window.open("mailto:"+destinatari+"?subject"+encodeURIComponent(oggetto)+"&body="+encodeURIComponent(bodyMail));
							
				});
			}
		});
		
		