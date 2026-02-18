(function () {
  "use strict";

  console.log("JS LOADED ✅");
  document.documentElement.classList.add("has-js");

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ── Year ── */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── Progress + navbar ── */
  const header = $("#header");
  const progressBar = $("#progressBar");

  function onScroll() {
    const doc = document.documentElement;
    const top = doc.scrollTop || document.body.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height > 0 ? (top / height) * 100 : 0;
    if (progressBar) progressBar.style.width = pct.toFixed(2) + "%";
    if (header) header.setAttribute("data-scrolled", String(top > 8));
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  /* ── Mobile drawer ── */
  const hamburger = $("#hamburger");
  const drawer = $("#drawer");

  function setDrawer(open) {
    if (!drawer || !hamburger) return;
    drawer.setAttribute("data-open", String(!!open));
    drawer.setAttribute("aria-hidden", String(!open));
    hamburger.setAttribute("aria-expanded", String(!!open));
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      setDrawer(drawer.getAttribute("data-open") !== "true");
    });
  }
  $$(".drawerLink").forEach((a) => a.addEventListener("click", () => setDrawer(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setDrawer(false);
  });
  if (drawer) {
    drawer.addEventListener("click", (e) => {
      const panel = $(".drawer__panel", drawer);
      if (panel && !panel.contains(e.target)) setDrawer(false);
    });
  }

  /* ── Smooth anchors ── */
  $$("a[href^='#']").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      setDrawer(false);
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ── Reveal animations ── */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((ent) => {
          if (ent.isIntersecting) {
            ent.target.classList.add("is-visible");
            io.unobserve(ent.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

/* ── Stage 3: Education stops ── */
const stopPoints = document.querySelectorAll(".stopPoint");
const eduTitle   = document.getElementById("eduTitle");
const eduText    = document.getElementById("eduText");
const eduGallery = document.getElementById("eduGallery");

const milestoneData = {
  "10th": {
    title: "10th — D.A.V Public School, Pokhariput",
    text: "This was my ignition point — where discipline first met ambition. I built strong academic fundamentals, like tuning an engine from scratch. Every subject added torque to my mindset and structure to my learning. The race began here, steady and controlled.",
    photos: [
      "images/10th1.jpeg",
      "images/10th2.jpeg",
      "images/10th3.jpeg"
    ]
  },
  "12th": {
    title: "12th — Bridgewell Global Public School",
    text: "Pressure increased, expectations rose — and so did my performance. Conceptual clarity became my traction through competitive terrain. Long study sessions refined my endurance and execution. This was the phase where I learned to push without losing control",
    photos: [
      "images/12th1.jpeg",
      "images/12th2.jpeg",
      "images/12th3.jpeg"
    ]
  },
  "college": {
    title: "Current — Sikhya O Anusandhan (ITER)",
    text: "Now the race is technical — precision engineering over pure speed. I design, build, and optimize using Java, Python, and web systems. Projects are my proving grounds; debugging is my pit stop. Each semester is another lap toward mastery",
    photos: [
      "images/college1.jpeg",
      "images/college2.jpeg",
      "images/college3.jpeg",
      "images/college4.jpeg"
    ]
  }
};


function renderGallery(srcs = []) {
  if (!eduGallery) return;
  eduGallery.innerHTML = "";

  srcs.forEach((src) => {
    const div = document.createElement("div");
    div.className = "gph";

    const img = document.createElement("img");
    img.src = src;
    img.alt = "Education photo";
    img.loading = "lazy";

    img.onerror = () => {
      console.error("❌ Image not found:", src);
      div.style.display = "grid";
      div.style.placeItems = "center";
      div.style.color = "#888";
      div.textContent = "Image missing";
    };

    div.appendChild(img);
    eduGallery.appendChild(div);
  });
}


function setActiveStop(key) {
  const data = milestoneData[key];
  if (!data) return;

  // highlight selected stop
  stopPoints.forEach((p) => {
    const active = p.dataset.stop === key;
    p.setAttribute("stroke", active ? "#e00" : "#1a1a1a");
    p.setAttribute("stroke-width", active ? "4" : "3");
  });

  // update panel
  if (eduTitle) eduTitle.textContent = data.title;
  if (eduText) eduText.textContent = data.text;
  renderGallery(data.photos);
}

// attach clicks
stopPoints.forEach((pt) => {
  pt.style.pointerEvents = "all"; // ✅ ensure SVG element receives events
  pt.addEventListener("click", () => setActiveStop(pt.dataset.stop));
});

// default (so right panel is never blank)
setActiveStop("10th");

  /* ── Stage 4: Skill wheel ── */
  const wheelEl = $("#wheel");
  const skillTitle = $("#skillTitle");
  const skillDesc = $("#skillDesc");
  const skillTags = $("#skillTags");
  const segs = $$(".seg");

  const skillsData = {
    Python: {
      desc:
        "Exploring Python for AI, automation, and problem-solving fundamentals. Comfortable with core syntax, loops, functions, and basic data structures. Using it as a stepping stone toward machine learning and data-oriented projects.",
      tags: ["AI/ML", "Automation", "DSA", "Problem Solving"]
    },
    Java: {
      desc:
        "Primary programming language and academic foundation at ITER. Focused on OOP, data structures, and performance optimization for game logic. Building text-based RPG systems and research-oriented development using Java.",
      tags: ["OOP", "DSA", "Game Logic", "RPG Systems"]
    },
    JavaScript: {
      desc:
        "Used for adding interactivity and dynamic behavior in web projects. Implemented animations, UI logic, and DOM manipulation in portfolio builds. Continuously improving ES6 concepts and event-driven programming skills.",
      tags: ["DOM", "ES6", "Animations", "UI Logic"]
    },
    HTML: {
      desc:
        "Structured multiple portfolio and storytelling-based web projects. Focused on semantic markup and clean document hierarchy. Comfortable designing multi-section responsive layouts.",
      tags: ["Semantic", "Layouts", "Responsive", "SEO"]
    },
    CSS: {
      desc:
        "Handled styling, positioning, and animations for interactive portfolio sites. Worked with transitions, transforms, and custom UI components. Improving responsive design and visual polish techniques.",
      tags: ["Animations", "Transforms", "Responsive", "UI Polish"]
    },
    Django: {
      desc:
        "Used Django for backend integration in portfolio website development. Managed static files, templates, routing, and admin configurations. Learning full-stack integration including deployment troubleshooting.",
      tags: ["Templates", "ORM", "Admin", "Deployment"]
    },
    Assembly: {
      desc:
        "Studied to understand low-level architecture and memory management concepts. Gained insight into CPU instructions, registers, and execution flow. Strengthened understanding of how high-level code translates to machine operations.",
      tags: ["Memory", "CPU", "Registers", "Low-Level"]
    },
    Backend: {
      desc:
        "Understanding server logic, database interaction, and application flow. Learning REST concepts, authentication basics, and deployment practices. Focused on building scalable foundations for future full-stack and AI systems.",
      tags: ["REST", "Auth", "Deployment", "Scalability"]
    }
  };

  function setSkill(name) {
    const data = skillsData[name];
    if (!data) return;

    if (skillTitle) skillTitle.textContent = name;
    if (skillDesc) skillDesc.textContent = data.desc;

    if (skillTags) {
      skillTags.innerHTML = "";
      data.tags.forEach((t) => {
        const s = document.createElement("span");
        s.className = "tag";
        s.textContent = t;
        skillTags.appendChild(s);
      });
    }
  }

  if (wheelEl) {
    wheelEl.addEventListener("mouseenter", () => {
      wheelEl.style.animationPlayState = "paused";
    });
    wheelEl.addEventListener("mouseleave", () => {
      wheelEl.style.animationPlayState = "running";
    });
  }

  segs.forEach((seg) => {
    seg.addEventListener("click", (e) => {
      e.stopPropagation();
      setSkill(seg.getAttribute("data-skill"));
    });
  });

  setSkill("Python");

  /* ── Stage 5: Form validation ── */
  const form = $("#contactForm");
  const successBox = $("#successBox");

  function emailOk(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || "").trim());
  }

  function setBad(fieldId, bad) {
    const el = $(fieldId);
    if (!el) return;
    el.setAttribute("data-bad", String(!!bad));
  }

  function validate() {
    const name = $("#name")?.value.trim() || "";
    const email = $("#email")?.value.trim() || "";
    const msg = $("#message")?.value.trim() || "";

    const badName = name.length < 2;
    const badEmail = !emailOk(email);
    const badMsg = msg.length < 10;

    setBad("#fName", badName);
    setBad("#fEmail", badEmail);
    setBad("#fMsg", badMsg);

    return !(badName || badEmail || badMsg);
  }

  if (form) {
    form.addEventListener("input", () => {
      if (successBox) successBox.setAttribute("data-show", "false");
      validate();
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!validate()) {
        const firstBad = $(".field[data-bad='true'] input, .field[data-bad='true'] textarea");
        if (firstBad) firstBad.focus();
        return;
      }

      if (successBox) successBox.setAttribute("data-show", "true");
    });
  }
})();
