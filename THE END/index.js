const particlesConfig = {
  particles: {
    number: {
      value: window.innerWidth < 768 ? 80 : 160,
      density: { enable: false, value_area: 600 },
    },
    color: { value: "#ffe6a7" },
    shape: { type: "circle" },
    opacity: {
      value: 1,
      random: true,
      anim: { enable: true, speed: 1, opacity_min: 0, sync: false },
    },
    size: {
      value: 3,
      random: true,
      anim: { enable: false, speed: 4, size_min: 0.3, sync: false },
    },
    line_linked: { enable: false },
    move: {
      enable: true,
      speed: 4,
      direction: "none",
      random: true,
      straight: false,
      out_mode: "out",
      bounce: false,
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "remove" },
      resize: true,
    },
    modes: {
      repulse: { distance: 400, duration: 0.4 },
      remove: { particles_nb: 2 },
    },
  },
  retina_detect: true,
};

function isDesktop() {
  return window.innerWidth >= 900;
}

function setupHoverEffects() {
  if (isDesktop()) {
    document
      .querySelectorAll(".skill, .work, .media-placeholder")
      .forEach((card) => {
        card.addEventListener("mouseenter", function () {
          this.classList.add("cine-hover");
        });
        card.addEventListener("mouseleave", function () {
          this.classList.remove("cine-hover");
        });
      });

    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("mouseenter", function () {
        this.classList.add("cine-hover");
      });
      btn.addEventListener("mouseleave", function () {
        this.classList.remove("cine-hover");
      });
    });
  }
}

function setupHeaderSlideIn() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    document.querySelectorAll(".logo-slide-in, .nav-slide-in").forEach((el) => {
      el.classList.add("header-active");
    });
    return;
  }

  setTimeout(() => {
    const logo = document.querySelector(".logo-slide-in");
    const navBox = document.querySelector(".nav-slide-in");

    if (logo) logo.classList.add("header-active");
    if (navBox) navBox.classList.add("header-active");
  }, 100);
}

function setupHeroTitleAnimation() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const heroTitle = document.querySelector(".hero-title");

  if (!heroTitle) return;

  if (prefersReducedMotion) {
    heroTitle.classList.add("active");
    return;
  }

  setTimeout(() => {
    heroTitle.classList.add("active");

    if (!isDesktop()) {
      setTimeout(() => {
        heroTitle.classList.add("cine-hover");
        setTimeout(() => heroTitle.classList.remove("cine-hover"), 600);
      }, 400);
    }
  }, 400);
}

function setupTitleSlideAnimation() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    document.querySelectorAll(".title-slide-anim").forEach((el) => {
      el.classList.add("slide-in");
      el.classList.add("active");
    });
    return;
  }

  // ─── Observer 1: يشغّل slide-in لما العنصر يدخل الشاشة من تحت ───
  // بيستخدم rootMargin سلبي عشان يتأكد إن جزء كويس من العنصر ظاهر
  const enterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // امنع التشغيل لو العنصر فوق الـ viewport (خرج من فوق مش من تحت)
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0) return;

        el.classList.remove("slide-out");
        el.classList.add("slide-in");
        el.classList.add("active");
      });
    },
    {
      threshold: 0.3,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  // ─── Observer 2: يشغّل slide-out بس لما العنصر يخرج من أسفل الشاشة تماماً ───
  // يعني لما تسكرول للأسفل كتير وتيجي تسكرول لفوق تاني يعمل slide-in
  // أما لو العنصر اختفى من فوق (scroll للأسفل) → مش بيعمل أي حاجة
  const exitObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) return;
        const el = entry.target;
        const rect = el.getBoundingClientRect();

        // فقط لو العنصر خرج من أسفل الشاشة (rect.top > window.innerHeight)
        // يعني المستخدم سكرول للأسفل وفات العنصر لفوق → متعملش حاجة
        // يعني المستخدم سكرول للأعلى وفات العنصر لتحت → عمل slide-out
        if (rect.top > window.innerHeight) {
          el.classList.remove("slide-in");
          el.classList.remove("active");
          el.classList.add("slide-out");
        }
      });
    },
    {
      threshold: 0,
    },
  );

  const titles = document.querySelectorAll(".title-slide-anim");
  titles.forEach((el) => {
    // ابدأ بـ slide-out (مخفي)
    el.classList.add("slide-out");
    enterObserver.observe(el);
    exitObserver.observe(el);
  });
}

