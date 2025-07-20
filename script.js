// Script principal para la página de inicio
document.addEventListener('DOMContentLoaded', async () => {
    // Inicializar tema
    ThemeManager.init();
    
    // Cargar frase motivacional
    await loadMotivationalQuote();
    
    // Cargar estadísticas
    await loadUpcomingExams();
    
    // Inicializar otras funciones
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
        
        // Si ya se mostraron todas las frases, reiniciar
        if (shownQuotes.length >= quotes.length) {
            this.resetShownQuotes();
            return this.getRandomUnshownQuote(quotes);
        }
        
        // Encontrar frases no mostradas
        const unshownIndices = quotes
            .map((_, index) => index)
            .filter(index => !shownQuotes.includes(index));
        
        // Seleccionar aleatoriamente una frase no mostrada
        const randomIndex = Math.floor(Math.random() * unshownIndices.length);
        const selectedQuoteIndex = unshownIndices[randomIndex];
        
        // Marcar como mostrada
        this.addShownQuote(selectedQuoteIndex);
        
        return quotes[selectedQuoteIndex];
    }
};

// Cargar frase motivacional sin repetición
async function loadMotivationalQuote() {
    try {
        const quotes = await DataManager.loadQuotes();
        const selectedQuote = QuoteManager.getRandomUnshownQuote(quotes);
        
        // Separar frase y autor
        const [quote, author] = selectedQuote.split(' — ');
        
        const quoteElement = document.getElementById('motivational-quote');
        const authorElement = document.querySelector('cite');
        
        if (quoteElement && authorElement) {
            quoteElement.textContent = `"${quote}"`;
            authorElement.textContent = author;
        }
    } catch (error) {
        console.error('Error loading motivational quote:', error);
        // Frase por defecto si hay error
        const quoteElement = document.getElementById('motivational-quote');
        const authorElement = document.querySelector('cite');
        
        if (quoteElement && authorElement) {
            quoteElement.textContent = '"El éxito es la suma de pequeños esfuerzos, repetidos día tras día."';
            authorElement.textContent = 'Robert Collier';
        }
    }
}

// Cargar información de exámenes próximos
async function loadUpcomingExams() {
    try {
        const exams = await DataManager.loadExams();
        const upcomingExams = getUpcomingExams(exams);
        
        // Mostrar notificación si hay exámenes próximos
        if (upcomingExams.length > 0) {
            const message = `Tienes ${upcomingExams.length} examen${upcomingExams.length > 1 ? 'es' : ''} próximo${upcomingExams.length > 1 ? 's' : ''} esta semana`;
            NotificationManager.show(message);
        }
    } catch (error) {
        console.error('Error loading upcoming exams:', error);
    }
}

// Obtener exámenes de la próxima semana
function getUpcomingExams(exams) {
    const today = new Date();
    const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return exams.filter(exam => {
        const examDate = Utils.createFullDate(exam);
        return examDate >= today && examDate <= oneWeekFromNow;
    });
}

// Inicializar funciones de la página principal
function initMainPage() {
    // Agregar animaciones a los portales
    const portals = document.querySelectorAll('.portal-button');
    portals.forEach((portal, index) => {
        portal.style.animationDelay = `${index * 200}ms`;
        portal.classList.add('card-fade-in');
    });
    
    // Agregar event listeners para navegación
    const planLink = document.querySelector('a[href="plan.html"]');
    const examsLink = document.querySelector('a[href="examenes.html"]');
    
    if (planLink) {
        planLink.addEventListener('click', handleNavigation);
    }
    
    if (examsLink) {
        examsLink.addEventListener('click', handleNavigation);
    }
}

// Manejar navegación con transiciones
function handleNavigation(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute('href');
    
    // Agregar animación de salida
    document.body.style.opacity = '0.5';
    
    setTimeout(() => {
        window.location.href = href;
    }, 200);
}