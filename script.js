function goHome() {
  document.getElementById("newsStand").style.display = "block";
  document.getElementById("results").innerHTML = "";
  document.getElementById("homeBtn").style.display = "none";
  document.getElementById("searchInput").value = "";
}

function search() {
  document.getElementById("newsStand").style.display = "none";
  document.getElementById("homeBtn").style.display = "inline-block";

  const query = document.getElementById("searchInput").value.trim().toLowerCase();

  const staticPages = {
    "download snipsearch": "snipsearch.html",
    "top 10 countries with high gdp": "gdp.html",
    "best ai tools": "aitools.html",
    "useful web tools": "webtools.html",
    "best coding apps": "bestapps.html"
  };

  if (staticPages[query]) {
    window.location.href = staticPages[query];
    return;
  }

  const apiKey = "AIzaSyDFliUSc0-bUmwbM1YR4wmQXk5wVgGV6-A";
  const cx = "c7621a78e53794892";
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}`;

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.items) {
        data.items.forEach(item => {
          const resultCard = document.createElement("div");
          resultCard.className = "result-card";

          let thumbnail = "";
          if (item.pagemap && item.pagemap.cse_image && item.pagemap.cse_image[0]) {
            thumbnail = `<img src="${item.pagemap.cse_image[0].src}" alt="Thumbnail" class="thumbnail">`;
          }

          resultCard.innerHTML = `
            ${thumbnail}
            <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
            <p>${item.snippet}</p>
          `;
          resultsDiv.appendChild(resultCard);
        });
      } else {
        resultsDiv.innerHTML = "<p>No results found.</p>";
      }
    })
    .catch(error => {
      console.error("Search error:", error);
      resultsDiv.innerHTML = "<p>Error fetching results.</p>";
    });

  // Wikipedia Box
  const wikiApi = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
  fetch(wikiApi)
    .then(response => response.json())
    .then(wiki => {
      if (wiki.extract) {
        const wikiBox = document.createElement("div");
        wikiBox.className = "wiki-box";
        wikiBox.innerHTML = `
          <h2>Wikipedia</h2>
          <p>${wiki.extract}</p>
          <a href="${wiki.content_urls.desktop.page}" target="_blank">Read more on Wikipedia</a>
        `;
        resultsDiv.prepend(wikiBox);
      }
    })
    .catch(error => {
      console.warn("No Wikipedia article found.");
    });
}