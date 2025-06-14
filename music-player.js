document.addEventListener('DOMContentLoaded', () => {
    // Inject Music Player HTML
    const musicPlayerHTML = `
        <div id="music-player" class="fixed top-1/2 right-0 transform -translate-y-1/2 bg-white/50 backdrop-blur-md p-3 rounded-l-lg shadow-lg border border-stone-200/50 z-40">
            <audio id="background-music" loop>
                <source src="music.mp3" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
            <button id="music-toggle-btn" class="text-stone-700 hover:text-stone-900">
                <i id="play-icon" data-lucide="play" class="w-6 h-6"></i>
                <i id="pause-icon" data-lucide="pause" class="w-6 h-6 hidden"></i>
            </button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', musicPlayerHTML);

    // Initialize Music Player
    const audio = document.getElementById('background-music');
    const musicToggleBtn = document.getElementById('music-toggle-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');

    if (audio && musicToggleBtn && playIcon && pauseIcon) {
        // Explicitly load the audio for better Safari/iOS compatibility
        audio.load();
        
        const updateIcons = (isPlaying) => {
            if (isPlaying) {
                playIcon.classList.add('hidden');
                pauseIcon.classList.remove('hidden');
            } else {
                playIcon.classList.remove('hidden');
                pauseIcon.classList.add('hidden');
            }
        };
        
        musicToggleBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play().catch(e => console.error("Playback failed:", e));
            } else {
                audio.pause();
            }
        });
        
        audio.addEventListener('play', () => updateIcons(true));
        audio.addEventListener('pause', () => updateIcons(false));
    }

    // SPA-like Navigation
    const mainContent = document.querySelector('main');

    const updateNavLinks = (path) => {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            let linkPath = new URL(link.href).pathname.split('/').pop() || 'index.html';
            let currentPath = path.split('/').pop() || 'index.html';
            if (linkPath === currentPath) {
                link.classList.add('active');
            }
        });
    };

    const handlePageSpecificScripts = (path) => {
        const page = path.split('/').pop();
        if (page === 'suning_report.html' || page === 'evergrande_report.html') {
            const mdFile = page === 'suning_report.html' 
                ? 'suning_default_risk_analysis.md' 
                : 'evergrande_industry_competitive_analysis_using_porters_five_forces.md';
            
            fetch(mdFile)
                .then(response => response.ok ? response.text() : Promise.reject('Network response was not ok'))
                .then(markdown => {
                    if (window.marked) {
                        document.getElementById('markdown-content').innerHTML = marked.parse(markdown);
                    }
                })
                .catch(error => {
                    console.error('Error fetching or parsing markdown:', error);
                    document.getElementById('markdown-content').innerHTML = '<p class="text-red-600 text-center">无法加载报告内容，请稍后再试。</p>';
                });
        }
    };

    const navigate = async (path, pushState = true) => {
        if (!mainContent) return;

        try {
            const response = await fetch(path);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            
            const newMain = doc.querySelector('main');
            if (newMain) {
                mainContent.innerHTML = newMain.innerHTML;
                document.title = doc.title;
                if (pushState) {
                    history.pushState({path}, '', path);
                }
                updateNavLinks(path);
                handlePageSpecificScripts(path);
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        } catch (error) {
            console.error('Navigation failed:', error);
            window.location.href = path; // Fallback to full page load
        }
    };

    document.body.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (anchor && anchor.hostname === window.location.hostname && anchor.target !== '_blank') {
            e.preventDefault();
            const path = anchor.getAttribute('href');
            if (window.location.pathname !== path) {
                navigate(path);
            }
        }
    });

    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.path) {
            navigate(e.state.path, false);
        }
    });

    // Save initial state
    history.replaceState({path: window.location.href}, '', window.location.href);

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {
        navMenu.style.display = 'none';
        menuToggle.addEventListener('click', () => {
            const isHidden = navMenu.style.display === 'none';
            navMenu.style.display = isHidden ? 'block' : 'none';
        });
    }

    // Active Nav Link Styling (for initial load)
    updateNavLinks(window.location.pathname);
    
    // Page specific scripts (for initial load)
    handlePageSpecificScripts(window.location.pathname);

    // Loader Animation
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 2500);
    }

    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}); 