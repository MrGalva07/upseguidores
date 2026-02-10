// =============================================
// SISTEMA DE CARROSSEL INFINITO - UpSeguidores
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 UpSeguidores - Sistema carregado');
    
    // Inicializar todas as funcionalidades
    initAllFunctions();
});

// =============================================
// FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO
// =============================================

function initAllFunctions() {
    // 1. Carrossel infinito (PRIORIDADE)
    initInfiniteCarousel();
    
    // 2. Menu mobile
    initMobileMenu();
    
    // 3. Animações do comparativo
    initComparativoAnimations();
    
    // 4. GTM e tracking
    initGTMEvents();
    
    // 5. Botões dos pacotes
    initPacoteButtons();
    
    // 6. FAQ accordion
    initFAQ();
    
    // 7. Carrossel de depoimentos
    initTestimonialsCarousel();
    
    // 8. Scroll suave
    initSmoothScroll();
    
    // 9. Cálculo automático de desconto
    initAutoDiscountCalculation();
    
    // 10. Ajustes responsivos
    setupResponsiveAdjustments();
}

// =============================================
// 1. CARROSSEL INFINITO - FUNÇÃO PRINCIPAL
// =============================================

function initInfiniteCarousel() {
    console.log('🔄 Inicializando carrossel infinito...');
    
    const carousels = document.querySelectorAll('.carrossel-inner');
    
    if (carousels.length === 0) {
        console.warn('⚠️ Nenhum carrossel encontrado');
        return;
    }
    
    carousels.forEach((carousel, index) => {
        // Se já foi inicializado, pular
        if (carousel.classList.contains('carrossel-initialized')) {
            console.log(`Carrossel ${index + 1} já inicializado`);
            return;
        }
        
        // Adicionar classe de controle
        carousel.classList.add('carrossel-initialized');
        
        // Configurar para desktop ou mobile
        if (window.innerWidth > 768) {
            setupDesktopCarousel(carousel, index);
        } else {
            setupMobileCarousel(carousel, index);
        }
    });
    
    // Reconfigurar ao redimensionar
    window.addEventListener('resize', function() {
        setTimeout(() => {
            carousels.forEach((carousel, index) => {
                carousel.classList.remove('carrossel-initialized');
                carousel.classList.add('carrossel-initialized');
                
                if (window.innerWidth > 768) {
                    setupDesktopCarousel(carousel, index);
                } else {
                    setupMobileCarousel(carousel, index);
                }
            });
        }, 300);
    });
}

// =============================================
// 1.1 CARROSSEL PARA DESKTOP (AUTO-PLAY + INFINITO)
// =============================================

