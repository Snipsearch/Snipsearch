const apiKey = 'AIzaSyCgeuFocEiV9szrWo93pTT7qTGWc9sveH8';
const cx = 'c7621a78e53794892';
const gnewsApiKey = '13463084aadb9cde1f92844c1ba2acc2';

// Sidebar Toggle Function
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
}

// Close sidebar when clicking on overlay
document.addEventListener('DOMContentLoaded', function() {
  const overlay = document.getElementById('sidebarOverlay');
  if (overlay) {
    overlay.addEventListener('click', toggleSidebar);
  }

  // Close sidebar on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const sidebar = document.getElementById('sidebar');
      if (sidebar.classList.contains('active')) {
        toggleSidebar();
      }
    }
  });

  // Load news on page load
  fetchTopNews();
});

function search() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return;

  // ✅ Check static links from external file
  if (typeof checkStaticLinks === "function" && checkStaticLinks(query)) {
    return;
  }

  document.getElementById("homePanels").style.display = "none";
  document.getElementById("searchResultsSection").style.display = "block";

  clearAllResults();

  fetchWikipediaFullArticle(query);
  fetchGoogleResults(query);

  if (/\d+/.test(query)) {
    fetchNumbersFact(query);
  }

  fetchDuckDuckGoResults(query);

  if (query.length > 3) {
    fetchRandomFact();
  }
}

function goHome() {
  clearAllResults();
  document.getElementById("searchResultsSection").style.display = "none";
  document.getElementById("homePanels").style.display = "block";
  document.getElementById("searchInput").value = "";
}

function clearAllResults() {
  document.getElementById("results").innerHTML = "";
  document.getElementById("wiki-results").innerHTML = "";
  document.getElementById("numbers-results").innerHTML = "";
  document.getElementById("duckduckgo-results").innerHTML = "";
  document.getElementById("facts-results").innerHTML = "";
}

