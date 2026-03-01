const browserContext = typeof browser !== 'undefined' ? browser : chrome;

function fixCookie(cookie) {
    if (cookie.domain.includes('screener.in') && (cookie.sameSite !== 'no_restriction' || !cookie.secure)) {
        const newCookie = {
            url: "https://" + cookie.domain.replace(/^\./, '') + cookie.path,
            name: cookie.name,
            value: cookie.value,
            domain: cookie.domain,
            path: cookie.path,
            secure: true,
            httpOnly: cookie.httpOnly,
            expirationDate: cookie.expirationDate,
            storeId: cookie.storeId,
            sameSite: 'no_restriction'
        };

        browserContext.cookies.set(newCookie, (setCookie) => {
            if (browserContext.runtime.lastError) {
                console.error("Failed to update cookie:", browserContext.runtime.lastError);
            }
        });
    }
}

// Fix existing cookies on startup
browserContext.cookies.getAll({ domain: 'screener.in' }, (cookies) => {
    cookies.forEach(fixCookie);
});

// Watch for new/changed cookies
browserContext.cookies.onChanged.addListener((changeInfo) => {
    if (!changeInfo.removed) {
        fixCookie(changeInfo.cookie);
    }
});