function setupDesktopCarousel(carousel, index) {
    console.log(`🎡 Configurando carrossel ${index + 1} para DESKTOP`);
    
    // Obter elementos
    const wrapper = carousel.closest('.carrossel-wrapper');
    const prevBtn = wrapper ? wrapper.querySelector('.carrossel-prev') : null;
    const nextBtn = wrapper ? wrapper.querySelector('.carrossel-next') : null;
    const cards = carousel.querySelectorAll('.pacote-card');
    
    if (cards.length === 0) {
        console.warn(`⚠️ Carrossel ${index + 1} sem cards`);
        return;
    }
    
    // Variáveis de controle
    let currentIndex = 0;
    let isAnimating = false;
    let autoPlayInterval;
    const totalCards = cards.length;
    const cardWidth = cards[0].offsetWidth + 25; // Largura + gap
    
    // 1. CLONAR CARDS PARA EFEITO INFINITO
    function cloneCardsForInfinite() {
        // Verificar se já tem clones
        if (carousel.hasAttribute('data-cloned')) return;
        
        console.log(`📋 Clonando cards para carrossel ${index + 1}`);
        
        // Clonar todos os cards e adicionar no final
        const cardsToClone = Array.from(cards);
        cardsToClone.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('cloned-card');
            clone.setAttribute('aria-hidden', 'true');
            carousel.appendChild(clone);
        });
        
        // Marcar como clonado
        carousel.setAttribute('data-cloned', 'true');
    }
    
    // Executar clonagem
    cloneCardsForInfinite();
    
    // 2. FUNÇÃO PARA MOVER CARROSSEL
    function moveCarousel(direction) {
        if (isAnimating) return;
        isAnimating = true;
        
        // Pausar auto-play temporariamente
        stopAutoPlay();
        
        if (direction === 'next') {
            currentIndex++;
            carousel.style.transition = 'transform 0.5s ease-in-out';
            carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            
            // Se chegou no final dos clones, resetar suavemente
            if (currentIndex >= totalCards) {
                setTimeout(() => {
                    carousel.style.transition = 'none';
                    carousel.style.transform = 'translateX(0)';
                    currentIndex = 0;
                    
                    setTimeout(() => {
                        carousel.style.transition = 'transform 0.5s ease-in-out';
                        isAnimating = false;
                        startAutoPlay();
                    }, 50);
                }, 500);
            } else {
                setTimeout(() => {
                    isAnimating = false;
                    startAutoPlay();
                }, 500);
            }
            
        } else if (direction === 'prev') {
            currentIndex--;
            
            if (currentIndex < 0) {
                // Ir para o final (clones)
                carousel.style.transition = 'none';
                carousel.style.transform = `translateX(-${totalCards * cardWidth}px)`;
                currentIndex = totalCards - 1;
                
                setTimeout(() => {
                    carousel.style.transition = 'transform 0.5s ease-in-out';
                    carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
                    
                    setTimeout(() => {
                        isAnimating = false;
                        startAutoPlay();
                    }, 500);
                }, 50);
            } else {
                carousel.style.transition = 'transform 0.5s ease-in-out';
                carousel.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
                
                setTimeout(() => {
                    isAnimating = false;
                    startAutoPlay();
                }, 500);
            }
        }
        
        // GTM Event
        if (window.dataLayer) {
            window.dataLayer.push({
                'event': 'carrossel_navigate',
                'carrossel_index': index + 1,
                'direction': direction,
                'current_slide': currentIndex + 1
            });
        }
    }
    
    // 3. AUTO-PLAY CONFIGURATION
    function startAutoPlay() {
        if (window.innerWidth > 768) {
            autoPlayInterval = setInterval(() => {
                moveCarousel('next');
            }, 4000); // 4 segundos
        }
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    // 4. EVENT LISTENERS
    // Botões de navegação
    if (prevBtn) {
        prevBtn.addEventListener('click', () => moveCarousel('prev'));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => moveCarousel('next'));
    }
    
    // Pausar no hover
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    
    // Navegação por teclado
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && prevBtn) {
            e.preventDefault();
            moveCarousel('prev');
        } else if (e.key === 'ArrowRight' && nextBtn) {
            e.preventDefault();
            moveCarousel('next');
        }
    });
    
    // 5. TOUCH SUPPORT (para tablets)
    let touchStartX = 0;
    let touchEndX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoPlay();
    }, { passive: true });
    
    carousel.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Prevenir scroll da página
    }, { passive: false });
    
    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                moveCarousel('next');
            } else {
                moveCarousel('prev');
            }
        } else {
            // Reiniciar auto-play
            setTimeout(startAutoPlay, 2000);
        }
    }, { passive: true });
    
    // 6. INICIAR AUTO-PLAY
    startAutoPlay();
    
    // 7. Pausar quando a página não está visível
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });
}

// =============================================
// 1.2 CARROSSEL PARA MOBILE (SCROLL HORIZONTAL)
// =============================================

