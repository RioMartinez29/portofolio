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

  /* ── Skip welcome screen when navigating via hash (e.g. index.html#projects) ── */
  if (window.location.hash.length === 0) {
    runWelcomeScreen();
  } else {
    welcomeComplete = true;
    welcomeScreen.classList.add("is-hidden");
    welcomeScreen.setAttribute("aria-hidden", "true");
    setTimeout(function () {
      welcomeScreen.classList.add("is-removed");
    }, 10);
  }

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
  const CV_LINK_PLACEHOLDER = "https://drive.google.com/file/d/1Oz4C1wAdhrgoR-qzJ5xhMPhvHehiIq4J/view?usp=drivesdk";
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
  const PROJECTS = [
    {
      id: "project-1",
      title: "DataOps Insight",
      slug: "dataops-insight",
      detailLink: "dataops-insight.html",
      category: "Data Analytics Platform",
      badge: "🚀 Latest",
      description: "Platform internal untuk mengumpulkan, membersihkan, memvalidasi, mengelola, dan menganalisis data dari berbagai divisi perusahaan menjadi insight bisnis yang mudah dipahami.",
      type: "Enterprise Data Platform",
      tags: ["HTML", "CSS", "Bootstrap", "JavaScript", "PHP", "MySQL", "Python", "Chart.js"],
      demoLink: "https://dataopsinsight.infinityfreeapp.com",  // TODO: Ganti dengan URL Live Demo
      githubLink: "#", // TODO: Ganti dengan URL GitHub Repository
      preview: "assets/data-ops.png",
      gradientClass: "project-image-bg--1",
    },
    {
      id: "project-2",
      title: "BankTest Pro",
      slug: "bank-test-pro",
      detailLink: "bank-test-pro.html",
      category: "Banking Testing Analyst Simulation",
      badge: "⭐ Featured",
      description: "Aplikasi simulasi perbankan untuk kebutuhan Software Testing dan Quality Assurance — menguji fungsionalitas sistem perbankan dasar dalam lingkungan yang aman dan terkontrol.",
      type: "QA · Web Application",
      tags: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
      demoLink: "https://rio-bankingqa.infinityfree.io",  // TODO: Ganti dengan URL Live Demo
      githubLink: "#", // TODO: Ganti dengan URL GitHub Repository
      preview: "assets/bank-test.png",
      gradientClass: "project-image-bg--2",
    },
    {
      id: "project-3",
      title: "Smart-Excel Assistant",
      slug: "smart-excel-assistant",
      detailLink: "smart-excel-assistant.html",
      category: "Productivity Tool",
      description: "Alat bantu pengolahan data Excel berbasis web — mengubah data CSV/Excel menjadi wawasan yang kuat melalui analisis lanjutan, pivot table, dan visualisasi data.",
      type: "Project · Project Pribadi",
      tags: ["JS", "HTML", "CSS"],
      demoLink: "https://riomartinez29.github.io/Smart-Excel/",
      githubLink: "#", // TODO: Ganti dengan URL GitHub Repository
      preview: "assets/smart-excel.png",
      gradientClass: "project-image-bg--3",
    },
    {
      id: "project-4",
      title: "Website Data-Vista",
      slug: "data-vista",
      detailLink: "data-vista.html",
      category: "Dashboard System",
      description: "Website Data-Vista untuk membaca dan menyajikan data supaya lebih mudah dipahami melalui tampilan yang interaktif dan informatif.",
      type: "Project · Latihan",
      tags: ["HTML", "CSS", "JavaScript"],
      demoLink: "https://riomartinez29.github.io/data-vista/",
      githubLink: "#", // TODO: Ganti dengan URL GitHub Repository
      preview: "assets/data-vista.png",
      gradientClass: "project-image-bg--1",
    },
    {
      id: "project-5",
      title: "Project Bootcamp RevoU",
      slug: "bootcamp-revou",
      detailLink: "bootcamp-revou.html",
      category: "Bootcamp Project",
      description: "Project praktik dari bootcamp RevoU — latihan membangun aplikasi web dan mengolah data. Bagian dari proses belajar intensif saya pasca lulus kuliah.",
      type: "Bootcamp · RevoU",
      tags: ["Web Dev", "Data", "Bootcamp"],
      demoLink: "https://riomartinez29.github.io/CodingCamp-01June26-RioMartinez/",
      githubLink: "#", // TODO: Ganti dengan URL GitHub Repository
      preview: "assets/boothcamp.png",
      gradientClass: "project-image-bg--2",
    },
    {
      id: "project-6",
      title: "Website Portofolio",
      slug: "company-profile",
      detailLink: "company-profile.html",
      category: "Website Profile",
      description: "Website profil portofolio dengan sections perjalanan, project, dan laiannya. Project latihan responsive web design.",
      type: "Latihan Mandiri",
      tags: ["HTML", "CSS", "JavaScript"],
      demoLink: "https://riomartinez29.github.io",  // TODO: Ganti dengan URL Live Demo
      githubLink: "#", // TODO: Ganti dengan URL GitHub Repository
      preview: "assets/portofolio.png",
      gradientClass: "project-image-bg--3",
    },
  ];

  const projGrid = document.getElementById("projects-grid");

  function buildProjectCompactCard(project, index, options) {
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

    var badgeHtml = "";
    if (project.badge) {
      badgeHtml = '<span class="project-badge">' + project.badge + "</span>";
    }

    var detailSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/></svg>';
    var demoOutSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

    // Browser mockup URL based on project slug
    var urlText = "localhost/" + project.slug;

    // Preview image — fallback to gradient if no image
    var previewImg = project.preview
      ? '<img src="' + project.preview + '" alt="' + project.title.replace(/"/g, '&quot;') + ' preview" class="project-preview-img" loading="lazy" onerror="this.parentElement.style.background=this.parentElement.getAttribute(\'data-fallback\')">'
      : '';

    var fallbackGradient = project.gradientClass || 'project-image-bg--1';

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
      '<div class="project-preview">' +
      '<div class="browser-mockup">' +
      '<div class="browser-bar" aria-hidden="true">' +
      '<div class="browser-dots">' +
      '<span class="browser-dot browser-dot--red"></span>' +
      '<span class="browser-dot browser-dot--yellow"></span>' +
      '<span class="browser-dot browser-dot--green"></span>' +
      '</div>' +
      '<span class="browser-url">' + urlText + '</span>' +
      '</div>' +
      '<div class="browser-content" data-fallback="linear-gradient(135deg, #0ea5e9, #6366f1)">' +
      previewImg +
      '</div>' +
      '</div>' +
      badgeHtml +
      '</div>' +
      '<div class="project-body">' +
      (project.category ? '<span class="project-card-category">' + project.category + '</span>' : '') +
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
      project.detailLink +
      '" class="btn btn-sm btn-primary" aria-label="Lihat detail ' +
      project.title +
      '">' +
      detailSvg +
      "Lihat Detail" +
      "</a>" +
      '<a href="' +
      project.demoLink +
      '" class="btn btn-sm btn-outline" aria-label="Lihat demo ' +
      project.title +
      '" target="_blank" rel="noopener noreferrer">' +
      demoOutSvg +
      "Lihat Demo" +
      "</a>" +
      "</div></div></article>"
    );
  }

  function renderProjectGrid(container, projects, options) {
    if (!container) return;
    container.innerHTML = projects
      .map(function (project, index) {
        return buildProjectCompactCard(project, index, options);
      })
      .join("");
    observeNewRevealElements(container);
  }

  if (projGrid && PROJECTS.length) {
    renderProjectGrid(projGrid, PROJECTS);
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
      year: "2026",
      certificateLink: "https://drive.google.com/file/d/1XvHwVDq54qg4r2Oag_3IpL4aPcVd-uXR/view?usp=drivesdk",
      thumbnailLink: "",
    },
    {
      id: "revou-data-analytics",
      title: "Sertifikat Data Analytics",
      issuer: "RevoU",
      category: "Training",
      year: "2026",
      certificateLink: "https://drive.google.com/file/d/1ILrwdEhnVH-apyS6HA_BSREbroOl07xI/view?usp=drivesdk",
      thumbnailLink: "",
    },
    {
      id: "bimtech-microsoft-office",
      title: "Sertifikat Kompetensi Microsoft Office dan Pengoperasian Internet",
      issuer: "BIMTECH Education",
      category: "Certificate",
      year: "2026",
      certificateLink: "https://drive.google.com/file/d/1LIEYVxedKU04dLzn80_6AzrS56JtyD37/view?usp=drivesdk",
      thumbnailLink: "",
    },
    {
      id: "toefl-preparation",
      title: "Sertifikat TOEFL Preparation Test",
      issuer: "TOEFL Preparation",
      category: "Certificate",
      year: "2025",
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
      year: "2026",
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
      year: "2026",
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
  function buildCertCard(cert, index, options) {
    const opts = options || {};
    const revealClass = opts.animate !== false ? " reveal" : "";
    const enterClass = opts.enter ? " cert-card--enter" : "";
    const delay = opts.delay !== undefined ? opts.delay : index;
    const delayAttr = opts.animate !== false ? ' data-delay="' + delay + '"' : "";
    const styleAttr = opts.enter ? ' style="animation-delay:' + delay * 80 + 'ms"' : "";
    var thumbnailUrl = getDriveThumbnailUrl(cert.certificateLink) || "";

    return (
      '<article class="cert-card' +
      revealClass +
      enterClass +
      '" data-cert-id="' +
      cert.id +
      '"' +
      delayAttr +
      styleAttr +
      ">" +
      '<div class="cert-image">' +
      (thumbnailUrl
        ? '<img src="' + thumbnailUrl + '" alt="' + cert.title.replace(/"/g, '&quot;') + '" loading="lazy" onerror="this.style.display=\'none\'">'
        : '<div class="cert-image-placeholder" aria-hidden="true"></div>'
      ) +
      "</div>" +
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
      "</div>" +
      '<button type="button" class="btn btn-sm btn-outline cert-btn" data-cert-view="' +
      cert.id +
      '">' +
      certBtnSvg +
      "Lihat Sertifikat</button></div></article>"
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

  /* ──────────────────────────────────────────────
   *  PHASE 8.5 — CINEMATIC UI EXPERIENCE
   * ────────────────────────────────────────────── */

  if (reducedMotion) return;

  /* ── Skip cursor/tracking on touch devices ── */
  var isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  /* ── 1. Custom Cursor ── */
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");

  if (cursorDot && cursorRing && !isTouchDevice) {
    let mouseX = 0;
    let mouseY = 0;
    let dotX = 0;
    let dotY = 0;
    let ringX = 0;
    let ringY = 0;
    let cursorRafId = null;

    cursorDot.style.display = "block";
    cursorRing.style.display = "block";

    const hoverTargets = [
      "a",
      "button",
      ".btn",
      ".project-card",
      ".capability-card",
      ".cert-card",
      ".about-highlight",
      ".about-stat",
      ".timeline-content",
      ".certificates-view-all",
      ".cert-viewer-close",
      ".certificates-overlay-close",
    ];

    document.addEventListener(
      "mousemove",
      function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!cursorRafId) {
          cursorRafId = requestAnimationFrame(updateCursor);
        }
      },
      { passive: true }
    );

    function updateCursor() {
      cursorRafId = null;

      // Smooth follow with lerp
      dotX += (mouseX - dotX) * 0.25;
      dotY += (mouseY - dotY) * 0.25;
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      cursorDot.style.transform = "translate(" + (dotX - 3) + "px, " + (dotY - 3) + "px)";
      cursorRing.style.transform = "translate(" + (ringX - 17) + "px, " + (ringY - 17) + "px)";

      if (Math.abs(dotX - mouseX) > 0.5 || Math.abs(dotY - mouseY) > 0.5) {
        cursorRafId = requestAnimationFrame(updateCursor);
      }
    }

    // Hover detection
    var currentHovered = null;

    var btnSelector = "a, button, .btn, .certificates-view-all, .cert-viewer-close, .certificates-overlay-close";
    var cardSelector = ".project-card, .capability-card, .cert-card, .about-highlight, .about-stat, .timeline-content";

    function isMatch(el, selector) {
      return el && el.matches && el.matches(selector);
    }

    function closestMatch(el, selectors) {
      for (var i = 0; i < selectors.length; i++) {
        if (isMatch(el, selectors[i])) return selectors[i];
        if (el.parentElement && isMatch(el.parentElement, selectors[i])) return selectors[i];
      }
      return null;
    }

    document.addEventListener(
      "mouseover",
      function (e) {
        var target = e.target;
        var matched = closestMatch(target, hoverTargets);

        if (matched && currentHovered !== target) {
          currentHovered = target;
          // Reset both states
          cursorDot.classList.remove("is-hovering", "is-btn-hover");
          cursorRing.classList.remove("is-hovering", "is-btn-hover");

          if (isMatch(target, btnSelector) || (target.parentElement && isMatch(target.parentElement, btnSelector))) {
            cursorDot.classList.add("is-btn-hover");
            cursorRing.classList.add("is-btn-hover");
          } else {
            cursorDot.classList.add("is-hovering");
            cursorRing.classList.add("is-hovering");
          }
        }
      },
      { passive: true }
    );

    document.addEventListener(
      "mouseout",
      function (e) {
        var target = e.target;
        var matched = closestMatch(target, hoverTargets);

        if (matched) {
          currentHovered = null;
          cursorDot.classList.remove("is-hovering", "is-btn-hover");
          cursorRing.classList.remove("is-hovering", "is-btn-hover");
        }
      },
      { passive: true }
    );

    // Click effect
    document.addEventListener(
      "mousedown",
      function () {
        cursorDot.classList.add("is-clicking");
        cursorRing.classList.add("is-clicking");
      },
      { passive: true }
    );

    document.addEventListener(
      "mouseup",
      function () {
        cursorDot.classList.remove("is-clicking");
        cursorRing.classList.remove("is-clicking");
      },
      { passive: true }
    );

    // Hide cursor on window blur
    document.addEventListener(
      "mouseleave",
      function () {
        cursorDot.style.opacity = "0";
        cursorRing.style.opacity = "0";
      },
      { passive: true }
    );

    document.addEventListener(
      "mouseenter",
      function () {
        cursorDot.style.opacity = "1";
        cursorRing.style.opacity = "1";
      },
      { passive: true }
    );
  }

  /* ── 2. Parallax Background Glow ── */
  const glow1 = document.querySelector(".bg-glow--1");
  const glow2 = document.querySelector(".bg-glow--2");

  if ((glow1 || glow2) && !isTouchDevice) {
    let parX = 0;
    let parY = 0;
    let parRafId = null;

    document.addEventListener(
      "mousemove",
      function (e) {
        var xFactor = (e.clientX / window.innerWidth - 0.5) * 2;
        var yFactor = (e.clientY / window.innerHeight - 0.5) * 2;
        parX = xFactor * 60;
        parY = yFactor * 60;

        if (!parRafId) {
          parRafId = requestAnimationFrame(updateParallax);
        }
      },
      { passive: true }
    );

    function updateParallax() {
      parRafId = null;
      if (glow1) {
        glow1.style.transform = "translate(" + parX + "px, " + parY + "px)";
      }
      if (glow2) {
        glow2.style.transform = "translate(" + -parX * 0.5 + "px, " + -parY * 0.5 + "px)";
      }
    }
  }

  /* ── 3. Global Mouse Glow ── */
  var mouseGlow = document.querySelector(".mouse-glow");

  if (mouseGlow && !isTouchDevice) {
    var mgX = 0;
    var mgY = 0;
    var mgRafId = null;

    mouseGlow.style.display = "block";

    document.addEventListener(
      "mousemove",
      function (e) {
        mgX = e.clientX;
        mgY = e.clientY;

        if (!mgRafId) {
          mgRafId = requestAnimationFrame(updateMouseGlow);
        }
      },
      { passive: true }
    );

    function updateMouseGlow() {
      mgRafId = null;
      mouseGlow.style.transform = "translate(" + (mgX) + "px, " + (mgY) + "px) translate(-50%, -50%)";
      // Don't recurse — RAF only fires when mousemove triggers it
    }
  }

  /* ── 4. Card Spotlight ── */
  var spotlightCards = document.querySelectorAll(
    ".project-card, .capability-card, .cert-card, .about-highlight, .about-stat, .timeline-content"
  );

  if (!isTouchDevice) {
    spotlightCards.forEach(function (card) {
      card.addEventListener(
        "mousemove",
        function (e) {
          var rect = card.getBoundingClientRect();
          var x = ((e.clientX - rect.left) / rect.width) * 100;
          var y = ((e.clientY - rect.top) / rect.height) * 100;
          card.style.setProperty("--mouse-x", x + "%");
          card.style.setProperty("--mouse-y", y + "%");
        },
        { passive: true }
      );

      card.addEventListener(
        "mouseleave",
        function () {
          card.style.setProperty("--mouse-x", "50%");
          card.style.setProperty("--mouse-y", "50%");
        },
        { passive: true }
      );
    });
  }

  /* ── 4. Magnetic Buttons ── */
  var magneticBtns = document.querySelectorAll(".btn-primary, .btn-secondary, .btn-outline");

  if (!isTouchDevice) {
    magneticBtns.forEach(function (btn) {
      btn.addEventListener(
        "mousemove",
        function (e) {
          var rect = btn.getBoundingClientRect();
          var x = e.clientX - rect.left - rect.width / 2;
          var y = e.clientY - rect.top - rect.height / 2;
          var dist = Math.sqrt(x * x + y * y);
          var maxDist = 150;
          var strength = Math.max(0, 1 - dist / maxDist) * 6;
          var angle = Math.atan2(y, x);
          var moveX = Math.cos(angle) * strength;
          var moveY = Math.sin(angle) * strength;
          btn.style.transform =
            "translate(" + moveX + "px, " + (moveY - 2) + "px)";
        },
        { passive: true }
      );

      btn.addEventListener(
        "mouseleave",
        function () {
          btn.style.transform = "";
        },
        { passive: true }
      );
    });
  }

  /* ── 5. Text Activation — Scroll-Progress Based ── */
  (function initTextActivation() {
    var els = document.querySelectorAll(".text-activate");
    if (!els.length) return;

    // Gradients for hero-title and .text-gradient spans
    var GRADIENT_MAP = {
      "hero-title": [{ r: 255, g: 255, b: 255 }, { r: 203, g: 213, b: 225 }],
      "gradient": [
        { r: 56, g: 189, b: 248 },
        { r: 129, g: 140, b: 248 },
        { r: 192, g: 132, b: 252 },
      ],
    };

    var targets = [];
    els.forEach(function (el) {
      if (el.classList.contains("hero-title")) {
        targets.push({ el: el, type: "gradient", stops: GRADIENT_MAP["hero-title"] });
      } else if (el.classList.contains("text-gradient")) {
        targets.push({ el: el, type: "gradient", stops: GRADIENT_MAP["gradient"] });
      } else {
        var c = getComputedStyle(el).color;
        var m = c.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (m) {
          targets.push({ el: el, type: "solid", r: +m[1], g: +m[2], b: +m[3] });
        }
      }
    });

    var sweepEls = document.querySelectorAll(".light-sweep");
    var sweepTriggered = new (Function.prototype.bind.call(
      typeof Set !== "undefined" ? Set : function () { this._s = []; this.has = function (v) { return this._s.indexOf(v) !== -1; }; this.add = function (v) { this._s.push(v); }; },
      null
    ))();

    var taRafId = null;
    var vh = window.innerHeight;

    function onScroll() {
      if (!taRafId) {
        taRafId = requestAnimationFrame(updateTextActivation);
      }
    }

    function updateTextActivation() {
      taRafId = null;
      vh = window.innerHeight;

      targets.forEach(function (t) {
        var rect = t.el.getBoundingClientRect();
        var total = vh + rect.height;
        var scrolled = vh - rect.top;
        var raw = Math.max(0, Math.min(1, scrolled / total));
        // Ease: fast start, smooth finish
        var eased = Math.pow(raw, 0.5);
        var alpha = Math.min(1, 0.28 + (1 - 0.28) * eased * 1.6);

        if (t.type === "solid") {
          t.el.style.color = "rgba(" + t.r + "," + t.g + "," + t.b + "," + alpha + ")";
        } else {
          var stops = t.stops
            .map(function (s) {
              return "rgba(" + s.r + "," + s.g + "," + s.b + "," + alpha + ")";
            })
            .join(",");
          t.el.style.background = "linear-gradient(135deg," + stops + ")";
          t.el.style.webkitBackgroundClip = "text";
          t.el.style.backgroundClip = "text";
          t.el.style.webkitTextFillColor = "transparent";
        }

        // Add text-shadow at high progress (>80%)
        if (alpha >= 0.85) {
          t.el.classList.add("text-highlight");
        } else {
          t.el.classList.remove("text-highlight");
        }
      });

      // Check light sweep at 70% progress
      sweepEls.forEach(function (el) {
        if (sweepTriggered.has(el)) return;
        var rect = el.getBoundingClientRect();
        var total = vh + rect.height;
        var scrolled = vh - rect.top;
        var raw = Math.max(0, Math.min(1, scrolled / total));
        if (raw >= 0.7) {
          sweepTriggered.add(el);
          var delay = parseInt(el.getAttribute("data-sweep-delay")) || 0;
          setTimeout(function () {
            el.classList.add("swept");
          }, delay);
        }
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    // Initial update
    updateTextActivation();
  })();

  /* ── 6. Progressive Section Activation ── */
  (function initProgressiveSections() {
    var secs = document.querySelectorAll("section[id]");
    if (!secs.length) return;

    var psRafId = null;
    var vh = window.innerHeight;
    var lastActiveId = "";

    function onScroll() {
      if (!psRafId) {
        psRafId = requestAnimationFrame(updateSections);
      }
    }

    function updateSections() {
      psRafId = null;
      vh = window.innerHeight;

      // Find which section is most "active" in viewport
      var bestId = "";
      var bestCoverage = 0;

      secs.forEach(function (sec) {
        var rect = sec.getBoundingClientRect();
        var visibleTop = Math.max(0, rect.top);
        var visibleBottom = Math.min(vh, rect.bottom);
        var visible = Math.max(0, visibleBottom - visibleTop);
        var coverage = visible / rect.height;

        if (coverage > bestCoverage) {
          bestCoverage = coverage;
          bestId = sec.getAttribute("id");
        }
      });

      if (bestId !== lastActiveId) {
        // Reset all
        secs.forEach(function (sec) {
          sec.classList.remove("is-active", "is-dimmed");
        });

        // Dim sections above and below
        var foundActive = false;
        var foundId = false;
        secs.forEach(function (sec) {
          var id = sec.getAttribute("id");
          if (id === bestId) {
            foundId = true;
            foundActive = true;
            sec.classList.add("is-active");
          } else if (!foundId) {
            // Sections before active — dim them
            sec.classList.add("is-dimmed");
          } else if (foundActive) {
            // Sections after active — dim them slightly if far
            var rect = sec.getBoundingClientRect();
            if (rect.top > vh + 100) {
              sec.classList.add("is-dimmed");
            }
          }
        });

        lastActiveId = bestId;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    updateSections();
  })();

  /* ── 7. Per-Line Story Highlight (About & Journey only) ── */
  /* ── 7. Per-Line Scroll Highlight (About & Journey only) ── */
  /* Each .story-line calculates its own viewport progress independently.
     Only ONE line is active: the FIRST line whose viewport progress is
     between 0 and 1. Previous lines = 100%, next lines = 0%.
     Scrolling up: active line regresses, then previous becomes active. */
  (function initStoryHighlight() {
    var sections = [
      document.getElementById("about"),
      document.getElementById("journey"),
    ];
    var vh = window.innerHeight;
    var ssRafId = null;

    function updateProgress() {
      ssRafId = null;
      vh = window.innerHeight;

      sections.forEach(function (section) {
        if (!section) return;

        var lines = section.querySelectorAll(".story-line");
        var count = lines.length;
        if (!count) return;

        // First pass: calculate each line's independent viewport progress
        var rawProgress = [];
        lines.forEach(function (el) {
          var rect = el.getBoundingClientRect();
          // 0 when line bottom enters viewport, 1 when line top reaches 15% from viewport top
          var scrollDist = vh * 0.3;
          var raw = (vh - rect.top) / scrollDist;
          raw = Math.max(0, Math.min(1, raw));
          rawProgress.push(raw);
        });

        // Find the first line (lowest index) that is in the "active" range (0 < progress < 1)
        var activeIndex = -1;
        for (var i = 0; i < count; i++) {
          if (rawProgress[i] > 0 && rawProgress[i] < 1) {
            activeIndex = i;
            break;
          }
        }

        // Apply progress: only the active line gets its calculated value
        lines.forEach(function (el, i) {
          var pct;
          if (activeIndex === -1) {
            // No line is actively in viewport — dim all or brighten based on scroll direction
            // If ALL lines have progress >= 1 (section scrolled past), brighten all
            if (rawProgress[count - 1] >= 1) {
              pct = 100;
            } else {
              pct = 0;
            }
          } else if (i < activeIndex) {
            pct = 100; // Already finished
          } else if (i > activeIndex) {
            pct = 0;   // Not yet started
          } else {
            // This is the active line — use its own viewport progress
            pct = Math.round(rawProgress[i] * 100);
          }
          el.style.setProperty("--progress", pct + "%");
        });
      });
    }

    function onScroll() {
      if (!ssRafId) {
        ssRafId = requestAnimationFrame(updateProgress);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    updateProgress();
  })();
})();
