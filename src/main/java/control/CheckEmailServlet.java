package control;

import java.io.IOException;

import java.sql.SQLException;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import model.Utente.UtenteDAO;



@WebServlet("/checkEmail")
public class CheckEmailServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private DataSource ds;

    @Override
    public void init() throws ServletException {
        try {
            InitialContext ctx = new InitialContext();
            ds = (DataSource) ctx.lookup("java:comp/env/jdbc/BrickCaveau");
        } catch (NamingException e) {
            throw new ServletException(e);
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String email = request.getParameter("email");
        
        // Impostiamo il content type corretto per la risposta JSON richiesta dal prof
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        boolean dataExists = false;

        if (email != null && !email.trim().isEmpty()) {
            try {
                UtenteDAO utenteDAO = new UtenteDAO(ds);
                // Se restituisce un utente, significa che l'email è già occupata!
                if (utenteDAO.doRetrieveByEmail(email) != null) {
                    dataExists = true;
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        // Risposta JSON snella pronta per la JavaScript Fetch API del front-end
        response.getWriter().print("{\"esiste\": " + dataExists + "}");
    }
}
