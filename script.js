document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const toggleText = themeToggle.querySelector('.toggle-text');
    const iconDark = themeToggle.querySelector('.icon-dark');
    const iconLight = themeToggle.querySelector('.icon-light');

    // Check saved theme
    const savedTheme = localStorage.getItem('zdb-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    setTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('zdb-theme', theme);

        if (theme === 'dark') {
            toggleText.textContent = 'Light Mode';
            iconDark.style.display = 'none';
            iconLight.style.display = 'block';
        } else {
            toggleText.textContent = 'Dark Mode';
            iconDark.style.display = 'block';
            iconLight.style.display = 'none';
        }
    }

    // Sidebar Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section-card');

    // Smooth scroll and active state update
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            const targetEl = document.getElementById(targetId);

            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Intersection Observer for Active State in Sidebar
    const observerOptions = {
        root: document.querySelector('.content-scroll'),
        rootMargin: '0px 0px -40% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Remove active from all
                navItems.forEach(nav => nav.classList.remove('active'));
                // Add active to current
                const activeNav = document.querySelector(`.nav-item[data-target="${id}"]`);
                if (activeNav) {
                    activeNav.classList.add('active');
                }
            }

            // Staggered fade in animation for cards on scroll
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
        // Initially hide for animation if not in viewport
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.8s cubic-bezier(0.2, 0, 0, 1), transform 0.8s cubic-bezier(0.2, 0, 0, 1)';
    });

    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');

    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 &&
                !sidebar.contains(e.target) &&
                !menuBtn.contains(e.target) &&
                sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    }

    // Copy Code Button
    const copyBtns = document.querySelectorAll('.copy-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const pre = btn.closest('.code-block').querySelector('pre');
            navigator.clipboard.writeText(pre.textContent).then(() => {
                const icon = btn.querySelector('.material-symbols-outlined');
                icon.textContent = 'check';
                icon.style.color = '#BBE5CE';
                setTimeout(() => {
                    icon.textContent = 'content_copy';
                    icon.style.color = '';
                }, 2000);
            });
        });
    });
});
