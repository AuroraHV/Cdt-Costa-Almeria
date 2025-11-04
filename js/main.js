document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const html = document.documentElement;
  const darkSwitch = document.getElementById("darkModeSwitch");
  const menuToggle = document.getElementById("menuToggle");
  const sideMenu = document.getElementById("sideMenu");
  const sideMenuContent = document.querySelector('#sideMenu .flex-1');
  const menuHeader = document.querySelector('.menu-header');
  const closeMenu = document.getElementById("closeMenu");
  const overlay = document.getElementById("overlay");
  const scrollTopBtn = document.getElementById("toTop");

// Aplicar preferencia guardada
if (localStorage.getItem("theme") === "dark") {
  html.classList.add("theme-dark");
  darkSwitch?.classList.add("active");
}

// Alternar modo oscuro
darkSwitch?.addEventListener("click", () => {
  html.classList.toggle("theme-dark");
  darkSwitch.classList.toggle("active");

  // Guardar preferencia
  localStorage.setItem(
    "theme",
    html.classList.contains("theme-dark") ? "dark" : "light"
  );
});

  // === Abrir menú lateral ===
  menuToggle?.addEventListener("click", () => {
    const isOpen = sideMenu.classList.contains("open");

    if (!isOpen) {
      // Mostrar menú y overlay
      sideMenu.classList.add("open");
      overlay.classList.add("active");

      scrollTopBtn.style.opacity = "0";
      scrollTopBtn.style.pointerEvents = "none";
    } else {
      closePanel();
    }
  });

  // === Función para cerrar el menú ===
  function closePanel() {
    sideMenu.classList.remove("open");
    overlay.classList.remove("active");

    // Restaurar icono original
    menuToggle.innerHTML = `<i data-lucide="menu" class="w-5 h-5 text-[#0B3C5D]"></i>`;
    lucide.createIcons();

    // Mostrar botón “Subir arriba” de nuevo
    setTimeout(() => {
      scrollTopBtn.style.opacity = "1";
      scrollTopBtn.style.pointerEvents = "auto";
    }, 200);
  }

  // === Cerrar menú al pulsar fuera o en la X ===
  closeMenu?.addEventListener("click", closePanel);
  overlay?.addEventListener("click", closePanel);

  // === Cerrar menú al hacer scroll ===
  let lastScrollY = window.scrollY;
  window.addEventListener("scroll", () => {
    const delta = Math.abs(window.scrollY - lastScrollY);
    if (delta > 10 && sideMenu.classList.contains("open")) {
      closePanel();
    }
    lastScrollY = window.scrollY;
  });

  // ===  Cambiar estilo del header al hacer scroll ===
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    if (window.scrollY > 10) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  });

    // === Cambiar estilo del header del panel al hacer scroll ===
  sideMenuContent?.addEventListener('scroll', () => {
  if (sideMenuContent.scrollTop > 5) {
    menuHeader.classList.add('scrolled');
  } else {
    menuHeader.classList.remove('scrolled');
  }
});

  // === 8️⃣ Botón “Subir arriba” ===
  function toggleScrollTopBtn() {
    if (!scrollTopBtn) return;
    if (window.scrollY > 200) {
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

    flecha.style.display = "inline";
    flecha.style.opacity = "1";
    diana.style.opacity = "0";

    window.scrollTo({ top: 0, behavior: "smooth" });

    const checkScroll = setInterval(() => {
      const scrollY = window.scrollY;
      const opacity = Math.max(0, Math.min(1, scrollY / 500));
      flecha.style.opacity = 1 - opacity;

      if (scrollY <= 10) {
        clearInterval(checkScroll);
        flecha.style.opacity = 0;
        scrollTopBtn.classList.add("fade-out");

        setTimeout(() => {
          scrollTopBtn.classList.remove("shoot", "fade-out", "show");
          flecha.style.display = "inline";
          flecha.style.opacity = "1";
          diana.style.opacity = "1";
          toggleScrollTopBtn();
        }, 400);
      }
    }, 16);
  });

// === BÚSQUEDA EN EL MENÚ ===
const searchForm = document.getElementById("menuSearchForm");
const searchInput = document.getElementById("menuSearchInput");

searchForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query) {
    alert(`🔎 Buscando: ${query}`);
  }
});


// === HERO CARRUSEL ===
const slides = document.querySelectorAll(".carousel-slide");
const dots = document.querySelectorAll(".dot");
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.style.opacity = i === index ? "1" : "0";
    slide.style.zIndex = i === index ? "10" : "0";
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
    dot.classList.toggle("bg-white/70", i === index);
    dot.classList.toggle("bg-white/50", i !== index);
  });
  currentSlide = index;
}

function nextSlide() {
  const next = (currentSlide + 1) % slides.length;
  showSlide(next);
}
function prevSlide() {
  const prev = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(prev);
}

document.getElementById("nextSlide")?.addEventListener("click", nextSlide);
document.getElementById("prevSlide")?.addEventListener("click", prevSlide);

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => showSlide(i));
});

function startCarousel() {
  slideInterval = setInterval(nextSlide, 6000);
}
function stopCarousel() {
  clearInterval(slideInterval);
}

document
  .querySelector("#hero-carousel")
  ?.addEventListener("mouseenter", stopCarousel);
document
  .querySelector("#hero-carousel")
  ?.addEventListener("mouseleave", startCarousel);

showSlide(0);
startCarousel();


// Obtener el nombre del archivo actual (por ejemplo: "index.html")
  const currentPage = window.location.pathname.split("/").pop();

  // Seleccionar todos los enlaces del panel lateral
  const menuLinks = document.querySelectorAll("#sideMenu .menu-link");

  menuLinks.forEach(link => {
    const href = link.getAttribute("href");

    // Comparar con la página actual
    if (href === currentPage || (href === "index.html" && currentPage === "")) {
      link.classList.add("active");
    }
  });

});
