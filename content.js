function createButton(text, id) {
    const button = document.createElement('a');
    button.href = '#';
    button.innerText = text;
    button.className = 'screener-btn';
    if (id) button.id = id;
    return button;
}

function getSymbol() {
    const urlParams = new URLSearchParams(window.location.search);
    const symbolParam = urlParams.get('symbol');
    if (symbolParam) {
        return symbolParam.split(':').pop();
    }
    const title = document.title;
    if (title) {
        return title.split(' ')[0];
    }
    return null;
}

function toggleScreenerIframe(symbol) {
    let iframeContainer = document.getElementById('screener-iframe-container');
    const tvContainer = document.querySelector('.layout__area--center') || document.querySelector('.chart-container');

    if (iframeContainer) {
        if (iframeContainer.style.display === 'none') {
            iframeContainer.style.display = 'block';
            if (tvContainer) tvContainer.style.height = '50vh';
            updateIframeSrc(symbol);
        } else {
            // If already open, check if we need to switch source
            const iframe = document.getElementById('screener-iframe');
            const currentSrc = iframe.src;
            const isScreener = currentSrc.includes('screener.in');

            if (!isScreener) {
                updateIframeSrc(symbol);
            } else {
                iframeContainer.style.display = 'none';
                if (tvContainer) tvContainer.style.height = '100%';
            }
        }
    } else {
        iframeContainer = document.createElement('div');
        iframeContainer.id = 'screener-iframe-container';
        iframeContainer.style.position = 'fixed';
        iframeContainer.style.bottom = '0';
        iframeContainer.style.left = '0';
        iframeContainer.style.width = '100%';
        iframeContainer.style.height = '50vh';
        iframeContainer.style.zIndex = '9998';
        iframeContainer.style.backgroundColor = 'white';
        iframeContainer.style.borderTop = '2px solid #ccc';

        const iframe = document.createElement('iframe');
        iframe.id = 'screener-iframe';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';

        iframeContainer.appendChild(iframe);
        document.body.appendChild(iframeContainer);

        if (tvContainer) {
            tvContainer.style.height = '50vh';
            window.dispatchEvent(new Event('resize'));
        }

        updateIframeSrc(symbol);
    }
}

function updateIframeSrc(symbol) {
    const iframe = document.getElementById('screener-iframe');
    if (iframe && symbol) {
        iframe.src = `https://www.screener.in/company/${symbol}/consolidated/`;
    }
}

function updateButtons() {
    const symbol = getSymbol();
    const newTabBtn = document.getElementById('screener-btn-new-tab');
    const splitScreenBtn = document.getElementById('screener-btn-split');

    if (newTabBtn) {
        if (symbol) {
            newTabBtn.href = `https://www.screener.in/company/${symbol}/consolidated/`;
            newTabBtn.target = '_blank';
            newTabBtn.referrerPolicy = 'no-referrer';
        } else {
            newTabBtn.href = 'https://www.screener.in';
            newTabBtn.target = '_blank';
            newTabBtn.referrerPolicy = 'no-referrer';
        }
    }

    // Split screen button logic is handled by click listener, but we might want to update state if needed
}

function injectButtons() {
    if (document.getElementById('screener-btn-wrapper')) return;

    const publishBtn = document.getElementById('header-toolbar-publish-desktop') || document.querySelector('[id^="header-toolbar-publish"]') || document.querySelector('[data-name="header-toolbar-publish"]');
    const saveBtn = document.getElementById('header-toolbar-save-load') || document.querySelector('[id^="header-toolbar-save"]') || document.querySelector('[data-name="header-toolbar-save"]');
    const rightGroup = document.querySelector('.layout__area--top [class*="right-"] [class*="group-"]') || document.querySelector('.layout__area--top > div:last-child');
    const fallbackTopBar = document.querySelector('.tv-header__area--right') || document.querySelector('.layout__area--top') || document.querySelector('.tv-header__area');

    let container = null;
    let insertBeforeNode = null;

    if (publishBtn) {
        container = publishBtn.parentNode;
        insertBeforeNode = publishBtn;
    } else if (saveBtn) {
        container = saveBtn.parentNode;
        insertBeforeNode = saveBtn;
    } else if (rightGroup) {
        container = rightGroup;
    } else if (fallbackTopBar) {
        container = fallbackTopBar;
    }

    if (container) {
        // Create wrapper to hold both buttons
        const wrapper = document.createElement('div');
        wrapper.id = 'screener-btn-wrapper';
        wrapper.style.display = 'inline-flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.marginRight = '10px';

        const newTabBtn = createButton('Screener New Tab', 'screener-btn-new-tab');
        newTabBtn.style.marginRight = '5px';
        newTabBtn.addEventListener('click', () => {
            const symbol = getSymbol();
        });

        const splitScreenBtn = createButton('Screener Splitscreen', 'screener-btn-split');
        splitScreenBtn.style.marginRight = '5px';
        splitScreenBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentSymbol = getSymbol();
            if (currentSymbol) {
                toggleScreenerIframe(currentSymbol);
            }
        });

        const marketSmithNewTabBtn = createButton('Marketsmith New Tab', 'screener-btn-marketsmith-new-tab');
        marketSmithNewTabBtn.style.marginRight = '5px';
        marketSmithNewTabBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentSymbol = getSymbol();
            if (currentSymbol) {
                // Open in new tab with correct URL format
                window.open(`https://marketsmithindia.com/mstool/eval/${currentSymbol.toLowerCase()}/evaluation.jsp#/`, '_blank');
            }
        });

        wrapper.appendChild(newTabBtn);
        wrapper.appendChild(splitScreenBtn);
        wrapper.appendChild(marketSmithNewTabBtn);

        if (insertBeforeNode && container === insertBeforeNode.parentNode) {
            container.insertBefore(wrapper, insertBeforeNode);
        } else if (container) {
            container.prepend(wrapper);
        }

        updateButtons();

        const titleObserver = new MutationObserver(() => {
            updateButtons();
        });
        const titleElement = document.querySelector('title');
        if (titleElement) {
            titleObserver.observe(titleElement, { childList: true });
        }
    }
}

if (window.location.hostname.includes('tradingview.com')) {
    // TradingView is an SPA, the header might be destroyed and recreated
    // We observe the body for child list additions to know when to inject again
    const observer = new MutationObserver((mutations) => {
        // Debounce or just check existence
        if (!document.getElementById('screener-btn-wrapper')) {
            injectButtons();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    injectButtons();

    setTimeout(injectButtons, 1000);
    setTimeout(injectButtons, 3000);
    setTimeout(injectButtons, 5000);
} else if (window.location.hostname.includes('marketsmithindia.com')) {
    console.log('MarketSmith content script loaded');

    function clickAccept() {
        const buttons = document.querySelectorAll('button, a, div[role="button"]');
        for (const btn of buttons) {
            if (btn.innerText && btn.innerText.trim().toLowerCase() === 'accept') {
                console.log('Found Accept button, clicking...');
                btn.click();
                return true;
            }
        }
        return false;
    }

    // Try immediately and periodically
    clickAccept();
    const interval = setInterval(() => {
        if (clickAccept()) {
            // Keep checking for a bit in case it comes back or wasn't the right one, 
            // but we can clear it eventually or just let it run for a short while.
            // For now, let's just keep trying every second for 10 seconds then stop.
        }
    }, 1000);

    // Stop checking after 30 seconds to save resources
    setTimeout(() => clearInterval(interval), 30000);
}
