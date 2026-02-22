document.addEventListener('DOMContentLoaded', () => {
    // Initial staggered hero animations with anime.js
    anime.set('.hero-title, .hero-subtitle, .hero-actions .btn', { opacity: 0, translateY: 20 });
    anime({
        targets: ['.hero-title', '.hero-subtitle', '.hero-actions .btn'],
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 1000,
        delay: anime.stagger(150, { start: 300 }),
        easing: 'easeOutExpo'
    });

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
                const scrollContainer = document.querySelector('.content-scroll');
                const targetPosition = targetEl.offsetTop;

                anime({
                    targets: scrollContainer,
                    scrollTop: targetPosition - 100, // Offset for breathing room
                    duration: 800,
                    easing: 'easeInOutQuart'
                });
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

            // Staggered fade in animation for cards on scroll using anime.js
            if (entry.isIntersecting) {
                if (!entry.target.classList.contains('anime-animated')) {
                    entry.target.classList.add('anime-animated');

                    // Animate the section card itself
                    anime({
                        targets: entry.target,
                        opacity: [0, 1],
                        translateY: [30, 0],
                        duration: 800,
                        easing: 'easeOutCubic'
                    });

                    // Animate internal items (like feature cards, timeline items) in stagger
                    const internalItems = entry.target.querySelectorAll('.feature-card, .timeline-item, .code-block, .steps-list li');
                    if (internalItems.length > 0) {
                        anime.set(internalItems, { opacity: 0, translateY: 20 });
                        anime({
                            targets: internalItems,
                            opacity: [0, 1],
                            translateY: [20, 0],
                            duration: 600,
                            delay: anime.stagger(100, { start: 200 }),
                            easing: 'easeOutBack'
                        });
                    }
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
        // Initially hide for anime.js
        section.style.opacity = '0';
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

    // Live Backend Demo Logic
    const fetchStatusBtn = document.getElementById('fetchStatusBtn');
    const fetchDevicesBtn = document.getElementById('fetchDevicesBtn');
    const demoStatus = document.getElementById('demoStatus');
    const demoOutput = document.getElementById('demoOutput');

    const updateDemoOutput = (text, isError = false) => {
        demoOutput.textContent = text;
        demoStatus.textContent = isError ? 'Error' : 'Success';
        demoStatus.style.color = isError ? '#FF8A8A' : '#BBE5CE';

        anime({
            targets: demoOutput.parentElement,
            backgroundColor: ['rgba(187, 229, 206, 0.2)', 'rgba(30, 31, 34, 1)'],
            duration: 800,
            easing: 'easeOutExpo'
        });
    };

    if (fetchStatusBtn) {
        fetchStatusBtn.addEventListener('click', async () => {
            demoStatus.textContent = 'Fetching status...';
            demoStatus.style.color = '#AECBFA';
            try {
                const response = await fetch('http://127.0.0.1:8080/api/zdb_v1/status');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                updateDemoOutput(JSON.stringify(data, null, 2));
            } catch (error) {
                updateDemoOutput(`Failed to connect to backend.\nEnsure backend.py is running on port 8080.\nError: ${error.message}`, true);
            }
        });
    }

    if (fetchDevicesBtn) {
        fetchDevicesBtn.addEventListener('click', async () => {
            demoStatus.textContent = 'Fetching devices...';
            demoStatus.style.color = '#AECBFA';
            try {
                const response = await fetch('http://127.0.0.1:8080/api/zdb_v1/devices');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                updateDemoOutput(JSON.stringify(data, null, 2));
            } catch (error) {
                updateDemoOutput(`Failed to connect to backend.\nEnsure backend.py is running on port 8080.\nError: ${error.message}`, true);
            }
        });
    }
});
