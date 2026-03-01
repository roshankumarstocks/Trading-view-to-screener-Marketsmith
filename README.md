# TradingView to Screener & Marketsmith Extension

## Overview
This Chrome Extension natively integrates with TradingView, adding quick-access buttons to your top chart header. These buttons allow you to instantly view fundamental financial data for the currently active stock symbol on [Screener.in](https://www.screener.in) or evaluate it on [MarketSmith India](https://marketsmithindia.com/). 

## Features
- **Screener New Tab**: Opens the Screener.in consolidated financials page for the current active TradingView symbol in a new browser tab.
- **Screener Splitscreen**: Toggles a bottom-half split screen (iframe) inside the TradingView tab to load the Screener.in page directly over your charts, letting you perform fundamental and technical analysis synchronously.
- **Marketsmith New Tab**: Opens the stock evaluation page on MarketSmith India for the active symbol in a new tab.
- **Screener Iframe Support**: Uses Manifest V3 declarative net request rules to intelligently bypass `X-Frame-Options` and `Content-Security-Policy` headers on Screener.in so it can easily be loaded inside an iframe without cross-origin errors.
- **Cookie Fixing**: Automatically forces the `SameSite=None` and `Secure=True` cookie attributes for Screener.in to allow its session states to be read seamlessly inside the popup iframe.
- **Auto-Accept MarketSmith**: Automatically attempts to locate and click any "Accept" consent baners when loading the MarketSmith India website.

## Supported Browsers
This extension utilizes the **Manifest V3** standard APIs and works smoothly across **all modern Chromium-based browsers**, including:
- Google Chrome
- Microsoft Edge
- Brave Browser
- Vivaldi
- Opera
- Arc Browser

## Installation Instructions (Local/Unpacked)
1. Download or keep this entire extension folder on your computer.
2. Open your Chromium browser and navigate to the Extensions settings page:
   - For Google Chrome: type `chrome://extensions/` in the address bar.
   - For Microsoft Edge: type `edge://extensions/` in the address bar.
   - For Brave: type `brave://extensions/` in the address bar.
3. Enable **Developer mode** using the toggle switch (usually located in the top-right corner).
4. Click the **Load unpacked** button that appears.
5. In the file explorer popup, choose this exact directory (the folder containing the `manifest.json` file).
6. The extension is now successfully installed! Open up TradingView to play around with the newly injected buttons in the top header.

Explanation Video : https://x.com/RoshanStocks/status/2028173012051341529?s=20

Contact in X : https://x.com/RoshanStocks