function setupMediaScaleAnimation() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    document.querySelectorAll(".media-scale-anim").forEach((el) => {
      el.classList.add("scale-active");
    });
    return;
  }

  const mediaObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;

        if (entry.isIntersecting) {
          el.classList.add("scale-active");
        } else {
          el.classList.remove("scale-active");
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -80px 0px" },
  );

  document
    .querySelectorAll(".media-scale-anim")
    .forEach((el) => mediaObserver.observe(el));
}

function setupScrollReveal() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    document.querySelectorAll(".reveal, .reveal-char").forEach((el) => {
      el.classList.add("active");
    });
    return;
  }

  const headline = document.querySelector(".headline");
  if (headline && !headline.dataset.split) {
    const text = headline.textContent;
    headline.textContent = "";
    text.split("").forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.className = "reveal-char";
      headline.appendChild(span);
    });
    headline.dataset.split = "done";
    headline.classList.add("with-gradient");
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;

          if (el.classList.contains("headline")) {
            const chars = el.querySelectorAll(".reveal-char");
            chars.forEach((char, i) => {
              setTimeout(() => char.classList.add("active"), i * 30);
            });
          } else {
            el.classList.add("active");

            if (!isDesktop()) {
              setTimeout(() => {
                el.classList.add("cine-hover");
                setTimeout(() => el.classList.remove("cine-hover"), 600);
              }, 400);
            }
          }

          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -50px 0px" },
  );

  document.querySelectorAll(".reveal").forEach((el) => {
    if (
      !el.classList.contains("title-slide-anim") &&
      !el.classList.contains("hero-title")
    ) {
      observer.observe(el);
    }
  });
}

function setupShimmer() {
  const logo = document.getElementById("siteLogo");
  const sectionTitles = document.querySelectorAll(".section-title");

  if (logo) {
    setInterval(() => {
      logo.classList.add("shimmer");
      setTimeout(() => logo.classList.remove("shimmer"), 1050);
    }, 3000); // this timeout is only for the shimmer animation, not the server
  }

  const shimmerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("shimmer");
          setTimeout(() => entry.target.classList.remove("shimmer"), 1050);
          shimmerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  sectionTitles.forEach((title) => shimmerObserver.observe(title));
}

