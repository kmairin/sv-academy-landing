
var FORMSPREE_ENDPOINT = "https://formspree.io/f/xlgznpob";

// Google Apps Script web-app URL — receives the same payload and writes it
// to a Google Sheet. Runs in parallel with Formspree; if one fails the
// other still catches the submission. Leave as "" to disable.
var SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbz-JajdV8f9BGeKGrGaiM-_2yYpCGgAb7o60DF5l1nGzJaFyL7RG5HXrcon9qGANm1a9Q/exec";

// ── Multi-step form ───────────────────────────────────────────────────────────
var currentFormStep = 1;
var totalFormSteps  = 5;
var formStepMeta = [
  { label: "Who are you? 👾",         progress: 20  },
  { label: "How do we reach you? 📡", progress: 40  },
  { label: "Your big idea 💡",        progress: 60  },
  { label: "Your skill level 🎮",     progress: 80  },
  { label: "Almost there! 🚀",        progress: 100 },
];

function formNext() {
  var stepEl = document.getElementById("form-step-" + currentFormStep);
  var fields  = stepEl.querySelectorAll("[required]");
  var valid   = true;
  fields.forEach(function(f) {
    if (!f.value || !f.value.trim()) { f.classList.add("input-error"); valid = false; }
    else                              { f.classList.remove("input-error"); }
  });
  var errEl = document.getElementById("form-error-msg");
  if (!valid) { if (errEl) errEl.style.display = "block"; return; }
  if (errEl) errEl.style.display = "none";
  if (currentFormStep >= totalFormSteps) return;

  var cur  = document.getElementById("form-step-" + currentFormStep);
  var next = document.getElementById("form-step-" + (currentFormStep + 1));
  cur.style.transition = "opacity 0.2s ease, transform 0.2s ease";
  cur.style.opacity = "0"; cur.style.transform = "translateX(-24px)";
  setTimeout(function() {
    cur.style.display = "none"; cur.style.opacity = ""; cur.style.transform = "";
    currentFormStep++;
    next.style.display = "block"; next.style.opacity = "0"; next.style.transform = "translateX(24px)";
    setTimeout(function() { next.style.opacity = "1"; next.style.transform = "translateX(0)"; }, 16);
    updateFormStepUI();
  }, 200);
}

function formPrev() {
  if (currentFormStep <= 1) return;
  var cur  = document.getElementById("form-step-" + currentFormStep);
  var prev = document.getElementById("form-step-" + (currentFormStep - 1));
  cur.style.transition = "opacity 0.2s ease, transform 0.2s ease";
  cur.style.opacity = "0"; cur.style.transform = "translateX(24px)";
  setTimeout(function() {
    cur.style.display = "none"; cur.style.opacity = ""; cur.style.transform = "";
    currentFormStep--;
    prev.style.display = "block"; prev.style.opacity = "0"; prev.style.transform = "translateX(-24px)";
    setTimeout(function() { prev.style.opacity = "1"; prev.style.transform = "translateX(0)"; }, 16);
    updateFormStepUI();
  }, 200);
}

