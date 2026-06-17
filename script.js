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
  const FINAL_TEXTS = [
    "Ready to Learn.",
    "Ready to Build.",
    "Ready to Contribute.",
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

  function showFinalTexts(onComplete) {
    const finalLines = document.querySelectorAll(".welcome-final-line");
    if (!finalLines.length) {
      onComplete();
      return;
    }

    let current = 0;
    const interval = reducedMotion ? 300 : 350;

    function showLine() {
      if (current < finalLines.length) {
        finalLines[current].style.opacity = "1";
        finalLines[current].style.transform = "translateY(0)";
        current++;
        setTimeout(showLine, interval);
      } else {
        setTimeout(onComplete, interval);
      }
    }

    showLine();
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
        showFinalTexts(function () {
          setTimeout(finishWelcomeScreen, 600);
        });
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
            showFinalTexts(function () {
              setTimeout(finishWelcomeScreen, 950);
            });
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
  const scrollProgress = document.getElementById("scroll-progress");

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

  /* ── Scroll progress bar ── */
  function handleScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + "%";
  }

  window.addEventListener("scroll", handleHeaderScroll, { passive: true });
  window.addEventListener("scroll", handleScrollProgress, { passive: true });
  handleHeaderScroll();
  handleScrollProgress();

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

  /* ── Counter animation ── */
  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.target, 10);
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          let step = 0;

          function updateCounter() {
            if (step < steps) {
              current += increment;
              counter.textContent = Math.ceil(current);
              step++;
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          }

          updateCounter();
          counterObserver.unobserve(counter);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll(".counter").forEach(function (counter) {
    counterObserver.observe(counter);
  });

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

  /* ── CV Download ── */
  const CV_LINK_PLACEHOLDER = "https://drive.google.com/file/d/1Z00PCAZOi9jaR29vhHkJ6nghroiFPoFP/view?usp=drivesdk";
  const downloadCvBtn = document.getElementById("download-cv-btn");

  if (downloadCvBtn) {
    downloadCvBtn.href = CV_LINK_PLACEHOLDER;
    downloadCvBtn.setAttribute("target", "_blank");
    downloadCvBtn.setAttribute("rel", "noopener noreferrer");
  }

  /* ── Projects ── */
  /*
   * Tambah project baru: salin objek di bawah, isi data, ganti demoLink dan githubLink.
   */
  const DEMO_LINK_PLACEHOLDER = "MASUKKAN_LINK_LIVE_DEMO_DISINI";
  const GITHUB_LINK_PLACEHOLDER = "MASUKKAN_LINK_GITHUB_DISINI";

  const PROJECTS = [
    {
      id: "project-1",
      title: "Sistem Rekomendasi Buku Berbasis Web",
      description: "Aplikasi web untuk rekomendasi buku berdasarkan kategori. Project skripsi saya — mencakup CRUD data buku, logika rekomendasi sederhana, dan manajemen database.",
      type: "Skripsi · Project Kuliah",
      tags: ["PHP", "MySQL", "HTML", "CSS"],
      demoLink: DEMO_LINK_PLACEHOLDER,
      githubLink: GITHUB_LINK_PLACEHOLDER,
      gradientClass: "project-image-bg--1",
    },
    {
      id: "project-2",
      title: "Project Bootcamp RevoU",
      description: "Project praktik dari bootcamp RevoU — latihan membangun aplikasi web dan mengolah data. Bagian dari proses belajar intensif saya pasca lulus kuliah.",
      type: "Bootcamp · RevoU",
      tags: ["Web Dev", "Data", "Bootcamp"],
      demoLink: "https://riomartinez29.github.io/CodingCamp-01June26-RioMartinez/",
      githubLink: GITHUB_LINK_PLACEHOLDER,
      gradientClass: "project-image-bg--2",
    },
    {
      id: "project-3",
      title: "Website Portfolio Pribadi",
      description: "Website portfolio ini saya buat sendiri untuk menampilkan project, skill, dan sertifikat. Project latihan front-end dengan desain modern dan responsif.",
      type: "Portfolio · Latihan",
      tags: ["HTML", "CSS", "JavaScript"],
      demoLink: "#top",
      githubLink: GITHUB_LINK_PLACEHOLDER,
      gradientClass: "project-image-bg--3",
    },
    {
      id: "project-4",
      title: "Aplikasi Manajemen Inventaris",
      description: "Sistem manajemen stok barang dengan fitur CRUD, pencarian, dan laporan. Dibangun untuk mempelajari konsep dasar manajemen data.",
      type: "Project Kuliah",
      tags: ["PHP", "MySQL", "Bootstrap"],
      demoLink: DEMO_LINK_PLACEHOLDER,
      githubLink: GITHUB_LINK_PLACEHOLDER,
      gradientClass: "project-image-bg--1",
    },
    {
      id: "project-5",
      title: "Dashboard Analitik Sederhana",
      description: "Dashboard untuk visualisasi data dengan chart dan tabel. Project latihan untuk memahami konsep data visualization.",
      type: "Latihan Mandiri",
      tags: ["HTML", "CSS", "JavaScript", "Chart.js"],
      demoLink: DEMO_LINK_PLACEHOLDER,
      githubLink: GITHUB_LINK_PLACEHOLDER,
      gradientClass: "project-image-bg--2",
    },
    {
      id: "project-6",
      title: "Website Company Profile",
      description: "Website profil perusahaan dengan sections tentang, layanan, dan kontak. Project latihan responsive web design.",
      type: "Latihan Mandiri",
      tags: ["HTML", "CSS", "JavaScript"],
      demoLink: DEMO_LINK_PLACEHOLDER,
      githubLink: GITHUB_LINK_PLACEHOLDER,
      gradientClass: "project-image-bg--3",
    },
  ];

  const PROJ_VISIBLE_COUNT = 3;
  const projGrid = document.getElementById("projects-grid");
  const projViewAllBtn = document.getElementById("proj-view-all-btn");

  function buildProjectCard(project, index, options) {
    const opts = options || {};
    const revealClass = opts.animate !== false ? " reveal" : "";
    const enterClass = opts.enter ? " project-card--enter" : "";
    const delay = opts.delay !== undefined ? opts.delay : index;
    const delayAttr = opts.animate !== false ? ' data-delay="' + delay + '"' : "";
    const styleAttr = opts.enter ? ' style="animation-delay:' + delay * 80 + 'ms"' : "";

    const tagsHtml = project.tags
      .map(function (tag) {
        return "<li>" + tag + "</li>";
      })
      .join("");

    return (
      '<article class="project-card' +
      revealClass +
      enterClass +
      '" data-project-id="' +
      project.id +
      '"' +
      delayAttr +
      styleAttr +
      '">' +
      '<div class="project-image">' +
      '<div class="project-image-bg ' +
      project.gradientClass +
      '"></div>' +
      '<span class="project-number">' +
      String(index + 1).padStart(2, "0") +
      "</span>" +
      '<span class="project-type">' +
      project.type +
      "</span>" +
      '<div class="project-overlay">' +
      '<a href="' +
      project.demoLink +
      '" class="btn btn-sm btn-primary" aria-label="Lihat demo ' +
      project.title +
      '" target="_blank" rel="noopener noreferrer">Lihat Demo' +
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>' +
      "</a>" +
      "</div></div>" +
      '<div class="project-body glass">' +
      "<h3>" +
      project.title +
      "</h3>" +
      "<p>" +
      project.description +
      "</p>" +
      '<ul class="project-tags">' +
      tagsHtml +
      "</ul>" +
      '<div class="project-links">' +
      '<a href="' +
      project.demoLink +
      '" class="btn btn-sm btn-primary" aria-label="Lihat demo ' +
      project.title +
      '" target="_blank" rel="noopener noreferrer">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      "Lihat Demo" +
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>' +
      "</a>" +
      '<a href="' +
      project.githubLink +
      '" class="btn btn-sm btn-ghost" aria-label="Lihat kode GitHub ' +
      project.title +
      '" target="_blank" rel="noopener noreferrer">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.395-.135-.345-.72-1.395-1.23-1.665-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>' +
      "GitHub" +
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>' +
      "</a>" +
      "</div></div></article>"
    );
  }

  function renderProjectGrid(container, projects, options) {
    if (!container) return;
    container.innerHTML = projects
      .map(function (project, index) {
        return buildProjectCard(project, index, options);
      })
      .join("");
    observeNewRevealElements(container);
  }

  function toggleProjectsExpand() {
    if (!projGrid || !projViewAllBtn) return;

    const isExpanded = projViewAllBtn.classList.contains("is-expanded");

    if (isExpanded) {
      projGrid.innerHTML = "";
      renderProjectGrid(projGrid, PROJECTS.slice(0, PROJ_VISIBLE_COUNT));
      projViewAllBtn.classList.remove("is-expanded");
      projViewAllBtn.innerHTML =
        'Lihat Semua<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    } else {
      const currentProjects = projGrid.querySelectorAll(".project-card").length;
      const additionalProjects = PROJECTS.slice(currentProjects);
      
      additionalProjects.forEach(function (project, index) {
        const actualIndex = currentProjects + index;
        const cardHtml = buildProjectCard(project, actualIndex, { animate: true, enter: true, delay: index });
        projGrid.insertAdjacentHTML("beforeend", cardHtml);
      });
      
      observeNewRevealElements(projGrid);
      projViewAllBtn.classList.add("is-expanded");
      projViewAllBtn.innerHTML =
        'Sembunyikan<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
  }

  if (projGrid && PROJECTS.length) {
    renderProjectGrid(projGrid, PROJECTS.slice(0, PROJ_VISIBLE_COUNT));

    if (projViewAllBtn) {
      projViewAllBtn.addEventListener("click", toggleProjectsExpand);
    }
  }

  /* ── Certificates ── */
  /*
   * Tambah sertifikat baru: salin objek di bawah, isi data, ganti certificateLink.
   * thumbnailLink opsional — kosongkan untuk gradient otomatis, atau isi URL gambar preview.
   */
  const CERTIFICATE_LINK_PLACEHOLDER = "MASUKKAN_LINK_GOOGLE_DRIVE_DISINI";

  const CERTIFICATES = [
    {
      id: "revou-software-engineering",
      title: "Sertifikat Software Engineering",
      issuer: "RevoU",
      category: "Training",
      year: "2025",
      certificateLink: "https://drive.google.com/file/d/1XvHwVDq54qg4r2Oag_3IpL4aPcVd-uXR/view?usp=drivesdk",
      thumbnailLink: "",
    },
    {
      id: "revou-data-analytics",
      title: "Sertifikat Data Analytics",
      issuer: "RevoU",
      category: "Training",
      year: "2025",
      certificateLink: "https://drive.google.com/file/d/1ILrwdEhnVH-apyS6HA_BSREbroOl07xI/view?usp=drivesdk",
      thumbnailLink: "",
    },
    {
      id: "bimtech-microsoft-office",
      title: "Sertifikat Kompetensi Microsoft Office dan Pengoperasian Internet",
      issuer: "BIMTECH Education",
      category: "Certificate",
      year: "2024",
      certificateLink: "https://drive.google.com/file/d/1LIEYVxedKU04dLzn80_6AzrS56JtyD37/view?usp=drivesdk",
      thumbnailLink: "",
    },
    {
      id: "toefl-preparation",
      title: "Sertifikat TOEFL Preparation Test",
      issuer: "TOEFL Preparation",
      category: "Certificate",
      year: "2024",
      certificateLink: "https://drive.google.com/file/d/1eGZh7XCOeKem3q3vRAXdV7kushKh1STt/view?usp=drivesdk",
      thumbnailLink: "",
    },
    {
      id: "snistik-pemakalah",
      title: "Sertifikat Sebagai Pemakalah di SNISTIK",
      issuer: "SNISTIK",
      category: "Certificate",
      year: "2023",
      certificateLink: "https://drive.google.com/file/d/1Yg8-Dqin93elfuHSA6noZ5BxEFb849vM/view?usp=drivesdk",
      thumbnailLink: "",
    },
    {
      id: "talenesia-admin-hr",
      title: "Sertifikat Pelatihan Dasar Admin HR",
      issuer: "Talenesia",
      category: "Training",
      year: "2024",
      certificateLink: "https://drive.google.com/file/d/1KBFpsTSZ3jgWRVhqTygwWldPPBbsT4WV/view?usp=drivesdk",
      thumbnailLink: "",
    },
    {
      id: "growia-data-analysis",
      title: "Sertifikat Pengantar Analisis Data",
      issuer: "GROWIA",
      category: "Training",
      year: "2024",
      certificateLink: "https://drive.google.com/file/d/1quh8q8q4T7h7WMeWrKR76a6SWXuVmitW/view?usp=drivesdk",
      thumbnailLink: "",
    },
    {
      id: "canva-training",
      title: "Sertifikat Pelatihan CANVA",
      issuer: "CANVA",
      category: "Training",
      year: "2024",
      certificateLink: "https://drive.google.com/file/d/1aIqzUcfc3VGEA_o0fwPQ1ihf-xmyU37L/view?usp=drivesdk",
      thumbnailLink: "",
    },
  ];

  const CERT_VISIBLE_COUNT = 6;
  const certGrid = document.getElementById("certificates-grid");
  const certViewAllBtn = document.getElementById("cert-view-all-btn");
  const certViewerModal = document.getElementById("cert-viewer-modal");
  const certViewerIframe = document.getElementById("cert-viewer-iframe");
  const certViewerTitle = document.getElementById("cert-viewer-title");
  const certViewerIssuer = document.getElementById("cert-viewer-issuer");
  const certViewerPlaceholder = document.getElementById("cert-viewer-placeholder");
  const certViewerOpenDrive = document.getElementById("cert-viewer-open-drive");

  const certIconSvg =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    "</svg>";

  const certBtnSvg =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
    '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
    "</svg>";

  function extractDriveFileId(link) {
    if (!link) return null;
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /\/d\/([a-zA-Z0-9_-]+)/,
      /[?&]id=([a-zA-Z0-9_-]+)/,
    ];
    for (let i = 0; i < patterns.length; i++) {
      const match = link.match(patterns[i]);
      if (match) return match[1];
    }
    return null;
  }

  function isCertificateLinkReady(link) {
    return Boolean(link && link !== CERTIFICATE_LINK_PLACEHOLDER && link.trim() !== "");
  }

  function getDrivePreviewUrl(link) {
    const fileId = extractDriveFileId(link);
    if (fileId) {
      return "https://drive.google.com/file/d/" + fileId + "/preview";
    }
    return link;
  }

  function getDriveThumbnailUrl(link) {
    const fileId = extractDriveFileId(link);
    if (fileId) {
      return "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w600";
    }
    return "";
  }

  function getCategoryClass(category) {
    return category === "Certificate" ? "cert-tag--certificate" : "cert-tag--training";
  }

  function buildCertThumbnail(cert, index) {
    const thumbIndex = (index % 8) + 1;
    const thumbFromLink = cert.thumbnailLink || getDriveThumbnailUrl(cert.certificateLink);
    let thumbHtml = "";

    if (thumbFromLink && isCertificateLinkReady(cert.certificateLink)) {
      thumbHtml =
        '<img src="' + thumbFromLink + '" alt="" class="cert-thumb-img" loading="lazy">';
    } else {
      thumbHtml = '<div class="cert-thumb-bg cert-thumb-bg--' + thumbIndex + '"></div>';
    }

    return (
      '<div class="cert-thumb">' +
      thumbHtml +
      '<div class="cert-thumb-icon">' +
      certIconSvg +
      "</div></div>"
    );
  }

  function buildCertCard(cert, index, options) {
    const opts = options || {};
    const revealClass = opts.animate !== false ? " reveal" : "";
    const enterClass = opts.enter ? " cert-card--enter" : "";
    const delay = opts.delay !== undefined ? opts.delay : index;
    const delayAttr = opts.animate !== false ? ' data-delay="' + delay + '"' : "";
    const styleAttr = opts.enter ? ' style="animation-delay:' + delay * 80 + 'ms"' : "";

    return (
      '<article class="cert-card glass' +
      revealClass +
      enterClass +
      '" data-cert-id="' +
      cert.id +
      '"' +
      delayAttr +
      styleAttr +
      ">" +
      buildCertThumbnail(cert, index) +
      '<div class="cert-body">' +
      '<span class="cert-issuer">' +
      cert.issuer +
      "</span>" +
      "<h3>" +
      cert.title +
      "</h3>" +
      '<div class="cert-meta">' +
      '<span class="cert-tag ' +
      getCategoryClass(cert.category) +
      '">' +
      cert.category +
      "</span>" +
      '<span class="cert-date">' +
      cert.year +
      "</span>" +
      "</div></div>" +
      '<button type="button" class="btn btn-sm btn-outline cert-btn" data-cert-view="' +
      cert.id +
      '">' +
      certBtnSvg +
      "Lihat Sertifikat</button></article>"
    );
  }

  function observeNewRevealElements(container) {
    if (!container) return;
    container.querySelectorAll(".reveal:not(.visible)").forEach(function (el) {
      revealObserver.observe(el);
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

  function renderCertificateGrid(container, certs, options) {
    if (!container) return;
    container.innerHTML = certs
      .map(function (cert, index) {
        return buildCertCard(cert, index, options);
      })
      .join("");
    bindCertViewButtons(container);
    observeNewRevealElements(container);
  }

  function bindCertViewButtons(container) {
    container.querySelectorAll("[data-cert-view]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const certId = btn.getAttribute("data-cert-view");
        const cert = CERTIFICATES.find(function (item) {
          return item.id === certId;
        });
        if (cert) openCertViewer(cert);
      });
    });
  }

  function toggleCertificatesExpand() {
    if (!certGrid || !certViewAllBtn) return;

    const isExpanded = certViewAllBtn.classList.contains("is-expanded");

    if (isExpanded) {
      certGrid.innerHTML = "";
      renderCertificateGrid(certGrid, CERTIFICATES.slice(0, CERT_VISIBLE_COUNT));
      certViewAllBtn.classList.remove("is-expanded");
      certViewAllBtn.setAttribute("aria-expanded", "false");
      certViewAllBtn.innerHTML =
        'Lihat Semua Sertifikat<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    } else {
      const currentCerts = certGrid.querySelectorAll(".cert-card").length;
      const additionalCerts = CERTIFICATES.slice(currentCerts);
      
      additionalCerts.forEach(function (cert, index) {
        const actualIndex = currentCerts + index;
        const cardHtml = buildCertCard(cert, actualIndex, { animate: true, enter: true, delay: index });
        certGrid.insertAdjacentHTML("beforeend", cardHtml);
      });
      
      bindCertViewButtons(certGrid);
      observeNewRevealElements(certGrid);
      certViewAllBtn.classList.add("is-expanded");
      certViewAllBtn.setAttribute("aria-expanded", "true");
      certViewAllBtn.innerHTML =
        'Sembunyikan Sertifikat<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
  }

  function openCertViewer(cert) {
    if (!certViewerModal) return;

    certViewerTitle.textContent = cert.title;
    certViewerIssuer.textContent = cert.issuer;

    if (isCertificateLinkReady(cert.certificateLink)) {
      certViewerIframe.hidden = false;
      certViewerPlaceholder.hidden = true;
      certViewerIframe.src = getDrivePreviewUrl(cert.certificateLink);
      if (certViewerOpenDrive) {
        certViewerOpenDrive.href = cert.certificateLink;
        certViewerOpenDrive.hidden = false;
      }
    } else {
      certViewerIframe.hidden = true;
      certViewerIframe.src = "";
      certViewerPlaceholder.hidden = false;
      if (certViewerOpenDrive) {
        certViewerOpenDrive.hidden = true;
      }
    }

    certViewerModal.classList.add("is-open");
    certViewerModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeCertViewer() {
    if (!certViewerModal) return;

    certViewerModal.classList.remove("is-open");
    certViewerModal.setAttribute("aria-hidden", "true");
    certViewerIframe.src = "";
    document.body.style.overflow = "";
  }

  if (certGrid && CERTIFICATES.length) {
    renderCertificateGrid(certGrid, CERTIFICATES.slice(0, CERT_VISIBLE_COUNT));

    if (certViewAllBtn) {
      certViewAllBtn.addEventListener("click", toggleCertificatesExpand);
    }

    document.querySelectorAll('[data-cert-close="viewer"]').forEach(function (el) {
      el.addEventListener("click", closeCertViewer);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      if (certViewerModal && certViewerModal.classList.contains("is-open")) {
        closeCertViewer();
      }
    });
  }
})();
