# Programa para determinar la generación según la edad
# Desarrollado en Python para facilitar la ejecución

def main():
    # Pedimos la edad al usuario
    edad = int(input("Por favor, ingresa tu edad: "))
    
    # Calculamos el año de nacimiento
    año_actual = 2025
    año_nacimiento = año_actual - edad
    
    # Validamos que la edad sea válida
    if edad < 0:
        print("Error: La edad no puede ser negativa.")
        return
    
    print("\n=== Usando estructura IF ===")
    # Usando solo estructura IF
    if año_nacimiento >= 1930 and año_nacimiento <= 1948:
        print("Perteneces a la Generación Niños de Posguerra")
    
    if año_nacimiento >= 1949 and año_nacimiento <= 1968:
        print("Perteneces a la Generación Baby Boomers")
    
    if año_nacimiento >= 1969 and año_nacimiento <= 1980:
        print("Perteneces a la Generación X")
    
    if año_nacimiento >= 1981 and año_nacimiento <= 1993:
        print("Perteneces a la Generación Millennials")
    
    if año_nacimiento >= 1994:
        print("Perteneces a las Generaciones Z y Alpha")
    
    if año_nacimiento < 1930:
        print("Año de nacimiento no contemplado en este programa")
    
    print("\n=== Usando estructura IF...ELSE ===")
    # Usando estructura IF...ELSE
    if año_nacimiento >= 1930 and año_nacimiento <= 1948:
        print("Perteneces a la Generación Niños de Posguerra")
    elif año_nacimiento >= 1949 and año_nacimiento <= 1968:
        print("Perteneces a la Generación Baby Boomers")
    elif año_nacimiento >= 1969 and año_nacimiento <= 1980:
        print("Perteneces a la Generación X")
    elif año_nacimiento >= 1981 and año_nacimiento <= 1993:
        print("Perteneces a la Generación Millennials")
    elif año_nacimiento >= 1994:
        print("Perteneces a las Generaciones Z y Alpha")
    else:
        print("Año de nacimiento no contemplado en este programa")
    
    print("\n=== Usando estructura SWITCH (simulada con diccionario) ===")
    # En Python no hay switch, pero podemos simularlo con un diccionario
    # Primero determinamos la categoría
    if año_nacimiento >= 1930 and año_nacimiento <= 1948:
        categoria = 1
    elif año_nacimiento >= 1949 and año_nacimiento <= 1968:
        categoria = 2
    elif año_nacimiento >= 1969 and año_nacimiento <= 1980:
        categoria = 3
    elif año_nacimiento >= 1981 and año_nacimiento <= 1993:
        categoria = 4
    elif año_nacimiento >= 1994:
        categoria = 5
    else:
        categoria = 0
    
    # Simulamos switch con un diccionario
    switch = {
        1: "Perteneces a la Generación Niños de Posguerra",
        2: "Perteneces a la Generación Baby Boomers",
        3: "Perteneces a la Generación X",
        4: "Perteneces a la Generación Millennials",
        5: "Perteneces a las Generaciones Z y Alpha"
    }
    
    # Obtenemos el mensaje correspondiente o un mensaje por defecto
    mensaje = switch.get(categoria, "Año de nacimiento no contemplado en este programa")
    print(mensaje)

if __name__ == "__main__":
    main()