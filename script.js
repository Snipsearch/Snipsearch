const apiKey = 'AIzaSyDFliUSc0-bUmwbM1YR4wmQXk5wVgGV6-A';
const cx = 'c7621a78e53794892';
const newsApiKey = 'pub_8058222c107541d88e82662dd2739bf4';

function search() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return;

  document.getElementById("homePanels").style.display = "none";

  fetchWikipedia(query);
  fetchGoogleResults(query);
}

function goHome() {
  document.getElementById("results").innerHTML = "";
  document.getElementById("wiki-results").innerHTML = "";
  document.getElementById("homePanels").style.display = "block";
  document.getElementById("searchInput").value = "";
}

// ✅ Fixed Wikipedia fetch: exact title only
function fetchWikipedia(query) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.extract) {
        document.getElementById("wiki-results").innerHTML = `
          <h3>SnipInfo: ${data.title}</h3>
          <p>${data.extract}</p>
          <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}" target="_blank">Read more</a>
        `;
      } else {
        document.getElementById("wiki-results").innerHTML = `<p>No info found on Snipsearch for "${query}".</p>`;
      }
    })
    .catch(err => {
      console.error("Wikipedia error:", err);
      document.getElementById("wiki-results").innerHTML = "<p>Failed to load Snipnfo.</p>";
    });
}

function fetchGoogleResults(query) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.items && data.items.length > 0) {
        data.items.forEach(item => {
          const card = document.createElement("div");
          card.className = "result-card";

          let imageHTML = "";
          if (item.pagemap?.cse_image?.length) {
            const imgSrc = item.pagemap.cse_image[0].src;
            imageHTML = `<img src="${imgSrc}" alt="thumbnail" class="result-image" />`;
          }

          card.innerHTML = `
            ${imageHTML}
            <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
            <p>${item.snippet}</p>
          `;

          resultsDiv.appendChild(card);
        });
      } else {
        resultsDiv.innerHTML = "<p>No results found.</p>";
      }
    })
    .catch(error => {
      console.error("Search error:", error);
      resultsDiv.innerHTML = "<p>Search failed. Please try again.</p>";
    });
}

function fetchTopNews() {
  const newsContainer = document.getElementById("newsApiResults");
  newsContainer.innerHTML = "Loading top news...";

  fetch(`https://newsdata.io/api/1/news?apikey=${newsApiKey}&language=en&country=in&category=top`)
    .then(response => response.json())
    .then(data => {
      newsContainer.innerHTML = "";

      if (data.results && data.results.length > 0) {
        data.results.slice(0, 10).forEach(news => {
          const card = document.createElement("div");
          card.className = "result-card";

          const imageHTML = news.image_url
            ? `<img src="${news.image_url}" alt="news" class="result-image" />`
            : "";

          card.innerHTML = `
            ${imageHTML}
            <h3><a href="${news.link}" target="_blank">${news.title}</a></h3>
            <p>${news.description || ""}</p>
          `;

          newsContainer.appendChild(card);
        });
      } else {
        newsContainer.innerHTML = "<p>No news found.</p>";
      }
    })
    .catch(err => {
      console.error("News API error:", err);
      newsContainer.innerHTML = "<p>Failed to load news.</p>";
    });
}

// Auto-load top news
document.addEventListener("DOMContentLoaded", fetchTopNews);