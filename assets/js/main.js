// =============================================
// CONFIGURAÇÃO PARA GOOGLE TAG MANAGER
// =============================================

function initGTMEvents() {
    // Seu GTM já está incluído no <head> do HTML (GTM-MMQ89T46)
    console.log('Google Tag Manager carregado: GTM-MMQ89T46');
    
    // =============================================
    // EVENTOS PARA DATALAYER (OPCIONAL - MAS RECOMENDADO)
    // =============================================
    
    // 1. EVENTO DE CLIQUE NO WHATSAPP (conversão principal)
    document.querySelectorAll('a[href*="wa.me"], .whatsapp-pacote-btn').forEach(link => {
        link.addEventListener('click', function() {
            // Envia evento customizado para o GTM
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'whatsapp_click',
                'event_category': 'conversion',
                'event_label': this.textContent.trim(),
                'link_text': this.textContent.trim(),
                'link_url': this.getAttribute('href') || 'button_click',
                'click_timestamp': new Date().toISOString()
            });
            
            console.log('📱 Clique no WhatsApp rastreado para GTM');
        });
    });
    
    // 2. EVENTO DE SCROLL EM SEÇÕES IMPORTANTES
    const importantSections = ['pacotes', 'comparativo', 'processo', 'services', 'testimonials', 'faq'];
    
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
    
    // 3. EVENTO DE INTERAÇÃO COM A ANIMAÇÃO
    const comparativoSection = document.querySelector('.instagram-comparativo');
    if (comparativoSection) {
        // Este evento será acionado pela função startAnimationOnInteraction()
    }
    
    // 4. EVENTO DE CLIQUE NOS PACOTES
    document.querySelectorAll('.whatsapp-pacote-btn').forEach(button => {
        button.addEventListener('click', function() {
            const quantidade = this.getAttribute('data-quantidade');
            const tipo = this.getAttribute('data-tipo');
            const rede = this.getAttribute('data-rede');
            
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'pacote_click',
                'event_category': 'purchase_intent',
                'event_label': `${quantidade}_${tipo}_${rede}`,
                'pacote_quantidade': quantidade,
                'pacote_tipo': tipo,
                'pacote_rede': rede,
                'click_timestamp': new Date().toISOString()
            });
            
            console.log(`📦 Pacote clicado: ${quantidade} ${tipo} para ${rede}`);
        });
    });
    
    // 5. EVENTO DE VIEW DOS CARROSSÉIS
    const carrosselObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const carrosselId = entry.target.classList.contains('carrossel-inner') ? 
                    entry.target.parentElement.classList[1] : 'unknown';
                
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    'event': 'carrossel_view',
                    'carrossel_id': carrosselId
                });
                
                console.log(`🎡 Carrossel visualizado: ${carrosselId}`);
            }
        });
    }, { threshold: 0.5 });
    
    // Observa os carrosséis
    document.querySelectorAll('.carrossel-inner').forEach(carrossel => {
        carrosselObserver.observe(carrossel);
    });
}

// =============================================
// CARROSSÉIS DOS PACOTES
// =============================================

