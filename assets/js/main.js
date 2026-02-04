// =============================================
// CONFIGURAÇÃO PARA GOOGLE TAG MANAGER
// =============================================

function initGTMEvents() {
    // Seu GTM já está incluído no <head> do HTML (GTM-MMQ89T46)
    console.log('Google Tag Manager carregado: GTM-MMQ89T46');
    
    // IMPORTANTE: Todas as configurações de analytics serão feitas
    // DENTRO do Google Tag Manager pelo seu gestor de tráfego
    
    // =============================================
    // EVENTOS PARA DATALAYER (OPCIONAL - MAS RECOMENDADO)
    // =============================================
    
    // 1. EVENTO DE CLIQUE NO WHATSAPP (conversão principal)
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', function() {
            // Envia evento customizado para o GTM
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'whatsapp_click',
                'event_category': 'conversion',
                'event_label': this.textContent.trim(),
                'link_text': this.textContent.trim(),
                'link_url': this.getAttribute('href'),
                'click_timestamp': new Date().toISOString()
            });
            
            console.log('📱 Clique no WhatsApp rastreado para GTM');
        });
    });
    
    // 2. EVENTO DE SCROLL EM SEÇÕES IMPORTANTES
    const importantSections = ['comparativo', 'processo', 'services', 'testimonials', 'faq'];
    
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    if (importantSections.includes(sectionId)) {
                        window.dataLayer = window.dataLayer || [];
                        window.dataLayer.push({
                            'event': 'section_view',
                            'section_id': sectionId,
                            'section_name': entry.target.querySelector('h2')?.textContent || sectionId
                        });
                        
                        console.log(`👁️ Seção visualizada: ${sectionId}`);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        // Observa todas as seções
        document.querySelectorAll('section[id]').forEach(section => {
            sectionObserver.observe(section);
        });
    }
    
    // 3. EVENTO DE INTERAÇÃO COM A ANIMAÇÃO (quando usuário vê a transformação)
    const comparativoSection = document.querySelector('.instagram-comparativo');
    if (comparativoSection) {
        // Este evento será acionado pela função startAnimationOnInteraction()
        // já existente no código
    }
    
    // 4. EVENTO DE FORM SUBMIT (se tiver formulários no futuro)
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'form_submit',
                'form_id': this.id || 'unnamed_form',
                'form_action': this.action
            });
        });
    });
}

// =============================================
// VARIÁVEIS GLOBAIS
// =============================================

let animationActive = false;
let animationCompleted = false;

// =============================================
// ANIMAÇÃO DE CRESCIMENTO SUPER RÁPIDO
// =============================================

function animateCounterFast(elementId, start, end) {
    const element = document.getElementById(elementId);
    const duration = 600;
    const range = end - start;
    const increment = range > 0 ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    // Efeito visual durante a animação
    element.style.transform = 'scale(1.1)';
    element.style.textShadow = '0 0 10px rgba(37, 211, 102, 0.5)';
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current.toLocaleString();
        
        // Adiciona efeito de "pulso" a cada 100 seguidores
        if (current % 100 === 0) {
            element.style.transform = 'scale(1.15)';
            setTimeout(() => {
                element.style.transform = 'scale(1.1)';
            }, 50);
        }
        
        if (current === end) {
            clearInterval(timer);
            // Efeito final
            element.style.transform = 'scale(1)';
            element.style.textShadow = 'none';
            
            // EVENTO PARA GTM - ANIMAÇÃO COMPLETA
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'animation_complete',
                'animation_type': 'counter_growth',
                'final_value': end,
                'growth_percentage': Math.round(((end - start) / start) * 100)
            });
            
            // Adiciona efeito de confete após conclusão
            if (elementId === 'seguidores-depois') {
                createConfettiEffect();
            }
        }
    }, Math.max(1, stepTime));
}

// =============================================
// EFEITO DE CONFETI
// =============================================

function createConfettiEffect() {
    const confettiContainer = document.querySelector('.perfil-depois');
    if (!confettiContainer) return;
    
    const colors = ['#25D366', '#d42a7f', '#8a3ab9', '#FF9800', '#4CAF50'];
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '8px';
        confetti.style.height = '8px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.top = '50%';
        confetti.style.left = '50%';
        confetti.style.zIndex = '100';
        confetti.style.opacity = '0.8';
        
        confettiContainer.appendChild(confetti);
        
        // Animação do confeti
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 3;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let posX = 0;
        let posY = 0;
        let opacity = 0.8;
        
        const animateConfetti = () => {
            posX += vx;
            posY += vy;
            opacity -= 0.02;
            
            confetti.style.transform = `translate(${posX * 10}px, ${posY * 10}px)`;
            confetti.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animateConfetti);
            } else {
                confetti.remove();
            }
        };
        
        requestAnimationFrame(animateConfetti);
    }
}

// =============================================
// INICIA ANIMAÇÃO QUANDO O USUÁRIO INTERAGE
// =============================================

