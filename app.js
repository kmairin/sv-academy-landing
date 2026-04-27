
var GOOGLE_FORM_URL = "https://forms.gle/YOUR_FORM_ID";
function applyNow() { window.open(GOOGLE_FORM_URL, "_blank"); }
function openModal() { document.getElementById("modal").style.display = "flex"; document.getElementById("modal-form").style.display = "block"; document.getElementById("modal-success").style.display = "none"; }
function closeModal() { document.getElementById("modal").style.display = "none"; }
function submitEmail(e) { e.preventDefault(); document.getElementById("modal-form").style.display = "none"; document.getElementById("modal-success").style.display = "block"; setTimeout(closeModal, 2000); }

var mobileMenuOpen = false;
function toggleMobileMenu() { mobileMenuOpen ? closeMobileMenu() : openMobileMenu(); }
function openMobileMenu() {
  mobileMenuOpen = true;
  var menuBtn = document.getElementById("mobile-menu-btn");
  var openIcon = document.getElementById("menu-icon-open");
  var closeIcon = document.getElementById("menu-icon-close");
  menuBtn.setAttribute("aria-expanded", "true");
  openIcon.style.transform = "rotate(90deg) scale(0)";
  openIcon.style.opacity = "0";
  setTimeout(function() {
    openIcon.style.display = "none";
    closeIcon.style.display = "block";
    closeIcon.style.transform = "rotate(-90deg) scale(0)";
    closeIcon.style.opacity = "0";
    requestAnimationFrame(function() {
      closeIcon.style.transition = "all 0.25s cubic-bezier(0.4,0,0.2,1)";
      closeIcon.style.transform = "rotate(0) scale(1)";
      closeIcon.style.opacity = "1";
    });
  }, 150);
  document.getElementById("mobile-menu").classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeMobileMenu() {
  mobileMenuOpen = false;
  var menuBtn = document.getElementById("mobile-menu-btn");
  var openIcon = document.getElementById("menu-icon-open");
  var closeIcon = document.getElementById("menu-icon-close");
  menuBtn.setAttribute("aria-expanded", "false");
  closeIcon.style.transform = "rotate(90deg) scale(0)";
  closeIcon.style.opacity = "0";
  setTimeout(function() {
    closeIcon.style.display = "none";
    openIcon.style.display = "block";
    openIcon.style.transform = "rotate(-90deg) scale(0)";
    openIcon.style.opacity = "0";
    requestAnimationFrame(function() {
      openIcon.style.transition = "all 0.25s cubic-bezier(0.4,0,0.2,1)";
      openIcon.style.transform = "rotate(0) scale(1)";
      openIcon.style.opacity = "1";
    });
  }, 150);
  document.getElementById("mobile-menu").classList.remove("open");
  document.body.style.overflow = "";
}
document.addEventListener("keydown", function(e) { if (e.key === "Escape") { if (mobileMenuOpen) closeMobileMenu(); if (document.getElementById("modal").style.display === "flex") closeModal(); } });

if (window.innerWidth >= 640) document.getElementById("nav-brand").style.display = "flex";
window.addEventListener("resize", function() { document.getElementById("nav-brand").style.display = window.innerWidth >= 640 ? "flex" : "none"; });

var storedTheme = null;
try { storedTheme = localStorage.getItem("sv-theme"); } catch(e){}
var currentTheme = storedTheme || (Math.random() > 0.5 ? "dark" : "light");
document.documentElement.setAttribute("data-theme", currentTheme);
updateThemeIcon();

function updateThemeIcon() {
  var isDark = document.documentElement.getAttribute("data-theme") === "dark";
  document.getElementById("theme-icon-sun").style.display = isDark ? "inline" : "none";
  document.getElementById("theme-icon-moon").style.display = isDark ? "none" : "inline";
}

function toggleTheme(e) {
  var btn = e.currentTarget;
  btn.classList.add("switching");
  setTimeout(function() { btn.classList.remove("switching"); }, 450);
  var rect = btn.getBoundingClientRect();
  var cx = rect.left + rect.width / 2;
  var cy = rect.top + rect.height / 2;
  var newTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  var reveal = document.getElementById("theme-reveal");
  var maxR = Math.ceil(Math.sqrt(Math.max(cx, window.innerWidth - cx) ** 2 + Math.max(cy, window.innerHeight - cy) ** 2));

  reveal.style.background = newTheme === "dark" ? "#0a0a12" : "#f8f9fc";
  reveal.style.clipPath = "circle(0px at " + cx + "px " + cy + "px)";
  reveal.classList.add("active");

  requestAnimationFrame(function() {
    reveal.style.transition = "clip-path 0.7s cubic-bezier(0.4, 0, 0.2, 1)";
    reveal.style.clipPath = "circle(" + maxR + "px at " + cx + "px " + cy + "px)";
  });

  setTimeout(function() {
    document.documentElement.setAttribute("data-theme", newTheme);
    currentTheme = newTheme;
    try { localStorage.setItem("sv-theme", newTheme); } catch(e){}
    updateThemeIcon();
    updateCodeRain();
    setTimeout(function() {
      reveal.classList.remove("active");
      reveal.style.transition = "none";
      reveal.style.clipPath = "";
    }, 100);
  }, 650);
}

var translations = {
  en: {
    nav_about: "About", nav_mentors: "Mentors", nav_program: "Program", nav_apply: "Apply",
    nav_join: "Join Mailing List", nav_join_full: "Join Mailing List", nav_apply_btn: "Apply Now",
    hero_badge: "Summer 2026 &middot; Limited to 10 Students",
    hero_title_1: "Build the Future,", hero_title_2: "One App at a Time.",
    hero_desc: '<strong style="color:var(--text);font-weight:500">Grade 6\u20119</strong> students design, build, and ship a real AI\u2011powered app in 5\u00a0weeks \u2014 mentored by <strong style="color:var(--text);font-weight:500">Silicon\u00a0Valley engineers</strong>.',
    stat_sat: "Saturdays", stat_stu: "Students Max", stat_app: "Real App", stat_men: "Mentors",
    cta_apply: "Apply Now", cta_join: "Join Mailing List",
    mentors_label: "Your Mentors", mentors_title: "Guided by builders,<br>not\u00a0textbooks.",
    dot_prom: "Prom", dot_march: "March", dot_charlie: "Charlie",
    prom_role: "Creative Director & Operations Lead",
    prom_tag2: "Asst. Director", prom_tag4: "Graphic Design",
    prom_bio: "Assistant Director at Lertlah School with a BA in Graphic Communication & Design from the University of Sunderland, UK. Prom leads promotional strategy, application design, and in-class creative coaching \u2014 teaching students to use AI-powered UI design tools for polished results.",
    march_role: "Technical Lead",
    march_bio: "Software Engineer at Magic Eden in San Francisco with deep expertise in Web3, distributed systems, and product engineering. Previously shipped production systems at Uniswap Labs, Amazon, and Databricks. Chulalongkorn undergrad, Johns Hopkins master\u2019s. On-site in Bangkok for all 5 sessions.",
    charlie_role: "Product, Strategy & Student Experience",
    charlie_bio: "Senior Software Engineer at Robinhood. Previously built autonomous delivery at Google X\u2019s Wing and hyper-scale infrastructure at Meta. Expert in scaling mission-critical systems for billions of users. Leads program strategy, Demo Day coaching, and student experience. On-site for all 5 sessions.",
    program_label: "The Program", program_title: "5 Saturdays.<br>1 real app.",
    program_desc: "Every Saturday 9:00 AM \u2013 12:00 PM at the Lertlah School Apple Computer Lab. Pre-configured machines, professional environment \u2014 no laptop required.",
    w1_label: "Week 1", w1_title: "The Blueprint", w1_desc: "Scope your app idea, write a Design Doc with KPIs, and deploy your first version live.",
    w2_label: "Week 2", w2_title: "Debug & Polish", w2_desc: "Mobile-first refinement, AI pair-programming, and writing tests to prevent regression.",
    w3_label: "Week 3", w3_title: "Ship & Observe", w3_desc: "Install analytics, run user testing, take feedback and iterate on your live app.",
    w4_label: "Week 4", w4_title: "Feature Sprint", w4_desc: "Add features based on real feedback, stress-test your app, and run peer critique sessions.",
    w5_label: "Week 5", w5_title: "The Keynote", w5_desc: "Build your pitch deck, final deploy, and Demo Day \u2014 parents attend at 11:00 AM.",
    workflow_label: "The Workflow", workflow_title: "Design. Build. Ship. Repeat.",
    tool1_sub: "Design", tool1_desc: "Turn your idea into a pixel-perfect UI with Google\u2019s AI design tool. No Figma skills needed.",
    tool2_sub: "Implement", tool2_desc: "AI pair-programs with you to turn designs into working React Native code, deployed live.",
    tool3_sub: "Brainstorm", tool3_desc: "Chat with Google\u2019s most advanced AI to brainstorm features, debug code, and explore ideas.",
    tool4_sub: "Deploy", tool4_desc: "Ship your app to the world on Cloudflare\u2019s edge network. Real URL, real users, real impact.",
    tool_footer: "Powered by Google Suite &middot; All tools provided in-class",
    show1_title: "Real Infrastructure,<br>Not Just Syntax",
    show1_desc: "Every student works with the same professional tools used by top tech companies \u2014 Google AI Studio, Cloudflare, and real APIs. No toy environments.",
    show2_title: "AI-Powered Design Pipeline",
    show2_desc: "From Google Stitch UI designs to Gemini-powered code generation to live deployment \u2014 students learn the complete modern app development workflow.",
    show3_title: "Demo Day:<br>Pitch Like a Founder",
    show3_desc: "On Week 5, parents attend as students present their live apps with polished pitch decks \u2014 just like real startup founders.",
    show3_btn: "Join the Summer Cohort",
    cta_title: "Reserve Your Spot", cta_sub: "Limited to 10 students per cohort. First come, first served.",
    cta_price_sub: "per student &middot; 5 sessions &middot; all materials included",
    detail_date: "Jun 13 \u2013 Jul 11", detail_date_sub: "Every Saturday",
    detail_time: "9 AM \u2013 12 PM", detail_time_sub: "3 hours / session",
    detail_grade: "Grades 6\u20139", detail_grade_sub: "Ages 11\u201315",
    detail_loc: "Lertlah School", detail_loc_sub: "Kanchanapisek Road",
    footer_text: "SV Academy &times; Lertlah School, Kanchanapisek Road &middot; Summer 2026",
    modal_title: "Stay in the Loop", modal_desc: "Get updates on enrollment, schedules, and early-bird offers.",
    modal_submit: "Join Mailing List", modal_success: "You\u2019re on the list!", modal_alt: "Or apply directly via"
  },
  th: {
    nav_about: "\u0e40\u0e01\u0e35\u0e48\u0e22\u0e27\u0e01\u0e31\u0e1a\u0e40\u0e23\u0e32", nav_mentors: "\u0e17\u0e35\u0e48\u0e1b\u0e23\u0e36\u0e01\u0e29\u0e32", nav_program: "\u0e42\u0e1b\u0e23\u0e41\u0e01\u0e23\u0e21", nav_apply: "\u0e2a\u0e21\u0e31\u0e04\u0e23",
    nav_join: "\u0e25\u0e07\u0e17\u0e30\u0e40\u0e1a\u0e35\u0e22\u0e19\u0e23\u0e31\u0e1a\u0e02\u0e48\u0e32\u0e27", nav_join_full: "\u0e25\u0e07\u0e17\u0e30\u0e40\u0e1a\u0e35\u0e22\u0e19\u0e23\u0e31\u0e1a\u0e02\u0e48\u0e32\u0e27\u0e2a\u0e32\u0e23", nav_apply_btn: "\u0e2a\u0e21\u0e31\u0e04\u0e23\u0e40\u0e25\u0e22",
    hero_badge: "\u0e0b\u0e31\u0e21\u0e40\u0e21\u0e2d\u0e23\u0e4c 2569 &middot; \u0e23\u0e31\u0e1a\u0e08\u0e33\u0e01\u0e31\u0e14\u0e40\u0e1e\u0e35\u0e22\u0e07 10 \u0e04\u0e19",
    hero_title_1: "\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e2d\u0e19\u0e32\u0e04\u0e15,", hero_title_2: "\u0e17\u0e35\u0e25\u0e30\u0e41\u0e2d\u0e1b",
    hero_desc: '\u0e19\u0e31\u0e01\u0e40\u0e23\u0e35\u0e22\u0e19<strong style="color:var(--text);font-weight:500">\u0e1b.6\u2013\u0e21.3</strong> \u0e2d\u0e2d\u0e01\u0e41\u0e1a\u0e1a, \u0e2a\u0e23\u0e49\u0e32\u0e07, \u0e41\u0e25\u0e30\u0e1b\u0e25\u0e48\u0e2d\u0e22\u0e41\u0e2d\u0e1b AI \u0e02\u0e2d\u0e07\u0e08\u0e23\u0e34\u0e07\u0e43\u0e19 5\u00a0\u0e2a\u0e31\u0e1b\u0e14\u0e32\u0e2b\u0e4c \u2014 \u0e42\u0e14\u0e22\u0e21\u0e35<strong style="color:var(--text);font-weight:500">\u0e27\u0e34\u0e28\u0e27\u0e01\u0e23\u0e08\u0e32\u0e01 Silicon Valley</strong> \u0e40\u0e1b\u0e47\u0e19\u0e17\u0e35\u0e48\u0e1b\u0e23\u0e36\u0e01\u0e29\u0e32',
    stat_sat: "\u0e27\u0e31\u0e19\u0e40\u0e2a\u0e32\u0e23\u0e4c", stat_stu: "\u0e19\u0e31\u0e01\u0e40\u0e23\u0e35\u0e22\u0e19\u0e2a\u0e39\u0e07\u0e2a\u0e38\u0e14", stat_app: "\u0e41\u0e2d\u0e1b\u0e08\u0e23\u0e34\u0e07", stat_men: "\u0e17\u0e35\u0e48\u0e1b\u0e23\u0e36\u0e01\u0e29\u0e32",
    cta_apply: "\u0e2a\u0e21\u0e31\u0e04\u0e23\u0e40\u0e25\u0e22", cta_join: "\u0e25\u0e07\u0e17\u0e30\u0e40\u0e1a\u0e35\u0e22\u0e19\u0e23\u0e31\u0e1a\u0e02\u0e48\u0e32\u0e27\u0e2a\u0e32\u0e23",
    mentors_label: "\u0e17\u0e35\u0e48\u0e1b\u0e23\u0e36\u0e01\u0e29\u0e32\u0e02\u0e2d\u0e07\u0e04\u0e38\u0e13", mentors_title: "\u0e2a\u0e2d\u0e19\u0e42\u0e14\u0e22\u0e1c\u0e39\u0e49\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e08\u0e23\u0e34\u0e07,<br>\u0e44\u0e21\u0e48\u0e43\u0e0a\u0e48\u0e41\u0e04\u0e48\u0e15\u0e33\u0e23\u0e32\u0e40\u0e23\u0e35\u0e22\u0e19",
    dot_prom: "\u0e1e\u0e23\u0e2b\u0e21", dot_march: "March", dot_charlie: "Charlie",
    prom_role: "\u0e1c\u0e39\u0e49\u0e2d\u0e33\u0e19\u0e27\u0e22\u0e01\u0e32\u0e23\u0e1d\u0e48\u0e32\u0e22\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e2a\u0e23\u0e23\u0e04\u0e4c & \u0e1a\u0e23\u0e34\u0e2b\u0e32\u0e23\u0e07\u0e32\u0e19",
    prom_tag2: "\u0e1c\u0e39\u0e49\u0e0a\u0e48\u0e27\u0e22\u0e1c\u0e39\u0e49\u0e2d\u0e33\u0e19\u0e27\u0e22\u0e01\u0e32\u0e23", prom_tag4: "\u0e01\u0e23\u0e32\u0e1f\u0e34\u0e01\u0e14\u0e35\u0e44\u0e0b\u0e19\u0e4c",
    prom_bio: "\u0e1c\u0e39\u0e49\u0e0a\u0e48\u0e27\u0e22\u0e1c\u0e39\u0e49\u0e2d\u0e33\u0e19\u0e27\u0e22\u0e01\u0e32\u0e23\u0e42\u0e23\u0e07\u0e40\u0e23\u0e35\u0e22\u0e19\u0e40\u0e25\u0e34\u0e28\u0e2b\u0e25\u0e49\u0e32 \u0e08\u0e1a\u0e1b\u0e23\u0e34\u0e0d\u0e0d\u0e32\u0e15\u0e23\u0e35\u0e14\u0e49\u0e32\u0e19 Graphic Communication & Design \u0e08\u0e32\u0e01 University of Sunderland, UK \u0e04\u0e38\u0e13\u0e1e\u0e23\u0e2b\u0e21\u0e14\u0e39\u0e41\u0e25\u0e01\u0e25\u0e22\u0e38\u0e17\u0e18\u0e4c\u0e1b\u0e23\u0e30\u0e0a\u0e32\u0e2a\u0e31\u0e21\u0e1e\u0e31\u0e19\u0e18\u0e4c \u0e2d\u0e2d\u0e01\u0e41\u0e1a\u0e1a\u0e41\u0e2d\u0e1b \u0e41\u0e25\u0e30\u0e2a\u0e2d\u0e19\u0e19\u0e31\u0e01\u0e40\u0e23\u0e35\u0e22\u0e19\u0e43\u0e0a\u0e49\u0e40\u0e04\u0e23\u0e37\u0e48\u0e2d\u0e07\u0e21\u0e37\u0e2d AI \u0e2d\u0e2d\u0e01\u0e41\u0e1a\u0e1a UI \u0e43\u0e19\u0e0a\u0e31\u0e49\u0e19\u0e40\u0e23\u0e35\u0e22\u0e19",
    march_role: "\u0e2b\u0e31\u0e27\u0e2b\u0e19\u0e49\u0e32\u0e1d\u0e48\u0e32\u0e22\u0e40\u0e17\u0e04\u0e19\u0e34\u0e04",
    march_bio: "\u0e27\u0e34\u0e28\u0e27\u0e01\u0e23\u0e0b\u0e2d\u0e1f\u0e15\u0e4c\u0e41\u0e27\u0e23\u0e4c\u0e17\u0e35\u0e48 Magic Eden \u0e0b\u0e32\u0e19\u0e1f\u0e23\u0e32\u0e19\u0e0b\u0e34\u0e2a\u0e42\u0e01 \u0e40\u0e0a\u0e35\u0e48\u0e22\u0e27\u0e0a\u0e32\u0e0d\u0e14\u0e49\u0e32\u0e19 Web3, \u0e23\u0e30\u0e1a\u0e1a\u0e01\u0e23\u0e30\u0e08\u0e32\u0e22 \u0e41\u0e25\u0e30\u0e27\u0e34\u0e28\u0e27\u0e01\u0e23\u0e23\u0e21\u0e1c\u0e25\u0e34\u0e15\u0e20\u0e31\u0e13\u0e11\u0e4c \u0e40\u0e04\u0e22\u0e17\u0e33\u0e07\u0e32\u0e19\u0e17\u0e35\u0e48 Uniswap Labs, Amazon \u0e41\u0e25\u0e30 Databricks \u0e08\u0e1a\u0e08\u0e32\u0e01\u0e08\u0e38\u0e2c\u0e32\u0e25\u0e07\u0e01\u0e23\u0e13\u0e4c \u0e1b\u0e23\u0e34\u0e0d\u0e0d\u0e32\u0e42\u0e17 Johns Hopkins \u0e2d\u0e22\u0e39\u0e48\u0e1b\u0e23\u0e30\u0e08\u0e33\u0e01\u0e23\u0e38\u0e07\u0e40\u0e17\u0e1e\u0e2f\u0e15\u0e25\u0e2d\u0e14 5 \u0e2a\u0e31\u0e1b\u0e14\u0e32\u0e2b\u0e4c",
    charlie_role: "\u0e1c\u0e25\u0e34\u0e15\u0e20\u0e31\u0e13\u0e11\u0e4c, \u0e01\u0e25\u0e22\u0e38\u0e17\u0e18\u0e4c & \u0e1b\u0e23\u0e30\u0e2a\u0e1a\u0e01\u0e32\u0e23\u0e13\u0e4c\u0e19\u0e31\u0e01\u0e40\u0e23\u0e35\u0e22\u0e19",
    charlie_bio: "\u0e27\u0e34\u0e28\u0e27\u0e01\u0e23\u0e0b\u0e2d\u0e1f\u0e15\u0e4c\u0e41\u0e27\u0e23\u0e4c\u0e2d\u0e32\u0e27\u0e38\u0e42\u0e2a\u0e17\u0e35\u0e48 Robinhood \u0e40\u0e04\u0e22\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e23\u0e30\u0e1a\u0e1a\u0e2a\u0e48\u0e07\u0e02\u0e2d\u0e07\u0e2d\u0e31\u0e15\u0e42\u0e19\u0e21\u0e31\u0e15\u0e34\u0e17\u0e35\u0e48 Google X Wing \u0e41\u0e25\u0e30\u0e42\u0e04\u0e23\u0e07\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e1e\u0e37\u0e49\u0e19\u0e10\u0e32\u0e19\u0e23\u0e30\u0e14\u0e31\u0e1a\u0e42\u0e25\u0e01\u0e17\u0e35\u0e48 Meta \u0e40\u0e0a\u0e35\u0e48\u0e22\u0e27\u0e0a\u0e32\u0e0d\u0e01\u0e32\u0e23\u0e02\u0e22\u0e32\u0e22\u0e23\u0e30\u0e1a\u0e1a\u0e2a\u0e33\u0e04\u0e31\u0e0d\u0e2a\u0e33\u0e2b\u0e23\u0e31\u0e1a\u0e1c\u0e39\u0e49\u0e43\u0e0a\u0e49\u0e2b\u0e25\u0e32\u0e22\u0e1e\u0e31\u0e19\u0e25\u0e49\u0e32\u0e19 \u0e14\u0e39\u0e41\u0e25\u0e01\u0e25\u0e22\u0e38\u0e17\u0e18\u0e4c\u0e42\u0e1b\u0e23\u0e41\u0e01\u0e23\u0e21 Demo Day \u0e41\u0e25\u0e30\u0e1b\u0e23\u0e30\u0e2a\u0e1a\u0e01\u0e32\u0e23\u0e13\u0e4c\u0e19\u0e31\u0e01\u0e40\u0e23\u0e35\u0e22\u0e19 \u0e2d\u0e22\u0e39\u0e48\u0e1b\u0e23\u0e30\u0e08\u0e33\u0e15\u0e25\u0e2d\u0e14 5 \u0e2a\u0e31\u0e1b\u0e14\u0e32\u0e2b\u0e4c",
    program_label: "\u0e42\u0e1b\u0e23\u0e41\u0e01\u0e23\u0e21", program_title: "5 \u0e27\u0e31\u0e19\u0e40\u0e2a\u0e32\u0e23\u0e4c<br>1 \u0e41\u0e2d\u0e1b\u0e08\u0e23\u0e34\u0e07",
    program_desc: "\u0e17\u0e38\u0e01\u0e27\u0e31\u0e19\u0e40\u0e2a\u0e32\u0e23\u0e4c 9:00 \u2013 12:00 \u0e19. \u0e17\u0e35\u0e48\u0e2b\u0e49\u0e2d\u0e07\u0e04\u0e2d\u0e21\u0e1e\u0e34\u0e27\u0e40\u0e15\u0e2d\u0e23\u0e4c Apple \u0e42\u0e23\u0e07\u0e40\u0e23\u0e35\u0e22\u0e19\u0e40\u0e25\u0e34\u0e28\u0e2b\u0e25\u0e49\u0e32 \u0e40\u0e04\u0e23\u0e37\u0e48\u0e2d\u0e07\u0e1e\u0e23\u0e49\u0e2d\u0e21\u0e43\u0e0a\u0e49\u0e07\u0e32\u0e19 \u0e2a\u0e20\u0e32\u0e1e\u0e41\u0e27\u0e14\u0e25\u0e49\u0e2d\u0e21\u0e21\u0e37\u0e2d\u0e2d\u0e32\u0e0a\u0e35\u0e1e \u2014 \u0e44\u0e21\u0e48\u0e15\u0e49\u0e2d\u0e07\u0e1e\u0e01\u0e41\u0e25\u0e47\u0e1b\u0e17\u0e47\u0e2d\u0e1b\u0e21\u0e32",
    w1_label: "\u0e2a\u0e31\u0e1b\u0e14\u0e32\u0e2b\u0e4c\u0e17\u0e35\u0e48 1", w1_title: "\u0e41\u0e1a\u0e1a\u0e41\u0e1c\u0e19", w1_desc: "\u0e01\u0e33\u0e2b\u0e19\u0e14\u0e44\u0e2d\u0e40\u0e14\u0e35\u0e22\u0e41\u0e2d\u0e1b \u0e40\u0e02\u0e35\u0e22\u0e19 Design Doc \u0e1e\u0e23\u0e49\u0e2d\u0e21 KPIs \u0e41\u0e25\u0e30\u0e1b\u0e25\u0e48\u0e2d\u0e22\u0e40\u0e27\u0e2d\u0e23\u0e4c\u0e0a\u0e31\u0e19\u0e41\u0e23\u0e01",
    w2_label: "\u0e2a\u0e31\u0e1b\u0e14\u0e32\u0e2b\u0e4c\u0e17\u0e35\u0e48 2", w2_title: "\u0e41\u0e01\u0e49\u0e1a\u0e31\u0e04 & \u0e02\u0e31\u0e14\u0e40\u0e01\u0e25\u0e32", w2_desc: "\u0e1b\u0e23\u0e31\u0e1a\u0e41\u0e15\u0e48\u0e07\u0e2a\u0e33\u0e2b\u0e23\u0e31\u0e1a\u0e21\u0e37\u0e2d\u0e16\u0e37\u0e2d\u0e01\u0e48\u0e2d\u0e19, \u0e40\u0e02\u0e35\u0e22\u0e19\u0e42\u0e04\u0e49\u0e14\u0e04\u0e39\u0e48\u0e01\u0e31\u0e1a AI \u0e41\u0e25\u0e30\u0e40\u0e02\u0e35\u0e22\u0e19\u0e40\u0e17\u0e2a\u0e15\u0e4c\u0e1b\u0e49\u0e2d\u0e07\u0e01\u0e31\u0e19\u0e1a\u0e31\u0e04",
    w3_label: "\u0e2a\u0e31\u0e1b\u0e14\u0e32\u0e2b\u0e4c\u0e17\u0e35\u0e48 3", w3_title: "\u0e1b\u0e25\u0e48\u0e2d\u0e22 & \u0e2a\u0e31\u0e07\u0e40\u0e01\u0e15", w3_desc: "\u0e15\u0e34\u0e14\u0e15\u0e31\u0e49\u0e07 analytics \u0e17\u0e14\u0e2a\u0e2d\u0e1a\u0e01\u0e31\u0e1a\u0e1c\u0e39\u0e49\u0e43\u0e0a\u0e49\u0e08\u0e23\u0e34\u0e07 \u0e23\u0e31\u0e1a\u0e1f\u0e35\u0e14\u0e41\u0e1a\u0e47\u0e04\u0e41\u0e25\u0e30\u0e1b\u0e23\u0e31\u0e1a\u0e1b\u0e23\u0e38\u0e07\u0e41\u0e2d\u0e1b",
    w4_label: "\u0e2a\u0e31\u0e1b\u0e14\u0e32\u0e2b\u0e4c\u0e17\u0e35\u0e48 4", w4_title: "\u0e2a\u0e1b\u0e23\u0e34\u0e19\u0e17\u0e4c\u0e1f\u0e35\u0e40\u0e08\u0e2d\u0e23\u0e4c", w4_desc: "\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e1f\u0e35\u0e40\u0e08\u0e2d\u0e23\u0e4c\u0e15\u0e32\u0e21\u0e1f\u0e35\u0e14\u0e41\u0e1a\u0e47\u0e04\u0e08\u0e23\u0e34\u0e07 \u0e17\u0e14\u0e2a\u0e2d\u0e1a\u0e04\u0e27\u0e32\u0e21\u0e40\u0e2a\u0e16\u0e35\u0e22\u0e23 \u0e41\u0e25\u0e30\u0e27\u0e34\u0e08\u0e32\u0e23\u0e13\u0e4c\u0e23\u0e48\u0e27\u0e21\u0e01\u0e31\u0e19",
    w5_label: "\u0e2a\u0e31\u0e1b\u0e14\u0e32\u0e2b\u0e4c\u0e17\u0e35\u0e48 5", w5_title: "\u0e1b\u0e23\u0e30\u0e01\u0e32\u0e28\u0e1c\u0e25\u0e07\u0e32\u0e19", w5_desc: "\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e2a\u0e44\u0e25\u0e14\u0e4c\u0e1e\u0e34\u0e17\u0e0a\u0e4c \u0e1b\u0e25\u0e48\u0e2d\u0e22\u0e23\u0e2d\u0e1a\u0e2a\u0e38\u0e14\u0e17\u0e49\u0e32\u0e22 \u0e41\u0e25\u0e30 Demo Day \u2014 \u0e1c\u0e39\u0e49\u0e1b\u0e01\u0e04\u0e23\u0e2d\u0e07\u0e23\u0e48\u0e27\u0e21\u0e0a\u0e21\u0e40\u0e27\u0e25\u0e32 11:00 \u0e19.",
    workflow_label: "\u0e40\u0e27\u0e34\u0e23\u0e4c\u0e04\u0e42\u0e1f\u0e25\u0e27\u0e4c", workflow_title: "\u0e2d\u0e2d\u0e01\u0e41\u0e1a\u0e1a. \u0e2a\u0e23\u0e49\u0e32\u0e07. \u0e1b\u0e25\u0e48\u0e2d\u0e22. \u0e17\u0e33\u0e0b\u0e49\u0e33.",
    tool1_sub: "\u0e2d\u0e2d\u0e01\u0e41\u0e1a\u0e1a", tool1_desc: "\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e44\u0e2d\u0e40\u0e14\u0e35\u0e22\u0e02\u0e2d\u0e07\u0e04\u0e38\u0e13\u0e40\u0e1b\u0e47\u0e19 UI \u0e2a\u0e27\u0e22\u0e07\u0e32\u0e21\u0e14\u0e49\u0e27\u0e22\u0e40\u0e04\u0e23\u0e37\u0e48\u0e2d\u0e07\u0e21\u0e37\u0e2d AI \u0e02\u0e2d\u0e07 Google \u0e44\u0e21\u0e48\u0e15\u0e49\u0e2d\u0e07\u0e21\u0e35\u0e1b\u0e23\u0e30\u0e2a\u0e1a\u0e01\u0e32\u0e23\u0e13\u0e4c Figma",
    tool2_sub: "\u0e1e\u0e31\u0e12\u0e19\u0e32", tool2_desc: "AI \u0e0a\u0e48\u0e27\u0e22\u0e40\u0e02\u0e35\u0e22\u0e19\u0e42\u0e04\u0e49\u0e14\u0e04\u0e39\u0e48\u0e01\u0e31\u0e1a\u0e04\u0e38\u0e13 \u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e14\u0e35\u0e44\u0e0b\u0e19\u0e4c\u0e40\u0e1b\u0e47\u0e19\u0e42\u0e04\u0e49\u0e14 React Native \u0e41\u0e25\u0e30\u0e1b\u0e25\u0e48\u0e2d\u0e22\u0e17\u0e31\u0e19\u0e17\u0e35",
    tool3_sub: "\u0e23\u0e30\u0e14\u0e21\u0e44\u0e2d\u0e40\u0e14\u0e35\u0e22", tool3_desc: "\u0e04\u0e38\u0e22\u0e01\u0e31\u0e1a AI \u0e17\u0e35\u0e48\u0e25\u0e49\u0e33\u0e2a\u0e21\u0e31\u0e22\u0e17\u0e35\u0e48\u0e2a\u0e38\u0e14\u0e02\u0e2d\u0e07 Google \u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e23\u0e30\u0e14\u0e21\u0e1f\u0e35\u0e40\u0e08\u0e2d\u0e23\u0e4c \u0e41\u0e01\u0e49\u0e1a\u0e31\u0e04 \u0e41\u0e25\u0e30\u0e2a\u0e33\u0e23\u0e27\u0e08\u0e44\u0e2d\u0e40\u0e14\u0e35\u0e22",
    tool4_sub: "\u0e1b\u0e25\u0e48\u0e2d\u0e22", tool4_desc: "\u0e2a\u0e48\u0e07\u0e41\u0e2d\u0e1b\u0e02\u0e2d\u0e07\u0e04\u0e38\u0e13\u0e2a\u0e39\u0e48\u0e42\u0e25\u0e01\u0e1a\u0e19\u0e40\u0e04\u0e23\u0e37\u0e2d\u0e02\u0e48\u0e32\u0e22 Cloudflare URL \u0e08\u0e23\u0e34\u0e07 \u0e1c\u0e39\u0e49\u0e43\u0e0a\u0e49\u0e08\u0e23\u0e34\u0e07 \u0e1c\u0e25\u0e01\u0e23\u0e30\u0e17\u0e1a\u0e08\u0e23\u0e34\u0e07",
    tool_footer: "\u0e02\u0e31\u0e1a\u0e40\u0e04\u0e25\u0e37\u0e48\u0e2d\u0e19\u0e42\u0e14\u0e22 Google Suite &middot; \u0e40\u0e04\u0e23\u0e37\u0e48\u0e2d\u0e07\u0e21\u0e37\u0e2d\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14\u0e08\u0e31\u0e14\u0e43\u0e2b\u0e49\u0e43\u0e19\u0e0a\u0e31\u0e49\u0e19\u0e40\u0e23\u0e35\u0e22\u0e19",
    show1_title: "\u0e42\u0e04\u0e23\u0e07\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e1e\u0e37\u0e49\u0e19\u0e10\u0e32\u0e19\u0e08\u0e23\u0e34\u0e07,<br>\u0e44\u0e21\u0e48\u0e43\u0e0a\u0e48\u0e41\u0e04\u0e48\u0e44\u0e27\u0e22\u0e32\u0e01\u0e23\u0e13\u0e4c",
    show1_desc: "\u0e19\u0e31\u0e01\u0e40\u0e23\u0e35\u0e22\u0e19\u0e17\u0e38\u0e01\u0e04\u0e19\u0e43\u0e0a\u0e49\u0e40\u0e04\u0e23\u0e37\u0e48\u0e2d\u0e07\u0e21\u0e37\u0e2d\u0e21\u0e37\u0e2d\u0e2d\u0e32\u0e0a\u0e35\u0e1e\u0e23\u0e30\u0e14\u0e31\u0e1a\u0e40\u0e14\u0e35\u0e22\u0e27\u0e01\u0e31\u0e1a\u0e1a\u0e23\u0e34\u0e29\u0e31\u0e17\u0e40\u0e17\u0e04\u0e0a\u0e31\u0e49\u0e19\u0e19\u0e33 \u2014 Google AI Studio, Cloudflare \u0e41\u0e25\u0e30 API \u0e08\u0e23\u0e34\u0e07 \u0e44\u0e21\u0e48\u0e43\u0e0a\u0e48\u0e2a\u0e20\u0e32\u0e1e\u0e41\u0e27\u0e14\u0e25\u0e49\u0e2d\u0e21\u0e08\u0e33\u0e25\u0e2d\u0e07",
    show2_title: "\u0e44\u0e1b\u0e1b\u0e4c\u0e44\u0e25\u0e19\u0e4c\u0e01\u0e32\u0e23\u0e2d\u0e2d\u0e01\u0e41\u0e1a\u0e1a\u0e14\u0e49\u0e27\u0e22 AI",
    show2_desc: "\u0e15\u0e31\u0e49\u0e07\u0e41\u0e15\u0e48\u0e2d\u0e2d\u0e01\u0e41\u0e1a\u0e1a UI \u0e14\u0e49\u0e27\u0e22 Google Stitch \u0e2a\u0e23\u0e49\u0e32\u0e07\u0e42\u0e04\u0e49\u0e14\u0e14\u0e49\u0e27\u0e22 Gemini \u0e08\u0e19\u0e16\u0e36\u0e07\u0e01\u0e32\u0e23\u0e1b\u0e25\u0e48\u0e2d\u0e22\u0e08\u0e23\u0e34\u0e07 \u2014 \u0e40\u0e23\u0e35\u0e22\u0e19\u0e23\u0e39\u0e49\u0e40\u0e27\u0e34\u0e23\u0e4c\u0e04\u0e42\u0e1f\u0e25\u0e27\u0e4c\u0e01\u0e32\u0e23\u0e1e\u0e31\u0e12\u0e19\u0e32\u0e41\u0e2d\u0e1b\u0e2a\u0e21\u0e31\u0e22\u0e43\u0e2b\u0e21\u0e48\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14",
    show3_title: "Demo Day:<br>\u0e1e\u0e34\u0e17\u0e0a\u0e4c\u0e41\u0e1a\u0e1a\u0e1c\u0e39\u0e49\u0e01\u0e48\u0e2d\u0e15\u0e31\u0e49\u0e07",
    show3_desc: "\u0e2a\u0e31\u0e1b\u0e14\u0e32\u0e2b\u0e4c\u0e17\u0e35\u0e48 5 \u0e1c\u0e39\u0e49\u0e1b\u0e01\u0e04\u0e23\u0e2d\u0e07\u0e23\u0e48\u0e27\u0e21\u0e0a\u0e21\u0e19\u0e31\u0e01\u0e40\u0e23\u0e35\u0e22\u0e19\u0e19\u0e33\u0e40\u0e2a\u0e19\u0e2d\u0e41\u0e2d\u0e1b\u0e1e\u0e23\u0e49\u0e2d\u0e21\u0e2a\u0e44\u0e25\u0e14\u0e4c\u0e1e\u0e34\u0e17\u0e0a\u0e4c\u0e21\u0e37\u0e2d\u0e2d\u0e32\u0e0a\u0e35\u0e1e \u2014 \u0e40\u0e2b\u0e21\u0e37\u0e2d\u0e19\u0e1c\u0e39\u0e49\u0e01\u0e48\u0e2d\u0e15\u0e31\u0e49\u0e07\u0e2a\u0e15\u0e32\u0e23\u0e4c\u0e17\u0e2d\u0e31\u0e1e\u0e08\u0e23\u0e34\u0e07",
    show3_btn: "\u0e23\u0e48\u0e27\u0e21\u0e04\u0e2d\u0e23\u0e4c\u0e2a\u0e0b\u0e31\u0e21\u0e40\u0e21\u0e2d\u0e23\u0e4c",
    cta_title: "\u0e08\u0e2d\u0e07\u0e17\u0e35\u0e48\u0e19\u0e31\u0e48\u0e07\u0e02\u0e2d\u0e07\u0e04\u0e38\u0e13", cta_sub: "\u0e23\u0e31\u0e1a\u0e08\u0e33\u0e01\u0e31\u0e14\u0e40\u0e1e\u0e35\u0e22\u0e07 10 \u0e04\u0e19\u0e15\u0e48\u0e2d\u0e23\u0e38\u0e48\u0e19 \u0e21\u0e32\u0e01\u0e48\u0e2d\u0e19\u0e44\u0e14\u0e49\u0e01\u0e48\u0e2d\u0e19",
    cta_price_sub: "\u0e15\u0e48\u0e2d\u0e19\u0e31\u0e01\u0e40\u0e23\u0e35\u0e22\u0e19 &middot; 5 \u0e04\u0e23\u0e31\u0e49\u0e07 &middot; \u0e23\u0e27\u0e21\u0e2d\u0e38\u0e1b\u0e01\u0e23\u0e13\u0e4c\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14",
    detail_date: "13 \u0e21\u0e34.\u0e22. \u2013 11 \u0e01.\u0e04.", detail_date_sub: "\u0e17\u0e38\u0e01\u0e27\u0e31\u0e19\u0e40\u0e2a\u0e32\u0e23\u0e4c",
    detail_time: "9:00 \u2013 12:00 \u0e19.", detail_time_sub: "3 \u0e0a\u0e31\u0e48\u0e27\u0e42\u0e21\u0e07 / \u0e04\u0e23\u0e31\u0e49\u0e07",
    detail_grade: "\u0e1b.6\u2013\u0e21.3", detail_grade_sub: "\u0e2d\u0e32\u0e22\u0e38 11\u201315 \u0e1b\u0e35",
    detail_loc: "\u0e42\u0e23\u0e07\u0e40\u0e23\u0e35\u0e22\u0e19\u0e40\u0e25\u0e34\u0e28\u0e2b\u0e25\u0e49\u0e32", detail_loc_sub: "\u0e16.\u0e01\u0e32\u0e0d\u0e08\u0e19\u0e32\u0e20\u0e34\u0e40\u0e29\u0e01",
    footer_text: "SV Academy &times; \u0e42\u0e23\u0e07\u0e40\u0e23\u0e35\u0e22\u0e19\u0e40\u0e25\u0e34\u0e28\u0e2b\u0e25\u0e49\u0e32 \u0e16.\u0e01\u0e32\u0e0d\u0e08\u0e19\u0e32\u0e20\u0e34\u0e40\u0e29\u0e01 &middot; \u0e0b\u0e31\u0e21\u0e40\u0e21\u0e2d\u0e23\u0e4c 2569",
    modal_title: "\u0e15\u0e34\u0e14\u0e15\u0e32\u0e21\u0e02\u0e48\u0e32\u0e27\u0e2a\u0e32\u0e23", modal_desc: "\u0e23\u0e31\u0e1a\u0e2d\u0e31\u0e1b\u0e40\u0e14\u0e15\u0e01\u0e32\u0e23\u0e23\u0e31\u0e1a\u0e2a\u0e21\u0e31\u0e04\u0e23 \u0e15\u0e32\u0e23\u0e32\u0e07\u0e40\u0e23\u0e35\u0e22\u0e19 \u0e41\u0e25\u0e30\u0e42\u0e1b\u0e23\u0e42\u0e21\u0e0a\u0e31\u0e48\u0e19\u0e1e\u0e34\u0e40\u0e28\u0e29",
    modal_submit: "\u0e25\u0e07\u0e17\u0e30\u0e40\u0e1a\u0e35\u0e22\u0e19", modal_success: "\u0e25\u0e07\u0e17\u0e30\u0e40\u0e1a\u0e35\u0e22\u0e19\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08!", modal_alt: "\u0e2b\u0e23\u0e37\u0e2d\u0e2a\u0e21\u0e31\u0e04\u0e23\u0e42\u0e14\u0e22\u0e15\u0e23\u0e07\u0e1c\u0e48\u0e32\u0e19"
  }
};

var currentLang = "en";
function toggleLang() {
  currentLang = currentLang === "en" ? "th" : "en";
  document.documentElement.setAttribute("data-lang", currentLang);
  document.documentElement.setAttribute("lang", currentLang);
  document.getElementById("lang-btn").textContent = currentLang === "en" ? "TH" : "EN";
  var els = document.querySelectorAll("[data-i18n]");
  for (var i = 0; i < els.length; i++) {
    var key = els[i].getAttribute("data-i18n");
    if (translations[currentLang] && translations[currentLang][key]) {
      els[i].innerHTML = translations[currentLang][key];
    }
  }
}

var currentSlide = 0;
var slideCount = 3;
var slideInterval;
var isTransitioning = false;
var matrixAnimFrame = null;
var MATRIX_FONT = 11;
var MATRIX_CHARS = "01{}[]<>/=;:()アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモ".split("");
var mentorBrightMaps = [null, null, null];
var mentorImgSrcs = ["./prom_decor.png", "./march_decor.png", "./charlie_decor.png"];

var mentorImgCache = [null, null, null];

function buildBrightnessMap(idx, targetW, targetH) {
  var img = mentorImgCache[idx];
  if (!img) return null;
  var cols = Math.floor(targetW / MATRIX_FONT);
  var rows = Math.floor(targetH / MATRIX_FONT);
  if (cols < 1 || rows < 1) return null;
  var off = document.createElement("canvas");
  off.width = cols; off.height = rows;
  var ctx = off.getContext("2d");
  ctx.drawImage(img, 0, 0, cols, rows);
  try {
    var data = ctx.getImageData(0, 0, cols, rows).data;
    var map = [];
    for (var c = 0; c < cols; c++) {
      map[c] = [];
      for (var r = 0; r < rows; r++) {
        var i = (r * cols + c) * 4;
        var lum = (data[i] * 0.299 + data[i+1] * 0.587 + data[i+2] * 0.114);
        var alpha = data[i+3] / 255;
        map[c][r] = lum * alpha;
      }
    }
    return map;
  } catch(e) { return null; }
}

function preloadMentorImage(idx) {
  var img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = function() {
    mentorImgCache[idx] = img;
    var visuals = document.querySelectorAll(".founder-visual");
    var w = visuals[idx] ? visuals[idx].offsetWidth : 380;
    var h = visuals[idx] ? visuals[idx].offsetHeight : 540;
    mentorBrightMaps[idx] = buildBrightnessMap(idx, w, h);
    if (!mentorBrightMaps[idx]) {
      var retry = new Image();
      retry.onload = function() {
        mentorImgCache[idx] = retry;
        mentorBrightMaps[idx] = buildBrightnessMap(idx, w, h);
      };
      retry.src = mentorImgSrcs[idx] + "?t=" + Date.now();
    }
  };
  img.onerror = function() {
    var retry = new Image();
    retry.onload = function() {
      mentorImgCache[idx] = retry;
      var visuals = document.querySelectorAll(".founder-visual");
      var w = visuals[idx] ? visuals[idx].offsetWidth : 380;
      var h = visuals[idx] ? visuals[idx].offsetHeight : 540;
      mentorBrightMaps[idx] = buildBrightnessMap(idx, w, h);
    };
    retry.src = mentorImgSrcs[idx];
  };
  img.src = mentorImgSrcs[idx];
}
for (var mi = 0; mi < 3; mi++) preloadMentorImage(mi);

window.addEventListener("resize", function() {
  var visuals = document.querySelectorAll(".founder-visual");
  for (var i = 0; i < 3; i++) {
    if (mentorImgCache[i] && visuals[i]) {
      mentorBrightMaps[i] = buildBrightnessMap(i, visuals[i].offsetWidth, visuals[i].offsetHeight);
    }
  }
});

function getSlideCanvas(slideIdx) {
  var slides = document.querySelectorAll("#mentor-slideshow > .slide");
  if (!slides[slideIdx]) return null;
  return slides[slideIdx].querySelector(".matrix-reveal-canvas");
}

function drawMatrixChars(ctx, particles, progress, isDark, MATRIX_FONT_SIZE, rows) {
  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    if (p.alpha < 0.01) continue;
    var normBright = p.bright / 255;
    var a = p.alpha;
    if (isDark) {
      if (normBright > 0.6) ctx.fillStyle = "rgba(77,200,255," + a + ")";
      else if (normBright > 0.3) ctx.fillStyle = "rgba(34,197,94," + (a * 0.8) + ")";
      else ctx.fillStyle = "rgba(77,163,255," + (a * 0.5) + ")";
    } else {
      if (normBright > 0.6) ctx.fillStyle = "rgba(0,100,220," + a + ")";
      else if (normBright > 0.3) ctx.fillStyle = "rgba(22,163,74," + (a * 0.8) + ")";
      else ctx.fillStyle = "rgba(0,80,200," + (a * 0.5) + ")";
    }
    ctx.font = MATRIX_FONT_SIZE + "px monospace";
    ctx.fillText(p.ch, p.x, p.currentY + MATRIX_FONT_SIZE);
  }
}

