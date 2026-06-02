(function () {
  "use strict";

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

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

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