function startAnimationOnInteraction() {
    if (animationCompleted) return;
    
    // Verifica se a animação já está ativa
    if (animationActive) return;
    animationActive = true;
    
    // EVENTO PARA GTM - ANIMAÇÃO INICIADA
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': 'animation_start',
        'animation_type': 'counter_growth',
        'interaction_type': 'user_triggered'
    });
    
    // VALORES FINAIS - APENAS SEGUIDORES AUMENTAM
    const seguidoresDepois = 5127;
    const seguindoDepois = 145;
    const postsDepois = 8;
    
    // Inicia APENAS a animação dos seguidores
    animateCounterFast('seguidores-depois', 127, seguidoresDepois);
    
    // Mantém os outros valores estáticos
    document.getElementById('seguindo-depois').textContent = seguindoDepois.toLocaleString();
    document.getElementById('posts-depois').textContent = postsDepois.toLocaleString();
    
    // Marca como completada
    animationCompleted = true;
    
    // Mostra mensagem de sucesso
    setTimeout(() => {
        const instrucao = document.querySelector('.instrucao-animacao');
        if (instrucao) {
            instrucao.innerHTML = '<i class="fas fa-check-circle" style="color:#25D366"></i> <span>Transformação completa! +5.000 seguidores!</span>';
            instrucao.style.color = '#25D366';
            instrucao.style.fontWeight = '600';
        }
    }, 800);
}

// =============================================
// DETECTOR DE HOVER E SCROLL
// =============================================

function setupInteractionDetectors() {
    const comparativoSection = document.querySelector('.instagram-comparativo');
    if (!comparativoSection) return;
    
    // Detecta hover na seção
    comparativoSection.addEventListener('mouseenter', startAnimationOnInteraction);
    
    // Detecta toque em dispositivos móveis
    comparativoSection.addEventListener('touchstart', startAnimationOnInteraction);
    
    // Detecta scroll até a seção
    let scrollTriggered = false;
    window.addEventListener('scroll', () => {
        if (scrollTriggered) return;
        
        const sectionTop = comparativoSection.offsetTop;
        const sectionHeight = comparativoSection.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight;
        
        // Dispara quando 70% da seção está visível
        if (scrollPosition > sectionTop + (sectionHeight * 0.7)) {
            startAnimationOnInteraction();
            scrollTriggered = true;
            
            // EVENTO PARA GTM - SEÇÃO VISUALIZADA VIA SCROLL
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'section_scroll_trigger',
                'section_id': 'comparativo'
            });
        }
    });
    
    // Também dispara ao carregar se a seção já estiver visível
    window.addEventListener('load', () => {
        const sectionTop = comparativoSection.offsetTop;
        const scrollPosition = window.scrollY + window.innerHeight;
        
        if (scrollPosition > sectionTop + 100) {
            setTimeout(startAnimationOnInteraction, 500);
        }
    });
}

// =============================================
// MENU HAMBURGUER
// =============================================

function initMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const nav = document.getElementById('nav');
    
    if (!mobileMenu || !nav) return;
    
    mobileMenu.addEventListener('click', function () {
        this.classList.toggle('active');
        nav.classList.toggle('active');
        
        // EVENTO PARA GTM - MENU ABERTO/FECHADO
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'menu_toggle',
            'menu_state': nav.classList.contains('active') ? 'open' : 'closed'
        });
        
        // Previne scroll quando o menu está aberto
        if (nav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });
    
    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileMenu.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}

// =============================================
// CARROSSEL DE DEPOIMENTOS
// =============================================

function initTestimonialCarousel() {
    const testimonialInner = document.querySelector('.testimonial-inner');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    if (!testimonialInner || testimonialSlides.length === 0) return;
    
    let currentIndex = 0;
    
    function updateCarousel() {
        testimonialInner.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // EVENTO PARA GTM - SLIDE ALTERADO
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'carousel_slide_change',
            'carousel_name': 'testimonials',
            'current_slide': currentIndex + 1,
            'total_slides': testimonialSlides.length
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            currentIndex = (currentIndex + 1) % testimonialSlides.length;
            updateCarousel();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            currentIndex = (currentIndex - 1 + testimonialSlides.length) % testimonialSlides.length;
            updateCarousel();
        });
    }
    
    // Auto-rotate carousel
    let carouselInterval = setInterval(function () {
        currentIndex = (currentIndex + 1) % testimonialSlides.length;
        updateCarousel();
    }, 5000);
    
    // Pausa no hover
    testimonialInner.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });
    
    // Retoma quando sai do hover
    testimonialInner.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(function () {
            currentIndex = (currentIndex + 1) % testimonialSlides.length;
            updateCarousel();
        }, 5000);
    });
}

// =============================================
// FAQ - ACCORDION
// =============================================