function runMatrixReveal(inSlideIdx, inCanvas, outSlide, inSlide, dots, oldIdx, onDone) {
  var fallback = function() {
    outSlide.classList.remove("active"); outSlide.style.opacity = "0";
    inSlide.style.opacity = "1"; inSlide.classList.add("active");
    dots[oldIdx].classList.remove("active"); dots[inSlideIdx].classList.add("active");
    currentSlide = inSlideIdx;
    setTimeout(onDone, 100);
  };
  if (!inCanvas) { fallback(); return; }

  var outCanvas = outSlide.querySelector(".matrix-reveal-canvas");
  var inVisual = inCanvas.parentElement;
  var outVisual = outCanvas ? outCanvas.parentElement : null;

  var refVisual = outVisual || inVisual;
  var w = refVisual.offsetWidth, h = refVisual.offsetHeight;

  if (outCanvas) {
    outCanvas.width = w; outCanvas.height = h;
  }
  inCanvas.width = inVisual.offsetWidth;
  inCanvas.height = inVisual.offsetHeight;

  var outCtx = outCanvas ? outCanvas.getContext("2d") : null;
  var inCtx = inCanvas.getContext("2d");
  if (!inCtx) { fallback(); return; }

  var cols = Math.floor(w / MATRIX_FONT);
  var rows = Math.floor(h / MATRIX_FONT);
  var map = mentorBrightMaps[inSlideIdx];
  if (mentorImgCache[inSlideIdx] && (!map || (map.length !== cols))) {
    map = buildBrightnessMap(inSlideIdx, w, h);
    mentorBrightMaps[inSlideIdx] = map;
  }
  var isDark = document.documentElement.getAttribute("data-theme") === "dark";
  var totalDuration = 1800;
  var startTime = performance.now();
  var swapped = false;
  var photoRevealing = false;
  var imgWrap = inVisual.querySelector(".founder-img-wrap");
  var inBio = inSlide.querySelector(".founder-scene > div:last-child");

  var PHASE1 = 400 / totalDuration;
  var PHASE2_END = (400 + 800) / totalDuration;

  if (!map) { fallback(); return; }

  var particles = [];
  for (var c = 0; c < cols; c++) {
    for (var r = 0; r < rows; r++) {
      var bright = (map[c] && map[c][r] !== undefined) ? map[c][r] : 0;
      if (bright > 15) {
        particles.push({
          col: c, row: r, bright: bright,
          ch: MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
          startY: h + Math.random() * h * 0.5,
          targetY: r * MATRIX_FONT,
          x: c * MATRIX_FONT,
          currentY: h + Math.random() * h * 0.5,
          alpha: 0,
          delay: Math.random() * 0.25 + (1 - r / rows) * 0.1,
          flickerRate: 0.02 + Math.random() * 0.05
        });
      }
    }
  }

  if (imgWrap) { imgWrap.classList.add("matrix-hiding"); imgWrap.style.opacity = "0"; }
  if (outCanvas) { outCanvas.classList.add("active"); }

  function draw(now) {
    var elapsed = now - startTime;
    var progress = Math.min(elapsed / totalDuration, 1);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var localP = Math.max(0, Math.min(1, (progress - p.delay * PHASE1) / (1 - p.delay * PHASE1)));
      if (localP <= 0) { p.alpha = 0; continue; }

      if (Math.random() < p.flickerRate) {
        p.ch = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      }

      if (progress < PHASE1) {
        var riseP = localP;
        p.currentY = p.startY + (p.targetY - p.startY) * riseP * 0.3;
        p.alpha = Math.min(1, riseP * 0.5 * (p.bright / 255));
      } else if (progress < PHASE2_END) {
        var postP = (progress - PHASE1) / (PHASE2_END - PHASE1);
        var ease = 1 - Math.pow(1 - postP, 3);
        p.currentY = p.startY + (p.targetY - p.startY) * (0.3 + ease * 0.7);
        p.alpha = Math.min(1, (0.3 + postP * 0.7) * (p.bright / 255));
      } else {
        p.currentY = p.targetY;
        var fadeP = (progress - PHASE2_END) / (1 - PHASE2_END);
        var rowFade = p.row / rows;
        var combinedFade = fadeP + rowFade * fadeP * 0.5;
        p.alpha = Math.max(0, 1 - combinedFade * combinedFade) * (p.bright / 255);
      }
    }

    if (!swapped && progress < PHASE1 && outCtx) {
      outCtx.clearRect(0, 0, w, h);
      drawMatrixChars(outCtx, particles, progress, isDark, MATRIX_FONT, rows);
      outSlide.style.opacity = String(1 - (progress / PHASE1) * 0.4);
    }

    if (!swapped && progress >= PHASE1) {
      swapped = true;
      if (outCtx) { outCtx.clearRect(0, 0, w, h); outCanvas.classList.remove("active"); }
      outSlide.style.opacity = "0";
      outSlide.classList.remove("active");
      inSlide.style.opacity = "1";
      inSlide.classList.add("active");
      dots[oldIdx].classList.remove("active"); dots[inSlideIdx].classList.add("active");
      currentSlide = inSlideIdx;
      inCanvas.classList.add("active");
      if (inBio) { inBio.style.transition = "opacity 0.4s ease-in"; inBio.style.opacity = "0"; }
      setTimeout(function() { if (inBio) { inBio.style.opacity = "1"; } }, 50);
    }

    if (swapped) {
      inCtx.clearRect(0, 0, inCanvas.width, inCanvas.height);
      drawMatrixChars(inCtx, particles, progress, isDark, MATRIX_FONT, rows);

      if (!photoRevealing && progress >= PHASE2_END && imgWrap) {
        photoRevealing = true;
        imgWrap.classList.remove("matrix-hiding");
        imgWrap.classList.add("matrix-revealing");
        imgWrap.style.opacity = "1";
      }
    }

    if (progress < 1) {
      matrixAnimFrame = requestAnimationFrame(draw);
    } else {
      inCanvas.classList.remove("active");
      inCtx.clearRect(0, 0, inCanvas.width, inCanvas.height);
      if (imgWrap) {
        imgWrap.classList.remove("matrix-hiding", "matrix-revealing");
        imgWrap.style.opacity = "";
      }
      if (inBio) { inBio.style.transition = ""; inBio.style.opacity = ""; }
      outSlide.style.transition = "";
      onDone();
    }
  }
  matrixAnimFrame = requestAnimationFrame(draw);
}

