package control;

import java.io.IOException;
import java.sql.Date;
import java.sql.SQLException;
import java.time.LocalDate;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.sql.DataSource;

import model.Carrello;
import model.Ordine.OrdineBean;
import model.Ordine.OrdineDAO;
import model.Utente.UtenteBean;

@WebServlet("/CheckoutServlet")
public class CheckoutServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private DataSource ds;

    @Override
    public void init() throws ServletException {
        try {
            InitialContext ctx = new InitialContext();
            ds = (DataSource) ctx.lookup("java:comp/env/jdbc/BrickCaveau");
        } catch (NamingException e) {
            throw new ServletException("Impossibile trovare il DataSource", e);
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        // controllo sessione
        if (session == null || session.getAttribute("utente") == null) {
            response.sendRedirect(request.getContextPath() + "/login.jsp?error=Devi effettuare il login per completare l'ordine");
            return;
        }

        // controllo carrello
        Carrello carrello = (Carrello) session.getAttribute("carrello");
        if (carrello == null || carrello.getElementi().isEmpty()) {
            response.sendRedirect(request.getContextPath() + "/catalogoServlet");
            return;
        }

        UtenteBean utente = (UtenteBean) session.getAttribute("utente");
        System.out.println("ATTENZIONE - ID Utente in fase di checkout: " + utente.getIdUtente()); 

        try {
            OrdineDAO ordineDAO = new OrdineDAO(ds);

            OrdineBean nuovoOrdine = new OrdineBean();
            nuovoOrdine.setUtenteId(utente.getIdUtente());
            nuovoOrdine.setDataOrdine(Date.valueOf(LocalDate.now()));
            nuovoOrdine.setTotale(carrello.getPrezzoTotaleComplessivo());
            
            // salvataggio nel database
            ordineDAO.doCheckout(nuovoOrdine, carrello);

            // svuotamento carrello
            carrello.svuota();
            session.setAttribute("carrello", carrello);

            // redirect a messaggio di successo
            response.sendRedirect(request.getContextPath() + "/ProfiloServlet?success=ordine_completato");

        } catch (SQLException e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/errori/500.jsp");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        doGet(request, response);
    }
}