function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function () {
            const answer = this.nextElementSibling;
            const isOpen = answer.classList.contains('open');
            
            // EVENTO PARA GTM - FAQ ABERTO
            if (!isOpen) {
                const faqTitle = this.textContent.replace('▼', '').replace('▲', '').trim();
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    'event': 'faq_open',
                    'faq_question': faqTitle
                });
            }
            
            // Fecha todas as respostas
            document.querySelectorAll('.faq-answer').forEach(item => {
                item.classList.remove('open');
            });
            
            document.querySelectorAll('.faq-question i').forEach(icon => {
                icon.className = 'fas fa-chevron-down';
            });
            
            // Abre a resposta clicada se não estava aberta
            if (!isOpen) {
                answer.classList.add('open');
                this.querySelector('i').className = 'fas fa-chevron-up';
            }
        });
    });
}

// =============================================
// SCROLL SUAVE PARA ÂNCORAS
// =============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if(this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                // EVENTO PARA GTM - NAVEGAÇÃO INTERNA
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    'event': 'internal_link_click',
                    'link_text': this.textContent.trim(),
                    'link_target': targetId
                });
                
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =============================================
// AJUSTE DE ALTURAS DO CARROSSEL
// =============================================

function adjustCarouselHeights() {
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    if (testimonialSlides.length === 0) return;
    
    // Remove alturas mínimas fixas para permitir que as imagens definam a altura
    testimonialSlides.forEach(slide => {
        slide.style.minHeight = 'auto';
    });
    
    // Encontra a altura máxima baseada nas imagens carregadas
    let maxHeight = 0;
    
    testimonialSlides.forEach(slide => {
        const slideHeight = slide.offsetHeight;
        if (slideHeight > maxHeight) {
            maxHeight = slideHeight;
        }
    });
    
    // Aplica uma altura mínima baseada no maior slide (com margem)
    testimonialSlides.forEach(slide => {
        slide.style.minHeight = (maxHeight + 10) + 'px';
    });
    
    // Ajusta a altura do container interno
    const testimonialInner = document.querySelector('.testimonial-inner');
    if (testimonialInner) {
        testimonialInner.style.height = 'auto';
    }
}

// =============================================
// CARREGAMENTO DE IMAGENS DO CARROSSEL
// =============================================

function initImageLoading() {
    // Ajusta as alturas quando as imagens carregarem
    window.addEventListener('load', function() {
        const images = document.querySelectorAll('.testimonial-img');
        if (images.length === 0) return;
        
        let imagesLoaded = 0;
        
        images.forEach(img => {
            if (img.complete) {
                imagesLoaded++;
            } else {
                img.addEventListener('load', function() {
                    imagesLoaded++;
                    if (imagesLoaded === images.length) {
                        setTimeout(adjustCarouselHeights, 100);
                    }
                });
                
                // Fallback para caso a imagem falhe ao carregar
                img.addEventListener('error', function() {
                    imagesLoaded++;
                    if (imagesLoaded === images.length) {
                        setTimeout(adjustCarouselHeights, 100);
                    }
                });
            }
        });
        
        // Se todas as imagens já estiverem carregadas
        if (imagesLoaded === images.length) {
            setTimeout(adjustCarouselHeights, 100);
        }
    });
    
    // Ajusta também quando a janela for redimensionada
    window.addEventListener('resize', function() {
        setTimeout(adjustCarouselHeights, 100);
    });
}

// =============================================
// TRACKING DE TEMPO NA PÁGINA (PARA GTM)
// =============================================

function initTimeTracking() {
    let timeOnPage = 0;
    const timeInterval = setInterval(() => {
        timeOnPage++;
        
        // A cada 30 segundos, envia um evento
        if (timeOnPage % 30 === 0) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'time_on_page',
                'time_seconds': timeOnPage,
                'time_minutes': Math.round(timeOnPage / 60 * 10) / 10
            });
        }
        
        // EVENTOS ESPECIAIS
        if (timeOnPage === 10) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': '10s_on_page'
            });
        }
        
        if (timeOnPage === 30) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': '30s_on_page'
            });
        }
        
        if (timeOnPage === 60) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': '60s_on_page'
            });
            clearInterval(timeInterval); // Para de contar após 60s
        }
    }, 1000);
}

// =============================================
// INICIALIZAÇÃO GERAL DO SITE
// =============================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 UpSeguidores - Site carregado com sucesso!');
    console.log('📊 Google Tag Manager: GTM-MMQ89T46');
    
    // Inicializa todas as funcionalidades
    initGTMEvents(); // Configura eventos para GTM
    initMobileMenu();
    setupInteractionDetectors();
    initTestimonialCarousel();
    initFAQAccordion();
    initSmoothScroll();
    initImageLoading();
    initTimeTracking(); // Track de tempo na página
    
    // Ajuste inicial do carrossel
    setTimeout(adjustCarouselHeights, 500);
    
    // EVENTO PARA GTM - PÁGINA CARREGADA
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': 'page_loaded',
        'page_title': document.title,
        'page_url': window.location.href
    });
});

// =============================================
// ERROR TRACKING (OPCIONAL - PARA GTM)
// =============================================

window.addEventListener('error', function(e) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': 'js_error',
        'error_message': e.message,
        'error_url': e.filename,
        'error_line': e.lineno
    });
});