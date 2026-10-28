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

  if (mobileMenuBtn && sideMenu && menuOverlay) {
    const toggleMenu = () => {
      mobileMenuBtn.classList.toggle("open");
      sideMenu.classList.toggle("active");
      menuOverlay.classList.toggle("active");
      document.body.style.overflow = sideMenu.classList.contains("active") ? "hidden" : "";
    };

    mobileMenuBtn.addEventListener("click", toggleMenu);
    menuOverlay.addEventListener("click", toggleMenu);
    
    sideLinks.forEach(link => {
      link.addEventListener("click", toggleMenu);
    });
  }

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
  setTimeout(() => { document.querySelectorAll('.reveal-hero').forEach(el => el.classList.add('reveal-active')); }, 100);

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
        await sleep(70);
      }
    }

    async function runTyping() {
      if (reduceMotion) {
        typeLine1.textContent = text1; typeLine2.textContent = text2; typeLine2.after(typeBall); return;
      }
      await sleep(600); await typeText(typeLine1, text1); await sleep(300); await typeText(typeLine2, text2);
      typeBall.classList.add("is-done");
    }
    runTyping();
  }

  // ===============================================
  // GALERIA MODAL DAS MODALIDADES (CARD SOBREPOSTO)
  // ===============================================
  const sportsData = {
    futebol: {
      title: "FUTEBOL",
      images: [
       "./images/ft01.jfif",
       "./images/ft02.jfif",
       "./images/ft03.jfif", 
       "./images/ft04.jfif",
       "./images/ft05.jfif",
       "./images/ft06.jfif",
       "./images/ft07.jfif",
       "./images/ft08.jfif",
       "./images/ft09.jfif",
       "./images/ft10.jfif",
      ]
    },
    volei: {
      title: "BEACH TENNIS",
      images: [
        "./images/bt01.jfif",
        "./images/bt02.jfif",
        "./images/bt03.jfif",
        "./images/bt04.jfif",
        "./images/bt05.jfif",
        "./images/bt06.jfif",
        "./images/bt07.jfif",
        "./images/bt08.jfif"
      ]
    }
  };

  const galleryModal = document.getElementById("galleryModal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalTitle = document.getElementById("modalTitle");
  const modalTrack = document.getElementById("modalGalleryTrack");
  const modalPrevBtn = document.getElementById("modalPrevBtn");
  const modalNextBtn = document.getElementById("modalNextBtn");
  const modalCounter = document.getElementById("modalCounter");

  let currentImages = [];
  let currentModalIndex = 0;

  function updateModalSlide(index) {
    if (index < 0) currentModalIndex = currentImages.length - 1;
    else if (index >= currentImages.length) currentModalIndex = 0;
    else currentModalIndex = index;

    modalTrack.style.transform = `translateX(-${currentModalIndex * 100}%)`;
    modalCounter.textContent = `${currentModalIndex + 1} / ${currentImages.length}`;
  }

  function openGallery(sportKey) {
    const data = sportsData[sportKey];
    if (!data) return;

    modalTitle.textContent = data.title;
    currentImages = data.images;
    currentModalIndex = 0;

    modalTrack.innerHTML = data.images.map(src => `
      <div class="modal-gallery-slide">
        <img src="${src}" alt="${data.title}" loading="lazy" />
      </div>
    `).join("");

    updateModalSlide(0);
    galleryModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeGallery() {
    galleryModal.classList.remove("active");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".sport-card").forEach(card => {
    card.addEventListener("click", () => {
      const sport = card.getAttribute("data-sport");
      openGallery(sport);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeGallery);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeGallery);
  if (modalPrevBtn) modalPrevBtn.addEventListener("click", () => updateModalSlide(currentModalIndex - 1));
  if (modalNextBtn) modalNextBtn.addEventListener("click", () => updateModalSlide(currentModalIndex + 1));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && galleryModal && galleryModal.classList.contains("active")) closeGallery();
  });
});
