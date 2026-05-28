/* ===========================
   LifeCare Clinic JavaScript
   Mobile Menu, Forms, WhatsApp, FAQ, Theme, Animations
   =========================== */

const WHATSAPP_NUMBER = "918391879877"; // Change this number for real clinic

// Loader
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  setTimeout(() => {
    loader.classList.add("hidden");
  }, 600);
});

// DOM Elements
const navMenu = document.getElementById("navMenu");
const hamburger = document.getElementById("hamburger");
const themeToggle = document.getElementById("themeToggle");
const backToTop = document.getElementById("backToTop");
const appointmentForm = document.getElementById("appointmentForm");
const contactForm = document.getElementById("contactForm");
const popup = document.getElementById("successPopup");
const popupClose = document.getElementById("popupClose");
const popupOk = document.getElementById("popupOk");
const printSlipBtn = document.getElementById("printSlipBtn");
const doctorStatus = document.getElementById("doctorStatus");

// Mobile Navbar Toggle
hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("show");
  hamburger.classList.toggle("active");
});

// Close mobile menu after clicking nav link
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show");
    hamburger.classList.remove("active");
  });
});

// Dark Mode Toggle
const savedTheme = localStorage.getItem("lifecare-theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("lifecare-theme", isDark ? "dark" : "light");
});

// Set minimum appointment date to today
const dateInput = document.getElementById("appointmentDate");
const today = new Date().toISOString().split("T")[0];
dateInput.setAttribute("min", today);

// Doctor Availability Status
function updateDoctorStatus() {
  const now = new Date();
  const day = now.getDay(); // Sunday = 0
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentMinutes = hour * 60 + minute;

  const morningStart = 9 * 60;
  const morningEnd = 13 * 60;
  const eveningStart = 17 * 60;
  const eveningEnd = 20 * 60;

  const isSunday = day === 0;
  const isOpen =
    !isSunday &&
    ((currentMinutes >= morningStart && currentMinutes <= morningEnd) ||
      (currentMinutes >= eveningStart && currentMinutes <= eveningEnd));

  if (doctorStatus) {
    doctorStatus.textContent = isOpen
      ? "Doctor available now"
      : "Doctor currently unavailable";
  }
}
updateDoctorStatus();

// Scroll Animations
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.12 }
);

revealElements.forEach(element => revealObserver.observe(element));

// Active Navbar Link Highlight
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 110;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });

  if (window.scrollY > 450) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

// Back to Top
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// FAQ Accordion
document.querySelectorAll(".faq-question").forEach(question => {
  question.addEventListener("click", () => {
    const faqItem = question.parentElement;

    document.querySelectorAll(".faq-item").forEach(item => {
      if (item !== faqItem) {
        item.classList.remove("active");
      }
    });

    faqItem.classList.toggle("active");
  });
});

// Validate Indian-like phone number
function isValidPhone(phone) {
  return /^[0-9+\-\s]{10,15}$/.test(phone.trim());
}

// Build WhatsApp Appointment Message
function buildAppointmentMessage(data) {
  return `Hello Doctor, I want to book an appointment.

Name: ${data.name}
Mobile: ${data.mobile}
Age: ${data.age}
Gender: ${data.gender}
Service: ${data.service}
Date: ${data.date}
Time: ${data.time}
Problem: ${data.problem}

Please confirm my appointment.`;
}

// Appointment Form Submit
appointmentForm.addEventListener("submit", event => {
  event.preventDefault();

  const data = {
    name: document.getElementById("patientName").value.trim(),
    mobile: document.getElementById("mobileNumber").value.trim(),
    age: document.getElementById("age").value.trim(),
    gender: document.getElementById("gender").value,
    service: document.getElementById("service").value,
    date: document.getElementById("appointmentDate").value,
    time: document.getElementById("appointmentTime").value,
    problem: document.getElementById("problem").value.trim()
  };

  const isEmpty = Object.values(data).some(value => !value);
  if (isEmpty) {
    alert("Please fill in all required appointment fields.");
    return;
  }

  if (!isValidPhone(data.mobile)) {
    alert("Please enter a valid mobile number.");
    return;
  }

  const message = buildAppointmentMessage(data);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  showPopup();
  setTimeout(() => {
    window.open(whatsappUrl, "_blank");
  }, 700);
});

// Contact Form Submit
contactForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("contactName").value.trim();
  const phone = document.getElementById("contactPhone").value.trim();
  const message = document.getElementById("contactMessage").value.trim();

  if (!name || !phone || !message) {
    alert("Please fill in all contact fields.");
    return;
  }

  if (!isValidPhone(phone)) {
    alert("Please enter a valid phone number.");
    return;
  }

  alert("Thank you! Your message has been submitted successfully.");
  contactForm.reset();
});

// Success Popup
function showPopup() {
  popup.classList.add("show");
}

function closePopup() {
  popup.classList.remove("show");
}

popupClose.addEventListener("click", closePopup);
popupOk.addEventListener("click", closePopup);

popup.addEventListener("click", event => {
  if (event.target === popup) {
    closePopup();
  }
});

// Print Appointment Slip
printSlipBtn.addEventListener("click", () => {
  const name = document.getElementById("patientName").value.trim();
  const mobile = document.getElementById("mobileNumber").value.trim();

  if (!name || !mobile) {
    alert("Please fill at least patient name and mobile number before printing.");
    return;
  }

  window.print();
});

// Service Modal
const serviceModal = document.getElementById("serviceModal");
const serviceClose = document.getElementById("serviceClose");
const serviceModalTitle = document.getElementById("serviceModalTitle");
const serviceModalText = document.getElementById("serviceModalText");
const serviceBookBtn = document.getElementById("serviceBookBtn");

const serviceDescriptions = {
  "General Health Checkup": "Routine checkup for common health concerns and preventive care advice.",
  "Fever, Cold & Cough Treatment": "Consultation and treatment guidance for fever, cold, cough, and seasonal illness.",
  "Diabetes Care": "Diabetes monitoring support, lifestyle advice, and regular consultation.",
  "Blood Pressure Checkup": "Blood pressure monitoring and guidance for maintaining healthy levels.",
  "Child Health Consultation": "Basic child health consultation for fever, cough, nutrition, and care.",
  "Vaccination": "Vaccination guidance and preventive healthcare support.",
  "ECG Service": "ECG support for basic heart health screening and doctor review.",
  "Medicine Consultation": "Professional medicine consultation based on symptoms and diagnosis.",
  "Women’s Health Care": "Basic women’s health support and preventive consultation.",
  "Emergency First Aid": "First-aid guidance and emergency support for urgent minor cases."
};

document.querySelectorAll(".learn-more").forEach(button => {
  button.addEventListener("click", () => {
    const service = button.dataset.service;
    serviceModalTitle.textContent = service;
    serviceModalText.textContent = serviceDescriptions[service] || "This service is available at LifeCare Clinic.";
    serviceModal.classList.add("show");
  });
});

function closeServiceModal() {
  serviceModal.classList.remove("show");
}

serviceClose.addEventListener("click", closeServiceModal);

serviceBookBtn.addEventListener("click", () => {
  closeServiceModal();
});

serviceModal.addEventListener("click", event => {
  if (event.target === serviceModal) {
    closeServiceModal();
  }
});

// Smooth Scroll for hash links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (event) {
    const targetId = this.getAttribute("href");
    if (targetId.length > 1) {
      event.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});

// Keyboard Escape closes modals
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closePopup();
    closeServiceModal();
  }
});
