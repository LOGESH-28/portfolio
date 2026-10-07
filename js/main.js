(() => {
  const C = window.CONFIG || {};
  const PROJECTS = window.PROJECTS || [];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animate = !!(window.gsap && window.ScrollTrigger) && !reduceMotion;

  /* ── Links from CONFIG ─────────────────────────────────────── */
  $$("[data-link]").forEach((a) => {
    const key = a.dataset.link;
    const value = C[key];
    if (!value) return (a.closest("[data-link-wrap]") || a).remove();
    a.href = key === "email" ? `mailto:${value}` : key === "phone" ? `tel:${value}` : value;
    if (key === "email" && !a.hasAttribute("data-icon-only")) a.textContent = value;
    if (key === "phone") a.textContent = C.phoneLabel || value;
  });
  $(".js-year").textContent = new Date().getFullYear();

  if (animate) document.documentElement.classList.add("anim");

  /* ── Projects (rendered from js/data.js) ───────────────────── */
  const ICONS = {
    enterprise: '<svg viewBox="0 0 24 24"><path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/></svg>',
    research: '<svg viewBox="0 0 24 24"><circle cx="5" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 7l3.3 3.6M7 17l3.3-3.6M13.7 10.6L17 7M13.7 13.4L17 17"/></svg>',
    genai: '<svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z"/><path d="M12 8.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z"/></svg>',
  };
  const ARROW = '<svg viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg>';
  const pad = (n) => String(n).padStart(2, "0");
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const cardHTML = ({ p, i }) => `
    <article class="h-card project">
      <div class="project__visual" data-cat="${p.cat}">
        <div class="project__inner"><span class="project__glyph">${ICONS[p.cat]}</span></div>
        <span class="project__num">${pad(i + 1)}</span>
        <span class="project__org">${esc(p.org)}</span>
      </div>
      <div class="project__body">
        <h3>${esc(p.title)}</h3>
        <div class="chips">${p.stack.map((t) => `<span>${esc(t)}</span>`).join("")}</div>
        <ul class="project__points">${p.points.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        ${p.link ? `<a class="project__link link-underline" href="${esc(p.link)}" target="_blank" rel="noopener">${esc(p.linkLabel || "View project")} ${ARROW}</a>` : ""}
      </div>
    </article>`;

  const indexed = PROJECTS.map((p, i) => ({ p, i }));
  const filterList = (f) => (f === "all" ? indexed : indexed.filter((x) => x.p.cat === f));
  const projectTrack = $("#project-slides");
  projectTrack.innerHTML = indexed.map(cardHTML).join("");
  $$(".filter").forEach((b) => (b.querySelector("sup").textContent = filterList(b.dataset.filter).length));
  $$("[data-hscroll]").forEach((stage) => ($(".js-total", stage).textContent = pad($$(".h-card", stage).length)));

  // Filled in by setupScrollAnimations(): one controller per [data-hscroll] stage
  const hScrolls = new Map();

  $$(".filter").forEach((btn) =>
    btn.addEventListener("click", () => {
      if (btn.classList.contains("is-active")) return;
      $$(".filter").forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", on);
      });
      const stage = projectTrack.closest("[data-hscroll]");
      const swap = () => {
        projectTrack.innerHTML = filterList(btn.dataset.filter).map(cardHTML).join("");
        $(".js-total", stage).textContent = pad(projectTrack.children.length);
      };
      const ctrl = hScrolls.get(stage);
      if (!animate || !ctrl) return swap();
      gsap.to(projectTrack.children, {
        y: 24, opacity: 0, duration: 0.3, stagger: 0.03, ease: "power2.in",
        onComplete: () => {
          swap();
          ScrollTrigger.refresh();
          // jump back to the start of the pinned stretch so the new list starts at card 1
          if (lenis) lenis.scrollTo(ctrl.st.start, { immediate: true });
          else window.scrollTo(0, ctrl.st.start);
          ctrl.sync();
          gsap.from(projectTrack.children, { y: 40, opacity: 0, duration: 0.7, stagger: 0.06, ease: "power3.out", clearProps: "transform,opacity" });
        },
      });
    })
  );

  /* ── Smooth scroll (Lenis) ─────────────────────────────────── */
  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    if (animate) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  const scrollToTarget = (target) => {
    if (lenis) lenis.scrollTo(target, { offset: target === 0 ? 0 : -70, duration: 1.4 });
    else if (target === 0) window.scrollTo({ top: 0, behavior: "smooth" });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  /* ── Header, nav, back-to-top ──────────────────────────────── */
  const header = $(".site-header");
  const toTop = $(".to-top");
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 40);
    toTop.classList.toggle("is-visible", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const burger = $(".burger");
  const closeNav = () => { document.body.classList.remove("nav-open"); burger.setAttribute("aria-expanded", "false"); };
  burger.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    burger.setAttribute("aria-expanded", open);
  });

  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id === "#") return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      closeNav();
      scrollToTarget(id === "#home" ? 0 : target);
    })
  );
  toTop.addEventListener("click", () => scrollToTarget(0));

  /* ── Contact form (delivered by FormSubmit; mailto as fallback) ─ */
  $(".contact__form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const note = $(".form-note", form);
    const button = $('button[type="submit"]', form);
    const say = (msg, kind = "") => { note.textContent = msg; note.className = `form-note ${kind && `is-${kind}`}`; };

    if (!form.checkValidity()) {
      say("Please fill in your name, a valid e-mail and a message.", "error");
      return form.reportValidity();
    }
    const d = Object.fromEntries(new FormData(form));
    if (d._honey) return; // bot filled the hidden field
    const subject = d.subject || `Portfolio enquiry from ${d.name}`;
    const mailto = () => {
      const body = `${d.message}\n\n— ${d.name} (${d.email})`;
      location.href = `mailto:${C.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    if (!C.formEndpoint) return mailto();

    button.disabled = true;
    button.textContent = "Sending…";
    say("");
    try {
      const res = await fetch(C.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: d.name,
          email: d.email,
          subject,
          message: d.message,
          _subject: `Portfolio: ${subject}`,
          _replyto: d.email,
          _template: "table",
          _captcha: "false",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || String(json.success) === "false") throw new Error(json.message || res.statusText);
      form.reset();
      say("Thanks! Your message has been sent — I'll get back to you soon.", "success");
    } catch (err) {
      say("Couldn't send right now. Opening your mail app instead…", "error");
      setTimeout(mailto, 900);
    } finally {
      button.disabled = false;
      button.textContent = "Send Message";
    }
  });

  /* ── No animation path ─────────────────────────────────────── */
  const loader = $(".loader");
  if (!animate) {
    loader && loader.remove();
    return;
  }

  /* ── Animation helpers ─────────────────────────────────────── */
  gsap.registerPlugin(ScrollTrigger);

  const splitLines = (el) => {
    if (!window.SplitType) return [el];
    const split = new SplitType(el, { types: "lines", lineClass: "line" });
    split.lines.forEach((line) => {
      const mask = document.createElement("div");
      mask.className = "line-mask";
      line.parentNode.insertBefore(mask, line);
      mask.appendChild(line);
    });
    return split.lines;
  };
  const onEnter = (trigger, start = "top 88%") => ({ trigger, start, once: true });

  /* ── Loader → hero intro ───────────────────────────────────── */
  const heroIntro = () => {
    const lines = splitLines($(".hero__title"));
    return gsap.timeline()
      .from(lines, { yPercent: 110, duration: 1.1, ease: "power4.out", stagger: 0.12 })
      .from(".hero__eyebrow", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, 0.1)
      .from(".hero__hello strong", { backgroundSize: "0% 100%", duration: 0.9, ease: "power3.inOut" }, 0.7)
      .from([".hero__lead", ".hero__actions"], { y: 30, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.1 }, 0.35)
      .from(".portrait", { y: 80, opacity: 0, duration: 1.2, ease: "power3.out" }, 0.1)
      .from(".hero__visual .shape", { scale: 0, opacity: 0, duration: 0.9, ease: "back.out(1.7)", stagger: 0.08 }, 0.3)
      .from(".hero__bar", { scaleX: 0, duration: 1.2, ease: "power4.inOut" }, 0.4)
      .from(".site-header", { yPercent: -100, opacity: 0, duration: 0.8, ease: "power3.out", clearProps: "transform,opacity" }, 0.2);
  };

  const runIntro = () => {
    lenis && lenis.stop();
    const letters = $$(".loader__word span");
    gsap.timeline({ onComplete: () => { loader.remove(); lenis && lenis.start(); ScrollTrigger.refresh(); } })
      .to(letters, { color: "#d4ff6a", duration: 0.22, stagger: 0.16, ease: "none" })
      .to(letters, { color: "#2b2b30", duration: 0.22, stagger: 0.16, ease: "none" }, 0.24)
      .to(letters, { color: "#d4ff6a", duration: 0.3, stagger: 0.03 })
      .to(".loader__word", { yPercent: -40, opacity: 0, duration: 0.5, ease: "power2.in" }, "+=.15")
      .to(loader, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "-=.2")
      .add(heroIntro(), "-=.5");
  };

  const ready = Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => setTimeout(r, 1500))]);
  ready.then(() => {
    runIntro();
    setupScrollAnimations();
  });

  /* ── Scroll animations ─────────────────────────────────────── */
  function setupScrollAnimations() {
    // Hero stays pinned while the About panel slides over it
    gsap.matchMedia().add("(min-width: 901px) and (min-height: 620px)", () => {
      ScrollTrigger.create({ trigger: ".hero", start: "top top", end: "bottom top", pin: true, pinSpacing: false });
      gsap.to(".hero__inner", {
        scale: 0.92, yPercent: -6, opacity: 0.3, ease: "none",
        scrollTrigger: { trigger: ".about", start: "top bottom", end: "top top", scrub: true },
      });
    });

    // Projects & Experience: pin the stage and let vertical scroll drive the cards sideways.
    // When the last card arrives the pin releases and the page continues downward.
    ScrollTrigger.config({ ignoreMobileResize: true });
    $$("[data-hscroll]").forEach((stage) => hScrolls.set(stage, horizontalScroll(stage)));

    // Floating hero shapes + gentle mouse parallax
    $$(".hero__visual .shape").forEach((s, i) =>
      gsap.to(s, { y: i % 2 ? 14 : -14, x: i % 2 ? -8 : 8, duration: 3 + i * 0.4, repeat: -1, yoyo: true, ease: "sine.inOut" })
    );
    if (matchMedia("(pointer: fine)").matches) {
      const visual = $(".hero__visual");
      const qx = gsap.quickTo(visual, "x", { duration: 0.8, ease: "power3.out" });
      const qy = gsap.quickTo(visual, "y", { duration: 0.8, ease: "power3.out" });
      $(".hero").addEventListener("mousemove", (e) => {
        qx((e.clientX / innerWidth - 0.5) * 24);
        qy((e.clientY / innerHeight - 0.5) * 24);
      });
    }

    // Line-mask heading reveals
    $$("[data-split]:not([data-split='hero'])").forEach((el) =>
      gsap.from(splitLines(el), { yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.1, scrollTrigger: onEnter(el) })
    );

    // Fade-ups
    $$("[data-fade]").forEach((el) =>
      gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: onEnter(el, "top 92%") })
    );
    $$("[data-stagger]").forEach((group) =>
      gsap.from(group.children, { y: 50, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, clearProps: "transform,opacity", scrollTrigger: onEnter(group) })
    );
    $$("[data-slide]").forEach((el) =>
      gsap.from(el, { x: el.dataset.slide === "left" ? -70 : 70, opacity: 0, duration: 1.1, ease: "power3.out", clearProps: "transform,opacity", scrollTrigger: onEnter(el) })
    );

    // Parallax cards in About
    $$("[data-parallax]").forEach((el) =>
      gsap.to(el, { y: +el.dataset.parallax, ease: "none", scrollTrigger: { trigger: ".about", start: "top bottom", end: "bottom top", scrub: true } })
    );

    // Dark panel: rounded corners tighten as it arrives (no transform — it holds a pinned stage)
    gsap.from(".experience", {
      borderRadius: 72, ease: "none",
      scrollTrigger: { trigger: ".experience", start: "top bottom", end: "top 30%", scrub: true },
    });

    // Counters
    $$("[data-count]").forEach((el) => {
      const end = parseFloat(el.dataset.count);
      const dec = +el.dataset.decimals || 0;
      const state = { v: 0 };
      el.textContent = (0).toFixed(dec);
      ScrollTrigger.create({
        ...onEnter(el, "top 92%"),
        onEnter: () => gsap.to(state, { v: end, duration: 2.2, ease: "power2.out", onUpdate: () => (el.textContent = state.v.toFixed(dec)) }),
      });
    });

    // Active nav link
    const links = $$(".nav a");
    $$("main section[id]").forEach((sec) =>
      ScrollTrigger.create({
        trigger: sec, start: "top center", end: "bottom center",
        onToggle: (st) => st.isActive && links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${sec.id}`)),
      })
    );

    window.addEventListener("load", () => ScrollTrigger.refresh());
  }

  /* ── Horizontal scroll stage ───────────────────────────────── */
  function horizontalScroll(stage) {
    const viewport = $(".h-viewport", stage);
    const track = $(".h-track", stage);
    const bar = $(".h-progress span", stage);
    const current = $(".js-current", stage);
    const total = $(".js-total", stage);
    const cards = () => [...track.children];
    const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
    const fits = () => stage.offsetHeight <= innerHeight - 90;
    let active = -1;

    // Highlight the card nearest a reference point that glides from the first card's
    // centre (progress 0) to the last card's centre (progress 1).
    const setActive = (progress) => {
      const list = cards();
      total.textContent = pad(list.length);
      bar.style.transform = `scaleX(${progress})`;
      if (!list.length) return;
      const shift = distance() * progress;
      const centre = (c) => c.offsetLeft + c.offsetWidth / 2;
      const ref = centre(list[0]) + (centre(list[list.length - 1]) - distance() - centre(list[0])) * progress;
      let best = 0;
      let bestDist = Infinity;
      list.forEach((c, i) => {
        const d = Math.abs(centre(c) - shift - ref);
        if (d < bestDist) { bestDist = d; best = i; }
      });
      if (best === active) return;
      active = best;
      list.forEach((c, i) => c.classList.toggle("is-active", i === best));
      current.textContent = pad(best + 1);
    };

    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: stage,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        start: () => (fits() ? "center center+=35" : "top top+=70"),
        end: () => `+=${distance()}`,
        onUpdate: (st) => setActive(st.progress),
        onRefresh: (st) => { active = -1; setActive(st.progress); },
      },
    });
    return { st: tween.scrollTrigger, sync: () => { active = -1; setActive(tween.scrollTrigger.progress); } };
  }
})();