function initPacoteCarrossels() {
    // Configura todos os carrosséis
    const carrossels = [
        { id: 'instagram-br', container: '.carrossel-instagram-br .carrossel-inner' },
        { id: 'instagram-mix', container: '.carrossel-instagram-mix .carrossel-inner' },
        { id: 'tiktok-br', container: '.carrossel-tiktok-br .carrossel-inner' },
        { id: 'tiktok-mix', container: '.carrossel-tiktok-mix .carrossel-inner' }
    ];
    
    carrossels.forEach(carrossel => {
        const container = document.querySelector(carrossel.container);
        const prevBtn = document.querySelector(`.carrossel-prev[data-carrossel="${carrossel.id}"]`);
        const nextBtn = document.querySelector(`.carrossel-next[data-carrossel="${carrossel.id}"]`);
        
        if (!container) return;
        
        const cards = container.querySelectorAll('.pacote-card');
        if (cards.length === 0) return;
        
        let currentIndex = 0;
        const cardWidth = cards[0].offsetWidth + 25; // Largura do card + gap
        const visibleCards = Math.floor(container.parentElement.offsetWidth / cardWidth);
        
        function updateCarrossel() {
            const translateX = -currentIndex * cardWidth;
            container.style.transform = `translateX(${translateX}px)`;
            
            // Atualiza visibilidade dos botões
            if (prevBtn) prevBtn.style.display = currentIndex === 0 ? 'none' : 'flex';
            if (nextBtn) nextBtn.style.display = currentIndex >= cards.length - visibleCards ? 'none' : 'flex';
        }
        
        // Botão próximo
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentIndex < cards.length - visibleCards) {
                    currentIndex++;
                    updateCarrossel();
                    
                    // EVENTO PARA GTM - NAVEGAÇÃO NO CARROSSEL
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                        'event': 'carrossel_navigate',
                        'carrossel_id': carrossel.id,
                        'direction': 'next',
                        'current_slide': currentIndex + 1
                    });
                }
            });
        }
        
        // Botão anterior
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarrossel();
                    
                    // EVENTO PARA GTM - NAVEGAÇÃO NO CARROSSEL
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                        'event': 'carrossel_navigate',
                        'carrossel_id': carrossel.id,
                        'direction': 'prev',
                        'current_slide': currentIndex + 1
                    });
                }
            });
        }

        // =============================================
// CÁLCULO AUTOMÁTICO DE DESCONTO
// =============================================

function initAutoDiscountCalculation() {
    // Preços originais por pacote (estes são os preços "normais" sem desconto)
    const precoBase = {
        // Instagram - Brasileiros
        'instagram-brasileiros-500': 39.90,
        'instagram-brasileiros-2000': 189.90,
        'instagram-brasileiros-5000': 299.90,
        
        // Instagram - Mistos
        'instagram-mistos-500': 34.90,
        'instagram-mistos-2000': 143.90,
        'instagram-mistos-5000': 189.90,
        
        // TikTok - Brasileiros
        'tiktok-brasileiros-500': 39.90,
        'tiktok-brasileiros-2000': 189.90,
        'tiktok-brasileiros-5000': 299.90,
        
        // TikTok - Mistos
        'tiktok-mistos-500': 34.90,
        'tiktok-mistos-2000': 143.90,
        'tiktok-mistos-5000': 189.90
    };
    
    // Calcula e atualiza todos os descontos
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
                    
                    if (!isNaN(precoNovoValue)) {
                        // Calcula a porcentagem de desconto
                        const desconto = ((precoBaseValue - precoNovoValue) / precoBaseValue) * 100;
                        const descontoArredondado = Math.round(desconto);
                        
                        // Atualiza o badge de economia
                        const economiaBadge = card.querySelector('.economia-badge');
                        if (economiaBadge) {
                            economiaBadge.textContent = `Economize ${descontoArredondado}%`;
                            
                            // Adiciona classe baseada no nível de desconto
                            economiaBadge.classList.remove('low-discount', 'medium-discount', 'high-discount');
                            
                            if (descontoArredondado < 15) {
                                economiaBadge.classList.add('low-discount');
                            } else if (descontoArredondado < 30) {
                                economiaBadge.classList.add('medium-discount');
                            } else {
                                economiaBadge.classList.add('high-discount');
                            }
                        }
                        
                        // Atualiza o preço riscado se não existir
                        const precoRiscado = card.querySelector('.preco-riscado');
                        if (precoRiscado && !precoRiscado.textContent.includes('R$')) {
                            precoRiscado.textContent = `R$ ${precoBaseValue.toFixed(2).replace('.', ',')}`;
                        }
                    }
                }
            }
        });
    }
    
    // Inicializa o cálculo
    calculateAllDiscounts();
    
    // Observa mudanças nos preços (se você tiver uma interface de admin)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                setTimeout(calculateAllDiscounts, 100);
            }
        });
    });
    
    // Observa mudanças nos preços
    document.querySelectorAll('.preco-novo').forEach(element => {
        observer.observe(element, { 
            childList: true, 
            characterData: true,
            subtree: true 
        });
    });
}
        
        // Navegação por teclado
        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                if (prevBtn) prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                if (nextBtn) nextBtn.click();
            }
        });
        
        // Navegação por touch/swipe para mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0 && nextBtn) {
                    nextBtn.click();
                } else if (diff < 0 && prevBtn) {
                    prevBtn.click();
                }
            }
        }
        
        // Ajusta na redimensionamento
        window.addEventListener('resize', () => {
            setTimeout(updateCarrossel, 100);
        });
        
        // Inicializa
        updateCarrossel();
    });
    
    // EVENTO PARA GTM - CARROSSÉIS INICIALIZADOS
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': 'carrossels_initialized',
        'total_carrossels': carrossels.length
    });
}

