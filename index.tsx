import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("FATAL: Root element '#root' not found in DOM. Ensure your index.html has a <div id='root'></div>.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Complimaxx OS Initialized Successfully.");
  } catch (err) {
    console.error("CRITICAL BOOT ERROR:", err);
    rootElement.innerHTML = `
      <div style="background: #05070A; color: white; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; text-align: center; padding: 20px;">
        <div style="border: 2px solid #FF4D4F; padding: 40px; border-radius: 24px; background: #0D1117; max-width: 600px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
          <h1 style="color: #FF4D4F; margin-top: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Neural Boot Failure</h1>
          <p style="color: #8B949E; line-height: 1.6; margin: 20px 0;">The workspace failed to mount. This is often caused by a script loading error or a missing environment variable.</p>
          <div style="background: #05070A; padding: 15px; border-radius: 12px; font-family: monospace; font-size: 12px; color: #FA8C16; text-align: left; overflow: auto; border: 1px solid #1A1F26;">
            ${err instanceof Error ? err.stack || err.message : String(err)}
          </div>
          <button onclick="window.location.reload()" style="margin-top: 30px; background: #008CFF; color: white; border: none; padding: 12px 30px; border-radius: 12px; cursor: pointer; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Restart System</button>
        </div>
      </div>
    `;
  }
}
