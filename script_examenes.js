document.addEventListener('DOMContentLoaded', () => {
    // Inicializar tema automáticamente
    initTheme();
    initCalendarioFinales();
    // Cargar frase motivacional
    loadExamMotivationalQuote();
});

// Sistema de control de frases mostradas para exámenes
const ExamQuoteManager = {
    STORAGE_KEY: 'shownExamQuotes',
    
    getShownQuotes() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    },
    
    addShownQuote(quoteIndex) {
        const shownQuotes = this.getShownQuotes();
        shownQuotes.push(quoteIndex);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(shownQuotes));
    },
    
    resetShownQuotes() {
        localStorage.removeItem(this.STORAGE_KEY);
    },
    
    getRandomUnshownQuote(quotes) {
        const shownQuotes = this.getShownQuotes();
        
        if (shownQuotes.length >= quotes.length) {
            this.resetShownQuotes();
            return this.getRandomUnshownQuote(quotes);
        }
        
        const unshownIndices = quotes
            .map((_, index) => index)
            .filter(index => !shownQuotes.includes(index));
        
        const randomIndex = Math.floor(Math.random() * unshownIndices.length);
        const selectedQuoteIndex = unshownIndices[randomIndex];
        
        this.addShownQuote(selectedQuoteIndex);
        return quotes[selectedQuoteIndex];
    }
};