function setupMobileCarousel(carousel, index) {
    console.log(`📱 Configurando carrossel ${index + 1} para MOBILE`);
    
    // Esconder botões de navegação no mobile
    const wrapper = carousel.closest('.carrossel-wrapper');
    const prevBtn = wrapper ? wrapper.querySelector('.carrossel-prev') : null;
    const nextBtn = wrapper ? wrapper.querySelector('.carrossel-next') : null;
    
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    
    // Configurar scroll horizontal
    carousel.style.overflowX = 'auto';
    carousel.style.overflowY = 'hidden';
    carousel.style.scrollSnapType = 'x mandatory';
    carousel.style.cursor = 'grab';
    carousel.style.WebkitOverflowScrolling = 'touch';
    carousel.style.scrollBehavior = 'smooth';
    
    // Remover transições no mobile
    carousel.style.transition = 'none';
    carousel.style.transform = 'none';
    
    // Adicionar mais clones para mobile se necessário
    const cards = carousel.querySelectorAll('.pacote-card');
    const cardWidth = cards[0] ? cards[0].offsetWidth + 15 : 220;
    const visibleCards = Math.floor(carousel.parentElement.offsetWidth / cardWidth);
    
    // Se tiver poucos cards, adicionar mais clones
    if (cards.length < visibleCards * 2 && !carousel.hasAttribute('data-mobile-cloned')) {
        console.log(`📋 Adicionando clones extras para mobile no carrossel ${index + 1}`);
        
        // Clonar os primeiros cards
        const cardsToClone = Array.from(cards).slice(0, visibleCards);
        cardsToClone.forEach(card => {
            const clone = card.cloneNode(true);
            clone.classList.add('mobile-clone');
            carousel.appendChild(clone);
        });
        
        carousel.setAttribute('data-mobile-cloned', 'true');
    }
    
    // Efeito de arrastar (drag)
    let isDragging = false;
    let startPosition = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    
    // Touch events
    carousel.addEventListener('touchstart', touchStart, { passive: true });
    carousel.addEventListener('touchmove', touchMove, { passive: true });
    carousel.addEventListener('touchend', touchEnd);
    
    // Mouse events (para tablets com mouse)
    carousel.addEventListener('mousedown', mouseDown);
    carousel.addEventListener('mousemove', mouseMove);
    carousel.addEventListener('mouseup', mouseEnd);
    carousel.addEventListener('mouseleave', mouseEnd);
    
    function touchStart(event) {
        startPosition = getPositionX(event);
        isDragging = true;
        animationID = requestAnimationFrame(animation);
        carousel.classList.add('grabbing');
    }
    
    function touchMove(event) {
        if (!isDragging) return;
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPosition;
    }
    
    function touchEnd() {
        if (!isDragging) return;
        isDragging = false;
        cancelAnimationFrame(animationID);
        
        const movedBy = currentTranslate - prevTranslate;
        
        // Se arrastou o suficiente, mover para o próximo card
        if (Math.abs(movedBy) > cardWidth * 0.3) {
            if (movedBy < 0) {
                // Scroll para a direita (próximo)
                const scrollAmount = carousel.scrollLeft + cardWidth;
                carousel.scrollTo({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            } else {
                // Scroll para a esquerda (anterior)
                const scrollAmount = carousel.scrollLeft - cardWidth;
                carousel.scrollTo({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        } else {
            // Voltar para posição original
            carousel.scrollTo({
                left: carousel.scrollLeft,
                behavior: 'smooth'
            });
        }
        
        carousel.classList.remove('grabbing');
        prevTranslate = currentTranslate;
    }
    
    function mouseDown(event) {
        startPosition = getPositionX(event);
        isDragging = true;
        carousel.classList.add('grabbing');
        event.preventDefault();
    }
    
    function mouseMove(event) {
        if (!isDragging) return;
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPosition;
    }
    
    function mouseEnd() {
        if (!isDragging) return;
        isDragging = false;
        touchEnd(); // Reutiliza a lógica do touch
    }
    
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
    
    function animation() {
        if (isDragging) {
            carousel.style.transform = `translateX(${currentTranslate}px)`;
            requestAnimationFrame(animation);
        }
    }
    
    // Infinite scroll para mobile
    let scrollTimeout;
    carousel.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
            const currentScroll = carousel.scrollLeft;
            
            // Se chegou perto do final, resetar para início
            if (currentScroll >= maxScrollLeft - cardWidth) {
                setTimeout(() => {
                    carousel.scrollTo({
                        left: 0,
                        behavior: 'smooth'
                    });
                }, 300);
            }
            
            // Se está no início e veio do final, ir para o final
            if (currentScroll <= cardWidth && prevTranslate < -maxScrollLeft * 0.5) {
                setTimeout(() => {
                    carousel.scrollTo({
                        left: maxScrollLeft,
                        behavior: 'smooth'
                    });
                }, 300);
            }
            
            prevTranslate = currentScroll;
        }, 100);
    });
}

// =============================================
// 2. MENU MOBILE
// =============================================

function initMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const nav = document.getElementById('nav');
    
    if (!mobileMenu || !nav) return;
    
    mobileMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
        
        // Bloquear scroll quando menu está aberto
        if (nav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Fechar menu ao clicar em links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !mobileMenu.contains(e.target) && nav.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// =============================================
// 3. ANIMAÇÕES DO COMPARATIVO
// =============================================

function initComparativoAnimations() {
    const comparativoSection = document.querySelector('.instagram-comparativo');
    if (!comparativoSection) return;
    
    // Resetar valores iniciais
    setInitialValues();
    
    // Configurar detectores de interação
    let animationTriggered = false;
    
    // Função para iniciar animação
    function startAnimation() {
        if (animationTriggered) return;
        animationTriggered = true;
        
        console.log('🚀 Iniciando animação do comparativo');
        
        // Animar apenas os seguidores
        animateCounter('seguidores-depois', 127, 5127, 2000);
        
        // Atualizar instrução
        setTimeout(() => {
            const instrucao = document.querySelector('.instrucao-animacao');
            if (instrucao) {
                instrucao.innerHTML = '<i class="fas fa-check-circle" style="color:#25D366"></i> <span>Transformação completa! +5.000 seguidores!</span>';
                instrucao.style.color = '#25D366';
                instrucao.style.fontWeight = '600';
            }
        }, 2200);
    }
    
    // Detectar hover
    comparativoSection.addEventListener('mouseenter', startAnimation);
    
    // Detectar toque (mobile)
    comparativoSection.addEventListener('touchstart', startAnimation, { passive: true });
    
    // Detectar scroll
    let scrollTriggered = false;
    window.addEventListener('scroll', () => {
        if (scrollTriggered || animationTriggered) return;
        
        const sectionTop = comparativoSection.offsetTop;
        const sectionHeight = comparativoSection.offsetHeight;
        const scrollPosition = window.scrollY + (window.innerHeight * 0.7);
        
        if (scrollPosition > sectionTop + (sectionHeight * 0.3)) {
            startAnimation();
            scrollTriggered = true;
        }
    });
    
    // Detectar se já está visível ao carregar
    window.addEventListener('load', () => {
        if (animationTriggered) return;
        
        const sectionTop = comparativoSection.offsetTop;
        const scrollPosition = window.scrollY + (window.innerHeight * 0.8);
        
        if (scrollPosition > sectionTop + 100) {
            setTimeout(startAnimation, 1000);
        }
    });
}

// =============================================
// 3.1 FUNÇÕES AUXILIARES DO COMPARATIVO
// =============================================

function setInitialValues() {
    const values = {
        'seguidores-antes': 127,
        'seguindo-antes': 145,
        'posts-antes': 8,
        'seguidores-depois': 127,
        'seguindo-depois': 145,
        'posts-depois': 8
    };
    
    Object.keys(values).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = values[id];
        }
    });
}

