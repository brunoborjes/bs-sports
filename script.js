document.addEventListener("DOMContentLoaded", () => {
  // HEADER SCROLL
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // MENU LATERAL / HAMBURGER (Gaveta)
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const sideMenu = document.getElementById("side-menu");
  const menuOverlay = document.getElementById("menu-overlay");
  const sideLinks = document.querySelectorAll(".side-link");

  const toggleMenu = () => {
    mobileMenuBtn.classList.toggle("open");
    sideMenu.classList.toggle("active");
    menuOverlay.classList.toggle("active");
    // Trava o fundo da tela para não rolar enquanto o menu lateral estiver aberto
    document.body.style.overflow = sideMenu.classList.contains("active") ? "hidden" : "";
  };

  mobileMenuBtn.addEventListener("click", toggleMenu);
  menuOverlay.addEventListener("click", toggleMenu); // Fecha o menu ao clicar na parte escura
  
  // Fecha o menu ao clicar em qualquer link da gaveta lateral
  sideLinks.forEach(link => {
    link.addEventListener("click", toggleMenu);
  });

  // SCROLL REVEAL (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // Aciona logo de cara os elementos do Hero para dar o efeito de entrada
  setTimeout(() => {
    document.querySelectorAll('.reveal-hero').forEach(el => el.classList.add('reveal-active'));
  }, 100);

  // EFEITO DE DIGITAÇÃO E BOLA
  const typeLine1 = document.getElementById("type-1");
  const typeLine2 = document.getElementById("type-2");
  const typeBall = document.getElementById("type-ball");

  if (typeLine1 && typeLine2 && typeBall) {
    const text1 = "Grandes eventos.";
    const text2 = "Grandes experiências.";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    let ballAngle = 0;
    const ballSvg = typeBall.querySelector("svg");

    async function typeText(el, text) {
      el.after(typeBall);
      for (const ch of text) {
        el.textContent += ch;
        ballAngle += 45;
        ballSvg.style.transform = `rotate(${ballAngle}deg)`;
        await sleep(70); // Velocidade da digitação
      }
    }

    async function runTyping() {
      if (reduceMotion) {
        typeLine1.textContent = text1;
        typeLine2.textContent = text2;
        typeLine2.after(typeBall);
        return;
      }
      await sleep(600);
      await typeText(typeLine1, text1);
      await sleep(300);
      await typeText(typeLine2, text2);
      typeBall.classList.add("is-done"); // Faz a bolinha "quicar" no final
    }

    runTyping();
  }
});