// Wikipedia fetch
function fetchWikipediaFullArticle(query) {
  const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
  fetch(summaryUrl)
    .then(response => response.json())
    .then(data => {
      if (data.extract) {
        const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(data.title)}&prop=extracts|pageimages&exintro=false&explaintext=true&pithumbsize=400&origin=*`;
        fetch(contentUrl)
          .then(response => response.json())
          .then(contentData => {
            const pages = contentData.query.pages;
            const pageId = Object.keys(pages)[0];
            const fullContent = pages[pageId].extract;
            const thumbnail = pages[pageId].thumbnail?.source;
            const content = fullContent ? fullContent.substring(0, 2000) + '...' : data.extract;

            document.getElementById("wiki-results").innerHTML = `
              <h3>SnipInfo.: ${data.title}</h3>
              ${thumbnail ? `<img src="${thumbnail}" alt="${data.title}" class="wiki-image" />` : ""}
              <div class="wiki-summary">
                <p><strong>Summary:</strong> ${data.extract}</p>
              </div>
              <div class="wiki-full-content">
                <h4>Full Article Preview:</h4>
                <p>${content}</p>
              </div>
              <div class="wiki-actions">
                <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}" target="_blank" class="wiki-link">Read Full Article →</a>
                ${data.content_urls && data.content_urls.desktop ? `<a href="${data.content_urls.desktop.page}" target="_blank" class="wiki-link">Mobile Version →</a>` : ''}
              </div>
            `;
          })
          .catch(() => {
            document.getElementById("wiki-results").innerHTML = `
              <h3>SnipInfo.: ${data.title}</h3>
              <p>${data.extract}</p>
              <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}" target="_blank" class="wiki-link">Read Full Article →</a>
            `;
          });
      } else {
        document.getElementById("wiki-results").innerHTML = `
          <div class="no-results">
            <h3>SnipInfo.</h3>
            <p>No SnipInfo. found for "${query}"</p>
          </div>
        `;
      }
    })
    .catch(err => {
      console.error("Wikipedia error:", err);
      document.getElementById("wiki-results").innerHTML = `
        <div class="error-message">
          <h3>SnipInfo.</h3>
          <p>Unable to fetch SnipInfo. content</p>
        </div>
      `;
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

function fetchDuckDuckGoResults(query) {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      let content = '';
      if (data.Answer) content += `<div class="ddg-answer"><strong>💡 Quick Answer:</strong> ${data.Answer}</div>`;
      if (data.Abstract) {
        content += `<div class="ddg-abstract"><strong>📝 Summary:</strong> ${data.Abstract}</div>`;
        if (data.AbstractSource) content += `<div class="ddg-source"><small>Source: ${data.AbstractSource}</small></div>`;
      }
      if (data.Definition) {
        content += `<div class="ddg-definition"><strong>📚 Definition:</strong> ${data.Definition}</div>`;
        if (data.DefinitionSource) content += `<div class="ddg-source"><small>Source: ${data.DefinitionSource}</small></div>`;
      }
      if (content) {
        document.getElementById("duckduckgo-results").innerHTML = `<h3>Instant Answer</h3>${content}`;
      }
    })
    .catch(err => {
      console.error("DuckDuckGo API error:", err);
    });
}

function fetchRandomFact() {
  const url = 'https://uselessfacts.jsph.pl/random.json?language=en';
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.text) {
        document.getElementById("facts-results").innerHTML = `
          <h3>🎯 Interesting Fact</h3>
          <p>${data.text}</p>
          <small>💡 Did you know? • Source: Snipsearch Insights</small>
        `;
      }
    })
    .catch(err => {
      console.error("Facts API error:", err);
    });
}

function fetchNumbersFact(query) {
  const numberMatch = query.match(/\d+/);
  if (!numberMatch) return;
  const number = numberMatch[0];
  const url = `http://numbersapi.com/${number}`;
  fetch(url)
    .then(response => response.text())
    .then(data => {
      document.getElementById("numbers-results").innerHTML = `
        <h3>🔢 Numbers Fact: ${number}</h3>
        <p>${data}</p>
        <small>📊 Mathematical</small>
      `;
    })
    .catch(err => {
      console.error("NumbersAPI error:", err);
    });
}

function fetchTopNews() {
  const newsContainer = document.getElementById("newsApiResults");
  newsContainer.innerHTML = "Loading global news...";
  const gnewsUrl = `https://gnews.io/api/v4/top-headlines?token=${gnewsApiKey}&lang=en&max=10`;
  fetch(gnewsUrl)
    .then(response => response.json())
    .then(data => {
      newsContainer.innerHTML = "";
      if (data.articles && data.articles.length > 0) {
        data.articles.forEach(news => {
          const card = document.createElement("div");
          card.className = "result-card";
          const imageHTML = news.image ? `<img src="${news.image}" alt="news" class="result-image" />` : "";
          const publishedDate = new Date(news.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
          });
          card.innerHTML = `
            ${imageHTML}
            <h3><a href="${news.url}" target="_blank">${news.title}</a></h3>
            <p>${news.description || ""}</p>
            <div class="news-meta">
              <small>📰 ${news.source.name} • 🕒 ${publishedDate} • 🌍 Global</small>
            </div>
          `;
          newsContainer.appendChild(card);
        });
      } else {
        newsContainer.innerHTML = "<p>No news found.</p>";
      }
    })
    .catch(err => {
      console.error("GNews API error:", err);
      newsContainer.innerHTML = "<p>Failed to load news. Please try again later.</p>";
    });
}
document.addEventListener('DOMContentLoaded', function () {
  const popup = document.getElementById('apkPopup');
  popup.style.display = 'block';

  document.getElementById('apkDownloadBtn').addEventListener('click', function () {
    popup.style.display = 'none';
  });
});

function closeApkPopup() {
  const popup = document.getElementById('apkPopup');
  popup.style.display = 'none';
}