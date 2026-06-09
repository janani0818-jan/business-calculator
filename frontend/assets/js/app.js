document.addEventListener('DOMContentLoaded', () => {
    router.init();
    clock.start();
    mobileDrawer.init();
});

const router = {
    pages: {
        'dashboard': {
            title: 'Dashboard Overview',
            subtitle: 'Real-time metrics and calculation quick-starts.',
            init: () => window.dashboardModule && window.dashboardModule.reloadAll()
        },
        'calculator': {
            title: 'Standard M.P.U. Calculator',
            subtitle: 'Evaluate multi-level complex equations on our fast decimal engine.',
            init: () => window.calculatorModule && window.calculatorModule.init()
        },
        'gst': {
            title: 'Government GST Calculator',
            subtitle: 'Break down CGST, SGST & IGST tax configurations for quick-filing reports.',
            init: () => window.gstModule && window.gstModule.init()
        },
        'history': {
            title: 'Accounting Ledger Logs',
            subtitle: 'Review historical computation records and complete tax invoices audit trails.',
            init: () => window.historyModule && window.historyModule.init()
        },
        'settings': {
            title: 'System & Theme Preferences',
            subtitle: 'Modify environmental palettes or manage local SQLite administration fields.',
            init: () => {
                if (window.themeModule) window.themeModule.updateThemeUI(localStorage.getItem('biz_calc_pro_theme') || 'theme-light');
                if (window.historyModule) window.historyModule.setupActionBindings();
            }
        }
    },

    init() {
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.dataset.page;
                this.navigate(pageId);
                mobileDrawer.close();
            });
        });
        let initialPage = 'dashboard';
        const hash = window.location.hash.substring(1);
        if (this.pages[hash]) {
            initialPage = hash;
        }

        this.navigate(initialPage);
    },

    navigate(pageId) {
        if (!this.pages[pageId]) return;
        document.querySelectorAll('.page-section').forEach(sect => {
            sect.classList.remove('active');
        });

        const activeSect = document.getElementById(`page-${pageId}`);
        if (activeSect) {
            activeSect.classList.add('active');
        }
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const activeNav = document.getElementById(`nav-${pageId}`);
        if (activeNav) {
            activeNav.classList.add('active');
        }


        const heading = document.getElementById('pageTitleHeading');
        const subheading = document.getElementById('pageSubHeading');

        if (heading && subheading) {
            heading.textContent = this.pages[pageId].title;
            subheading.textContent = this.pages[pageId].subtitle;
        }
        window.location.hash = pageId;
        this.pages[pageId].init();
    }
};

const clock = {
    start() {
        this.tick();
        setInterval(() => this.tick(), 1000);
    },
    tick() {
        const liveClockElem = document.getElementById('liveClock');
        if (liveClockElem) {
            const timeStr = new Date().toLocaleTimeString('en-IN', { hour12: false });
            liveClockElem.textContent = timeStr;
        }
    }
};

const mobileDrawer = {
    init() {
        const toggleBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('sidebar');

        if (toggleBtn && sidebar) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                sidebar.classList.toggle('open');
            });
            document.addEventListener('click', (e) => {
                if (!sidebar.contains(e.target) && sidebar.classList.contains('open')) {
                    this.close();
                }
            });
        }
    },
    close() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('open');
        }
    }
};
window.navigateToPage = (pageId) => router.navigate(pageId);
window.appShellRouter = router;
