const revealItems = document.querySelectorAll("[data-reveal]");
const counters = document.querySelectorAll("[data-count]");
const glow = document.querySelector(".cursor-glow");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const typeTargets = document.querySelectorAll(".hero h1");
const wordRevealTargets = document.querySelectorAll(".section-heading h2, .contact h2");

const prepareTyping = () => {
  if (prefersReducedMotion) return;

  typeTargets.forEach((target) => {
    target.dataset.fullText = target.textContent.trim();
    target.textContent = "";
    target.classList.add("typing-ready");
  });
};

const prepareWordReveal = () => {
  if (prefersReducedMotion) return;

  wordRevealTargets.forEach((target) => {
    const words = target.textContent.trim().split(/\s+/);
    target.textContent = "";
    target.classList.add("word-reveal");

    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.className = "word";
      span.textContent = word;
      span.style.setProperty("--word-index", index);
      target.append(span, " ");
    });
  });
};

const typeText = (target) => {
  if (prefersReducedMotion || target.dataset.typed === "true" || !target.dataset.fullText) return;

  const chars = Array.from(target.dataset.fullText || "");
  let index = 0;
  target.dataset.typed = "true";
  target.classList.add("is-typing");

  const tick = () => {
    target.textContent = chars.slice(0, index).join("");
    index += 1;

    if (index <= chars.length) {
      window.setTimeout(tick, 24);
    } else {
      target.classList.remove("is-typing");
      target.classList.add("typing-done");
    }
  };

  tick();
};

prepareTyping();
prepareWordReveal();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        typeText(entry.target);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 45, 240)}ms`;
  revealObserver.observe(item);
});

const animateCounter = (counter) => {
  const target = Number(counter.dataset.count);
  const duration = 1100;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.floor(target * eased);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      counter.textContent = target;
    }
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.45 }
);

counters.forEach((counter) => counterObserver.observe(counter));

window.addEventListener("pointermove", (event) => {
  if (!glow) return;
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});
