document.addEventListener('DOMContentLoaded', () => {
    // Inicializar tema automáticamente
    initTheme();
    initPlanDeEstudio();
});

// Función para inicializar el tema basado en preferencias del sistema
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    
    // Detectar preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    // Aplicar tema: prioridad a lo guardado, sino al sistema
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
    }
    
    // Event listener para toggle de tema
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
    
    // Escuchar cambios en preferencias del sistema
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

function initPlanDeEstudio() {
    const planDeEstudio = [
        { id: 1, nombre: "Ciencia Política", cuatrimestre: 1, correlativa: 0, anio: 1 },
        { id: 2, nombre: "Introducción al Pensamiento Científico", cuatrimestre: 1, correlativa: 0, anio: 1 },
        { id: 3, nombre: "Introducción al conocimiento de la Sociedad y el Estado", cuatrimestre: 1, correlativa: 0, anio: 1 },
        { id: 4, nombre: "Sociología", cuatrimestre: 2, correlativa: 0, anio: 1 },
        { id: 5, nombre: "Antropología", cuatrimestre: 2, correlativa: 0, anio: 1 },
        { id: 6, nombre: "Economía", cuatrimestre: 2, correlativa: 0, anio: 1 },
        { id: 7, nombre: "Teoría Política y Social I", cuatrimestre: 1, correlativa: 1, anio: 2 },
        { id: 8, nombre: "Filosofía y Métodos de las Ciencias Sociales", cuatrimestre: 1, correlativa: 2, anio: 2 },
        { id: 9, nombre: "Derecho y Sistemas Normativos", cuatrimestre: 1, correlativa: 0, anio: 2 },
        { id: 10, nombre: "Economía Política I", cuatrimestre: 2, correlativa: 6, anio: 2 },
        { id: 11, nombre: "Teoría Política y Social II", cuatrimestre: 2, correlativa: 7, anio: 2 },
        { id: 12, nombre: "Historia Política Contemporánea", cuatrimestre: 2, correlativa: 0, anio: 2 },
        { id: 13, nombre: "Economía Política II", cuatrimestre: 1, correlativa: 10, anio: 3 },
        { id: 14, nombre: "Teoría y Derecho Constitucional", cuatrimestre: 1, correlativa: 9, anio: 3 },
        { id: 15, nombre: "Historia Política Latinoamericana", cuatrimestre: 1, correlativa: 12, anio: 3 },
        { id: 16, nombre: "Sociología Política", cuatrimestre: 2, correlativa: 4, anio: 3 },
        { id: 17, nombre: "Teoría Política Contemporánea", cuatrimestre: 2, correlativa: 11, anio: 3 },
        { id: 18, nombre: "Historia Política Argentina", cuatrimestre: 2, correlativa: 15, anio: 3 },
        { id: 19, nombre: "Teoría Sociológica", cuatrimestre: 1, correlativa: 16, anio: 4 },
        { id: 20, nombre: "Técnicas de Investigación en Ciencias Sociales", cuatrimestre: 1, correlativa: 8, anio: 4 },
        { id: 21, nombre: "Sistemas Políticos Comparados", cuatrimestre: 1, correlativa: 17, anio: 4 },
        { id: 22, nombre: "Derecho Público", cuatrimestre: 2, correlativa: 14, anio: 4 },
        { id: 23, nombre: "Filosofía", cuatrimestre: 2, correlativa: 8, anio: 4 },
        { id: 24, nombre: "Historia del Pensamiento Económico", cuatrimestre: 2, correlativa: 13, anio: 4 },
        { id: 25, nombre: "Técnicas de Investigación Avanzadas", cuatrimestre: 1, correlativa: 20, anio: 5 },
        { id: 26, nombre: "Derecho Administrativo", cuatrimestre: 1, correlativa: 22, anio: 5 },
        { id: 27, nombre: "Opinión Pública", cuatrimestre: 1, correlativa: 21, anio: 5 },
        { id: 28, nombre: "Actores y Procesos Políticos", cuatrimestre: 2, correlativa: 27, anio: 5 },
        { id: 29, nombre: "Psicología Política", cuatrimestre: 2, correlativa: 27, anio: 5 },
        { id: 30, nombre: "Ética", cuatrimestre: 2, correlativa: 23, anio: 5 }
    ];

    const yearSelect = document.getElementById('year-select');
    const cuatrimestreSelect = document.getElementById('cuatrimestre-select');
    const resultsContainer = document.getElementById('results-container');
    const noResultsMessage = document.getElementById('no-results-message');
    const initialMessage = document.getElementById('initial-message');

    function getMateriaById(id) {
        return planDeEstudio.find(m => m.id === id);
    }

    function displayMaterias() {
        const selectedYear = parseInt(yearSelect.value);
        const selectedCuatrimestre = parseInt(cuatrimestreSelect.value);
        
        // Limpiar contenedor
        resultsContainer.innerHTML = '';
        
        // Si no hay filtros seleccionados, mostrar mensaje inicial
        if (!selectedYear && !selectedCuatrimestre) {
            initialMessage.classList.remove('hidden');
            resultsContainer.classList.add('hidden');
            noResultsMessage.classList.add('hidden');
            return;
        }
        
        // Ocultar mensaje inicial
        initialMessage.classList.add('hidden');
        
        // Filtrar materias según los criterios seleccionados
        let materias = planDeEstudio;
        
        if (selectedYear) {
            materias = materias.filter(m => m.anio === selectedYear);
        }
        
        if (selectedCuatrimestre) {
            materias = materias.filter(m => m.cuatrimestre === selectedCuatrimestre);
        }
        
        // Mostrar/ocultar elementos según resultados
        if (materias.length > 0) {
            resultsContainer.classList.remove('hidden');
            noResultsMessage.classList.add('hidden');
            
            // Crear cards para cada materia
            materias.forEach((materia, index) => {
                const correlativa = getMateriaById(materia.correlativa);
                const card = document.createElement('div');
                card.className = 'bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 card-fade-in';
                card.style.animationDelay = `${index * 100}ms`;
                
                card.innerHTML = `
                    <div class="flex justify-between items-start mb-3">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            ${materia.anio}° Año
                        </span>
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            ${materia.cuatrimestre}° Cuatrimestre
                        </span>
                    </div>
                    
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        ${materia.nombre}
                    </h3>
                    
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        Correlativa: ${correlativa ? correlativa.nombre : 'Ninguna'}
                    </p>
                `;
                
                resultsContainer.appendChild(card);
            });
        } else {
            resultsContainer.classList.add('hidden');
            noResultsMessage.classList.remove('hidden');
        }
    }

    // Agregar event listeners
    yearSelect.addEventListener('change', displayMaterias);
    cuatrimestreSelect.addEventListener('change', displayMaterias);

    // Mostrar mensaje inicial por defecto
    displayMaterias();
}