function animateCounter(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    // Efeito visual
    element.style.color = '#25D366';
    element.style.textShadow = '0 0 10px rgba(37, 211, 102, 0.5)';
    element.style.transition = 'all 0.3s ease';
    
    const timer = setInterval(() => {
        current += increment;
        element.textContent = current.toLocaleString('pt-BR');
        
        if (current === end) {
            clearInterval(timer);
            element.style.textShadow = 'none';
            
            // GTM Event
            if (window.dataLayer) {
                window.dataLayer.push({
                    'event': 'animation_complete',
                    'element': elementId,
                    'final_value': end
                });
            }
        }
    }, Math.max(1, stepTime));
}

// =============================================
// 4. GTM E TRACKING
// =============================================

function initGTMEvents() {
    if (typeof dataLayer === 'undefined') {
        window.dataLayer = window.dataLayer || [];
    }
    
    console.log('📊 GTM configurado: GTM-MMQ89T46');
    
    // Evento de página carregada
    window.dataLayer.push({
        'event': 'page_view',
        'page_title': document.title,
        'page_location': window.location.href
    });
    
    // Eventos de clique no WhatsApp
    document.querySelectorAll('a[href*="wa.me"], .whatsapp-pacote-btn').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            const isPacoteButton = this.classList.contains('whatsapp-pacote-btn');
            
            window.dataLayer.push({
                'event': 'whatsapp_click',
                'button_text': buttonText,
                'button_type': isPacoteButton ? 'pacote' : 'cta',
                'pacote_info': isPacoteButton ? this.getAttribute('data-quantidade') + ' ' + this.getAttribute('data-tipo') : null
            });
        });
    });
    
    // Eventos de visualização de seção
    if ('IntersectionObserver' in window) {
        const sections = document.querySelectorAll('section[id]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    window.dataLayer.push({
                        'event': 'section_view',
                        'section_id': entry.target.id,
                        'section_name': entry.target.querySelector('h2')?.textContent || entry.target.id
                    });
                }
            });
        }, { threshold: 0.5 });
        
        sections.forEach(section => observer.observe(section));
    }
}

