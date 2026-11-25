document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "posaunenchor_standkonzerte_2026_seen";

  if (sessionStorage.getItem(STORAGE_KEY)) {
    return;
  }

  const overlay = document.getElementById("letter-overlay");
  const wrapper = document.getElementById("envelope-wrapper");
  const flap = document.getElementById("envelope-flap");
  const flyerLeft = document.querySelector(".flyer-left");
  const flyerRight = document.querySelector(".flyer-right");
  const closeBtn = document.getElementById("letter-close");

  if (!overlay || typeof gsap === "undefined") return;

  sessionStorage.setItem(STORAGE_KEY, "true");

  overlay.style.display = "flex";
  overlay.setAttribute("aria-hidden", "false");

  const tl = gsap.timeline({ delay: 0.35 });

  tl.to(overlay, {
    opacity: 1,
    duration: 0.35,
    ease: "power2.out",
  })

    .fromTo(
      wrapper,
      { scale: 0.3, y: 80, opacity: 0, rotation: -4 },
      {
        scale: 1,
        y: 35,
        opacity: 1,
        rotation: 0,
        duration: 0.65,
        ease: "back.out(1.6)",
      },
    )

    .to(flap, {
      rotateX: 180,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        flap.style.zIndex = "1";
      },
    })

    .to(
      flyerLeft,
      {
        y: -145,
        xPercent: -92,
        rotation: -7,
        scale: 1.08,
        duration: 0.75,
        ease: "back.out(1.4)",
        onStart: () => {
          flyerLeft.style.zIndex = "5";
        },
      },
      "-=0.1",
    )
    .to(
      flyerRight,
      {
        y: -145,
        xPercent: -8,
        rotation: 7,
        scale: 1.08,
        duration: 0.75,
        ease: "back.out(1.4)",
        onStart: () => {
          flyerRight.style.zIndex = "6";
        },
      },
      "<0.1",
    );

  function unzoomFlyer() {
    const zoomedCard = document.querySelector(".flyer-card.is-zoomed");
    if (!zoomedCard) return false;

    zoomedCard.classList.remove("is-zoomed");
    const z = zoomedCard === flyerLeft ? 5 : 6;
    zoomedCard.style.zIndex = String(z);
    gsap.set(zoomedCard, { scale: 1.08, y: -145 });
    return true;
  }

  [flyerLeft, flyerRight].forEach((card) => {
    const defaultZ = card === flyerLeft ? 5 : 6;

    card.addEventListener("mouseenter", () => {
      if (card.classList.contains("is-zoomed")) return;
      card.style.zIndex = "10";
      gsap.to(card, {
        scale: 1.17,
        y: -158,
        duration: 0.25,
        ease: "power2.out",
      });
    });

    card.addEventListener("mouseleave", () => {
      if (card.classList.contains("is-zoomed")) return;
      card.style.zIndex = String(defaultZ);
      gsap.to(card, {
        scale: 1.08,
        y: -145,
        duration: 0.25,
        ease: "power2.out",
      });
    });

    card.addEventListener("click", (e) => {
      e.stopPropagation();
      const alreadyZoomed = card.classList.contains("is-zoomed");

      unzoomFlyer();

      if (!alreadyZoomed) {
        card.classList.add("is-zoomed");
      }
    });
  });

  function closeLetter() {
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        overlay.style.display = "none";
        overlay.setAttribute("aria-hidden", "true");
      },
    });
  }

  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!unzoomFlyer()) {
      closeLetter();
    }
  });

  overlay.addEventListener("click", (e) => {
    if (unzoomFlyer()) return;

    if (e.target === overlay || e.target.classList.contains("letter-stage")) {
      closeLetter();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.style.display === "flex") {
      if (!unzoomFlyer()) {
        closeLetter();
      }
    }
  });
});
