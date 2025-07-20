// staticLinks.js

// List of keyword aliases mapped to websites
const staticWebLinks = [
  {
    keywords: ["nasa", "space", "nasa official", "nasa website", "nasa mission", "moon mission", "mars rover", "hubble"],
    url: "https://www.nasa.gov"
  },
  {
    keywords: ["isro", "isro official", "india space", "indian space agency", "isro satellite", "chandrayaan"],
    url: "https://www.isro.gov.in"
  },
  {
    keywords: ["google", "google search", "google website"],
    url: "https://www.google.com"
  },
  {
    keywords: ["facebook", "facebook login", "meta", "fb"],
    url: "https://www.facebook.com"
  },
  {
    keywords: ["twitter", "x.com", "elon twitter", "tweet", "twitter website"],
    url: "https://www.twitter.com"
  },
  {
    keywords: ["openai", "chatgpt", "gpt", "openai website", "dall-e", "ai tools"],
    url: "https://www.openai.com"
  },
  {
    keywords: ["snipsearch", "snip search", "snipsearch ai"],
    url: "https://snipsearch.vercel.app"
  },
  {
    keywords: ["github", "git hub", "code hosting", "git website"],
    url: "https://github.com"
  },
  {
    keywords: ["who", "world health organization", "who official"],
    url: "https://www.who.int"
  },
  {
    keywords: ["unesco", "unesco official", "education science culture"],
    url: "https://www.unesco.org"
  }
];

// Function to check and redirect based on query
function checkStaticLinks(query) {
  const lowerQuery = query.toLowerCase().trim();

  for (const entry of staticWebLinks) {
    for (const keyword of entry.keywords) {
      if (lowerQuery.includes(keyword)) {
        window.open(entry.url, "_blank");
        return true;
      }
    }
  }
  return false;
}