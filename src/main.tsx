import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker (optional) so the browser can control the page when served
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js').then(reg => {
			console.debug('ServiceWorker registered:', reg.scope);
		}).catch(err => {
			console.debug('ServiceWorker registration failed:', err);
		});
	});
}
