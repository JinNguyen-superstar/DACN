document.addEventListener("DOMContentLoaded", () => {
  includeHTML();
});

function includeHTML() {
  const elements = document.querySelectorAll("[data-include]");
  elements.forEach(async (el) => {
    const file = el.getAttribute("data-include");
    try {
      const response = await fetch(file);
      if (response.ok) {
        const html = await response.text();
        el.innerHTML = html;
      } else {
        el.innerHTML = "<p>Không thể tải component.</p>";
      }
    } catch (error) {
      el.innerHTML = "<p>Lỗi khi tải component.</p>";
    }
  });
}