// =============================================
// 5. BOTÕES DOS PACOTES
// =============================================

function initPacoteButtons() {
    document.querySelectorAll('.whatsapp-pacote-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const quantidade = this.getAttribute('data-quantidade');
            const tipo = this.getAttribute('data-tipo');
            const rede = this.getAttribute('data-rede');
            
            // Textos formatados
            const tipoTexto = tipo === 'brasileiros' ? 'brasileiros' : 'mistos';
            const redeTexto = rede === 'instagram' ? 'Instagram' : 'TikTok';
            
            // Mensagem para WhatsApp
            const mensagem = `Olá! Gostaria de adquirir o pacote de ${quantidade} seguidores ${tipoTexto} para o meu ${redeTexto}.`;
            const mensagemCodificada = encodeURIComponent(mensagem);
            const whatsappURL = `https://wa.me/5581999388041?text=${mensagemCodificada}`;
            
            // Abrir WhatsApp
            window.open(whatsappURL, '_blank');
            
            // GTM Event
            if (window.dataLayer) {
                window.dataLayer.push({
                    'event': 'pacote_selected',
                    'pacote_quantidade': quantidade,
                    'pacote_tipo': tipo,
                    'pacote_rede': rede
                });
            }
        });
    });
}

// =============================================
// 6. FAQ ACCORDION
// =============================================

function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        // Adicionar ícone se não existir
        if (!question.querySelector('i')) {
            const icon = document.createElement('i');
            icon.className = 'fas fa-chevron-down';
            question.appendChild(icon);
        }
        
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isOpen = answer.classList.contains('open');
            const icon = this.querySelector('i');
            
            // Fechar todas as outras
            document.querySelectorAll('.faq-answer').forEach(ans => {
                ans.classList.remove('open');
            });
            
            document.querySelectorAll('.faq-question i').forEach(icn => {
                icn.className = 'fas fa-chevron-down';
            });
            
            // Abrir/fechar esta
            if (!isOpen) {
                answer.classList.add('open');
                if (icon) {
                    icon.className = 'fas fa-chevron-up';
                }
                
                // GTM Event
                if (window.dataLayer) {
                    window.dataLayer.push({
                        'event': 'faq_open',
                        'faq_question': this.textContent.replace(/[▼▲+-]/g, '').trim()
                    });
                }
            }
        });
    });
}

// =============================================
// 7. CARROSSEL DE DEPOIMENTOS
// =============================================

function initTestimonialsCarousel() {
    const carousel = document.querySelector('.testimonial-inner');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    
    if (!carousel || slides.length === 0) return;
    
    let currentIndex = 0;
    let autoPlayInterval;
    
    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    }
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Pausar no hover
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    
    // Iniciar auto-play
    startAutoPlay();
}