function setupContactForm() {
  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector(".btn.primary");
      const originalText = submitBtn.textContent;

      // Disable button & show loading
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      const formData = new FormData(form);
      const data = {
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        message: formData.get("message"),
      };

      try {
        // Use a relative URL so it works when the site is hosted anywhere.
        // the server will always expose the contact endpoint at `/api/contact`.
        // `fetch` will automatically use the same origin the page was loaded from.
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        let result = null;
        try {
          result = await response.json();
        } catch {
          // non-JSON response
        }

        if (response.ok && result?.success) {
          alert("✅ " + (result.message || "Message sent successfully!"));
          form.reset();
        } else {
          const parts = [];
          if (result?.message) parts.push(result.message);
          if (result?.errors) {
            const errorsText = Object.values(result.errors).flat().join("\n");
            if (errorsText) parts.push(errorsText);
          }
          if (!parts.length) {
            parts.push(
              `Request failed (${response.status}). Please try again.`,
            );
          }
          const errorMsg = parts.join("\n");
          alert("❌ " + errorMsg);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("❌ Network error. Please check your connection.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      this.classList.remove("cine-hover");
      this.blur();

      const clickedElement = this;
      const tempRemoveHover = () => {
        clickedElement.classList.remove("cine-hover");
      };

      clickedElement.addEventListener("mouseenter", tempRemoveHover);
      setTimeout(() => {
        clickedElement.removeEventListener("mouseenter", tempRemoveHover);
      }, 100);

      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);

      if (target) {
        const header = document.querySelector(".site-header");
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition =
          target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerHeight - 20;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// ====== 🎬 comments CAROUSEL (✅ FIXED) ======

function setupcommentsCarousel() {
  const track = document.querySelector(".comments-carousel-track");
  const cards = document.querySelectorAll(".comment-card");
  const prevBtn = document.querySelector(".comment-prev");
  const nextBtn = document.querySelector(".comment-next");
  const dotsContainer = document.querySelector(".comments-dots");

  if (!track || !cards.length) return;

  let currentIndex = 0;
  let autoPlayInterval;
  let isTransitioning = false;

  function createDots() {
    dotsContainer.innerHTML = "";
    cards.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "comments-dot";
      dot.setAttribute("aria-label", `Go to comment ${index + 1}`);
      dot.addEventListener("click", () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  function updatecomment(smooth = true) {
    if (!smooth) {
      track.style.transition = "none";
    } else {
      track.style.transition =
        "transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1)";
    }

    const cardWidth = cards[0].offsetWidth;
    const gap = 40;
    const containerWidth = track.parentElement.offsetWidth;
    const centerOffset = containerWidth / 2 - cardWidth / 2;
    const rawOffset = centerOffset - currentIndex * (cardWidth + gap);
    const totalTrackWidth = cards.length * (cardWidth + gap) - gap;
    const minOffset = containerWidth - totalTrackWidth - centerOffset;
    const offset = Math.min(centerOffset, Math.max(minOffset, rawOffset));

    track.style.transform = `translateX(${offset}px)`;

    cards.forEach((card, index) => {
      card.classList.remove("active", "before", "after", "far");

      if (index === currentIndex) {
        card.classList.add("active");
      } else if (index === currentIndex - 1) {
        card.classList.add("before");
      } else if (index === currentIndex + 1) {
        card.classList.add("after");
      } else {
        card.classList.add("far");
      }
    });

    const dots = dotsContainer.querySelectorAll(".comments-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });

    if (!smooth) {
      requestAnimationFrame(() => {
        track.style.transition =
          "transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1)";
      });
    }
  }

  function goToSlide(index) {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex = index;
    updatecomment();

    setTimeout(() => {
      isTransitioning = false;
    }, 800);

    resetAutoPlay();
  }

  function nextSlide() {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex = (currentIndex + 1) % cards.length;
    updatecomment();

    setTimeout(() => {
      isTransitioning = false;
    }, 800);
  }

  function prevSlide() {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updatecomment();

    setTimeout(() => {
      isTransitioning = false;
    }, 800);
  }

  // على موبايل الأوتوبلاي أبطأ (6 ثواني) عشان المستخدم يقدر يقرأ براحته
  const autoPlayDelay = window.innerWidth <= 768 ? 6000 : 4000;

  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      nextSlide();
    }, autoPlayDelay);
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  });

  track.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    resetAutoPlay();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  document.addEventListener("keydown", (e) => {
    const commentSection = document.getElementById("comment");
    if (!commentSection) return;

    const rect = commentSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

    if (isVisible) {
      if (e.key === "ArrowLeft") {
        prevSlide();
        resetAutoPlay();
      } else if (e.key === "ArrowRight") {
        nextSlide();
        resetAutoPlay();
      }
    }
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoPlay();
    });
  }

  if (window.innerWidth >= 900) {
    track.addEventListener("mouseenter", stopAutoPlay);
    track.addEventListener("mouseleave", startAutoPlay);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updatecomment(false);
    }, 200);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startAutoPlay();
        } else {
          stopAutoPlay();
        }
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(track);

  createDots();
  updatecomment(false);
  startAutoPlay();

  console.log("✅ Comments Carousel Initialized!");
}

