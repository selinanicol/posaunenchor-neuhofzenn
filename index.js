
//sidebar
function showSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'flex'
}

function hideSidebar(){
    const sidebar = document.querySelector('.sidebar')
    sidebar.style.display = 'none'
}

// scroll button

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


// Veranstaltung

fetch("Termine/veranstaltungen.json")
    .then(response => {
      if (!response.ok) throw new Error("Fehler beim Laden der Veranstaltungsdaten");
      return response.json();
    })
    .then(data => {
      const container = document.getElementById("veranstaltungen-container");
      container.innerHTML = "";

      data.forEach(event => {
        container.innerHTML += `
          <div class="box">
            <img src="${event.image}" >
            <p>${event.date}</p>
            <h1 class="headline">${event.title}</h1>
            <p>${event.description}</p>
          </div>
        `;
      });
    })
    .catch(error => {
      console.error("Veranstaltungsdaten konnten nicht geladen werden:", error);
      const container = document.getElementById("veranstaltungen-container");
      container.innerHTML = "<p>Veranstaltungen konnten nicht geladen werden.</p>";
    });

// history timeline

let historyData = [];
const imageIndices = {}; 

fetch('Geschichte/history.json')
  .then(response => {
    if (!response.ok) throw new Error("Fehler beim Laden der history.json");
    return response.json();
  })
  .then(data => {
    historyData = data;
    showAllHistory();
  })
  .catch(error => {
    console.error("Fehler beim Laden der Chronikdaten:", error);
    const container = document.getElementById('timeline');
    container.textContent = "Daten konnten nicht geladen werden.";
  });

function showAllHistory() {
  const container = document.getElementById("timeline");
  container.innerHTML = "";

  historyData.forEach((item, index) => {
    container.innerHTML += showHistory(item, index);
  });
}

function showHistory(item, index) {
  const side = index % 2 === 0 ? "left-container" : "right-container";
  const arrowClass = index % 2 === 0 ? "left-container-arrow" : "right-container-arrow";

  const carouselId = `carousel-${index}`;

  let imageHTML = "";
  if (item.images && item.images.length > 0) {
    const hasMultiple = item.images.length > 1;

    imageHTML = `
      <div class="carousel" id="${carouselId}">
        ${hasMultiple ? `<button class="carousel-btn prev" onclick="changeSlide('${carouselId}', -1)">&#10094;</button>` : ""}
        <img class="carousel-image" src="${item.images[0].src}" alt="${item.images[0].alt}">
        ${hasMultiple ? `<button class="carousel-btn next" onclick="changeSlide('${carouselId}', 1)">&#10095;</button>` : ""}
      </div>
    `;
  }

  const linkHTML = item.link
    ? `<a href="${item.link}" target="_blank" class="info-link">weitere Informationen</a>`
    : '';

  const reportHTML = item.report
    ? `<p class="report">${item.report}
         <p class="reporterName">${item.reporterName}</p>
       </p>`
    : '';

  const organisationLinkHTML = item.organisationLink
    ? `<p>Organisiert durch</p>
       <a href="${item.organisationLink}" target="_blank" class="organisationLink">Verband evangelischer Posaunenchöre in Bayern e.V.</a>`
    : '';

  return `
    <div class="timeline-container ${side}">
      <img src="../images/white.circle.png" alt="circle" class="circle">
      <div class="timeline-textbox">
        <h2>${item.title}</h2>
        <small>${item.time}</small>
        <p>${item.infoText}</p>
        ${reportHTML}
        ${organisationLinkHTML}
        ${linkHTML}
        ${imageHTML}
        <span class="${arrowClass}"></span>
      </div>
    </div>
  `;
}

// Carousel 
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
  img.alt = current.alt;
}

// Interest faq

fetch("Interesse/faq.json")
  .then(response => {
    if (!response.ok) throw new Error("FAQ konnte nicht geladen werden.");
    return response.json();
  })
  .then(data => {
    const container = document.getElementById("faq-container");
    container.innerHTML = "";
    data.forEach(item => {
      container.innerHTML += showFAQ(item);
    });
  })
  .catch(error => {
    console.error("Fehler beim Laden der FAQs:", error);
    const container = document.getElementById("faq-container");
    container.innerHTML = "FAQ konnte nicht geladen werden.";
  });

function showFAQ(faq) {
    return `
        <div class="faq-item">
            <div class="faq-question" onclick="toggleAnswer(this)">
                <span class="question-text">${faq.question}</span>
                <svg class="arrow" viewBox="0 0 24 24">
                    <polyline points="6 9 12 15 18 9" fill="none" stroke="black" stroke-width="2"/>
                </svg>
            </div>
            <div class="faq-answer" style="display: none;">
                ${faq.answer}
            </div>
        </div>
    `;
}

function showAllFAQs() {
    const container = document.getElementById("faq-container");
    container.innerHTML = ""; 

    faq.forEach(item => {
        container.innerHTML += showFAQ(item);
    });
}

// Zum Ein-/Ausklappen
function toggleAnswer(element) {
    const answerDiv = element.nextElementSibling;
    answerDiv.style.display = (answerDiv.style.display === "block") ? "none" : "block";
}

window.onload = function () {
    showAllHistory?.(); 
    showAllFAQs();
};


window.onload = function () {
  showAllHistory();
  showAllFAQs();
}

