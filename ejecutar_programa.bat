@echo off
echo Instalando Python y ejecutando el programa de generaciones...
echo.

REM Verificar si Python está instalado
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Python ya está instalado.
    echo Ejecutando el programa...
    python generaciones.py
    pause
    exit /b
)

echo Python no está instalado. Abriendo el sitio de descarga...
echo.
echo Por favor, descargue e instale Python desde el sitio web que se abrirá.
echo Durante la instalación, asegúrese de marcar la opción "Add Python to PATH".
echo Después de la instalación, ejecute este archivo nuevamente.
echo.
timeout /t 5 >nul
start "" "https://www.python.org/downloads/"
pause