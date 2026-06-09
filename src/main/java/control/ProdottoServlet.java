package control;

import java.io.IOException;
import java.sql.SQLException;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import model.SetLego.SetLegoBean;
import model.SetLego.SetLegoDAO;

@WebServlet("/ProdottoServlet")
public class ProdottoServlet extends HttpServlet {
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
        
        try {
            // Prendo l'ID del prodotto passato nell'URL
            int idSet = Integer.parseInt(request.getParameter("id"));
            
            SetLegoDAO setDAO = new SetLegoDAO(ds);
            
            // Richiamo il metodo esatto che ho letto nel tuo DAO!
            SetLegoBean prodotto = setDAO.doRetrieveByKey(idSet);
            
            // Metto il bean nella request
            request.setAttribute("prodotto", prodotto);
            
            // Mando alla pagina JSP corretta
            RequestDispatcher dispatcher = request.getRequestDispatcher("/prodotto.jsp");
            dispatcher.forward(request, response);
            
        } catch (SQLException | NumberFormatException e) { 
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