// =============================================
// 8. SCROLL SUAVE
// =============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Fechar menu mobile se aberto
                const mobileMenu = document.getElementById('mobile-menu');
                const nav = document.getElementById('nav');
                if (mobileMenu && nav && nav.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    nav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

// =============================================
// 9. CÁLCULO AUTOMÁTICO DE DESCONTO
// =============================================

function initAutoDiscountCalculation() {
    // Preços base por pacote
    const precoBase = {
        'instagram-brasileiros-500': 45.90,
        'instagram-brasileiros-2000': 189.90,
        'instagram-brasileiros-5000': 299.90,
        'instagram-mistos-500': 40.90,
        'instagram-mistos-2000': 143.90,
        'instagram-mistos-5000': 219.90,
        'tiktok-brasileiros-500': 45.90,
        'tiktok-brasileiros-2000': 189.90,
        'tiktok-brasileiros-5000': 299.90,
        'tiktok-mistos-500': 40.90,
        'tiktok-mistos-2000': 143.90,
        'tiktok-mistos-5000': 219.90
    };
    
    function calculateAllDiscounts() {
        document.querySelectorAll('.pacote-card').forEach(card => {
            const quantidade = card.getAttribute('data-quantidade');
            const tipo = card.getAttribute('data-tipo');
            const rede = card.getAttribute('data-rede');
            
            const key = `${rede}-${tipo}-${quantidade}`;
            const precoBaseValue = precoBase[key];
            
            if (precoBaseValue) {
                const precoNovoElement = card.querySelector('.preco-novo');
                if (precoNovoElement) {
                    const precoNovoTexto = precoNovoElement.textContent.replace('R$ ', '').replace(',', '.');
                    const precoNovoValue = parseFloat(precoNovoTexto);
                    
                    if (!isNaN(precoNovoValue) && precoBaseValue > precoNovoValue) {
                        // Calcular desconto
                        const desconto = ((precoBaseValue - precoNovoValue) / precoBaseValue) * 100;
                        const descontoArredondado = Math.round(desconto);
                        
                        // Atualizar badge
                        const economiaBadge = card.querySelector('.economia-badge');
                        if (economiaBadge) {
                            economiaBadge.textContent = `Economize ${descontoArredondado}%`;
                            
                            // Adicionar classe baseada no desconto
                            economiaBadge.classList.remove('low-discount', 'medium-discount', 'high-discount');
                            
                            if (descontoArredondado < 15) {
                                economiaBadge.classList.add('low-discount');
                            } else if (descontoArredondado < 30) {
                                economiaBadge.classList.add('medium-discount');
                            } else {
                                economiaBadge.classList.add('high-discount');
                            }
                        }
                        
                        // Atualizar preço riscado
                        const precoRiscado = card.querySelector('.preco-riscado');
                        if (precoRiscado) {
                            precoRiscado.textContent = `R$ ${precoBaseValue.toFixed(2).replace('.', ',')}`;
                        }
                    }
                }
            }
        });
    }
    
    // Calcular inicialmente e ao redimensionar
    calculateAllDiscounts();
    window.addEventListener('resize', calculateAllDiscounts);
}

// =============================================
// 10. AJUSTES RESPONSIVOS
// =============================================

function setupResponsiveAdjustments() {
    // Ajustar alturas do carrossel de depoimentos
    function adjustTestimonialHeights() {
        const testimonialSlides = document.querySelectorAll('.testimonial-slide');
        if (testimonialSlides.length === 0) return;
        
        let maxHeight = 0;
        testimonialSlides.forEach(slide => {
            slide.style.minHeight = 'auto';
            const height = slide.offsetHeight;
            if (height > maxHeight) maxHeight = height;
        });
        
        testimonialSlides.forEach(slide => {
            slide.style.minHeight = (maxHeight + 20) + 'px';
        });
    }
    
    // Ajustar quando as imagens carregarem
    window.addEventListener('load', adjustTestimonialHeights);
    
    // Ajustar ao redimensionar
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(adjustTestimonialHeights, 250);
    });
}

// =============================================
// MENSAGEM DE CONSOLE
// =============================================

console.log(`
╔══════════════════════════════════════════════╗
║    🚀 UPSEGUIDORES - SISTEMA ATIVADO        ║
╠══════════════════════════════════════════════╣
║ 🎡 Carrossel Infinito:   PRONTO             ║
║ 📱 Responsividade:       OTIMIZADA          ║
║ 📊 GTM Tracking:         CONFIGURADO        ║
║ 🎯 Animações:            ATIVAS             ║
║ 💬 Botões WhatsApp:      FUNCIONANDO        ║
╚══════════════════════════════════════════════╝
`);