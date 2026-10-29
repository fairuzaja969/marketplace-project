/**
 * STOREHUB LANDING PAGE INTERACTIVITY
 * Architecture: Modern Vanilla JS (ES6+) with Intersection Observer
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Navbar Scroll Effect (Menambah bayangan dan efek solid saat halaman digulir)
    const navbar = document.querySelector("nav");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
            navbar.classList.add("shadow-md", "bg-white/95");
            navbar.classList.remove("bg-white/80");
        } else {
            navbar.classList.remove("shadow-md", "bg-white/95");
            navbar.classList.add("bg-white/80");
        }
    });

    // 2. Scroll Reveal Animation menggunakan Intersection Observer (Standar Enterprise SaaS)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("opacity-100", "translate-y-0");
                entry.target.classList.remove("opacity-0", "translate-y-8");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Targetkan kartu fitur dan heading section untuk animasi muncul halus
    const animatedElements = document.querySelectorAll(".feature-card, section h2");
    animatedElements.forEach(el => {
        el.classList.add("transition-all", "duration-700", "opacity-0", "translate-y-8");
        observer.observe(el);
    });

    // 3. Interactive CTA / Notification Simulation untuk Tombol Daftar/Masuk
    const ctaButtons = document.querySelectorAll("nav a.bg-indigo-600, header a.bg-white, header a.bg-indigo-800\\/50");
    ctaButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const text = btn.textContent.trim();
            if (text.includes("Mulai Gratis") || text.includes("Daftar") || text.includes("Pelajari")) {
                // Jika bukan link anchor (#fitur), tampilkan feedback profesional
                if (!btn.getAttribute("href").startsWith("#")) {
                    e.preventDefault();
                    showNotification(`Fitur "${text}" sedang dalam tahap pengembangan sistem.`);
                }
            }
        });
    });
});

/**
 * Utility: Toast Notification Generator ala Software House Modern
 */
function showNotification(message) {
    let existingToast = document.getElementById("storehub-toast");
    if (existingToast) existingToast.remove();

    const toast = document.createElement("div");
    toast.id = "storehub-toast";
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: #0f172a;
        color: #ffffff;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-size: 0.9rem;
        font-weight: 500;
        border-left: 4px solid #6366f1;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transform = "translateY(0)";
        toast.style.opacity = "1";
    }, 10);

    setTimeout(() => {
        toast.style.transform = "translateY(100px)";
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}