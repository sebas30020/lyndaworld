// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const timeInput = document.getElementById('time-input');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const currentTimeBtn = document.getElementById('current-time-btn');
    const originalTimeDisplay = document.getElementById('original-time-display');
    const resultTimeDisplay = document.getElementById('result-time-display');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    
    // Cargar historial desde localStorage
    let history = JSON.parse(localStorage.getItem('timeCalculationHistory')) || [];
    
    // Mostrar historial al cargar la página
    renderHistory();
    
    // Establecer la hora actual al cargar la página
    setCurrentTime();
    
    // Función para sumar 45 minutos a una hora
    function add45Minutes(timeString) {
        // Dividir la hora y los minutos
        const [hours, minutes] = timeString.split(':').map(Number);
        
        // Crear objeto Date con la hora proporcionada (fecha actual)
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        
        // Sumar 45 minutos
        date.setMinutes(date.getMinutes() + 45);
        
        // Formatear la hora resultante en formato HH:MM
        const resultHours = date.getHours().toString().padStart(2, '0');
        const resultMinutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${resultHours}:${resultMinutes}`;
    }
    
    // Función para formatear hora en formato 12h con AM/PM
    function format12Hour(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        
        return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }
    
    // Función para calcular y mostrar el resultado
    function calculateResult() {
        const inputTime = timeInput.value;
        
        // Verificar si se ingresó una hora válida
        if (!inputTime) {
            alert('Por favor, ingresa una hora válida.');
            return;
        }
        
        // Calcular la hora resultante
        const resultTime = add45Minutes(inputTime);
        
        // Mostrar las horas en formato 24h
        originalTimeDisplay.textContent = inputTime;
        resultTimeDisplay.textContent = resultTime;
        
        // Agregar al historial
        const calculation = {
            original: inputTime,
            result: resultTime,
            timestamp: new Date().toLocaleString()
        };
        
        history.unshift(calculation); // Agregar al principio del array
        
        // Limitar el historial a 10 elementos
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        
        // Guardar en localStorage y actualizar la vista
        saveHistory();
        renderHistory();
        
        // Efecto visual en el resultado
        resultTimeDisplay.style.transform = 'scale(1.1)';
        setTimeout(() => {
            resultTimeDisplay.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Función para reiniciar la calculadora
    function resetCalculator() {
        timeInput.value = '12:00';
        originalTimeDisplay.textContent = '--:--';
        resultTimeDisplay.textContent = '--:--';
        
        // Efecto visual
        timeInput.focus();
    }
    
    // Función para establecer la hora actual
    function setCurrentTime() {
        const now = new Date();
        const currentHours = now.getHours().toString().padStart(2, '0');
        const currentMinutes = now.getMinutes().toString().padStart(2, '0');
        timeInput.value = `${currentHours}:${currentMinutes}`;
    }
    
    // Función para guardar el historial en localStorage
    function saveHistory() {
        localStorage.setItem('timeCalculationHistory', JSON.stringify(history));
    }
    
    // Función para renderizar el historial
    function renderHistory() {
        historyList.innerHTML = '';
        
        if (history.length === 0) {
            historyList.innerHTML = '<p class="no-history">No hay cálculos en el historial.</p>';
            return;
        }
        
        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const time12h = format12Hour(item.original);
            const result12h = format12Hour(item.result);
            
            historyItem.innerHTML = `
                <div>
                    <div class="history-time">${time12h}</div>
                    <div class="history-date">${item.timestamp}</div>
                </div>
                <div style="text-align: center;">
                    <div><i class="fas fa-plus"></i> 45 min</div>
                    <div><i class="fas fa-arrow-right"></i></div>
                </div>
                <div>
                    <div class="history-result">${result12h}</div>
                    <div class="history-24h">(${item.result})</div>
                </div>
            `;
            
            historyList.appendChild(historyItem);
        });
    }
    
    // Función para limpiar el historial
    function clearHistory() {
        if (history.length === 0) return;
        
        if (confirm('¿Estás seguro de que quieres borrar todo el historial?')) {
            history = [];
            saveHistory();
            renderHistory();
        }
    }
    
    // Event Listeners
    calculateBtn.addEventListener('click', calculateResult);
    
    resetBtn.addEventListener('click', resetCalculator);
    
    currentTimeBtn.addEventListener('click', function() {
        setCurrentTime();
        // Efecto visual en el botón
        this.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            this.style.transform = 'rotate(0)';
        }, 300);
    });
    
    clearHistoryBtn.addEventListener('click', clearHistory);
    
    // Permitir calcular con la tecla Enter
    timeInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            calculateResult();
        }
    });
    
    // Calcular automáticamente al cambiar la hora en el input
    timeInput.addEventListener('change', function() {
        // Solo calcular si ya hay un resultado mostrado (para no calcular en el primer cambio)
        if (originalTimeDisplay.textContent !== '--:--') {
            calculateResult();
        }
    });
    
    // Inicializar con un cálculo por defecto
    calculateResult();
});