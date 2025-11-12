// Incluimos la biblioteca estándar de entrada/salida
#include <stdio.h>

// Función principal del programa
int main() {
    // Declaramos variables para almacenar la edad, año de nacimiento y año actual
    int edad;
    int añoNacimiento;
    int añoActual = 2025; // Año actual para hacer los cálculos
    
    // Pedimos al usuario que ingrese su edad
    printf("Por favor, ingresa tu edad: ");
    scanf("%d", &edad); // Leemos la edad ingresada por el usuario
    
    // Calculamos el año de nacimiento restando la edad del año actual
    añoNacimiento = añoActual - edad;
    
    // Validamos que la edad sea un número válido (no negativo)
    if (edad < 0) {
        printf("Error: La edad no puede ser negativa.\n");
        return 1; // Terminamos el programa con un código de error
    }
    
    // Mostramos un título para la primera sección
    printf("\n=== Usando estructura IF ===\n");
    // Usando solo estructura IF (múltiples sentencias if independientes)
    // Cada if se evalúa independientemente de los demás
    if (añoNacimiento >= 1930 && añoNacimiento <= 1948) {
        printf("Perteneces a la Generación Niños de Posguerra\n");
    }
    
    if (añoNacimiento >= 1949 && añoNacimiento <= 1968) {
        printf("Perteneces a la Generación Baby Boomers\n");
    }
    
    if (añoNacimiento >= 1969 && añoNacimiento <= 1980) {
        printf("Perteneces a la Generación X\n");
    }
    
    if (añoNacimiento >= 1981 && añoNacimiento <= 1993) {
        printf("Perteneces a la Generación Millennials\n");
    }
    
    if (añoNacimiento >= 1994) {
        printf("Perteneces a las Generaciones Z y Alpha\n");
    }
    
    if (añoNacimiento < 1930) {
        printf("Año de nacimiento no contemplado en este programa\n");
    }
    
    // Mostramos un título para la segunda sección
    printf("\n=== Usando estructura IF...ELSE ===\n");
    // Usando estructura IF...ELSE (cadena de condiciones)
    // Una vez que se cumple una condición, no se evalúan las demás
    if (añoNacimiento >= 1930 && añoNacimiento <= 1948) {
        printf("Perteneces a la Generación Niños de Posguerra\n");
    } else if (añoNacimiento >= 1949 && añoNacimiento <= 1968) {
        printf("Perteneces a la Generación Baby Boomers\n");
    } else if (añoNacimiento >= 1969 && añoNacimiento <= 1980) {
        printf("Perteneces a la Generación X\n");
    } else if (añoNacimiento >= 1981 && añoNacimiento <= 1993) {
        printf("Perteneces a la Generación Millennials\n");
    } else if (añoNacimiento >= 1994) {
        printf("Perteneces a las Generaciones Z y Alpha\n");
    } else {
        // Esta parte se ejecuta si ninguna de las condiciones anteriores se cumple
        printf("Año de nacimiento no contemplado en este programa\n");
    }
    
    // Mostramos un título para la tercera sección
    printf("\n=== Usando estructura SWITCH ===\n");
    // Usando estructura SWITCH
    // Para usar switch, necesitamos convertir los rangos a casos específicos
    // Creamos una variable para representar la categoría
    int categoria;
    
    // Primero determinamos a qué categoría pertenece el año de nacimiento
    if (añoNacimiento >= 1930 && añoNacimiento <= 1948) {
        categoria = 1; // Niños de posguerra
    } else if (añoNacimiento >= 1949 && añoNacimiento <= 1968) {
        categoria = 2; // Baby Boomers
    } else if (añoNacimiento >= 1969 && añoNacimiento <= 1980) {
        categoria = 3; // Generación X
    } else if (añoNacimiento >= 1981 && añoNacimiento <= 1993) {
        categoria = 4; // Millennials
    } else if (añoNacimiento >= 1994) {
        categoria = 5; // Generación Z y Alpha
    } else {
        categoria = 0; // No contemplado
    }
    
    // Ahora usamos switch para mostrar el mensaje correspondiente
    switch (categoria) {
        case 1:
            printf("Perteneces a la Generación Niños de Posguerra\n");
            break; // Importante: rompemos el switch para no ejecutar los siguientes casos
        case 2:
            printf("Perteneces a la Generación Baby Boomers\n");
            break;
        case 3:
            printf("Perteneces a la Generación X\n");
            break;
        case 4:
            printf("Perteneces a la Generación Millennials\n");
            break;
        case 5:
            printf("Perteneces a las Generaciones Z y Alpha\n");
            break;
        default:
            // Se ejecuta si no coincide con ninguno de los casos anteriores
            printf("Año de nacimiento no contemplado en este programa\n");
            break;
    }
    
    // Terminamos el programa exitosamente
    return 0;
}