// =============================================
// FUNCIONALIDADE DOS BOTÕES DE PACOTES
// =============================================

function initPacoteButtons() {
    document.querySelectorAll('.whatsapp-pacote-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const quantidade = this.getAttribute('data-quantidade');
            const tipo = this.getAttribute('data-tipo');
            const rede = this.getAttribute('data-rede');
            
            // Determina o texto do tipo (brasileiros ou mistos)
            const tipoTexto = tipo === 'brasileiros' ? 'brasileiros' : 'mistos';
            
            // Texto da rede social
            const redeTexto = rede === 'instagram' ? 'Instagram' : 'TikTok';
            
            // Mensagem personalizada para WhatsApp
            const mensagem = `Olá! Gostaria de adquirir o pacote de ${quantidade} seguidores ${tipoTexto} para o meu ${redeTexto}.`;
            
            // Codifica a mensagem para URL
            const mensagemCodificada = encodeURIComponent(mensagem);
            
            // URL do WhatsApp
            const whatsappURL = `https://wa.me/5581999388041?text=${mensagemCodificada}`;
            
            // Abre em nova aba
            window.open(whatsappURL, '_blank');
            
            // EVENTO PARA GTM - PACOTE SELECIONADO
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'pacote_selected',
                'event_category': 'conversion',
                'event_label': `${quantidade}_${tipo}_${rede}`,
                'pacote_quantidade': quantidade,
                'pacote_tipo': tipo,
                'pacote_rede': rede,
                'pacote_valor': this.closest('.pacote-card').querySelector('.preco-novo')?.textContent || 'unknown'
            });
            
            console.log(`🛒 Pacote selecionado: ${quantidade} seguidores ${tipoTexto} para ${redeTexto}`);
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
    if (!element) return;
    
    const duration = 600;
    const range = end - start;
    const increment = range > 0 ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;
    
    // Efeito visual durante a animação
    element.style.transform = 'scale(1.1)';
    element.style.textShadow = '0 0 10px rgba(37, 211, 102, 0.5)';
    element.style.color = '#25D366';
    element.style.transition = 'color 0.3s ease';
    
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
        confetti.style.pointerEvents = 'none';
        
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
    const seguindoElement = document.getElementById('seguindo-depois');
    const postsElement = document.getElementById('posts-depois');
    
    if (seguindoElement) seguindoElement.textContent = seguindoDepois.toLocaleString();
    if (postsElement) postsElement.textContent = postsDepois.toLocaleString();
    
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
    comparativoSection.addEventListener('touchstart', function(e) {
        e.preventDefault();
        startAnimationOnInteraction();
    }, { passive: false });
    
    // Detecta scroll até a seção
    let scrollTriggered = false;
    window.addEventListener('scroll', () => {
        if (scrollTriggered || animationCompleted) return;
        
        const sectionTop = comparativoSection.offsetTop;
        const sectionHeight = comparativoSection.offsetHeight;
        const scrollPosition = window.scrollY + (window.innerHeight * 0.8); // 80% da janela
        
        // Dispara quando 80% da seção está visível
        if (scrollPosition > sectionTop + (sectionHeight * 0.2)) {
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
        if (animationCompleted) return;
        
        const sectionTop = comparativoSection.offsetTop;
        const scrollPosition = window.scrollY + (window.innerHeight * 0.8);
        
        if (scrollPosition > sectionTop + 100) {
            setTimeout(startAnimationOnInteraction, 1000);
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
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', function(event) {
        const isClickInsideNav = nav.contains(event.target);
        const isClickOnMenuToggle = mobileMenu.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnMenuToggle && nav.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
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
    let autoRotateInterval;
    
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
    
    function startAutoRotate() {
        autoRotateInterval = setInterval(function () {
            currentIndex = (currentIndex + 1) % testimonialSlides.length;
            updateCarousel();
        }, 5000);
    }
    
    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            currentIndex = (currentIndex + 1) % testimonialSlides.length;
            updateCarousel();
            stopAutoRotate();
            setTimeout(startAutoRotate, 10000); // Retoma após 10 segundos
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            currentIndex = (currentIndex - 1 + testimonialSlides.length) % testimonialSlides.length;
            updateCarousel();
            stopAutoRotate();
            setTimeout(startAutoRotate, 10000); // Retoma após 10 segundos
        });
    }
    
    // Pausa no hover
    testimonialInner.addEventListener('mouseenter', stopAutoRotate);
    
    // Retoma quando sai do hover
    testimonialInner.addEventListener('mouseleave', startAutoRotate);
    
    // Inicia auto-rotate
    startAutoRotate();
}

