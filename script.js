(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var menuToggle = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".nav");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var setScrolled = function () {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });

  var closeMenu = function () {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.querySelector(".sr-only").textContent = "메뉴 열기";
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMenu();
        return;
      }
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.querySelector(".sr-only").textContent = "메뉴 닫기";
      nav.classList.add("is-open");
      document.body.classList.add("menu-open");
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  var revealGroups = document.querySelectorAll("section, .work-grid, .skills-grid");
  revealGroups.forEach(function (group) {
    var items = group.querySelectorAll(".reveal");
    items.forEach(function (item, index) {
      item.style.transitionDelay = Math.min(index * 80, 320) + "ms";
    });
  });

  var revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
      item.style.transitionDelay = "0ms";
    });
  }

  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var linkForId = {};
  navLinks.forEach(function (link) {
    var id = link.getAttribute("href").replace("#", "");
    linkForId[id] = link;
  });

  if ("IntersectionObserver" in window && sections.length) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.remove("is-active");
          });
          var active = linkForId[entry.target.id];
          if (active) active.classList.add("is-active");
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  var heroArt = document.querySelector(".hero-art");
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (heroArt && canHover && !reduceMotion) {
    heroArt.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
    window.addEventListener("mousemove", function (event) {
      var x = event.clientX / window.innerWidth - 0.5;
      var y = event.clientY / window.innerHeight - 0.5;
      heroArt.style.transform = "rotateX(" + (-y * 6).toFixed(2) + "deg) rotateY(" + (x * 8).toFixed(2) + "deg)";
    });
  }
})();