function goToSlide(n) {
  if (isTransitioning || n === currentSlide) return;
  isTransitioning = true;
  var slides = document.querySelectorAll("#mentor-slideshow > .slide");
  var dots = document.querySelectorAll(".slide-dot");
  var outSlide = slides[currentSlide];
  var inSlide = slides[n];
  var inCanvas = getSlideCanvas(n);

  runMatrixReveal(n, inCanvas, outSlide, inSlide, dots, currentSlide,
    function() {
      isTransitioning = false;
    }
  );
}

function nextSlide() { goToSlide((currentSlide + 1) % slideCount); }

function startSlideshow() {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 5000);
}

document.querySelectorAll(".slide-dot").forEach(function(dot) {
  dot.addEventListener("click", function() {
    goToSlide(parseInt(this.getAttribute("data-goto")));
    startSlideshow();
  });
});
var mentorSlideshow = document.getElementById("mentor-slideshow");
if (mentorSlideshow) {
  mentorSlideshow.addEventListener("mouseenter", function() { clearInterval(slideInterval); });
  mentorSlideshow.addEventListener("mouseleave", startSlideshow);
}
startSlideshow();

var heroSlides = document.querySelectorAll("#hero-slideshow .hero-slide");
var heroSlideIdx = 0;
var heroSlideTimer;
function nextHeroSlide() {
  heroSlides[heroSlideIdx].classList.remove("active");
  heroSlideIdx = (heroSlideIdx + 1) % heroSlides.length;
  heroSlides[heroSlideIdx].classList.add("active");
}
function startHeroSlideshow() {
  clearInterval(heroSlideTimer);
  heroSlideTimer = setInterval(nextHeroSlide, 6000);
}
if (heroSlides.length > 1) startHeroSlideshow();