// =============================================
// FAQ - ACCORDION
// =============================================

function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        // Adiciona ícone se não existir
        if (!question.querySelector('i')) {
            const icon = document.createElement('i');
            icon.className = 'fas fa-chevron-down';
            question.appendChild(icon);
        }
        
        question.addEventListener('click', function () {
            const answer = this.nextElementSibling;
            const isOpen = answer.classList.contains('open');
            const icon = this.querySelector('i');
            
            // EVENTO PARA GTM - FAQ ABERTO
            if (!isOpen) {
                const faqTitle = this.textContent.replace('▼', '').replace('▲', '').replace('+', '').replace('-', '').trim();
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
            
            document.querySelectorAll('.faq-question i').forEach(itemIcon => {
                itemIcon.className = 'fas fa-chevron-down';
                itemIcon.style.transform = 'rotate(0deg)';
            });
            
            // Abre a resposta clicada se não estava aberta
            if (!isOpen) {
                answer.classList.add('open');
                if (icon) {
                    icon.className = 'fas fa-chevron-up';
                    icon.style.transform = 'rotate(180deg)';
                }
            }
        });
        
        // Suporte a teclado
        question.setAttribute('tabindex', '0');
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
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
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // EVENTO PARA GTM - NAVEGAÇÃO INTERNA
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    'event': 'internal_link_click',
                    'link_text': this.textContent.trim(),
                    'link_target': href
                });
                
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Fecha menu mobile se estiver aberto
                const mobileMenu = document.getElementById('mobile-menu');
                const nav = document.getElementById('nav');
                if (mobileMenu && nav && nav.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    nav.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
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
    
    // Reset alturas
    testimonialSlides.forEach(slide => {
        slide.style.minHeight = 'auto';
    });
    
    // Aguarda o próximo frame para calcular alturas corretas
    setTimeout(() => {
        let maxHeight = 0;
        
        testimonialSlides.forEach(slide => {
            const slideHeight = slide.offsetHeight;
            if (slideHeight > maxHeight) {
                maxHeight = slideHeight;
            }
        });
        
        // Aplica altura mínima baseada no maior slide
        testimonialSlides.forEach(slide => {
            slide.style.minHeight = (maxHeight + 20) + 'px';
        });
        
        // Ajusta a altura do container interno
        const testimonialInner = document.querySelector('.testimonial-inner');
        if (testimonialInner) {
            testimonialInner.style.height = (maxHeight + 40) + 'px';
        }
    }, 100);
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
        const totalImages = images.length;
        
        function checkAllImagesLoaded() {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                setTimeout(adjustCarouselHeights, 100);
            }
        }
        
        images.forEach(img => {
            if (img.complete) {
                checkAllImagesLoaded();
            } else {
                img.addEventListener('load', checkAllImagesLoaded);
                img.addEventListener('error', checkAllImagesLoaded);
            }
        });
        
        // Fallback se todas as imagens já estiverem carregadas
        if (imagesLoaded === totalImages) {
            setTimeout(adjustCarouselHeights, 100);
        }
    });
    
    // Ajusta quando a janela for redimensionada
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(adjustCarouselHeights, 250);
    });
}

// =============================================
// TRACKING DE TEMPO NA PÁGINA
// =============================================