function updateFormStepUI() {
  var meta = formStepMeta[currentFormStep - 1];
  var labelEl    = document.getElementById("step-label");
  var counterEl  = document.getElementById("step-counter");
  var progressEl = document.getElementById("form-progress-fill");
  if (labelEl)    labelEl.textContent   = meta.label;
  if (counterEl)  counterEl.textContent = "Step " + currentFormStep + " of " + totalFormSteps;
  if (progressEl) progressEl.style.width = meta.progress + "%";
  for (var i = 1; i <= totalFormSteps; i++) {
    var dot = document.getElementById("dot-" + i);
    if (dot) {
      if (i < currentFormStep) {
        dot.style.background = "#22c55e"; dot.style.color = "#fff"; dot.textContent = "✓";
      } else if (i === currentFormStep) {
        dot.style.background = "linear-gradient(135deg,#4DA3FF,#8b5cf6)"; dot.style.color = "#fff"; dot.textContent = String(i);
      } else {
        dot.style.background = ""; dot.style.color = ""; dot.textContent = String(i);
      }
    }
    var line = document.getElementById("dot-line-" + i);
    if (line) line.style.background = i < currentFormStep ? "#22c55e" : "";
  }
  var prevBtn   = document.getElementById("form-btn-prev");
  var nextBtn   = document.getElementById("form-btn-next");
  var submitBtn = document.getElementById("form-btn-submit");
  if (prevBtn)   prevBtn.style.display   = currentFormStep > 1 ? "block" : "none";
  if (nextBtn)   nextBtn.style.display   = currentFormStep < totalFormSteps ? "flex" : "none";
  if (submitBtn) submitBtn.style.display = currentFormStep === totalFormSteps ? "block" : "none";
  var errEl = document.getElementById("form-error-msg");
  if (errEl) errEl.style.display = "none";
}

function scrollToApplyForm() {
  var el = document.getElementById("apply-form");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function openModal() {
  scrollToApplyForm();
}

function closeModal() { document.getElementById("modal").style.display = "none"; }

async function submitApplication(e) {
  e.preventDefault();
  var form = e.target;
  var btn = form.querySelector("button[type=submit]");
  btn.disabled = true;
  btn.textContent = currentLang === "th" ? "กำลังส่ง..." : "Submitting...";

  var data = {};
  var inputs = form.querySelectorAll("input,select,textarea");
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].name && inputs[i].name !== "_honey") {
      data[inputs[i].name] = inputs[i].value;
    }
  }
  data["_subject"] = "New SV Academy Application — " + (data["full_name"] || "Unknown");
  // Source tracking: capture ?source= from the URL so we can tell booth-QR
  // applications apart from organic web ones.
  try {
    data["source"] = new URLSearchParams(window.location.search).get("source") || "web";
  } catch (e) { data["source"] = "web"; }

  try {
    // Send to Formspree (existing path — email notifications + backup).
    var formspreePromise = fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(data)
    });

    // Send to Google Sheets in parallel (our owned data store).
    // Uses text/plain content type to avoid CORS preflight against the
    // Apps Script web app endpoint.
    var sheetsPromise = SHEETS_ENDPOINT
      ? fetch(SHEETS_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(data)
        })
      : Promise.reject(new Error("sheets endpoint not configured"));

    // Succeed if EITHER endpoint accepts the submission.
    var results = await Promise.allSettled([formspreePromise, sheetsPromise]);
    var anyOk = results.some(function (r) {
      return r.status === "fulfilled" && r.value && r.value.ok;
    });
    if (!anyOk) {
      var firstError = results.find(function (r) { return r.status === "rejected"; });
      throw new Error(firstError ? String(firstError.reason) : "all endpoints failed");
    }

    var nick = (data["nickname"] || "").trim();
    var greeting = nick ? "Thanks, " + nick + "! " : "";
    var thaiGreeting = nick ? "ขอบคุณ " + nick + "! " : "";
    document.getElementById("apply-form-success-msg").innerHTML =
      greeting + "We’ve received your application and will be in touch within 3–5 days." +
      "<br><span style=\"font-size:14px;color:var(--text3)\">" + thaiGreeting + "เราได้รับใบสมัครแล้ว และจะติดต่อกลับภายใน 3–5 วัน</span>";
    document.getElementById("apply-form-content").style.display = "none";
    document.getElementById("apply-form-success").style.display = "block";
  } catch (err) {
    btn.disabled = false;
    btn.textContent = currentLang === "th" ? "ส่งใบสมัคร / Submit Application" : "Submit Application / ส่งใบสมัคร";
    alert(currentLang === "th" ? "เกิดข้อผิดพลาด กรุณาลองใหม่" : "Submission failed. Please try again.");
  }
}

