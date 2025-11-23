document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const html = document.documentElement;
  const darkSwitch = document.getElementById("darkModeSwitch");
  const menuToggle = document.getElementById("menuToggle");
  const sideMenu = document.getElementById("sideMenu");
  const closeMenu = document.getElementById("closeMenu");
  const overlay = document.getElementById("overlay");
  const scrollTopBtn = document.getElementById("toTop");

  /* ============================
        MODO OSCURO
  ============================= */
  if (localStorage.getItem("theme") === "dark") {
    html.classList.add("theme-dark");
    darkSwitch?.classList.add("active");
  }

  darkSwitch?.addEventListener("click", () => {
    html.classList.toggle("theme-dark");
    darkSwitch.classList.toggle("active");
    localStorage.setItem(
      "theme",
      html.classList.contains("theme-dark") ? "dark" : "light"
    );
  });

  /* ============================================
        MENÚ LATERAL ACCESIBLE + INERT FIX
  ============================================= */

  let lastFocusedElement = null;

  function disablePanelFocus() {
    sideMenu
      .querySelectorAll("button, a, input, select, textarea")
      .forEach((el) => {
        el.setAttribute("tabindex", "-1");
      });
  }

  function enablePanelFocus() {
    sideMenu
      .querySelectorAll("button, a, input, select, textarea")
      .forEach((el) => {
        el.removeAttribute("tabindex");
      });
  }

  // Menú comienza OCULTO al árbol accesible
  sideMenu.setAttribute("inert", "");
  disablePanelFocus();

  function openPanel() {
    lastFocusedElement = document.activeElement;

    sideMenu.removeAttribute("inert"); // <-- ACTIVAMOS ACCESIBILIDAD

    sideMenu.classList.remove("side-menu-closed");
    sideMenu.classList.add("side-menu-open");
    overlay.classList.add("active");

    sideMenu.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");

    enablePanelFocus();
    closeMenu.focus();

    scrollTopBtn.style.opacity = "0";
    scrollTopBtn.style.pointerEvents = "none";
  }

  function closePanel() {
    sideMenu.classList.remove("side-menu-open");
    sideMenu.classList.add("side-menu-closed");
    overlay.classList.remove("active");

    sideMenu.setAttribute("inert", ""); // <-- PANEL FUERA DEL ÁRBOL ACCESIBLE
    sideMenu.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");

    disablePanelFocus();

    if (lastFocusedElement) lastFocusedElement.focus();

    scrollTopBtn.style.opacity = "0";
    scrollTopBtn.style.pointerEvents = "none";

    const onEnd = () => {
      sideMenu.removeEventListener("transitionend", onEnd);
      scrollTopBtn.style.opacity = "";
      scrollTopBtn.style.pointerEvents = "";
      toggleScrollTopBtn();
    };

    sideMenu.addEventListener("transitionend", onEnd);
  }

  menuToggle?.addEventListener("click", () => {
    const isClosed = sideMenu.classList.contains("side-menu-closed");
    if (isClosed) openPanel();
    else closePanel();
  });

  closeMenu?.addEventListener("click", closePanel);
  overlay?.addEventListener("click", closePanel);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sideMenu.classList.contains("side-menu-open")) {
      closePanel();
    }
  });

  sideMenu.addEventListener("keydown", (e) => {
    if (!sideMenu.classList.contains("side-menu-open")) return;

    const focusable = sideMenu.querySelectorAll(
      'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* ============================================
        CERRAR MENÚ AL HACER SCROLL
  ============================================= */
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    if (sideMenu.classList.contains("side-menu-open")) {
      if (Math.abs(window.scrollY - lastScrollY) > 10) closePanel();
    }
    lastScrollY = window.scrollY;
  });

  /* ============================================
        HEADER SCROLL
  ============================================= */
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    if (window.scrollY > 10) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  });

  /* ============================================
        BOTÓN SUBIR ARRIBA
  ============================================= */

  function toggleScrollTopBtn() {
    if (window.scrollY > 350) {
      scrollTopBtn.classList.remove("hidden");
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
      scrollTopBtn.classList.add("hidden");
    }
  }

  window.addEventListener("scroll", toggleScrollTopBtn);
  toggleScrollTopBtn();

  scrollTopBtn?.addEventListener("click", () => {
    if (scrollTopBtn.classList.contains("shoot")) return;

    scrollTopBtn.classList.add("shoot");
    const flecha = scrollTopBtn.querySelector(".flecha");
    const diana = scrollTopBtn.querySelector(".diana");

    flecha.style.opacity = "1";
    diana.style.opacity = "0";

    window.scrollTo({ top: 0, behavior: "smooth" });

    const check = setInterval(() => {
      if (window.scrollY <= 10) {
        clearInterval(check);
        scrollTopBtn.classList.remove("shoot");
        flecha.style.opacity = "1";
        diana.style.opacity = "1";
      }
    }, 16);
  });

  /* ============================================
        BUSCADOR
  ============================================= */
  const searchForm = document.getElementById("menuSearchForm");
  const searchInput = document.getElementById("menuSearchInput");

  searchForm?.addEventListener("submit", (e) => {
    if (!searchInput.value.trim()) e.preventDefault();
  });

  /* ============================================
        CARRUSEL HERO ACCESIBLE
  ============================================= */
  const slides = document.querySelectorAll(".carousel-slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.getElementById("prevSlide");
  const nextBtn = document.getElementById("nextSlide");

  let currentSlide = 0;
  let slideInterval;
  let userKeyboard = false;

  document.addEventListener("keydown", () => (userKeyboard = true));

  function showSlide(index) {
    slides.forEach((slide, i) => {
      const active = index === i;

      slide.style.opacity = active ? "1" : "0";
      slide.style.zIndex = active ? "10" : "0";
      slide.setAttribute("aria-hidden", active ? "false" : "true");

      if (active) {
        slide.removeAttribute("inert");
        slide.removeAttribute("tabindex");
      } else {
        slide.setAttribute("inert", "");
        slide.setAttribute("tabindex", "-1");
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
      dot.setAttribute("aria-current", i === index);
    });

    if (userKeyboard) {
      const content = slides[index].querySelector(".hero-content");
      if (content) content.focus();
    }

    currentSlide = index;
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
  }

  function prevSlide() {
    showSlide((currentSlide - 1 + slides.length) % slides.length);
  }

  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  dots.forEach((dot, i) => dot.addEventListener("click", () => showSlide(i)));

  function startCarousel() {
    slideInterval = setInterval(nextSlide, 6000);
  }

  function stopCarousel() {
    clearInterval(slideInterval);
  }

  const hero = document.querySelector("#hero-carousel");
  hero.addEventListener("mouseenter", stopCarousel);
  hero.addEventListener("mouseleave", startCarousel);

  showSlide(0);
  startCarousel();

  /* ============================================
        LINK ACTIVO DEL MENÚ
  ============================================= */
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll("#sideMenu .menu-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (href === "index.html" && currentPage === "")) {
      link.classList.add("active");
    }
  });
});
