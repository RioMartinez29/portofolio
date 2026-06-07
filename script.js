(function () {
  "use strict";

  /* ── Opening Welcome Screen ── */
  const welcomeScreen = document.getElementById("welcome-screen");
  const welcomeTypingText = document.getElementById("welcome-typing-text");
  const welcomeRotate = document.getElementById("welcome-rotate");
  const welcomeCanvas = document.getElementById("welcome-particles");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const WELCOME_TEXT = "WELCOME TO MY PORTFOLIO";
  const ROTATE_TEXTS = [
    "Software Engineering Enthusiast",
    "Data Analytics Enthusiast",
    "Open to Internship & Entry-Level Opportunities",
  ];

  let welcomeComplete = false;
  let particleFrame = null;
  let particleCleanup = null;

  function initWelcomeParticles() {
    if (!welcomeCanvas || reducedMotion) return function () {};

    const ctx = welcomeCanvas.getContext("2d");
    let particles = [];
    let width = 0;
    let height = 0;

    function resize() {
      width = welcomeCanvas.width = welcomeCanvas.offsetWidth;
      height = welcomeCanvas.height = welcomeCanvas.offsetHeight;
    }

    function createParticles() {
      const count = Math.min(45, Math.floor((width * height) / 18000));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          opacity: Math.random() * 0.4 + 0.15,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(56, 189, 248, " + p.opacity + ")";
        ctx.fill();
      });
      particleFrame = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    const onResize = function () {
      resize();
      createParticles();
    };
    window.addEventListener("resize", onResize);

    return function () {
      window.removeEventListener("resize", onResize);
      if (particleFrame) cancelAnimationFrame(particleFrame);
    };
  }

  function setWelcomeStage(stageNum) {
    if (!welcomeScreen) return;
    welcomeScreen.querySelectorAll(".welcome-stage").forEach(function (stage) {
      const num = parseInt(stage.dataset.stage, 10);
      stage.classList.toggle("is-active", num === stageNum);
      stage.classList.toggle("is-exiting", num === 1 && stageNum > 1);
    });
  }

  function typeWelcomeText(onComplete) {
    if (!welcomeTypingText) {
      onComplete();
      return;
    }

    let index = 0;
    const speed = reducedMotion ? 0 : 48;

    function typeChar() {
      if (index <= WELCOME_TEXT.length) {
        welcomeTypingText.textContent = WELCOME_TEXT.slice(0, index);
        index++;
        setTimeout(typeChar, speed);
      } else {
        setTimeout(onComplete, reducedMotion ? 200 : 280);
      }
    }

    typeChar();
  }

  function rotateWelcomeTexts(onComplete) {
    if (!welcomeRotate) {
      onComplete();
      return;
    }

    let current = 0;
    const interval = reducedMotion ? 400 : 420;
    const total = ROTATE_TEXTS.length;

    function showText() {
      welcomeRotate.textContent = ROTATE_TEXTS[current];
      welcomeRotate.classList.remove("is-changing");

      if (current < total - 1) {
        current++;
        setTimeout(function () {
          welcomeRotate.classList.add("is-changing");
          setTimeout(showText, 200);
        }, interval);
      } else {
        setTimeout(onComplete, interval);
      }
    }

    showText();
  }

  function finishWelcomeScreen() {
    if (!welcomeScreen || welcomeComplete) return;
    welcomeComplete = true;

    welcomeScreen.classList.add("is-hidden");
    document.body.classList.remove("welcome-active");
    welcomeScreen.setAttribute("aria-hidden", "true");

    if (particleCleanup) particleCleanup();

    setTimeout(function () {
      welcomeScreen.classList.add("is-removed");
      startRevealAnimations();
    }, 650);
  }

  function runWelcomeScreen() {
    if (!welcomeScreen) {
      welcomeComplete = true;
      return;
    }

    document.body.classList.add("welcome-active");
    particleCleanup = initWelcomeParticles();

    if (reducedMotion) {
      welcomeTypingText.textContent = WELCOME_TEXT;
      setWelcomeStage(2);
      welcomeRotate.textContent = ROTATE_TEXTS[ROTATE_TEXTS.length - 1];
      setTimeout(function () {
        setWelcomeStage(3);
        setTimeout(finishWelcomeScreen, 600);
      }, 800);
      return;
    }

    setWelcomeStage(1);

    setTimeout(function () {
      typeWelcomeText(function () {
        setTimeout(function () {
          setWelcomeStage(2);
          rotateWelcomeTexts(function () {
            setWelcomeStage(3);
            setTimeout(finishWelcomeScreen, 950);
          });
        }, 120);
      });
    }, 150);

    setTimeout(finishWelcomeScreen, 5000);
  }

  runWelcomeScreen();

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const headerLinks = document.querySelectorAll(".nav-links a");
  const revealElements = document.querySelectorAll(".reveal");
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const yearEl = document.getElementById("year");

  /* ── Footer year ── */
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ── Header scroll effect ── */
  function handleHeaderScroll() {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ── Mobile navigation ── */
  function closeNav() {
    navToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("open");
    document.body.style.overflow = "";
  }

  navToggle.addEventListener("click", function () {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("open", !isOpen);
    document.body.style.overflow = !isOpen ? "hidden" : "";
  });

  headerLinks.forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", function (event) {
    if (
      navLinks.classList.contains("open") &&
      !navLinks.contains(event.target) &&
      !navToggle.contains(event.target)
    ) {
      closeNav();
    }
  });

  /* ── Scroll reveal with stagger ── */
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(function () {
            entry.target.classList.add("visible");
          }, delay * 120);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
  );

  function startRevealAnimations() {
    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });

    revealElements.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const delay = el.dataset.delay || 0;
        setTimeout(function () {
          el.classList.add("visible");
        }, delay * 120);
        revealObserver.unobserve(el);
      }
    });
  }

  if (welcomeComplete) {
    startRevealAnimations();
  }

  /* ── Active nav link on scroll ── */
  const sections = document.querySelectorAll("section[id]");

  function setActiveLink() {
    const scrollPos = window.scrollY + 140;
    let currentId = "";

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        currentId = id;
      }
    });

    headerLinks.forEach(function (link) {
      link.classList.remove("active");
      link.style.color = "";

      if (link.getAttribute("href") === "#" + currentId) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  /* ── Contact form validation ── */
  function showError(field, message) {
    field.classList.add("error");
    formStatus.textContent = message;
    formStatus.className = "form-status error";
  }

  function clearErrors() {
    contactForm.querySelectorAll(".error").forEach(function (el) {
      el.classList.remove("error");
    });
    formStatus.textContent = "";
    formStatus.className = "form-status";
  }

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();

    const name = contactForm.querySelector("#name");
    const email = contactForm.querySelector("#email");
    const message = contactForm.querySelector("#message");

    if (!name.value.trim()) {
      showError(name, "Silakan masukkan nama Anda.");
      name.focus();
      return;
    }

    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showError(email, "Silakan masukkan alamat email yang valid.");
      email.focus();
      return;
    }

    if (!message.value.trim()) {
      showError(message, "Silakan tulis pesan Anda.");
      message.focus();
      return;
    }

    formStatus.textContent = "Terima kasih! Pesan kamu sudah saya terima — akan saya balas secepatnya.";
    formStatus.className = "form-status success";
    contactForm.reset();
  });
})();
