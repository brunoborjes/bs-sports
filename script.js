// Script Principal - BS SPORTS

document.addEventListener("DOMContentLoaded", () => {
  // --- CABEÇALHO COM SCROLL ---
  const header = document.getElementById("header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // --- MENU MOBILE ---
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const navMobile = document.getElementById("nav-mobile");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  mobileMenuBtn.addEventListener("click", () => {
    navMobile.classList.toggle("active");
    if (navMobile.classList.contains("active")) {
      mobileMenuBtn.innerHTML = "✕";
    } else {
      mobileMenuBtn.innerHTML = "☰";
    }
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMobile.classList.remove("active");
      mobileMenuBtn.innerHTML = "☰";
    });
  });

  // --- SCROLL REVEAL & ANIMAÇÃO DOS NÚMEROS (NOVO) ---
  const observerOptions = {
    threshold: 0.1, // Anima quando 10% do elemento estiver visível
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Adiciona a classe que ativa as transições CSS
        entry.target.classList.add('reveal-active');
        
        // Verifica se é o container de estatística para rodar a animação dos números
        if (entry.target.classList.contains('stat-item') && !entry.target.dataset.animated) {
          animateNumbers(entry.target);
          entry.target.dataset.animated = true; // Impede que anime de novo ao subir e descer a tela
        }
        
        observer.unobserve(entry.target); // Para de observar após animar
      }
    });
  }, observerOptions);

  // Seleciona todos os elementos com a classe reveal
  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });

  // Ativa instantaneamente as animações da seção Hero no load
  setTimeout(() => {
    document.querySelectorAll('.reveal-hero').forEach(el => {
      el.classList.add('reveal-active');
    });
  }, 100);

  // Função matemática para rodar a contagem fluida
  function animateNumbers(statItem) {
    const numElement = statItem.querySelector('.stat-number');
    const originalText = numElement.innerText; // Ex: "5000+"
    const targetNum = parseInt(originalText.replace(/\D/g, '')); // Extrai apenas 5000
    const suffix = originalText.replace(/[0-9]/g, ''); // Extrai apenas "+"
    
    let start = 0;
    const duration = 2000; // 2 segundos de animação
    const increment = targetNum / (duration / 16); // 60 frames por segundo

    const updateNumber = () => {
      start += increment;
      if (start < targetNum) {
        // Usa formatação local para adicionar pontos (5.000)
        numElement.innerText = Math.ceil(start).toLocaleString('pt-BR') + suffix;
        requestAnimationFrame(updateNumber);
      } else {
        // Garante que termina exatamente com o valor original formatado
        numElement.innerText = targetNum.toLocaleString('pt-BR') + suffix; 
      }
    };
    updateNumber();
  }

  // --- NOVO: EFEITO DE DIGITAÇÃO COM BOLA NO HERO ---
  const typeLine1 = document.getElementById("type-1");
  const typeLine2 = document.getElementById("type-2");
  const typeBall = document.getElementById("type-ball");

  if (typeLine1 && typeLine2 && typeBall) {
    const text1 = "Grandes eventos.";
    const text2 = "Grandes experiências.";
    const typeSpeed = 100; // ms por letra (menor = mais rápido)
    const ballSvg = typeBall.querySelector("svg");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let ballAngle = 0;

    async function typeText(el, text) {
      el.after(typeBall); // a bola vai para o fim da linha atual
      for (const ch of text) {
        el.textContent += ch;
        ballAngle += 40; // a bola gira a cada letra
        ballSvg.style.transform = "rotate(" + ballAngle + "deg)";
        await sleep(typeSpeed);
      }
    }

    async function runTyping() {
      if (reduceMotion) {
        // sem animação para quem prefere movimento reduzido
        typeLine1.textContent = text1;
        typeLine2.textContent = text2;
        typeLine2.after(typeBall);
        return;
      }
      await sleep(500);
      await typeText(typeLine1, text1);
      await sleep(250);
      await typeText(typeLine2, text2);
      typeBall.classList.add("is-done"); // bola começa a quicar
    }

    runTyping();
  }
});