// ====== 🎬 REELS CAROUSEL (✅ FIXED) ======
function setupReelsCarousel() {
  const track = document.querySelector(".reels-carousel-track");
  const cards = document.querySelectorAll(".reel-card");
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");
  const dotsContainer = document.querySelector(".carousel-dots");

  if (!track || !cards.length) return;

  let currentIndex = 0;
  let autoPlayInterval;
  let isTransitioning = false;

  function createDots() {
    dotsContainer.innerHTML = "";
    cards.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", `Go to reel ${index + 1}`);
      dot.addEventListener("click", () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  function updateCarousel(smooth = true) {
    if (!smooth) {
      track.style.transition = "none";
    } else {
      track.style.transition =
        "transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1)";
    }

    const cardWidth = cards[0].offsetWidth;
    const gap = 40;
    const containerWidth = track.parentElement.offsetWidth;
    const centerOffset = containerWidth / 2 - cardWidth / 2;
    const rawOffset = centerOffset - currentIndex * (cardWidth + gap);
    const totalTrackWidth = cards.length * (cardWidth + gap) - gap;
    const minOffset = containerWidth - totalTrackWidth - centerOffset;
    const offset = Math.min(centerOffset, Math.max(minOffset, rawOffset));

    track.style.transform = `translateX(${offset}px)`;

    cards.forEach((card, index) => {
      card.classList.remove("active", "before", "after", "far");

      if (index === currentIndex) {
        card.classList.add("active");
      } else if (index === currentIndex - 1) {
        card.classList.add("before");
      } else if (index === currentIndex + 1) {
        card.classList.add("after");
      } else {
        card.classList.add("far");
      }
    });

    const dots = dotsContainer.querySelectorAll(".carousel-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });

    if (!smooth) {
      requestAnimationFrame(() => {
        track.style.transition =
          "transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1)";
      });
    }
  }

  function goToSlide(index) {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex = index;
    updateCarousel();

    setTimeout(() => {
      isTransitioning = false;
    }, 800);

    resetAutoPlay();
  }

  function nextSlide() {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex = (currentIndex + 1) % cards.length;
    updateCarousel();

    setTimeout(() => {
      isTransitioning = false;
    }, 800);
  }

  function prevSlide() {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCarousel();

    setTimeout(() => {
      isTransitioning = false;
    }, 800);
  }

  function startAutoPlay() {
    // على موبايل الأوتوبلاي أبطأ (6 ثواني) عشان المستخدم يقدر يشوف براحته
    const autoPlayDelay = window.innerWidth <= 768 ? 6000 : 4000;
    autoPlayInterval = setInterval(() => {
      nextSlide();
    }, autoPlayDelay);
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  });

  track.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    resetAutoPlay();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  document.addEventListener("keydown", (e) => {
    const reelsSection = document.getElementById("reels");
    if (!reelsSection) return;

    const rect = reelsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

    if (isVisible) {
      if (e.key === "ArrowLeft") {
        prevSlide();
        resetAutoPlay();
      } else if (e.key === "ArrowRight") {
        nextSlide();
        resetAutoPlay();
      }
    }
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoPlay();
    });
  }

  if (window.innerWidth >= 900) {
    track.addEventListener("mouseenter", stopAutoPlay);
    track.addEventListener("mouseleave", startAutoPlay);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateCarousel(false);
    }, 200);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startAutoPlay();
        } else {
          stopAutoPlay();
        }
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(track);

  createDots();
  updateCarousel(false);
  startAutoPlay();

  console.log("✅ Reels Carousel Initialized!");
}

// ====== 🎬 PORTFOLIO CAROUSEL ======
function setupPortfolioCarousel() {
  const track = document.querySelector(".portfolio-carousel-track");
  const cards = document.querySelectorAll(".portfolio-card");
  const prevBtn = document.querySelector(".portfolio-prev");
  const nextBtn = document.querySelector(".portfolio-next");
  const dotsContainer = document.querySelector(".portfolio-dots");

  if (!track || !cards.length) return;

  let currentIndex = 0;
  let autoPlayInterval;
  let isTransitioning = false;

  function createDots() {
    dotsContainer.innerHTML = "";
    cards.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "portfolio-dot";
      dot.setAttribute("aria-label", `Go to project ${index + 1}`);
      dot.addEventListener("click", () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  function updateCarousel(smooth = true) {
    if (!smooth) {
      track.style.transition = "none";
    } else {
      track.style.transition =
        "transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1)";
    }

    const cardWidth = cards[0].offsetWidth;
    const gap = 40;
    const containerWidth = track.parentElement.offsetWidth;
    const centerOffset = containerWidth / 2 - cardWidth / 2;
    const rawOffset = centerOffset - currentIndex * (cardWidth + gap);
    const totalTrackWidth = cards.length * (cardWidth + gap) - gap;
    const minOffset = containerWidth - totalTrackWidth - centerOffset;
    const offset = Math.min(centerOffset, Math.max(minOffset, rawOffset));

    track.style.transform = `translateX(${offset}px)`;

    cards.forEach((card, index) => {
      card.classList.remove("active", "before", "after", "far");

      if (index === currentIndex) {
        card.classList.add("active");
      } else if (index === currentIndex - 1) {
        card.classList.add("before");
      } else if (index === currentIndex + 1) {
        card.classList.add("after");
      } else {
        card.classList.add("far");
      }
    });

    const dots = dotsContainer.querySelectorAll(".portfolio-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });

    if (!smooth) {
      requestAnimationFrame(() => {
        track.style.transition =
          "transform 800ms cubic-bezier(0.34, 1.56, 0.64, 1)";
      });
    }
  }

  function goToSlide(index) {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex = index;
    updateCarousel();

    setTimeout(() => {
      isTransitioning = false;
    }, 800);

    resetAutoPlay();
  }

  function nextSlide() {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex = (currentIndex + 1) % cards.length;
    updateCarousel();

    setTimeout(() => {
      isTransitioning = false;
    }, 800);
  }

  function prevSlide() {
    if (isTransitioning) return;

    isTransitioning = true;
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCarousel();

    setTimeout(() => {
      isTransitioning = false;
    }, 800);
  }

  function startAutoPlay() {
    // على موبايل الأوتوبلاي أبطأ (6 ثواني) عشان المستخدم يقدر يشوف براحته
    const autoPlayDelay = window.innerWidth <= 768 ? 6000 : 4000;
    autoPlayInterval = setInterval(() => {
      nextSlide();
    }, autoPlayDelay);
  }

  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  });

  track.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    resetAutoPlay();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  document.addEventListener("keydown", (e) => {
    const portfolioSection = document.getElementById("portfolio");
    if (!portfolioSection) return;

    const rect = portfolioSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

    if (isVisible) {
      if (e.key === "ArrowLeft") {
        prevSlide();
        resetAutoPlay();
      } else if (e.key === "ArrowRight") {
        nextSlide();
        resetAutoPlay();
      }
    }
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoPlay();
    });
  }

  if (window.innerWidth >= 900) {
    track.addEventListener("mouseenter", stopAutoPlay);
    track.addEventListener("mouseleave", startAutoPlay);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateCarousel(false);
    }, 200);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startAutoPlay();
        } else {
          stopAutoPlay();
        }
      });
    },
    { threshold: 0.3 },
  );

  observer.observe(track);

  createDots();
  updateCarousel(false);
  startAutoPlay();

  console.log("✅ Portfolio Carousel Initialized!");
}

