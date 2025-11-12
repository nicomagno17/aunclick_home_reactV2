// Importación de librerías necesarias
import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

// Clase principal que hereda de JFrame (ventana)
public class CalculadoraNotas extends JFrame {
    // Componentes de la interfaz
    private JTextField[] notasFields;
    private JLabel resultadoLabel;
    private JButton calcularButton;
    private JButton limpiarButton;
    
    // Ponderaciones de cada evaluación
    private final double[] ponderaciones = {0.07, 0.14, 0.21, 0.07, 0.07, 0.14, 0.30};
    
    // Constructor
    public CalculadoraNotas() {
        // Configuración básica de la ventana
        setTitle("Calculadora de Nota Final del Curso");
        setSize(500, 450);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLayout(new BorderLayout());
        
        // Panel principal
        JPanel mainPanel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);
        
        // Crear campos para las notas
        notasFields = new JTextField[7];
        
        // Etiquetas para cada evaluación
        String[] etiquetas = {
            "Evaluación 1 (7%):",
            "Evaluación 2 (14%):",
            "Evaluación 3 (21%):",
            "Evaluación 4 (7%):",
            "Evaluación 5 (7%):",
            "Evaluación 6 (14%):",
            "Examen (30%):"
        };
        
        // Crear y agregar componentes al panel
        for (int i = 0; i < 7; i++) {
            gbc.gridx = 0;
            gbc.gridy = i;
            gbc.anchor = GridBagConstraints.WEST;
            mainPanel.add(new JLabel(etiquetas[i]), gbc);
            
            gbc.gridx = 1;
            gbc.fill = GridBagConstraints.HORIZONTAL;
            gbc.weightx = 1.0;
            notasFields[i] = new JTextField(10);
            mainPanel.add(notasFields[i], gbc);
            gbc.weightx = 0.0;
            gbc.fill = GridBagConstraints.NONE;
        }
        
        // Panel de botones
        JPanel buttonPanel = new JPanel(new FlowLayout());
        calcularButton = new JButton("Calcular");
        limpiarButton = new JButton("Limpiar");
        buttonPanel.add(calcularButton);
        buttonPanel.add(limpiarButton);
        
        // Área de resultados
        resultadoLabel = new JLabel("Ingrese las notas y presione Calcular", JLabel.CENTER);
        resultadoLabel.setFont(new Font("Arial", Font.BOLD, 14));
        resultadoLabel.setOpaque(true);
        resultadoLabel.setBackground(Color.LIGHT_GRAY);
        resultadoLabel.setBorder(BorderFactory.createEtchedBorder());
        
        // Agregar paneles a la ventana principal
        add(mainPanel, BorderLayout.CENTER);
        add(buttonPanel, BorderLayout.SOUTH);
        add(resultadoLabel, BorderLayout.NORTH);
        
        // Asignar eventos a los botones
        calcularButton.addActionListener(new CalcularListener());
        limpiarButton.addActionListener(new LimpiarListener());
    }
    
    // Método para validar una nota
    private boolean validarNota(String notaStr, int indice) throws NotaInvalidaException {
        try {
            double nota = Double.parseDouble(notaStr);
            if (nota < 0 || nota > 7.0) {
                throw new NotaInvalidaException("La nota debe estar entre 0.0 y 7.0 para " + 
                    (indice < 6 ? "Evaluación " + (indice + 1) : "Examen"));
            }
            return true;
        } catch (NumberFormatException e) {
            throw new NotaInvalidaException("Formato inválido para " + 
                (indice < 6 ? "Evaluación " + (indice + 1) : "Examen") + 
                ". Ingrese un número válido.");
        }
    }
    
    // Método para calcular la nota final
    private double calcularNotaFinal(double[] notas) {
        double notaFinal = 0.0;
        for (int i = 0; i < notas.length; i++) {
            notaFinal += notas[i] * ponderaciones[i];
        }
        return Math.round(notaFinal * 100.0) / 100.0; // Redondear a 2 decimales
    }
    
    // Listener para el botón Calcular
    private class CalcularListener implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            try {
                // Validar y obtener notas
                double[] notas = new double[7];
                for (int i = 0; i < 7; i++) {
                    String notaStr = notasFields[i].getText().trim();
                    if (notaStr.isEmpty()) {
                        throw new NotaInvalidaException("Por favor, ingrese la nota para " + 
                            (i < 6 ? "Evaluación " + (i + 1) : "Examen"));
                    }
                    validarNota(notaStr, i);
                    notas[i] = Double.parseDouble(notaStr);
                }
                
                // Calcular nota final
                double notaFinal = calcularNotaFinal(notas);
                
                // Determinar si aprobó o reprobó
                String mensaje = notaFinal >= 4.0 ? "APROBÓ" : "REPROBÓ";
                Color colorFondo = notaFinal >= 4.0 ? Color.GREEN : Color.RED;
                
                // Mostrar resultado
                resultadoLabel.setText(String.format("Nota Final: %.2f - %s", notaFinal, mensaje));
                resultadoLabel.setBackground(colorFondo);
                
            } catch (NotaInvalidaException ex) {
                JOptionPane.showMessageDialog(CalculadoraNotas.this, 
                    ex.getMessage(), "Error en los datos", JOptionPane.ERROR_MESSAGE);
                resultadoLabel.setText("Error en los datos ingresados");
                resultadoLabel.setBackground(Color.YELLOW);
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(CalculadoraNotas.this, 
                    "Ocurrió un error inesperado: " + ex.getMessage(), 
                    "Error", JOptionPane.ERROR_MESSAGE);
                resultadoLabel.setText("Error en la aplicación");
                resultadoLabel.setBackground(Color.YELLOW);
            }
        }
    }
    
    // Listener para el botón Limpiar
    private class LimpiarListener implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            // Limpiar todos los campos
            for (JTextField field : notasFields) {
                field.setText("");
            }
            resultadoLabel.setText("Ingrese las notas y presione Calcular");
            resultadoLabel.setBackground(Color.LIGHT_GRAY);
            
            // Enfocar el primer campo
            if (notasFields.length > 0) {
                notasFields[0].requestFocus();
            }
        }
    }
    
    // Método principal: lanza la aplicación
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            try {
                // Establecer el look and feel del sistema
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception e) {
                // Si no se puede establecer, usar el predeterminado
            }
            new CalculadoraNotas().setVisible(true);
        });
    }
}

// Clase de excepción personalizada para notas inválidas
class NotaInvalidaException extends Exception {
    public NotaInvalidaException(String mensaje) {
        super(mensaje);
    }
}