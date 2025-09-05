// Importación de librerías necesarias
import javax.swing.*;                     // Componentes gráficos (botones, texto, paneles, etc.)
import java.awt.*;                        // Manejo de diseño visual (layout)
import java.awt.event.*;                  // Manejo de eventos (clics, acciones, etc.)
import java.util.ArrayList;               // Lista dinámica para almacenar estados de tareas

// Clase principal que hereda de JFrame (ventana)
public class ToDoApp extends JFrame {

    private DefaultListModel<String> taskModel;  // Modelo de datos para la lista de tareas
    private JList<String> taskList;              // Lista visual de tareas
    private JTextField taskInput;                // Campo de entrada para nuevas tareas
    private JComboBox<String> filterComboBox;    // Filtro para mostrar tareas
    private ArrayList<Boolean> completedStatus;  // Estado de cada tarea (completada o no)

    // Constructor
    public ToDoApp() {
        setTitle("Agenda de Actividades");
        setSize(500, 400);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        taskModel = new DefaultListModel<>();
        taskList = new JList<>(taskModel);
        JScrollPane scrollPane = new JScrollPane(taskList);
        completedStatus = new ArrayList<>();

        // Panel superior (entrada + agregar)
        JPanel topPanel = new JPanel();
        taskInput = new JTextField(25);
        JButton addButton = new JButton("Agregar");
        topPanel.add(taskInput);
        topPanel.add(addButton);

        // Panel del medio (lista de tareas)
        JPanel middlePanel = new JPanel(new BorderLayout());
        middlePanel.add(scrollPane, BorderLayout.CENTER);

        // Panel inferior (acciones y filtro)
        JPanel bottomPanel = new JPanel();
        JButton editButton = new JButton("Editar");
        JButton completeButton = new JButton("Marcar como Completada");
        JButton deleteButton = new JButton("Eliminar");
        filterComboBox = new JComboBox<>(new String[]{"Todas", "Pendientes", "Completadas"});

        bottomPanel.add(editButton);
        bottomPanel.add(completeButton);
        bottomPanel.add(deleteButton);
        bottomPanel.add(new JLabel("Filtrar:"));
        bottomPanel.add(filterComboBox);

        // Agregar los paneles a la ventana principal
        add(topPanel, BorderLayout.NORTH);
        add(middlePanel, BorderLayout.CENTER);
        add(bottomPanel, BorderLayout.SOUTH);

        // Acción del botón Agregar
        addButton.addActionListener(e -> {
            String task = taskInput.getText().trim();
            if (!task.isEmpty()) {
                taskModel.addElement(task);
                completedStatus.add(false);
                taskInput.setText("");
            }
        });

        // Acción del botón Eliminar
        deleteButton.addActionListener(e -> {
            int index = taskList.getSelectedIndex();
            if (index != -1) {
                int actualIndex = taskModel.indexOf(taskList.getSelectedValue());
                taskModel.remove(actualIndex);
                completedStatus.remove(actualIndex);
            }
        });

        // Acción del botón Marcar como Completada
        completeButton.addActionListener(e -> {
            int index = taskList.getSelectedIndex();
            if (index != -1) {
                int actualIndex = taskModel.indexOf(taskList.getSelectedValue());
                String task = taskModel.getElementAt(actualIndex);
                boolean completed = completedStatus.get(actualIndex);
                completedStatus.set(actualIndex, !completed);
                taskModel.setElementAt((!completed ? "[✔] " : "") + task.replaceFirst("\\[✔\\] ", ""), actualIndex);
            }
        });

        // Acción del botón Editar
        editButton.addActionListener(e -> {
            int index = taskList.getSelectedIndex();
            if (index != -1) {
                int actualIndex = taskModel.indexOf(taskList.getSelectedValue());
                String current = taskModel.get(actualIndex).replaceFirst("\\[✔\\] ", "");
                String newTask = JOptionPane.showInputDialog("Editar tarea:", current);
                if (newTask != null && !newTask.trim().isEmpty()) {
                    boolean completed = completedStatus.get(actualIndex);
                    taskModel.set(actualIndex, (completed ? "[✔] " : "") + newTask.trim());
                }
            }
        });

        // Acción del filtro ComboBox
        filterComboBox.addActionListener(e -> applyFilter());
    }

    // Método para aplicar el filtro de visualización
    private void applyFilter() {
        String selected = (String) filterComboBox.getSelectedItem();
        DefaultListModel<String> filteredModel = new DefaultListModel<>();

        for (int i = 0; i < taskModel.size(); i++) {
            boolean completed = completedStatus.get(i);
            String task = taskModel.getElementAt(i);

            if (selected.equals("Todas") ||
                (selected.equals("Pendientes") && !completed) ||
                (selected.equals("Completadas") && completed)) {
                filteredModel.addElement(task);
            }
        }

        taskList.setModel(filteredModel);
    }

    // Método principal: lanza la aplicación
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new ToDoApp().setVisible(true));
    }
}