var codeRainCtx, codeRainCanvas, codeRainDrops;
(function() {
  codeRainCanvas = document.getElementById("code-rain-canvas");
  if (!codeRainCanvas) return;
  codeRainCtx = codeRainCanvas.getContext("2d");
  if (!codeRainCtx) return;
  function resize() { codeRainCanvas.width = codeRainCanvas.offsetWidth; codeRainCanvas.height = codeRainCanvas.offsetHeight; }
  resize();
  window.addEventListener("resize", resize);
  var chars = "01{}[]<>/=;:()=>importconstasyncawaitfunctionreturndeployshipbuildcreateappmodelAI".split("");
  var fontSize = 13;
  var columns = Math.floor(codeRainCanvas.width / fontSize);
  codeRainDrops = [];
  for (var i = 0; i < columns; i++) codeRainDrops[i] = Math.random() * -100;

  function draw() {
    var isDark = document.documentElement.getAttribute("data-theme") === "dark";
    var bgColor = isDark ? "rgba(10, 10, 18, 0.06)" : "rgba(248, 249, 252, 0.06)";
    codeRainCtx.fillStyle = bgColor;
    codeRainCtx.fillRect(0, 0, codeRainCanvas.width, codeRainCanvas.height);
    codeRainCtx.font = fontSize + "px monospace";
    var r = isDark ? 77 : 0;
    var g = isDark ? 163 : 80;
    var b = isDark ? 255 : 200;
    for (var i = 0; i < codeRainDrops.length; i++) {
      var ch = chars[Math.floor(Math.random() * chars.length)];
      var alpha = 0.08 + Math.random() * 0.12;
      codeRainCtx.fillStyle = "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
      codeRainCtx.fillText(ch, i * fontSize, codeRainDrops[i] * fontSize);
      if (codeRainDrops[i] * fontSize > codeRainCanvas.height && Math.random() > 0.98) codeRainDrops[i] = 0;
      codeRainDrops[i] += 0.3 + Math.random() * 0.4;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();
function updateCodeRain() {}

document.querySelectorAll(".tilt-card").forEach(function(card) {
  card.addEventListener("mousemove", function(e) {
    var rect = card.getBoundingClientRect();
    var x = (e.clientX - rect.left) / rect.width - 0.5;
    var y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = "perspective(800px) rotateY(" + (x * 8) + "deg) rotateX(" + (-y * 8) + "deg) translateZ(10px)";
    if (card.classList.contains("glow-border")) {
      card.style.setProperty("--glow-x", ((x + 0.5) * 100) + "%");
      card.style.setProperty("--glow-y", ((y + 0.5) * 100) + "%");
    }
  });
  card.addEventListener("mouseleave", function() {
    card.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
  });
});

gsap.registerPlugin(ScrollTrigger);
var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReduced) {
  gsap.fromTo(".hero-badge", { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 });
  gsap.fromTo(".hero-team", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.2 });
  gsap.fromTo(".hero-headline", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 });
  gsap.fromTo(".hero-sub", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.7 });
  gsap.fromTo(".hero-stats", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.8 });
  gsap.fromTo(".hero-cta", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.9 });

  gsap.utils.toArray(".float-device").forEach(function(device) {
    var speed = parseFloat(device.getAttribute("data-speed") || "1");
    gsap.to(device, { y: -140 * speed, ease: "none", scrollTrigger: { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: 1 } });
    gsap.to(device, { y: "+=15", duration: 3 + Math.random() * 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
  });

  gsap.utils.toArray(".parallax-section").forEach(function(section) {
    var bg = section.querySelector(".parallax-bg");
    if (bg) gsap.fromTo(bg, { y: -60 }, { y: 60, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 } });
  });

  gsap.utils.toArray(".fade-up").forEach(function(el) {
    gsap.fromTo(el, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
  });
  gsap.utils.toArray(".slide-in-left").forEach(function(el) {
    gsap.fromTo(el, { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
  });
  gsap.utils.toArray(".slide-in-right").forEach(function(el) {
    gsap.fromTo(el, { x: 80, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
  });
  gsap.utils.toArray(".ui-card-dark").forEach(function(card) {
    gsap.to(card, { y: "+=8", duration: 2.5 + Math.random() * 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
  });
  gsap.utils.toArray(".founder-scene").forEach(function(scene, i) {
    gsap.fromTo(scene, { x: i % 2 === 0 ? -60 : 60, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: scene, start: "top 85%" } });
  });
  gsap.utils.toArray(".founder-visual").forEach(function(vis) {
    gsap.from(vis, { y: 60, scrollTrigger: { trigger: vis, start: "top 90%", end: "top 40%", scrub: 1 } });
  });
  gsap.fromTo(".program-card", { y: 40, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.4)", scrollTrigger: { trigger: "#program", start: "top 75%" } });
  gsap.utils.toArray(".showcase-section").forEach(function(section) {
    var cards = section.querySelectorAll(".showcase-card");
    if (cards.length) gsap.fromTo(cards, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 70%" } });
  });
  gsap.fromTo(".cta-card", { y: 50, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: "#apply", start: "top 75%" } });
  gsap.utils.toArray(".tool-card").forEach(function(card, i) {
    gsap.fromTo(card, { y: 30, opacity: 0, rotateY: -15 }, { y: 0, opacity: 1, rotateY: 0, duration: 0.7, delay: i * 0.08, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 90%" } });
  });
}

document.querySelectorAll(".stat-val").forEach(function(stat) {
  var target = parseInt(stat.getAttribute("data-value") || "0", 10);
  if (prefersReduced) { stat.textContent = target; return; }
  var obj = { val: 0 };
  gsap.to(obj, { val: target, duration: 2, ease: "power2.out", scrollTrigger: { trigger: stat, start: "top 80%" }, onUpdate: function() { stat.textContent = Math.round(obj.val); } });
});
