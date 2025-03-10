document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".carousel-container");

  carousels.forEach((carousel) => {
    const leftBtn = carousel.querySelector(".left-btn");
    const rightBtn = carousel.querySelector(".right-btn");
    const track = carousel.querySelector(".carousel-track");
    const images = track.querySelectorAll("img");

    // Show/hide arrows based on scroll position
    function updateArrows() {
      const scrollLeft = track.scrollLeft;
      const maxScrollLeft = track.scrollWidth - track.clientWidth;

      // If there's content to the left, show leftBtn
      if (scrollLeft > 0) {
        leftBtn.style.display = "flex";
      } else {
        leftBtn.style.display = "none";
      }

      // Show rightBtn if there's more content to scroll to
      if (track.scrollWidth > track.clientWidth) {
        rightBtn.style.display = "flex";
      } else {
        rightBtn.style.display = "none";
      }
    }

    // Scroll one full viewport width on arrow click
    leftBtn.addEventListener("click", () => {
      track.scrollLeft -= track.clientWidth;
    });
    rightBtn.addEventListener("click", () => {
      track.scrollLeft += track.clientWidth;
    });

    // Update arrows when user scrolls or resizes
    track.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);

    // Wait for images to load before initializing arrows
    let loadedImages = 0;
    images.forEach((img) => {
      if (img.complete) {
        loadedImages++;
      } else {
        img.addEventListener("load", () => {
          loadedImages++;
          if (loadedImages === images.length) {
            updateArrows();
          }
        });
      }
    });

    // Initialize immediately if images are already cached
    updateArrows();

    // Fallback initialization after a short delay
    setTimeout(updateArrows, 100);
  });

  // Format current date in Brazilian Portuguese
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const date = new Date().toLocaleDateString("pt-BR", options);
  document.getElementById("currentDate").textContent = date;

  // Modal functionality
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const closeBtn = document.querySelector(".close-modal");
  const modalCaption = document.querySelector(".modal-caption");

  // Function to open modal
  function openModal(imgSrc, altText) {
    modal.style.display = "flex"; // Set display to flex first
    setTimeout(() => {
      modalImg.src = imgSrc;
      modalCaption.textContent = altText;
      modal.classList.add("show");
      document.body.style.overflow = "hidden";
    }, 10); // Small delay to ensure display is set before transition
  }

  // Function to close modal
  function closeModal() {
    modal.classList.remove("show");
    document.body.style.overflow = "";
    setTimeout(() => {
      modal.style.display = "none";
    }, 300); // Match the transition duration in CSS
  }

  // Add click listeners to all carousel images
  document.querySelectorAll(".carousel-track img").forEach((img) => {
    img.addEventListener("click", () => {
      openModal(img.src, img.alt);
    });
  });

  // Close modal when clicking close button
  closeBtn.addEventListener("click", closeModal);

  // Close modal when clicking outside the image
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  const floatingContact = document.querySelector(".floating-contact");
  const footer = document.getElementById("footer");

  // Update the observer options for earlier triggering
  const observerOptions = {
    root: null,
    rootMargin: "-200px 0px", // Even earlier trigger
    threshold: 0, // Trigger immediately when any part is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        floatingContact.style.opacity = "0";
        floatingContact.style.visibility = "hidden";
        floatingContact.style.pointerEvents = "none";
        setTimeout(() => {
          floatingContact.style.display = "none"; // Completely remove from DOM flow
        }, 300); // Wait for fade out animation
      } else {
        floatingContact.style.display = "flex";
        // Small delay to ensure display is set before showing
        setTimeout(() => {
          floatingContact.style.opacity = "1";
          floatingContact.style.visibility = "visible";
          floatingContact.style.pointerEvents = "auto";
        }, 10);
      }
    });
  }, observerOptions);

  observer.observe(footer);

  const copyBtn = document.querySelector(".copy-btn");
  const phoneNumber = "55981060201"; // Clean number for copying

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      const tooltip = copyBtn.querySelector(".copy-tooltip");
      tooltip.textContent = "Copiado!";
      copyBtn.classList.add("success");

      setTimeout(() => {
        tooltip.textContent = "Copiar";
        copyBtn.classList.remove("success");
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  });
});