// Cargar frase motivacional para exámenes
async function loadExamMotivationalQuote() {
    try {
        const response = await fetch('Frases_examenes.json');
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo cargar Frases_examenes.json`);
        }
        
        const quotes = await response.json();
        const selectedQuote = ExamQuoteManager.getRandomUnshownQuote(quotes);
        
        const [quote, author] = selectedQuote.split(' — ');
        
        const quoteElement = document.getElementById('exam-motivational-quote');
        const authorElement = document.getElementById('exam-quote-author');
        
        if (quoteElement && authorElement) {
            quoteElement.textContent = `"${quote}"`;
            authorElement.textContent = author;
        }
    } catch (error) {
        console.error('Error loading exam motivational quote:', error);
        const quoteElement = document.getElementById('exam-motivational-quote');
        const authorElement = document.getElementById('exam-quote-author');
        
        if (quoteElement && authorElement) {
            quoteElement.textContent = '"El éxito en los exámenes no se mide solo por la nota, sino por el conocimiento adquirido."';
            authorElement.textContent = 'Anónimo';
        }
    }
}

// Función para inicializar el tema basado en preferencias del sistema
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    });
}

function initCalendarioFinales() {
    const monthSelect = document.getElementById('exam-month-select');
    const subjectSelect = document.getElementById('exam-subject-select');
    const resultsDiv = document.getElementById('exam-results-container');
    let allExams = [];

    function formatarHora(valorHora) {
        if (!valorHora || String(valorHora).includes(':')) {
            return valorHora || '';
        }
        const horaStr = String(valorHora).padStart(4, '0');
        const horas = horaStr.substring(0, 2);
        const minutos = horaStr.substring(2, 4);
        return `${horas}:${minutos}`;
    }

    function extraerDia(valorFecha) {
        if (!valorFecha) return '';
        const fechaStr = String(valorFecha);
        return fechaStr.length > 2 ? fechaStr.substring(0, 2) : fechaStr;
    }

    async function cargarDatosAutomaticamente() {
        resultsDiv.innerHTML = `
            <div class="flex items-center justify-center p-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span class="ml-2 text-gray-600 dark:text-gray-300">Cargando fechas de examen...</span>
            </div>
        `;

        try {
            const response = await fetch('fechas_examenes.json');
            if (!response.ok) {
                throw new Error(`No se encontró el archivo fechas_examenes.json (Error ${response.status})`);
            }

            allExams = await response.json();
            populateExamFilters(allExams);
            resultsDiv.innerHTML = "";
        } catch (error) {
            console.error("Falló la carga automática:", error);
            resultsDiv.innerHTML = `
                <div class="text-center p-8">
                    <div class="mb-4">
                        <svg class="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Error</h3>
                    <p class="text-gray-600 dark:text-gray-300">No se pudo cargar el archivo fechas_examenes.json</p>
                </div>
            `;
        }
    }

    function populateExamFilters(exams) {
        const months = [...new Set(exams.map(exam => exam.mes))];
        const monthOrder = ['Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const sortedMonths = months.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

        const subjects = [...new Set(exams.map(exam => exam.materia))].sort();

        monthSelect.innerHTML = '<option value="">Todos los meses</option>';
        sortedMonths.forEach(month => {
            const option = document.createElement('option');
            option.value = month;
            option.textContent = month;
            monthSelect.appendChild(option);
        });

        subjectSelect.innerHTML = '<option value="">Todas las materias</option>';
        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject;
            option.textContent = subject;
            subjectSelect.appendChild(option);
        });

        monthSelect.disabled = false;
        subjectSelect.disabled = false;
        monthSelect.addEventListener('change', displayExamResults);
        subjectSelect.addEventListener('change', displayExamResults);
    }

    function displayExamResults() {
        const selectedMonth = monthSelect.value;
        const selectedSubject = subjectSelect.value;

        // Mantener la condición de filtrado para ambos filtros
        if (!selectedMonth || !selectedSubject) {
            resultsDiv.innerHTML = "";
            return;
        }

        let filteredExams = allExams.filter(exam => 
            exam.mes === selectedMonth && exam.materia === selectedSubject
        );

        if (filteredExams.length > 0) {
            // Crear contenedor sin overflow-x para evitar scroll horizontal
            const tableContainer = document.createElement('div');
            tableContainer.className = 'w-full rounded-lg shadow-md bg-white dark:bg-gray-800';
            
            const table = document.createElement('table');
            table.className = 'w-full border-collapse';
            
            // Crear encabezados con anchos responsivos
            const thead = document.createElement('thead');
            thead.className = 'bg-gray-50 dark:bg-gray-700';
            
            const headerRow = document.createElement('tr');
            const headers = [
                { text: 'Materia', width: 'w-1/5' },
                { text: 'Fecha', width: 'w-1/12' },
                { text: 'Mes', width: 'w-1/6' },
                { text: 'Hora', width: 'w-1/12' },
                { text: 'Tribunal', width: 'w-2/5' }
            ];
            
            headers.forEach(header => {
                const th = document.createElement('th');
                th.className = `px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${header.width}`;
                th.textContent = header.text;
                headerRow.appendChild(th);
            });
            
            thead.appendChild(headerRow);
            table.appendChild(thead);
            
            // Crear cuerpo de la tabla
            const tbody = document.createElement('tbody');
            tbody.className = 'divide-y divide-gray-200 dark:divide-gray-700';
            
            filteredExams.forEach((exam, index) => {
                const row = document.createElement('tr');
                row.className = index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700';
                
                row.innerHTML = `
                    <td class="px-3 py-3 text-sm font-medium text-gray-900 dark:text-white break-words">${exam.materia}</td>
                    <td class="px-3 py-3 text-sm text-gray-900 dark:text-gray-100 text-center">${extraerDia(exam.fecha)}</td>
                    <td class="px-3 py-3 text-sm text-gray-500 dark:text-gray-400">${exam.mes}</td>
                    <td class="px-3 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">${formatarHora(exam.hora)}</td>
                    <td class="px-3 py-3 text-sm text-gray-500 dark:text-gray-400 break-words">${exam.tribunal}</td>
                `;
                
                tbody.appendChild(row);
            });
            
            table.appendChild(tbody);
            tableContainer.appendChild(table);
            
            resultsDiv.innerHTML = '';
            resultsDiv.appendChild(tableContainer);
        } else {
            resultsDiv.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-gray-500 dark:text-gray-400">No se encontraron exámenes para la materia y mes seleccionados.</p>
                </div>
            `;
        }
    }

    function getMonthNumber(monthName) {
        const months = {
            'Enero': 1, 'Febrero': 2, 'Marzo': 3, 'Abril': 4,
            'Mayo': 5, 'Junio': 6, 'Julio': 7, 'Agosto': 8,
            'Septiembre': 9, 'Octubre': 10, 'Noviembre': 11, 'Diciembre': 12
        };
        return months[monthName] || 1;
    }

    cargarDatosAutomaticamente();
}