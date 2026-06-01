// Sidebar anzeigen/verbergen
function showSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "flex";
}

function hideSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none";
}

// Scroll-To-Top Button Sichtbarkeit & Logik
const scrollButton = document.getElementById("scrollUp");

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    scrollButton.classList.add("visible");
  } else {
    scrollButton.classList.remove("visible");
  }
});

scrollButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Globaler Daten-Cache für Chronik-Karussells
let historyData = [];
const imageIndices = {};

// Einmaliges Laden aller dynamischen Inhalte nach DOM-Ready (Behebt doppelten window.onload-Bug)
document.addEventListener("DOMContentLoaded", () => {
  loadVeranstaltungen();
  loadHistory();
  loadFAQs();
});

// Veranstaltungen über JSON laden
function loadVeranstaltungen() {
  fetch("Termine/veranstaltungen.json")
    .then((response) => {
      if (!response.ok)
        throw new Error("Fehler beim Laden der Veranstaltungsdaten");
      return response.json();
    })
    .then((data) => {
      const container = document.getElementById("veranstaltungen-container");
      container.innerHTML = "";
      data.forEach((event) => {
        container.innerHTML += `
                    <div class="box">
                        <img src="${event.image}" alt="${event.title}" loading="lazy">
                        <p class="event-date"><strong>${event.date}</strong></p>
                        <h3 class="headline">${event.title}</h3>
                        <p>${event.description}</p>
                    </div>
                `;
      });
    })
    .catch((error) => {
      console.error(error);
      document.getElementById("veranstaltungen-container").innerHTML =
        "<p>Veranstaltungen konnten derzeit nicht geladen werden.</p>";
    });
}

// Chronik als Blog-Layout laden
function loadHistory() {
  fetch("Geschichte/history.json")
    .then((response) => {
      if (!response.ok) throw new Error("Fehler beim Laden der Chronik");
      return response.json();
    })
    .then((data) => {
      historyData = data;
      const container = document.getElementById("timeline");
      container.innerHTML = "";

      historyData.forEach((item, index) => {
        const carouselId = `carousel-${index}`;

        let imageHTML = "";
        if (item.images && item.images.length > 0) {
          const hasMultiple = item.images.length > 1;
          imageHTML = `
                        <div class="carousel" id="${carouselId}">
                            ${hasMultiple ? `<button class="carousel-btn prev" onclick="changeSlide('${carouselId}', -1)">&#10094;</button>` : ""}
                            <img class="blog-image" src="${item.images[0].src}" alt="${item.images[0].alt || "Chronik Bild"}" loading="lazy">
                            ${hasMultiple ? `<button class="carousel-btn next" onclick="changeSlide('${carouselId}', 1)">&#10095;</button>` : ""}
                        </div>
                    `;
        }

        // Generiert moderne Blog-Cards statt veralteter Timeline-Container
        container.innerHTML += `
                    <article class="blog-card">
                        ${imageHTML}
                        <div class="blog-content">
                            <span class="blog-date">${item.time}</span>
                            <h2 class="blog-title">${item.title}</h2>
                            <p class="blog-text">${item.infoText}</p>
                            
                            ${item.report ? `<blockquote class="blog-report">"${item.report}"</blockquote>` : ""}
                            ${item.reporterName ? `<p class="blog-reporter-name">— ${item.reporterName}</p>` : ""}
                            
                            <div class="blog-footer-links">
                                ${item.organisationLink ? `<a href="${item.organisationLink}" target="_blank" class="org-link">Verband evang. Posaunenchöre in Bayern e.V.</a>` : ""}
                                ${item.link ? `<a href="${item.link}" target="_blank" class="more-link">Weiterlesen →</a>` : ""}
                            </div>
                        </div>
                    </article>
                `;
      });
    })
    .catch((error) => {
      console.error(error);
      document.getElementById("timeline").textContent =
        "Chronikdaten konnten nicht geladen werden.";
    });
}

// Carousel Switch Logik
function changeSlide(id, direction) {
  const container = document.getElementById(id);
  const img = container.querySelector("img");
  const index = parseInt(id.split("-")[1]);

  const images = historyData[index].images;
  if (!images || images.length === 0) return;

  imageIndices[id] = (imageIndices[id] ?? 0) + direction;

  if (imageIndices[id] >= images.length) imageIndices[id] = 0;
  if (imageIndices[id] < 0) imageIndices[id] = images.length - 1;

  const current = images[imageIndices[id]];
  img.src = current.src;
  img.alt = current.alt || "Chronik Bild";
}

// FAQ über JSON laden
function loadFAQs() {
  fetch("Interesse/faq.json")
    .then((response) => {
      if (!response.ok) throw new Error("FAQ konnte nicht geladen werden.");
      return response.json();
    })
    .then((data) => {
      const container = document.getElementById("faq-container");
      container.innerHTML = "";
      data.forEach((item) => {
        container.innerHTML += `
                    <div class="faq-item">
                        <div class="faq-question" onclick="toggleAnswer(this)">
                            <span class="question-text">${item.question}</span>
                            <svg class="arrow" viewBox="0 0 24 24">
                                <polyline points="6 9 12 15 18 9" fill="none" stroke="black" stroke-width="2"/>
                            </svg>
                        </div>
                        <div class="faq-answer" style="display: none;">
                            ${item.answer}
                        </div>
                    </div>
                `;
      });
    })
    .catch((error) => {
      console.error(error);
      document.getElementById("faq-container").innerHTML =
        "FAQ-Daten aktuell nicht verfügbar.";
    });
}

// FAQ-Akkordeon Toggle mit sanfter Pfeil-Animation
function toggleAnswer(element) {
  const answerDiv = element.nextElementSibling;
  const arrow = element.querySelector(".arrow");

  if (answerDiv.style.display === "block") {
    answerDiv.style.display = "none";
    arrow.style.transform = "rotate(0deg)";
  } else {
    answerDiv.style.display = "block";
    arrow.style.transform = "rotate(180deg)";
  }
}
