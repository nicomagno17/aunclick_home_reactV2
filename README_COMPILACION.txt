INSTRUCCIONES PARA COMPILAR Y EJECUTAR EL PROGRAMA

Este proyecto incluye dos versiones del programa:
1. generaciones.c - Versión en lenguaje C
2. generaciones.py - Versión en lenguaje Python (más fácil de ejecutar)

OPCIÓN 1: Usar GCC (MinGW en Windows)
1. Descargar e instalar MinGW: http://www.mingw.org/
2. Añadir MinGW al PATH del sistema
3. Abrir una terminal en la carpeta del proyecto
4. Compilar con el comando: gcc generaciones.c -o generaciones
5. Ejecutar con: ./generaciones (en Linux/Mac) o generaciones.exe (en Windows)

OPCIÓN 2: Usar Visual Studio (Windows)
1. Instalar Visual Studio Community (gratuito)
2. Abrir el "Developer Command Prompt for VS"
3. Navegar a la carpeta del proyecto
4. Compilar con el comando: cl generaciones.c
5. Ejecutar con: generaciones.exe

OPCIÓN 3: Usar Python (la más fácil)
1. Descargar e instalar Python desde https://www.python.org/downloads/
2. Asegurarse de marar la opción "Add Python to PATH" durante la instalación
3. Abrir una terminal en la carpeta del proyecto
4. Ejecutar con: python generaciones.py

OPCIÓN 4: Usar un compilador en línea
1. Visitar un sitio como https://www.onlinegdb.com/online_c_compiler
2. Copiar y pegar el código del archivo generaciones.c
3. Compilar y ejecutar directamente en el navegador

EXPLICACIÓN DEL PROGRAMA:
El programa solicita al usuario su edad, calcula su año de nacimiento y determina a qué generación pertenece según los rangos:
- Niños de posguerra (1930-1948)
- Baby Boomers (1949-1968)
- Generación X (1969-1980)
- Millennials (1981-1993)
- Generación Z y Alpha (1994 en adelante)

Se implementan tres estructuras de control diferentes:
1. Múltiples sentencias IF independientes
2. Cadena de IF...ELSE
3. Estructura SWITCH (simulada con diccionario en Python)

El código está completamente comentado en español para facilitar su comprensión.