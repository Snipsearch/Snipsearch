const API_KEY = "AIzaSyDFliUSc0-bUmwbM1YR4wmQXk5wVgGV6-A";
const CX = "c7621a78e53794892";

function search() {
  const query = document.getElementById("searchInput").value;
  if (!query) return;

  const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const results = data.items || [];
      const container = document.getElementById("results");
      container.innerHTML = "";

      results.forEach(item => {
        const card = document.createElement("div");
        card.className = "result-card";
        card.innerHTML = `
          <a href="${item.link}" target="_blank">${item.title}</a>
          <p>${item.snippet}</p>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Search Error:", err);
      document.getElementById("results").innerHTML = "<p>Something went wrong. Try again.</p>";
    });
}