async function submitEmail(e) {
  e.preventDefault();
  scrollToApplyForm();
}

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
document.addEventListener("keydown", function(e) { if (e.key === "Escape") { if (mobileMenuOpen) closeMobileMenu(); } });

if (window.innerWidth >= 640) document.getElementById("nav-brand").style.display = "flex";
window.addEventListener("resize", function() { document.getElementById("nav-brand").style.display = window.innerWidth >= 640 ? "flex" : "none"; });

var storedTheme = null;
try { storedTheme = localStorage.getItem("sv-theme"); } catch(e){}
var currentTheme = storedTheme || "dark";
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
    nav_join: "Apply Now", nav_join_full: "Apply Now", nav_apply_btn: "Apply Now",
    hero_badge: "Summer 2026 &middot; Limited to 10 Students",
    hero_title_1: "Build the Future,", hero_title_2: "One App at a Time.",
    hero_desc: '<strong style="color:var(--text);font-weight:500">P6‑M3</strong> students design, build, and ship a real AI‑powered app in 5 weeks — mentored by <strong style="color:var(--text);font-weight:500">Silicon Valley engineers</strong>.',
    hero_no_code: "No coding experience needed.",
    stat_sat: "Saturdays", stat_stu: "Students Max", stat_app: "Real App", stat_men: "Mentors",
    cta_apply: "Apply Now", cta_join: "Apply Now",
    mentors_label: "Your Mentors", mentors_title: "Guided by builders,<br>not textbooks.",
    dot_prom: "Prom", dot_march: "March", dot_charlie: "Charlie",
    prom_role: "Creative Director & Operations Lead",
    prom_tag2: "Asst. Director", prom_tag4: "Graphic Design",
    prom_bio: "Assistant Director at Lertlah School with a BA in Graphic Communication & Design from the University of Sunderland, UK. Prom leads promotional strategy, application design, and in-class creative coaching — teaching students to use AI-powered UI design tools for polished results.",
    march_role: "Technical Lead",
    march_bio: "Senior Software Engineer at Magic Eden in San Francisco with deep expertise in Web3, distributed systems, and product engineering. Previously shipped production systems at Uniswap Labs, Amazon, and Databricks. Chulalongkorn undergrad, Johns Hopkins master’s. On-site in Bangkok for all 5 sessions.",
    charlie_role: "Infrastructure & Backend",
    charlie_bio: "Senior Software Engineer at Robinhood. Previously built autonomous delivery at Google X’s Wing and hyper-scale infrastructure at Meta. Expert in backend systems, infrastructure, and scaling. Leads technical architecture and Demo Day coaching. On-site for all 5 sessions.",
    program_label: "The Program", program_title: "5 Saturdays.<br>1 real app.",
    program_desc: "Every Saturday 9:00 AM – 12:00 PM at the Lertlah School Apple Computer Lab. Pre-configured machines, professional environment — no laptop required.",
    w1_label: "Week 1", w1_title: "The Blueprint",
    w1_desc: "Meet the tools (Claude Chat, Stitch, Claude Code, Vercel, GitHub). Learn what a prompt is, how AI works, and key terminology. Build a template app together. Then start YOUR app — write a PRD with KPIs and design your first UI.",
    w1_deliverables: "Template app deployed &middot; PRD complete &middot; V1 design started",
    w2_label: "Week 2", w2_title: "Debug & Polish",
    w2_desc: "Quiz on Week 1 concepts. Build your app — design, code, preview, fix. Install analytics and error tracking. Push to GitHub. Deploy to Vercel. Your app is now LIVE.",
    w2_deliverables: "App deployed with live URL &middot; analytics installed &middot; code on GitHub",
    w3_label: "Week 3", w3_title: "Ship & Observe",
    w3_desc: "Peer critique session — learn constructive feedback, present your app, get real comments. Improve based on feedback. Update your PRD. Add automated tests. Learn what ‘regression’ means and why it matters.",
    w3_deliverables: "Improved app &middot; updated PRD &middot; test cases added",
    w4_label: "Week 4", w4_title: "Feature Sprint",
    w4_desc: "Analyze real user data — page views, latency, daily users, error logs, web vitals. Build new features based on data and user feedback. Prepare your 5-slide pitch deck for Demo Day.",
    w4_deliverables: "New feature shipped &middot; pitch deck ready",
    w5_label: "Week 5", w5_title: "The Keynote",
    w5_desc: "Final polish. Parents arrive at 10:30. Each student pitches their app: 3 minutes + 2 minutes Q&amp;A. Certificates awarded. You are now an app builder.",
    w5_deliverables: "Pitch delivered &middot; certificate earned &middot; app live",
    learn_label: "What You'll Learn",
    learn_title: "What You'll Actually Learn",
    learn_01: "01", learn_01_title: "Product Thinking",
    learn_01_desc: "Plan what to build, why you’re building it, and who will use it. Write a PRD like a real product manager at a tech company.",
    learn_02: "02", learn_02_title: "AI Literacy",
    learn_02_desc: "Use AI as a real building tool — not just a toy. Learn to prompt, direct, and iterate with AI to create production-quality apps.",
    learn_03: "03", learn_03_title: "Ship It",
    learn_03_desc: "Build a real app, deploy it on the internet, get real users, analyze real data, and present it to parents on Demo Day.",
    workflow_label: "The Workflow", workflow_title: "Design. Build. Ship. Repeat.",
    tool1_name: "Stitch", tool1_sub: "Design",
    tool1_desc: "Turn your idea into a pixel-perfect UI with Google’s AI design tool. Describe what you want, refine until you’re happy — no Figma skills needed.",
    tool2_name: "Claude Code", tool2_sub: "Build",
    tool2_desc: "AI pair-programs with you to turn designs into a working app. NextJS frontend, NestJS backend, TypeScript — real production code.",
    tool3_name: "Claude Chat", tool3_sub: "Brainstorm + PRD",
    tool3_desc: "Chat with Claude to brainstorm your app idea, define features, write a PRD with KPIs, and debug problems along the way.",
    tool4_name: "Vercel", tool4_sub: "Deploy",
    tool4_desc: "Ship your app to the internet with one click. Real URL, real users. Auto-deploys every time you push to GitHub.",
    tool_footer: "Powered by Claude + Stitch + Vercel &middot; All tools provided in-class",
    tech_stack: "NextJS &middot; NestJS &middot; TypeScript &middot; Postgres &middot; R2 &middot; Redis &middot; PostHog &middot; Sentry",
    show1_title: "Real Infrastructure,<br>Not Just Syntax",
    show1_desc: "Every student works with production-grade tools — NextJS, NestJS, TypeScript, Postgres, PostHog analytics, and Sentry error tracking. The same stack used by real startups.",
    show2_title: "From Idea to Live App",
    show2_desc: "Claude Chat for brainstorming, Stitch for UI design, Claude Code for building, Vercel for deployment — a complete pipeline where each step flows naturally into the next.",
    show3_title: "Demo Day:<br>Pitch Like a Founder",
    show3_desc: "On Week 5, parents attend as students present their live apps with polished pitch decks — just like real startup founders.",
    show3_btn: "Apply Now",
    prereq_label: "Before Day 1",
    prereq_title: "Before Day 1",
    prereq_sub: "Students need these 4 accounts ready — we’ll send setup instructions one week before.",
    prereq_note: "All lab computers come pre-configured with Claude Code, Git, and development tools. No laptop needed.",
    cta_title: "Reserve Your Spot", cta_sub: "Limited to 10 students per cohort. First come, first served.",
    cta_no_code: "No coding experience needed.",
    cta_price_sub: "per student &middot; 5 sessions &middot; all materials included",
    detail_date: "Jun 13 – Jul 11", detail_date_sub: "Every Saturday",
    detail_time: "9 AM – 12 PM", detail_time_sub: "3 hours / session",
    detail_grade: "P6–M3", detail_grade_sub: "Ages 11–15",
    detail_loc: "Lertlah School", detail_loc_sub: "Kanchanapisek Road",
    footer_text: "SV Academy &times; Lertlah School, Kanchanapisek Road &middot; Summer 2026",
    form_title: "Apply Now",
    form_sub: "Limited to 10 students. Tell us about yourself and your ideas.",
    form_sec1: "About You",
    form_sec2: "Your Ideas",
    form_sec3: "You as a Builder",
    form_submit: "Submit Application / ส่งใบสมัคร",
    form_success: "Application submitted! We’ll contact you via LINE within 3 days.",
    form_success_th: "ส่งใบสมัครเรียบร้อย! เราจะติดต่อกลับทาง LINE ภายใน 3 วัน",
    modal_title: "Stay in the Loop", modal_desc: "Get updates on enrollment, schedules, and early-bird offers.",
    modal_submit: "Join Mailing List", modal_success: "You’re on the list!", modal_alt: "Or apply directly via"
  },
  th: {
    nav_about: "เกี่ยวกับเรา", nav_mentors: "ที่ปรึกษา", nav_program: "โปรแกรม", nav_apply: "สมัคร",
    nav_join: "สมัครเลย", nav_join_full: "สมัครเลย", nav_apply_btn: "สมัครเลย",
    hero_badge: "ซัมเมอร์ 2569 &middot; รับจำกัดเพียง 10 คน",
    hero_title_1: "สร้างอนาคต,", hero_title_2: "ทีละแอป",
    hero_desc: 'นักเรียน<strong style="color:var(--text);font-weight:500">ป.6–ม.3</strong> ออกแบบ, สร้าง, และปล่อยแอป AI ของจริงใน 5 สัปดาห์ — โดยมี<strong style="color:var(--text);font-weight:500">วิศวกรจาก Silicon Valley</strong> เป็นที่ปรึกษา',
    hero_no_code: "ไม่ต้องเขียนโค้ดเป็นมาก่อน",
    stat_sat: "วันเสาร์", stat_stu: "นักเรียนสูงสุด", stat_app: "แอปจริง", stat_men: "ที่ปรึกษา",
    cta_apply: "สมัครเลย", cta_join: "สมัครเลย",
    mentors_label: "ที่ปรึกษาของคุณ", mentors_title: "สอนโดยผู้สร้างจริง,<br>ไม่ใช่แค่ตำราเรียน",
    dot_prom: "พรหม", dot_march: "March", dot_charlie: "Charlie",
    prom_role: "ผู้อำนวยการฝ่ายสร้างสรรค์ & บริหารงาน",
    prom_tag2: "ผู้ช่วยผู้อำนวยการ", prom_tag4: "กราฟิกดีไซน์",
    prom_bio: "ผู้ช่วยผู้อำนวยการโรงเรียนเลิศหล้า จบปริญญาตรีด้าน Graphic Communication & Design จาก University of Sunderland, UK คุณพรหมดูแลกลยุทธ์ประชาสัมพันธ์ ออกแบบแอป และสอนนักเรียนใช้เครื่องมือ AI ออกแบบ UI ในชั้นเรียน",
    march_role: "หัวหน้าฝ่ายเทคนิค",
    march_bio: "วิศวกรซอฟต์แวร์อาวุโสที่ Magic Eden ซานฟรานซิสโก เชี่ยวชาญด้าน Web3, ระบบกระจาย และวิศวกรรมผลิตภัณฑ์ เคยทำงานที่ Uniswap Labs, Amazon และ Databricks จบจากจุฬาลงกรณ์ ปริญญาโท Johns Hopkins อยู่ประจำกรุงเทพฯตลอด 5 สัปดาห์",
    charlie_role: "โครงสร้างระบบและ Backend",
    charlie_bio: "Senior Software Engineer ที่ Robinhood เคยสร้างระบบส่งของอัตโนมัติที่ Google X Wing และโครงสร้างพื้นฐานระดับโลกที่ Meta เชี่ยวชาญด้าน backend และ infrastructure ดูแลสถาปัตยกรรมระบบและโค้ช Demo Day มาสอนด้วยตัวเองทุกสัปดาห์",
    program_label: "โปรแกรม", program_title: "5 วันเสาร์<br>1 แอปจริง",
    program_desc: "ทุกวันเสาร์ 9:00 – 12:00 น. ที่ห้องคอมพิวเตอร์ Apple โรงเรียนเลิศหล้า เครื่องพร้อมใช้งาน สภาพแวดล้อมมืออาชีพ — ไม่ต้องพกแล็ปท็อปมา",
    w1_label: "สัปดาห์ที่ 1", w1_title: "พิมพ์เขียว",
    w1_desc: "รู้จักเครื่องมือทั้งหมด เรียนรู้ว่า prompt คืออะไร AI ทำงานยังไง แล้วลงมือสร้างแอพตัวอย่างด้วยกัน จากนั้นเริ่มแอปของตัวเอง เขียน PRD ตั้ง KPI แล้วออกแบบหน้าจอแรก",
    w1_deliverables: "ปล่อย template app · เขียน PRD เสร็จ · เริ่ม design V1",
    w2_label: "สัปดาห์ที่ 2", w2_title: "สร้างและขัดเกลา",
    w2_desc: "ทดสอบความรู้จากสัปดาห์แรก สร้างแอปของตัวเอง ออกแบบ เขียนโค้ด ดูตัวอย่าง แก้บัค ติดตั้งระบบวิเคราะห์ข้อมูล และ deploy ขึ้น internet แอปของเธอจะ live จริงๆ",
    w2_deliverables: "ปล่อยแอปมี URL จริง · ติดตั้ง analytics · โค้ดอยู่บน GitHub",
    w3_label: "สัปดาห์ที่ 3", w3_title: "ปล่อยแอปและสังเกตการณ์",
    w3_desc: "เซสชั่นวิจารณ์เชิงสร้างสรรค์ นำเสนอแอปต่อเพื่อนและ mentor รับ feedback จริง ปรับปรุงแอปตาม feedback อัพเดต PRD เพิ่ม test case อัตโนมัติ เรียนรู้คำว่า regression",
    w3_deliverables: "แอปที่ดีขึ้น · อัพเดต PRD · เพิ่ม test case",
    w4_label: "สัปดาห์ที่ 4", w4_title: "สปรินท์ฟีเจอร์ใหม่",
    w4_desc: "วิเคราะห์ข้อมูลจากผู้ใช้จริง ดูว่าคนใช้แอปยังไง เจอ error ตรงไหน สร้างฟีเจอร์ใหม่จากข้อมูลและ feedback เตรียมสไลด์ 5 แผ่นสำหรับ Demo Day",
    w4_deliverables: "ปล่อยฟีเจอร์ใหม่ · สไลด์ pitch deck พร้อม",
    w5_label: "สัปดาห์ที่ 5", w5_title: "วันนำเสนอ",
    w5_desc: "ขัดเกลาครั้งสุดท้าย ผู้ปกครองมาถึง 10:30 นักเรียนแต่ละคนนำเสนอแอป 3 นาที + ถามตอบ 2 นาที รับใบประกาศ ตอนนี้เธอเป็นคนสร้างแอปแล้ว",
    w5_deliverables: "นำเสนอ pitch เสร็จ · รับใบประกาศ · แอป live",
    learn_label: "สิ่งที่จะได้เรียนรู้",
    learn_title: "สิ่งที่จะได้เรียนรู้จริงๆ",
    learn_01: "01", learn_01_title: "คิดแบบคนสร้างโปรดักต์",
    learn_01_desc: "วางแผนว่าจะสร้างอะไร ทำไมถึงสร้าง ใครจะใช้ เขียน PRD เหมือน product manager ในบริษัทเทคจริงๆ",
    learn_02: "02", learn_02_title: "รู้จักใช้ AI เป็นเครื่องมือ",
    learn_02_desc: "ใช้ AI เป็นเครื่องมือสร้างของจริง ไม่ใช่แค่ของเล่น เรียนรู้วิธีสั่ง วิธีปรับ วิธีทำงานร่วมกับ AI จนได้ผลงานระดับมืออาชีพ",
    learn_03: "03", learn_03_title: "ปล่อของจริง",
    learn_03_desc: "สร้างแอปจริง ปล่อยขึ้น internet มีคนใช้จริง วิเคราะห์ข้อมูลจริง แล้วนำเสนอต่อหน้าผู้ปกครองใน Demo Day",
    workflow_label: "เวิร์คโฟลว์", workflow_title: "ออกแบบ. สร้าง. ปล่อย. ทำซ้ำ.",
    tool1_name: "Stitch", tool1_sub: "ออกแบบ",
    tool1_desc: "เปลี่ยนไอเดียให้เป็นหน้าตาแอปสวยๆ ด้วย AI แค่บอกว่าอยากได้แบบไหน ปรับแต่งจนพอใจ ไม่ต้องเป็น Figma",
    tool2_name: "Claude Code", tool2_sub: "สร้างแอป",
    tool2_desc: "AI เขียนโค้ดคู่กับเธอ เปลี่ยน design เป็นแอปที่ใช้งานได้จริง ใช้ NextJS, NestJS, TypeScript เหมือนบริษัทเทคจริงๆ",
    tool3_name: "Claude Chat", tool3_sub: "ระดมไอเดีย + PRD",
    tool3_desc: "คุยกับ Claude เพื่อระดมไอเดีย วางแผนฟีเจอร์ เขียน PRD ตั้ง KPI และช่วยแก้ปัญหาระหว่างทาง",
    tool4_name: "Vercel", tool4_sub: "ปล่อย",
    tool4_desc: "ปล่อยแอปขึ้น internet คลิกเดียว ได้ URL จริง มีคนใช้จริง อัพเดตอัตโนมัติทุกครั้งที่ push โค้ด",
    tool_footer: "ขับเคลื่อนด้วย Claude + Stitch + Vercel &middot; เครื่องมือทั้งหมดจัดให้ในชั้นเรียน",
    tech_stack: "NextJS &middot; NestJS &middot; TypeScript &middot; Postgres &middot; R2 &middot; Redis &middot; PostHog &middot; Sentry",
    show1_title: "เครื่องมือระดับมืออาชีพ,<br>ไม่ใช่แค่ของเล่น",
    show1_desc: "นักเรียนทุกคนใช้เครื่องมือระดับ production จริงๆ ทั้ง NextJS, NestJS, TypeScript, Postgres, PostHog, Sentry เหมือนที่ startup จริงๆ ใช้",
    show2_title: "จากไอเดียสู่แอปที่ใช้ได้จริง",
    show2_desc: "Claude Chat ระดมไอเดีย Stitch ออกแบบ UI Claude Code สร้างแอป Vercel ปล่อยแอป ทุกขั้นตอนต่อเนื่องกันเป็นธรรมชาติ",
    show3_title: "Demo Day:<br>พิทช์แบบผู้ก่อตั้ง",
    show3_desc: "สัปดาห์ที่ 5 ผู้ปกครองร่วมชมนักเรียนนำเสนอแอปพร้อมสไลด์พิทช์มืออาชีพ — เหมือนผู้ก่อตั้งสตาร์ทอัพจริง",
    show3_btn: "สมัครเลย",
    prereq_label: "ก่อนเริ่มเรียนวันแรก",
    prereq_title: "ก่อนเริ่มเรียนวันแรก",
    prereq_sub: "นักเรียนต้องเตรียม 4 บัญชีนี้ให้พร้อม เราจะส่งวิธีตั้งค่าให้ 1 สัปดาห์ก่อนเริ่ม",
    prereq_note: "คอมพิวเตอร์ในห้องเรียนติดตั้งเครื่องมือทุกอย่างไว้แล้ว ไม่ต้องเอาแล็ปท็อปมา",
    cta_title: "จองที่นั่งของคุณ", cta_sub: "รับจำกัดเพียง 10 คนต่อรุ่น มาก่อนได้ก่อน",
    cta_no_code: "ไม่ต้องเขียนโค้ดเป็นมาก่อน",
    cta_price_sub: "ต่อนักเรียน &middot; 5 ครั้ง &middot; รวมอุปกรณ์ทั้งหมด",
    detail_date: "13 มิ.ย. – 11 ก.ค.", detail_date_sub: "ทุกวันเสาร์",
    detail_time: "9:00 – 12:00 น.", detail_time_sub: "3 ชั่วโมง / ครั้ง",
    detail_grade: "ป.6–ม.3", detail_grade_sub: "อายุ 11–15 ปี",
    detail_loc: "โรงเรียนเลิศหล้า", detail_loc_sub: "ถ.กาญจนาภิเษก",
    footer_text: "SV Academy &times; โรงเรียนเลิศหล้า ถ.กาญจนาภิเษก &middot; ซัมเมอร์ 2569",
    form_title: "สมัครเรียน",
    form_sub: "รับแค่ 10 คน เล่าให้เราฟังเกี่ยวกับตัวเองและไอเดียของเธอ",
    form_sec1: "เกี่ยวกับตัวเอง",
    form_sec2: "ไอเดียของเธอ",
    form_sec3: "ตัวตนในฐานะคนสร้าง",
    form_submit: "ส่งใบสมัคร / Submit Application",
    form_success: "ส่งใบสมัครเรียบร้อย! เราจะติดต่อกลับทาง LINE ภายใน 3 วัน",
    form_success_th: "ส่งใบสมัครเรียบร้อย! เราจะติดต่อกลับทาง LINE ภายใน 3 วัน",
    modal_title: "ติดตามข่าวสาร", modal_desc: "รับอัปเดตการรับสมัคร ตารางเรียน และโปรโมชั่นพิเศษ",
    modal_submit: "ลงทะเบียน", modal_success: "ลงทะเบียนสำเร็จ!", modal_alt: "หรือสมัครโดยตรงผ่าน"
  }
};

