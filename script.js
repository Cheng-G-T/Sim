document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {
        navMenu.style.display = 'none';
        menuToggle.addEventListener('click', () => {
            const isHidden = navMenu.style.display === 'none';
            navMenu.style.display = isHidden ? 'block' : 'none';
        });
    }

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.hostname !== window.location.hostname) {
            return;
        }
        let linkPath = new URL(link.href).pathname.split('/').pop();
        if (linkPath === '') {
            linkPath = 'index.html';
        }
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });

    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 2500);
    }

    const audio = document.getElementById('background-music');
    const musicToggleBtn = document.getElementById('music-toggle-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');

    if (audio && musicToggleBtn && playIcon && pauseIcon) {
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
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay was prevented. User interaction is required.");
                updateIcons(false);
            });
        }
    }

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
