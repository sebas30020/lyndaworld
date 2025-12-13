// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const timeInput = document.getElementById('time-input');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const currentTimeBtn = document.getElementById('current-time-btn');
    const originalTimeDisplay = document.getElementById('original-time-display');
    const resultTimeDisplay = document.getElementById('result-time-display');
    const minutesToAddDisplay = document.getElementById('minutes-to-add');
    const selectedMinutesSpan = document.getElementById('selected-minutes');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const result15Minutes = document.getElementById('result-15-minutes');
    const result45Minutes = document.getElementById('result-45-minutes');
    const customMinuteBtn = document.getElementById('custom-minute-btn');
    const customMinuteInput = document.getElementById('custom-minute-input');
    const customMinutesInput = document.getElementById('custom-minutes');
    const useCustomBtn = document.getElementById('use-custom-btn');
    const historyTabs = document.querySelectorAll('.history-tab');
    
    // Variables de estado
    let selectedMinutes = 45;
    let currentHistoryFilter = 'all';
    
    // Cargar historial desde localStorage
    let history = JSON.parse(localStorage.getItem('timeCalculationHistory')) || [];
    
    // Inicializar la aplicación
    initApp();
    
    // Función para inicializar la aplicación
    function initApp() {
        // Mostrar historial al cargar la página
        renderHistory();
        
        // Establecer la hora actual al cargar la página
        setCurrentTime();
        
        // Establecer el evento para los botones de minutos
        setupMinuteButtons();
        
        // Establecer eventos para las pestañas del historial
        setupHistoryTabs();
        
        // Calcular por defecto
        calculateResult();
    }
    
    // Función para sumar minutos a una hora
    function addMinutes(timeString, minutesToAdd) {
        // Dividir la hora y los minutos
        const [hours, minutes] = timeString.split(':').map(Number);
        
        // Crear objeto Date con la hora proporcionada (fecha actual)
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        
        // Sumar minutos
        date.setMinutes(date.getMinutes() + minutesToAdd);
        
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
    
    // Función para configurar los botones de selección de minutos
    function setupMinuteButtons() {
        // Botones predefinidos (15 y 45 minutos)
        document.querySelectorAll('.minute-btn:not(.custom-minute-btn)').forEach(btn => {
            btn.addEventListener('click', function() {
                // Remover clase active de todos los botones
                document.querySelectorAll('.minute-btn').forEach(b => b.classList.remove('active'));
                
                // Añadir clase active al botón clickeado
                this.classList.add('active');
                
                // Ocultar el input personalizado si estaba visible
                customMinuteInput.style.display = 'none';
                
                // Establecer los minutos seleccionados
                selectedMinutes = parseInt(this.dataset.minutes);
                selectedMinutesSpan.textContent = selectedMinutes;
                minutesToAddDisplay.textContent = selectedMinutes + ' min';
                
                // Calcular automáticamente
                calculateResult();
            });
        });
        
        // Botón para personalizar minutos
        customMinuteBtn.addEventListener('click', function() {
            // Remover clase active de todos los botones
            document.querySelectorAll('.minute-btn').forEach(b => b.classList.remove('active'));
            
            // Añadir clase active al botón personalizado
            this.classList.add('active');
            
            // Mostrar el input personalizado
            customMinuteInput.style.display = 'block';
            
            // Establecer el foco en el input personalizado
            customMinutesInput.focus();
        });
        
        // Botón para usar minutos personalizados
        useCustomBtn.addEventListener('click', function() {
            let customMinutes = parseInt(customMinutesInput.value);
            
            // Validar el valor ingresado
            if (isNaN(customMinutes) || customMinutes < 1 || customMinutes > 300) {
                alert('Por favor, ingresa un valor entre 1 y 300 minutos.');
                customMinutesInput.focus();
                return;
            }
            
            // Establecer los minutos personalizados
            selectedMinutes = customMinutes;
            selectedMinutesSpan.textContent = selectedMinutes;
            minutesToAddDisplay.textContent = selectedMinutes + ' min';
            
            // Calcular automáticamente
            calculateResult();
        });
        
        // Permitir usar Enter en el input personalizado
        customMinutesInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                useCustomBtn.click();
            }
        });
    }
    
    // Función para configurar las pestañas del historial
    function setupHistoryTabs() {
        historyTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remover clase active de todas las pestañas
                historyTabs.forEach(t => t.classList.remove('active'));
                
                // Añadir clase active a la pestaña clickeada
                this.classList.add('active');
                
                // Establecer el filtro actual
                currentHistoryFilter = this.dataset.historyType;
                
                // Renderizar el historial con el filtro aplicado
                renderHistory();
            });
        });
    }
    
    // Función para calcular y mostrar el resultado
    function calculateResult() {
        const inputTime = timeInput.value;
        
        // Verificar si se ingresó una hora válida
        if (!inputTime) {
            alert('Por favor, ingresa una hora válida.');
            return;
        }
        
        // Calcular la hora resultante con los minutos seleccionados
        const resultTime = addMinutes(inputTime, selectedMinutes);
        
        // Mostrar las horas en formato 24h
        originalTimeDisplay.textContent = inputTime;
        resultTimeDisplay.textContent = resultTime;
        
        // Calcular y mostrar también los resultados con 15 y 45 minutos
        const resultWith15 = addMinutes(inputTime, 15);
        const resultWith45 = addMinutes(inputTime, 45);
        
        result15Minutes.textContent = resultWith15 + ' (' + format12Hour(resultWith15) + ')';
        result45Minutes.textContent = resultWith45 + ' (' + format12Hour(resultWith45) + ')';
        
        // Agregar al historial
        const calculation = {
            original: inputTime,
            result: resultTime,
            minutes: selectedMinutes,
            timestamp: new Date().toLocaleString()
        };
        
        history.unshift(calculation); // Agregar al principio del array
        
        // Limitar el historial a 15 elementos
        if (history.length > 15) {
            history = history.slice(0, 15);
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
        result15Minutes.textContent = '--:--';
        result45Minutes.textContent = '--:--';
        
        // Restablecer a 45 minutos
        document.querySelectorAll('.minute-btn').forEach(b => b.classList.remove('active'));
        document.querySelector('.minute-btn[data-minutes="45"]').classList.add('active');
        selectedMinutes = 45;
        selectedMinutesSpan.textContent = '45';
        minutesToAddDisplay.textContent = '45 min';
        customMinuteInput.style.display = 'none';
        
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
    
    // Función para renderizar el historial con filtro
    function renderHistory() {
        historyList.innerHTML = '';
        
        // Filtrar el historial según la pestaña seleccionada
        let filteredHistory = history;
        if (currentHistoryFilter !== 'all') {
            if (currentHistoryFilter === '15') {
                filteredHistory = history.filter(item => item.minutes === 15);
            } else if (currentHistoryFilter === '45') {
                filteredHistory = history.filter(item => item.minutes === 45);
            } else if (currentHistoryFilter === 'custom') {
                filteredHistory = history.filter(item => item.minutes !== 15 && item.minutes !== 45);
            }
        }
        
        if (filteredHistory.length === 0) {
            historyList.innerHTML = '<p class="no-history">No hay cálculos en el historial para este filtro.</p>';
            return;
        }
        
        filteredHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const time12h = format12Hour(item.original);
            const result12h = format12Hour(item.result);
            
            // Determinar la clase CSS según los minutos
            let minuteClass = 'minutes-custom';
            if (item.minutes === 15) minuteClass = 'minutes-15';
            else if (item.minutes === 45) minuteClass = 'minutes-45';
            
            historyItem.innerHTML = `
                <div>
                    <div class="history-time">${time12h}</div>
                    <div class="history-date">${item.timestamp}</div>
                </div>
                <div style="text-align: center;">
                    <div><i class="fas fa-plus"></i> <span class="history-minutes ${minuteClass}">${item.minutes} min</span></div>
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
});