function initTimeTracking() {
    let timeOnPage = 0;
    let maxTrackTime = 300; // 5 minutos máximo
    
    const timeInterval = setInterval(() => {
        timeOnPage++;
        
        // A cada 30 segundos, envia um evento
        if (timeOnPage % 30 === 0 && timeOnPage <= maxTrackTime) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'time_on_page',
                'time_seconds': timeOnPage,
                'time_minutes': Math.round(timeOnPage / 60 * 10) / 10
            });
        }
        
        // EVENTOS ESPECIAIS EM MARCOS
        const milestones = [10, 30, 60, 120, 180, 300];
        if (milestones.includes(timeOnPage)) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': `${timeOnPage}s_on_page`
            });
        }
        
        // Para de contar após o tempo máximo
        if (timeOnPage >= maxTrackTime) {
            clearInterval(timeInterval);
        }
    }, 1000);
}

// =============================================
// VALORES INICIAIS PARA A ANIMAÇÃO
// =============================================

function setInitialValues() {
    // Define valores iniciais para a animação
    const seguidoresAntes = document.getElementById('seguidores-antes');
    const seguindoAntes = document.getElementById('seguindo-antes');
    const postsAntes = document.getElementById('posts-antes');
    const seguidoresDepois = document.getElementById('seguidores-depois');
    const seguindoDepois = document.getElementById('seguindo-depois');
    const postsDepois = document.getElementById('posts-depois');
    
    if (seguidoresAntes) seguidoresAntes.textContent = '127';
    if (seguindoAntes) seguindoAntes.textContent = '145';
    if (postsAntes) postsAntes.textContent = '8';
    if (seguidoresDepois) seguidoresDepois.textContent = '127';
    if (seguindoDepois) seguindoDepois.textContent = '145';
    if (postsDepois) postsDepois.textContent = '8';
}

// =============================================
// LAZY LOADING PARA IMAGENS
// =============================================

function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// =============================================
// VALIDAÇÃO DE FORMULÁRIOS (se houver no futuro)
// =============================================

function initFormValidation() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            // Aqui você pode adicionar validações futuras
            // Por enquanto, apenas envia o evento para GTM
            
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
// ERROR TRACKING
// =============================================

window.addEventListener('error', function(e) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': 'js_error',
        'error_message': e.message,
        'error_url': e.filename,
        'error_line': e.lineno,
        'error_column': e.colno
    });
    
    console.error('❌ JavaScript Error:', e.message);
});

// =============================================
// INICIALIZAÇÃO GERAL DO SITE
// =============================================

document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 UpSeguidores - Site carregado com sucesso!');
    console.log('📊 Google Tag Manager: GTM-MMQ89T46');
    console.log('🛒 Carrosséis de pacotes inicializados');
    
    // Inicializa todas as funcionalidades
    setInitialValues();
    initGTMEvents(); // Configura eventos para GTM
    initPacoteCarrossels(); // Novos carrosséis de pacotes
    initPacoteButtons(); // Botões dos pacotes
    initAutoDiscountCalculation(); 
    initMobileMenu();
    setupInteractionDetectors();
    initTestimonialCarousel();
    initFAQAccordion();
    initSmoothScroll();
    initImageLoading();
    initTimeTracking();
    initLazyLoading();
    initFormValidation();
    
    // Ajuste inicial do carrossel
    setTimeout(adjustCarouselHeights, 500);
    
    // EVENTO PARA GTM - PÁGINA CARREGADA
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'event': 'page_loaded',
        'page_title': document.title,
        'page_url': window.location.href,
        'user_agent': navigator.userAgent,
        'viewport_width': window.innerWidth,
        'viewport_height': window.innerHeight
    });
});

// =============================================
// MENSAGEM DE BOAS-VINDAS NO CONSOLE
// =============================================

console.log(`
╔═══════════════════════════════════════════╗
║     🚀 UPSEGUIDORES - SISTEMA ATIVO      ║
╠═══════════════════════════════════════════╣
║ 📊 Google Tag Manager: GTM-MMQ89T46      ║
║ 🛒 Carrosséis de pacotes: PRONTO         ║
║ 📱 Botões WhatsApp: CONFIGURADOS         ║
║ 🎯 Tracking de eventos: ATIVADO          ║
║ 📈 Animações: DISPONÍVEIS                ║
╚═══════════════════════════════════════════╝
`);