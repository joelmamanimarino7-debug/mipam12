document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  var header = document.getElementById("siteHeader");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });
      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    }
  }

  // Toggle Castellano / Qhishwa
  var langToggle = document.getElementById("langToggle");
  if (langToggle) {
    langToggle.addEventListener("click", function () {
      var toQu = document.documentElement.lang !== "qu";
      document.documentElement.lang = toQu ? "qu" : "es";
      document.querySelectorAll('[data-lang="es"]').forEach(function (el) {
        el.hidden = toQu;
      });
      document.querySelectorAll('[data-lang="qu"]').forEach(function (el) {
        el.hidden = !toQu;
      });
    });
  }

  // Agregar al calendario (Google Calendar)
  document.querySelectorAll(".btn-cal").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var title = btn.getAttribute("data-cal-title");
      var range = btn.getAttribute("data-cal-time").split("-");
      var today = new Date();
      var day = today.getDay();
      var nextSunday = new Date(today);
      nextSunday.setDate(today.getDate() + ((7 - day) % 7));
      var fmt = function (dateStr, timeStr) {
        var parts = timeStr.split(":");
        var d = new Date(nextSunday);
        d.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0);
        return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      };
      var start = fmt(nextSunday, range[0]);
      var end = fmt(nextSunday, range[1]);
      var url = "https://calendar.google.com/calendar/render?action=TEMPLATE"
        + "&text=" + encodeURIComponent(title)
        + "&dates=" + start + "/" + end
        + "&location=" + encodeURIComponent("Calle Demetrio Canelas # 50, Sucre, Bolivia");
      window.open(url, "_blank", "noopener");
    });
  });

  // "Hice esta oración" — muestra mensaje de bienvenida antes de ir a WhatsApp
  var hicePrayerBtn = document.getElementById("hicePrayerBtn");
  var welcomeMessage = document.getElementById("welcomeMessage");
  if (hicePrayerBtn && welcomeMessage) {
    hicePrayerBtn.addEventListener("click", function () {
      hicePrayerBtn.hidden = true;
      welcomeMessage.hidden = false;
      requestAnimationFrame(function () {
        welcomeMessage.classList.add("is-visible");
      });
      welcomeMessage.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  // Petición de oración por WhatsApp
  var prayerForm = document.getElementById("prayerForm");
  if (prayerForm) {
    prayerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("prayerName").value.trim();
      var request = document.getElementById("prayerRequest").value.trim();
      var text = "Hola, soy " + name + ". Quisiera que oren por mí: " + request;
      window.open("https://wa.me/59167600229?text=" + encodeURIComponent(text), "_blank", "noopener");
      prayerForm.reset();
    });
  }
});
