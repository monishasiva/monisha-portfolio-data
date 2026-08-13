/* ==========================================================================
   Monisha Sivakumar — Data Science Portfolio
   Vanilla JavaScript interactions
   -------------------------------------------------------------------------
   1. Theme toggle (dark/light) with localStorage persistence
   2. Sticky navbar background on scroll + active link highlighting
   3. Typed role animation in the hero
   4. Animated particle background (canvas)
   5. Scroll reveal animations (IntersectionObserver)
   6. Animated skill progress bars
   7. Contact form validation
   8. Back-to-top button + footer year
   ========================================================================== */

(function () {
  "use strict";

  /* ======================================================================
     1. THEME TOGGLE + localStorage
     ====================================================================== */
  const htmlEl = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle.querySelector("i");

  // Apply a theme and update the toggle icon + stored preference.
  function applyTheme(theme) {
    htmlEl.setAttribute("data-bs-theme", theme);
    themeIcon.className = theme === "dark" ? "bi bi-moon-stars-fill" : "bi bi-sun-fill";
    localStorage.setItem("portfolio-theme", theme);
  }

  // Load stored preference, else fall back to OS preference.
  const storedTheme = localStorage.getItem("portfolio-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(storedTheme || (prefersDark ? "dark" : "light"));

  themeToggle.addEventListener("click", function () {
    const next = htmlEl.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
  });

  /* ======================================================================
     2. STICKY NAVBAR + ACTIVE LINK HIGHLIGHTING
     ====================================================================== */
  const navbar = document.getElementById("mainNav");
  const navLinks = document.querySelectorAll(".glass-nav .nav-link");
  const sections = document.querySelectorAll("section[id], header[id]");

  function onScroll() {
    // Add background to navbar once the page is scrolled.
    navbar.classList.toggle("scrolled", window.scrollY > 40);

    // Highlight the nav link for the section currently in view.
    let currentId = "";
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 120) {
        currentId = section.getAttribute("id");
      }
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
    });

    // Toggle back-to-top button visibility.
    backToTop.classList.toggle("show", window.scrollY > 400);
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  // Collapse the mobile menu after clicking a link.
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const collapse = document.getElementById("navContent");
      if (collapse.classList.contains("show")) {
        new bootstrap.Collapse(collapse).hide();
      }
    });
  });

  /* ======================================================================
     3. TYPED ROLE ANIMATION
     ====================================================================== */
  const typedEl = document.getElementById("typedRole");
  const roles = ["Data Science Enthusiast", "Python Developer", "Machine Learning Aspirant"];
  let roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    const current = roles[roleIndex];
    typedEl.textContent = deleting
      ? current.substring(0, charIndex--)
      : current.substring(0, charIndex++);

    let delay = deleting ? 45 : 85;

    if (!deleting && charIndex === current.length + 1) {
      deleting = true;
      delay = 1600; // pause at full word
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 350;
    }
    setTimeout(typeLoop, delay);
  }
  typeLoop();

  /* ======================================================================
     4. ANIMATED PARTICLE BACKGROUND (canvas)
     ====================================================================== */
  const canvas = document.getElementById("particles");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canvas && canvas.getContext && !reducedMotion) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let width, height;

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    // Build the particle field, scaled to viewport size.
    function initParticles() {
      const count = Math.min(90, Math.floor(width / 16));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        // Move + wrap around edges.
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;

        // Dot.
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34, 211, 238, 0.7)";
        ctx.fill();

        // Connect nearby particles with faint lines.
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = "rgba(99, 102, 241, " + (0.14 * (1 - dist / 120)) + ")";
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(draw);
    }

    resize();
    initParticles();
    draw();
    window.addEventListener("resize", () => { resize(); initParticles(); });
  }

  /* ======================================================================
     5. SCROLL REVEAL + 6. ANIMATED SKILL BARS (IntersectionObserver)
     ====================================================================== */
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          // If this element contains skill bars, animate them.
          entry.target.querySelectorAll(".skill-bar").forEach((bar) => {
            const level = bar.getAttribute("data-skill");
            const fill = bar.querySelector(".bar i");
            if (fill && level) fill.style.width = level + "%";
          });

          observer.unobserve(entry.target); // reveal only once
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ======================================================================
     7. CONTACT FORM VALIDATION
     ====================================================================== */
  const form = document.getElementById("contactForm");
  const successAlert = document.getElementById("formSuccess");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (form.checkValidity()) {
      form.classList.remove("was-validated");
      form.reset();
      successAlert.classList.remove("d-none");
      setTimeout(() => successAlert.classList.add("d-none"), 5000);
    } else {
      form.classList.add("was-validated");
    }
  });

  /* ======================================================================
     8. BACK-TO-TOP + FOOTER YEAR
     ====================================================================== */
  const backToTop = document.getElementById("backToTop");
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  // Run once on load so initial state is correct.
  onScroll();

  function downloadResume() {
    const link = document.createElement("a");
    link.href = "/resume.pdf";        // Next.js

    // For plain HTML use:
    // link.href = "./assets/resume.pdf";

    link.download = "Monisha_Sivakumar_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  document.getElementById("downloadResume").addEventListener("click", function (e) {
    e.preventDefault();

    const link = document.createElement("a");
    link.href = "./assets/resume.pdf";
    link.download = "Monisha_Sivakumar_Resume.pdf";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
})();