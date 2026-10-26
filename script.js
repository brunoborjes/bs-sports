// Script Principal - BS SPORTS

document.addEventListener("DOMContentLoaded", () => {
  // ===============================================
  // EFEITO DO CABEÇALHO (Sombra ao rolar)
  // ===============================================
  const header = document.getElementById("header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // ===============================================
  // MENU MOBILE
  // ===============================================
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

  // ===============================================
  // SCROLL REVEAL (Animações de rolagem)
  // ===============================================
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -40px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal-active");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal").forEach((el) => {
    observer.observe(el);
  });

  setTimeout(() => {
    document.querySelectorAll(".reveal-hero").forEach((el) => {
      el.classList.add("reveal-active");
    });
  }, 100);

  // ===============================================
  // ANIMAÇÃO DE DIGITAÇÃO COM BOLA NO HERO
  // ===============================================
  const typeLine1 = document.getElementById("type-1");
  const typeLine2 = document.getElementById("type-2");
  const typeBall = document.getElementById("type-ball");

  if (typeLine1 && typeLine2 && typeBall) {
    const text1 = "Grandes eventos.";
    const text2 = "Grandes experiências.";
    const typeSpeed = 90;
    const ballSvg = typeBall.querySelector("svg");

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let ballAngle = 0;

    async function typeText(el, text) {
      el.after(typeBall);
      for (const ch of text) {
        el.textContent += ch;
        ballAngle += 40;
        ballSvg.style.transform = `rotate(${ballAngle}deg)`;
        await sleep(typeSpeed);
      }
    }

    async function runTyping() {
      if (reduceMotion) {
        typeLine1.textContent = text1;
        typeLine2.textContent = text2;
        typeLine2.after(typeBall);
        return;
      }

      await sleep(400);
      await typeText(typeLine1, text1);
      await sleep(200);
      await typeText(typeLine2, text2);
      typeBall.classList.add("is-done");
    }

    runTyping();
  }
});
