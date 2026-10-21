// Script Principal - BS SPORTS

// O evento DOMContentLoaded garante que o código só roda depois que toda a tela carregou
document.addEventListener("DOMContentLoaded", () => {
  
  // ===============================================
  // EFEITO DO CABEÇALHO (Fica menor ao rolar a página)
  // ===============================================
  const header = document.getElementById("header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled"); // Adiciona sombra e diminui altura
    } else {
      header.classList.remove("scrolled");
    }
  });

  // ===============================================
  // MENU DO CELULAR (Abrir e fechar navegação)
  // ===============================================
  const mobileMenuBtn = document.getElementById("mobile-menu-btn"); // Botão ☰
  const navMobile = document.getElementById("nav-mobile"); // A caixa com os links
  const mobileLinks = document.querySelectorAll(".mobile-link");

  // Ao clicar no botão ☰
  mobileMenuBtn.addEventListener("click", () => {
    navMobile.classList.toggle("active");
    if (navMobile.classList.contains("active")) {
      mobileMenuBtn.innerHTML = "✕"; // Vira X quando tá aberto
    } else {
      mobileMenuBtn.innerHTML = "☰"; // Volta para as 3 linhas
    }
  });

  // Ao clicar num link, fecha o menu no celular
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMobile.classList.remove("active");
      mobileMenuBtn.innerHTML = "☰";
    });
  });

  // ===============================================
  // EFEITO DOS ITENS SURGINDO AO DESCER A TELA (Scroll Reveal)
  // ===============================================
  const observerOptions = {
    threshold: 0.1, // Quando 10% do item estiver visível, anima
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active'); // Mostra o item
        observer.unobserve(entry.target); // Para de espiar ele
      }
    });
  }, observerOptions);

  // Procura tudo que tem a classe 'reveal' para aplicar o efeito
  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });

  // Ativa os itens do TOPO DO SITE (Hero) assim que a página carregar
  setTimeout(() => {
    document.querySelectorAll('.reveal-hero').forEach(el => {
      el.classList.add('reveal-active');
    });
  }, 100);

  // ===============================================
  // ANIMAÇÃO DE DIGITAÇÃO COM A BOLINHA NO TOPO
  // ===============================================
  const typeLine1 = document.getElementById("type-1");
  const typeLine2 = document.getElementById("type-2");
  const typeBall = document.getElementById("type-ball");

  if (typeLine1 && typeLine2 && typeBall) {
    const text1 = "Grandes eventos."; // Primeiro texto
    const text2 = "Grandes experiências."; // Segundo texto
    const typeSpeed = 100; // Velocidade da letra (em milissegundos)
    const ballSvg = typeBall.querySelector("svg");
    
    // Respeita pessoas com opções de movimento reduzido no computador delas
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let ballAngle = 0;

    // Função que digita letrinha por letrinha e roda a bola
    async function typeText(el, text) {
      el.after(typeBall); // Bota a bola atrás do texto atual
      for (const ch of text) {
        el.textContent += ch; // Mostra letra
        ballAngle += 40; // Gira a bola 40 graus
        ballSvg.style.transform = "rotate(" + ballAngle + "deg)";
        await sleep(typeSpeed);
      }
    }

    async function runTyping() {
      // Se não curtir muito movimento, escreve de uma vez
      if (reduceMotion) {
        typeLine1.textContent = text1;
        typeLine2.textContent = text2;
        typeLine2.after(typeBall);
        return;
      }
      
      // Digita as frases na ordem
      await sleep(500);
      await typeText(typeLine1, text1);
      await sleep(250);
      await typeText(typeLine2, text2);
      typeBall.classList.add("is-done"); // Quando acaba, faz a bola quicar (no CSS)
    }

    runTyping();
  }

  // ===============================================
  // CARROSSEL DE IMAGENS (Seção Nossa História)
  // ===============================================
  const track = document.getElementById("carouselTrack");
  if (track) {
    const slides = Array.from(track.children); // Pega as fotos
    const nextBtn = document.getElementById("nextBtn"); // Seta direita
    const prevBtn = document.getElementById("prevBtn"); // Seta esquerda
    const dotsContainer = document.getElementById("carouselDots");
    const dots = Array.from(dotsContainer.children); // Bolinhas
    
    let currentIndex = 0; // Qual foto tá sendo mostrada agora
    const slideIntervalTime = 4000; // Troca sozinho de 4 em 4 segundos
    let slideTimer;

    // Função que faz o deslizamento das imagens
    function updateSlide(index) {
      // Se foi antes da 1a, vai pra última foto. Se foi depois da última, vai pra 1a.
      if (index < 0) {
        currentIndex = slides.length - 1;
      } else if (index >= slides.length) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }

      // Empurra a "faixa" do carrossel para a lateral - mostrando a imagem certa
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Atualiza qual "bolinha" fica amarela/ativa
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });
    }

    function nextSlide() {
      updateSlide(currentIndex + 1);
    }

    function prevSlide() {
      updateSlide(currentIndex - 1);
    }

    // Clique no botão DIREITO do carrossel
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetTimer(); // Zera o temporizador para não passar sozinha logo depois de clicar
    });

    // Clique no botão ESQUERDO do carrossel
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetTimer();
    });

    // Clique direto nas bolinhas embaixo da foto
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        updateSlide(index);
        resetTimer();
      });
    });

    // Inicia a troca automática das fotos
    function startTimer() {
      slideTimer = setInterval(nextSlide, slideIntervalTime);
    }

    // Recomeça a contagem de tempo
    function resetTimer() {
      clearInterval(slideTimer);
      startTimer();
    }

    startTimer(); // Dá play na troca automática
  }
});