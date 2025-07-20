document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar tema automáticamente
    initTheme();
    
    // Cargar frase motivacional
    await loadMotivationalQuote();
    
    // La carga de exámenes próximos y otras inicializaciones pueden permanecer si las necesitas
    // await loadUpcomingExams(); 
    initMainPage();
});

// Sistema de control de frases mostradas
const QuoteManager = {
    STORAGE_KEY: 'shownQuotes',
    
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

// Cargar frase motivacional sin repetición (VERSIÓN CORREGIDA)
async function loadMotivationalQuote() {
    try {
        // Hacemos la petición directamente a frases.json
        const response = await fetch('frases.json');
        if (!response.ok) {
            throw new Error(`Error ${response.status}: No se pudo cargar frases.json`);
        }
        
        const quotes = await response.json();
        const selectedQuote = QuoteManager.getRandomUnshownQuote(quotes);
        
        const [quote, author] = selectedQuote.split(' — ');
        
        const quoteElement = document.getElementById('motivational-quote');
        const authorElement = document.querySelector('cite');
        
        if (quoteElement && authorElement) {
            quoteElement.textContent = `"${quote}"`;
            authorElement.textContent = author;
        }
    } catch (error) {
        console.error('Error loading motivational quote:', error);
        // La frase por defecto se mantiene en caso de que falle la carga del archivo
        const quoteElement = document.getElementById('motivational-quote');
        const authorElement = document.querySelector('cite');
        
        if (quoteElement && authorElement) {
            quoteElement.textContent = '"El éxito es la suma de pequeños esfuerzos, repetidos día tras día."';
            authorElement.textContent = 'Robert Collier';
        }
    }
}

// Las funciones de abajo pueden permanecer igual
// Cargar información de exámenes próximos
async function loadUpcomingExams() {
    // Esta función probablemente dependa de utils.js, puede que necesite ajustes si la usas.
    // Por ahora la dejamos como está.
}

function getUpcomingExams(exams) {
    // Esta función también podría depender de utils.js
}

function initMainPage() {
    const portals = document.querySelectorAll('.portal-button');
    portals.forEach((portal, index) => {
        portal.style.animationDelay = `${index * 200}ms`;
        portal.classList.add('card-fade-in');
    });
    
    const planLink = document.querySelector('a[href="plan.html"]');
    const examsLink = document.querySelector('a[href="examenes.html"]');
    
    if (planLink) {
        planLink.addEventListener('click', handleNavigation);
    }
    
    if (examsLink) {
        examsLink.addEventListener('click', handleNavigation);
    }
}

function handleNavigation(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    
    document.body.style.opacity = '0.5';
    
    setTimeout(() => {
        window.location.href = href;
    }, 200);
}
// Función para inicializar el tema basado en preferencias del sistema
function initTheme() {
    // Detectar preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');

    // Aplicar tema: prioridad a lo guardado, sino al sistema
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
    }
    
    // Escuchar cambios en preferencias del sistema para que se ajuste en tiempo real
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Solo cambia si el usuario no ha elegido un tema manualmente
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    });
}