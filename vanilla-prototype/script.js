const projects = document.querySelectorAll(".project");

const openObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const folder = entry.target.querySelector(".folder");
        folder.classList.add("is-open");
      }
    });
  },
  { rootMargin: "0px 0px -35% 0px", threshold: 0 }
);

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-active", entry.isIntersecting);
    });
  },
  { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
);

projects.forEach((project) => {
  openObserver.observe(project);
  activeObserver.observe(project);
});