var storedLang = null;
try { storedLang = localStorage.getItem("sv-lang"); } catch(e){}
var currentLang = storedLang === "th" ? "th" : "en";

function applyLang() {
  document.documentElement.setAttribute("data-lang", currentLang);
  document.documentElement.setAttribute("lang", currentLang);
  var btn = document.getElementById("lang-btn");
  if (btn) btn.textContent = currentLang === "en" ? "TH" : "EN";
  var els = document.querySelectorAll("[data-i18n]");
  for (var i = 0; i < els.length; i++) {
    var key = els[i].getAttribute("data-i18n");
    if (translations[currentLang] && translations[currentLang][key]) {
      els[i].innerHTML = translations[currentLang][key];
    }
  }
  document.documentElement.classList.remove("lang-loading");
}

function toggleLang() {
  currentLang = currentLang === "en" ? "th" : "en";
  try { localStorage.setItem("sv-lang", currentLang); } catch(e){}
  applyLang();
}

applyLang();

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

var mentorAutoRotate = true;
document.querySelectorAll(".slide-dot").forEach(function(dot) {
  dot.addEventListener("click", function() {
    goToSlide(parseInt(this.getAttribute("data-goto")));
    mentorAutoRotate = false;
    clearInterval(slideInterval);
  });
});
var mentorSlideshow = document.getElementById("mentor-slideshow");
if (mentorSlideshow) {
  mentorSlideshow.addEventListener("mouseenter", function() { clearInterval(slideInterval); });
  mentorSlideshow.addEventListener("mouseleave", function() { if (mentorAutoRotate) startSlideshow(); });
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
