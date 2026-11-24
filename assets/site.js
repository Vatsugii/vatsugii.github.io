/* Vatsugii — tiny progressive enhancements. No dependencies. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Reveal content as it enters the viewport. Runs once per element. */
  var reveals = document.querySelectorAll("[data-reveal]");
  if (reduced || !("IntersectionObserver" in window)) {
    for (var i = 0; i < reveals.length; i++) {
      reveals[i].classList.add("is-revealed");
    }
  } else {
    var observed = false;
    var observer = new IntersectionObserver(
      function (entries, obs) {
        observed = true;
        for (var j = 0; j < entries.length; j++) {
          if (!entries[j].isIntersecting) continue;
          entries[j].target.classList.add("is-revealed");
          obs.unobserve(entries[j].target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );
    for (var k = 0; k < reveals.length; k++) {
      observer.observe(reveals[k]);
    }

    /* Failsafe for embedded previews that never deliver observer callbacks. */
    window.setTimeout(function () {
      if (observed) return;
      for (var f = 0; f < reveals.length; f++) {
        reveals[f].classList.add("is-revealed");
      }
      observer.disconnect();
    }, 1200);
  }

  /* Reading progress bar, present on mod posts only. */
  var bar = document.querySelector("[data-reading-progress]");
  if (bar) {
    var queued = false;

    function paint() {
      var doc = document.documentElement;
      var range = doc.scrollHeight - window.innerHeight;
      var value = range > 0 ? Math.min(1, Math.max(0, window.pageYOffset / range)) : 0;
      bar.style.transform = "scaleX(" + value.toFixed(4) + ")";
      queued = false;
    }

    function onScroll() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(paint);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    paint();
  }

  /* Loader filter, present on the mods page only. */
  var chips = document.querySelectorAll("[data-filter]");
  if (chips.length) {
    var cards = document.querySelectorAll("[data-loaders]");
    var status = document.querySelector("[data-filter-status]");

    function apply(chip) {
      var filter = chip.getAttribute("data-filter");

      for (var c = 0; c < chips.length; c++) {
        chips[c].setAttribute("aria-pressed", chips[c] === chip ? "true" : "false");
      }

      for (var m = 0; m < cards.length; m++) {
        var loaders = " " + (cards[m].getAttribute("data-loaders") || "") + " ";
        cards[m].hidden =
          filter !== "all" && loaders.indexOf(" " + filter + " ") === -1;
      }

      if (status) {
        status.textContent =
          filter === "all"
            ? "Showing all mods."
            : "Showing mods for " + chip.textContent.trim() + ".";
      }
    }

    for (var n = 0; n < chips.length; n++) {
      chips[n].addEventListener("click", function () {
        apply(this);
      });
    }
  }
})();
