(function () {
  // Highlight external links with an icon for clarity
  const isExternal = (link) => link.host && link.host !== window.location.host;
  const decorate = (link) => {
    if (link.dataset.enhanced === "true") return;
    link.dataset.enhanced = "true";
    const icon = document.createElement("span");
    icon.setAttribute("aria-hidden", "true");
    icon.className = "external-link-icon";
    icon.textContent = "↗";
    icon.style.marginLeft = "0.35rem";
    icon.style.fontSize = "0.85em";
    link.appendChild(icon);
  };

  const markExternalLinks = () => {
    const links = document.querySelectorAll(".md-content a[href]");
    links.forEach((link) => {
      if (isExternal(link)) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        decorate(link);
      }
    });
  };

  document.addEventListener("DOMContentLoaded", markExternalLinks);
  document.addEventListener("navigation", markExternalLinks);
})();