window.addEventListener("resize", () => {
  setupHoverEffects();
});

// ====== 🌟 INITIALIZE PARTICLES ======
function initParticles() {
  if (typeof particlesJS !== "undefined") {
    particlesJS("particles-js", particlesConfig);
    console.log("✅ Particles.js Initialized!");
  } else {
    console.warn("⚠️ Particles.js library not loaded");
  }
}

const learnMoreBtn = document.getElementById("learnMoreBtn");
const hiddenText = document.getElementById("hiddenText");
let isExpanded = false;

learnMoreBtn.addEventListener("click", function () {
  if (!isExpanded) {
    // Show text with typewriter effect
    hiddenText.classList.add("show");

    const paragraphs = hiddenText.querySelectorAll("p");
    let paragraphIndex = 0;

    learnMoreBtn.textContent = "Loading...";
    learnMoreBtn.disabled = true;

    function typeNextParagraph() {
      if (paragraphIndex >= paragraphs.length) {
        learnMoreBtn.textContent = "Show Less";
        learnMoreBtn.disabled = false;
        isExpanded = true;
        return;
      }

      const currentP = paragraphs[paragraphIndex];
      const text = currentP.textContent;
      currentP.textContent = "";
      currentP.style.display = "block";

      let charIndex = 0;

      function typeChar() {
        if (charIndex < text.length) {
          currentP.textContent += text.charAt(charIndex);
          charIndex++;
          setTimeout(typeChar, 25); // 25ms كل حرف
        } else {
          paragraphIndex++;
          setTimeout(typeNextParagraph, 150);
        }
      }

      typeChar();
    }

    setTimeout(typeNextParagraph, 300);
  } else {
    // Hide text instantly
    hiddenText.classList.remove("show");
    hiddenText.querySelectorAll("p").forEach((p) => {
      p.style.display = "none";
    });
    learnMoreBtn.textContent = "Learn More";
    isExpanded = false;
  }
});

// ====== 🔥 MAIN INITIALIZATION (✅ FIXED - No Double Init) ======
document.addEventListener("DOMContentLoaded", function () {
  setupHeaderSlideIn();
  setupMediaScaleAnimation();
  setupHeroTitleAnimation();
  setupTitleSlideAnimation();
  setupScrollReveal();
  setupHoverEffects();
  setupShimmer();
  setupContactForm();
  setupSmoothScroll();
  setupcommentsCarousel();
  setupReelsCarousel();
  setupPortfolioCarousel();
  initParticles();

  // Email card fallback: if the browser blocks mail.google.com, allow mailto
  document
    .querySelectorAll("a.contact-card-clickable[data-mailto]")
    .forEach((a) => {
      a.addEventListener("auxclick", () => {
        // no-op: keep default for middle-click
      });

      a.addEventListener("contextmenu", () => {
        // no-op: keep default right-click menu
      });

      a.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          // keep default navigation
        }
      });

      a.addEventListener("click", () => {
        // If user holds Alt key, use mailto (some users prefer local mail app)
        if (window.event && window.event.altKey) {
          const mailto = a.getAttribute("data-mailto");
          if (mailto) {
            window.location.href = mailto;
          }
        }
      });
    });

  console.log("✅ All Systems Active - Portfolio Ready with Particles!");
});
