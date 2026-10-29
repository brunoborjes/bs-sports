document.addEventListener("DOMContentLoaded", () => {
  // HEADER SCROLL
  const header = document.getElementById("header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // MENU LATERAL / HAMBURGER (GAVETA MOBILE)
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

  // SCROLL REVEAL (INTERSECTION OBSERVER)
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length > 0) {
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  }

  setTimeout(() => {
    document.querySelectorAll(".reveal-hero").forEach(el => el.classList.add("reveal-active"));
  }, 100);

  // EFEITO DE DIGITAÇÃO E BOLA
  const typeLine1 = document.getElementById("type-1");
  const typeLine2 = document.getElementById("type-2");
  const typeBall = document.getElementById("type-ball");

  if (typeLine1 && typeLine2 && typeBall) {
    const text1 = "Grandes eventos.";
    const text2 = "Grandes experiências.";
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    let ballAngle = 0;
    const ballSvg = typeBall.querySelector("svg");

    async function typeText(el, text) {
      el.after(typeBall);
      for (const ch of text) {
        el.textContent += ch;
        ballAngle += 45;
        if (ballSvg) ballSvg.style.transform = `rotate(${ballAngle}deg)`;
        await sleep(65);
      }
    }

    async function runTyping() {
      typeLine1.textContent = "";
      typeLine2.textContent = "";
      typeBall.classList.remove("is-done");

      await sleep(400);
      await typeText(typeLine1, text1);
      await sleep(250);
      await typeText(typeLine2, text2);
      typeBall.classList.add("is-done");
    }

    runTyping();
  }

  // ===============================================
  // GALERIA MODAL DAS MODALIDADES
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
        "./images/ft10.jfif"
      ]
    },
    beachtennis: {
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
    },
    futsal: {
      title: "FUTSAL",
      images: [
        "./images/futsal1.jfif",
        "./images/futsal2.jfif",
        "./images/futsal3.jfif",
        "./images/futsal4.jfif",
        "./images/futsal5.jfif",
        "./images/futsal6.jfif",
        "./images/futsal7.jfif",
        "./images/futsal8.jfif",
        "./images/futsal9.jfif",
        "./images/futsal10.jfif",
        "./images/futsal11.jfif",
        "./images/futsal12.jfif",
        "./images/futsal13.jfif"
      ]
    },
    ciclismo: {
      title: "CICLISMO",
      images: [
        "./images/bc1.jfif",
        "./images/bc2.jfif",
        "./images/bc3.jfif",
        "./images/bc4.jfif",
        "./images/bc5.jfif",
        "./images/bc6.jfif",
        "./images/bc7.jfif",
        "./images/bc8.jfif",
        "./images/bc9.jfif"
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
    if (!modalTrack || !modalCounter || currentImages.length === 0) return;

    if (index < 0) currentModalIndex = currentImages.length - 1;
    else if (index >= currentImages.length) currentModalIndex = 0;
    else currentModalIndex = index;

    modalTrack.style.transform = `translateX(-${currentModalIndex * 100}%)`;
    modalCounter.textContent = `${currentModalIndex + 1} / ${currentImages.length}`;
  }

  function openGallery(sportKey) {
    const data = sportsData[sportKey];
    if (!data || !galleryModal || !modalTitle || !modalTrack) return;

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
    if (galleryModal) {
      galleryModal.classList.remove("active");
      document.body.style.overflow = "";
    }
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
    if (e.key === "Escape" && galleryModal && galleryModal.classList.contains("active")) {
      closeGallery();
    }
  });
});