const VALID_USER = "ZayyN";
const VALID_PASS_HASH = "c05e7fb529fd488f8df45421bb3bd25489e5d14f5914254e94ee3a7e85449c52";

async function hashString(string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ---------------------------------------------
// OPRAVENÁ FUNKCE PRO ZOBRAZENÍ HESLA
// ---------------------------------------------
function togglePasswordVisibility() {
    const passInput = document.getElementById('passInput');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passInput.type === 'password') {
        passInput.type = 'text';
        eyeIcon.innerHTML = '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.17c0-1.66-1.34-3-3-3l-.17.02z"/>';
    } else {
        passInput.type = 'password';
        eyeIcon.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
    }
}

async function handleLogin() {
    const user = document.getElementById('userInput').value;
    const pass = document.getElementById('passInput').value;
    const errorBox = document.getElementById('loginError');

    const passHash = await hashString(pass);

    if (user === VALID_USER && passHash === VALID_PASS_HASH) {
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('appContainer').style.display = 'block';
        document.title = "IKT - Dashboard";
        initAuditApp();
    } else {
        errorBox.style.display = 'block';
    }
}

// ---------------------------------------------
// OPRAVENÁ LOGIKA ENTER (Skok na heslo / Přihlášení)
// ---------------------------------------------
document.addEventListener('keydown', (e) => {
    const loginOverlay = document.getElementById('loginOverlay');
    if (loginOverlay.style.display !== 'none' && e.key === 'Enter') {
        e.preventDefault(); 
        
        const userInput = document.getElementById('userInput');
        const passInput = document.getElementById('passInput');
        
        // Pokud jsme ve jménu a je vyplněné -> přeskoč na heslo
        if (document.activeElement === userInput && userInput.value.trim() !== '') {
            passInput.focus();
        } 
        // Pokud je už jméno i heslo vyplněné -> zkus se přihlásit
        else if (userInput.value.trim() !== '' && passInput.value !== '') {
            handleLogin();
        }
    }
});

function renderBrowserLinks() {
    const container = document.getElementById('browserSpecificLinksContainer');
    const ua = navigator.userAgent.toLowerCase();
    
    let html = `
        <div class="flex-row" style="margin-bottom: 8px;">
            <button onclick="openCustomLink('file:///#')" class="btn-warn">file:///#</button>
            <button onclick="openCustomLink('view-source:https://google.com')">view-source</button>
        </div>
        <div class="flex-row" style="margin-bottom: 8px;">
            <button onclick="openCustomLink('data:text/html,<h1>Data URI Sandbox Escape</h1>')">Data URI</button>
            <button onclick="openCustomLink('blob:https://example.com/fake-uuid')">Blob URI</button>
        </div>
    `;

    if (ua.includes('edge/') || ua.includes('edg/')) {
        html += `<div style="font-size:0.75rem; color:var(--accent); margin-bottom:4px; font-weight:bold;">Detekován prohlížeč: Microsoft Edge</div>`;
        html += `
            <div class="flex-row" style="margin-bottom: 8px;">
                <button onclick="openCustomLink('edge://settings')" class="btn-danger">edge://settings</button>
                <button onclick="openCustomLink('edge://about')" class="btn-warn">edge://about</button>
            </div>
            <div class="flex-row" style="margin-bottom: 8px;">
                <button onclick="openCustomLink('edge://flags')" class="btn-danger">edge://flags</button>
                <button onclick="openCustomLink('edge://downloads')" class="btn-warn">edge://downloads</button>
            </div>
            <div class="flex-row" style="margin-bottom: 8px;">
                <button onclick="openCustomLink('edge://net-internals')" class="btn-danger">edge://net-internals</button>
                <button onclick="openCustomLink('edge://extensions')" class="btn-warn">edge://extensions</button>
            </div>
        `;
    } else if (ua.includes('chrome/') && !ua.includes('edg/')) {
        html += `<div style="font-size:0.75rem; color:var(--accent); margin-bottom:4px; font-weight:bold;">Detekován prohlížeč: Google Chrome</div>`;
        html += `
            <div class="flex-row" style="margin-bottom: 8px;">
                <button onclick="openCustomLink('chrome://settings')" class="btn-danger">chrome://settings</button>
                <button onclick="openCustomLink('chrome://about')" class="btn-warn">chrome://about</button>
            </div>
            <div class="flex-row" style="margin-bottom: 8px;">
                <button onclick="openCustomLink('chrome://flags')" class="btn-danger">chrome://flags</button>
                <button onclick="openCustomLink('chrome://downloads')" class="btn-warn">chrome://downloads</button>
            </div>
            <div class="flex-row" style="margin-bottom: 8px;">
                <button onclick="openCustomLink('chrome://net-internals')" class="btn-danger">chrome://net-internals</button>
                <button onclick="openCustomLink('chrome://extensions')" class="btn-warn">chrome://extensions</button>
            </div>
            <div class="flex-row" style="margin-bottom: 8px;">
                <button onclick="openCustomLink('chrome://system')" class="btn-danger">chrome://system</button>
                <button onclick="openCustomLink('chrome://version')" class="btn-warn">chrome://version</button>
            </div>
        `;
    } else if (ua.includes('firefox/')) {
        html += `<div style="font-size:0.75rem; color:var(--accent); margin-bottom:4px; font-weight:bold;">Detekován prohlížeč: Mozilla Firefox</div>`;
        html += `
            <div class="flex-row" style="margin-bottom: 8px;">
                <button onclick="openCustomLink('about:preferences')" class="btn-warn">about:preferences</button>
                <button onclick="openCustomLink('about:config')" class="btn-danger">about:config</button>
            </div>
            <div class="flex-row" style="margin-bottom: 8px;">
                <button onclick="openCustomLink('about:debugging')" class="btn-danger">about:debugging</button>
                <button onclick="openCustomLink('about:support')" class="btn-warn">about:support</button>
            </div>
            <div class="flex-row" style="margin-bottom: 8px;">
                <button onclick="openCustomLink('about:addons')" class="btn-warn">about:addons</button>
                <button onclick="openCustomLink('about:networking')" class="btn-danger">about:networking</button>
            </div>
        `;
    } else if (ua.includes('safari/') && !ua.includes('chrome/')) {
        html += `<div style="font-size:0.75rem; color:var(--accent); margin-bottom:4px; font-weight:bold;">Detekován prohlížeč: Apple Safari</div>`;
        html += `
            <div class="flex-row" style="margin-bottom: 8px;">
                <button onclick="openCustomLink('safari-extension://')" class="btn-danger">safari-extension://</button>
                <button onclick="openCustomLink('x-apple.systempreferences:')" class="btn-warn">System Prefs</button>
            </div>
        `;
    } else {
        html += `<div style="font-size:0.75rem; color:var(--warn); margin-bottom:4px; font-weight:bold;">Neznámý/Ostatní prohlížeč (zobrazen obecný set)</div>`;
        html += `
            <div class="flex-row" style="margin-bottom: 8px;">
                <button onclick="openCustomLink('about:blank')" class="btn-warn">about:blank</button>
                <button onclick="openCustomLink('about:preferences')" class="btn-warn">about:preferences</button>
            </div>
        `;
    }

    container.innerHTML = html;
}

function renderKeyboardOptions() {
    const container = document.getElementById('osKeyboardContainer');
    const ua = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();
    
    let html = '';
    if (platform.includes('win') || ua.includes('windows')) {
        html = `
            <div class="flex-row" style="margin-bottom:0;">
                <button onclick="triggerOnScreenKeyboard('osk')" class="btn-warn" style="margin-top:0;">Windows OSK</button>
                <button onclick="triggerOnScreenKeyboard('tabtip')" class="btn-warn" style="margin-top:0;">Windows TabTip</button>
            </div>
        `;
    } else if (platform.includes('lin') || ua.includes('linux')) {
        html = `
            <div class="flex-row" style="margin-bottom:0;">
                <button onclick="triggerOnScreenKeyboard('onboard')" class="btn-warn" style="margin-top:0;">Onboard</button>
                <button onclick="triggerOnScreenKeyboard('matchbox')" class="btn-warn" style="margin-top:0;">Matchbox</button>
                <button onclick="triggerOnScreenKeyboard('squeekboard')" class="btn-warn" style="margin-top:0;">Squeekboard</button>
            </div>
        `;
    } else {
        html = `<p style="font-size: 0.85rem; color: var(--warn); margin: 5px 0;">Neznámý operační systém pro specifické systémové klávesnice.</p>`;
    }
    container.innerHTML = html;
}

function initAuditApp() {
    const ua = navigator.userAgent;
    let isOutdated = false;
    
    if (ua.includes("Chrome/") && !ua.includes("Headless")) {
        const match = ua.match(/Chrome\/([0-9]+)/);
        if (match && parseInt(match[1]) < 100) {
            isOutdated = true;
        }
    } else if (ua.includes("MSIE") || ua.includes("Trident")) {
        isOutdated = true;
    }

    const statusBadge = isOutdated 
        ? '<span class="badge badge-danger">(outdated)</span>' 
        : '<span class="badge badge-success">(uptodate)</span>';

    const info = `User-Agent: ${ua}\nPlatforma: ${navigator.platform}\nRozlišení: ${window.screen.width}x${window.screen.height}\nStav jádra: ${statusBadge}`;
    document.getElementById('fingerprintBox').innerHTML = info;
    logEvent(`Prostředí načteno. Stav jádra: ${isOutdated ? 'Zastaralé (outdated)' : 'Aktuální (uptodate)'}`, isOutdated ? 'danger' : 'info');
    
    renderKeyboardOptions();
    renderBrowserLinks();
}

let auditEvents = [];

function logEvent(text, type = 'warn') {
    const box = document.getElementById('eventLog');
    const time = new Date().toLocaleTimeString();
    let badgeClass = 'badge-warn';
    if (type === 'danger') badgeClass = 'badge-danger';
    if (type === 'info') badgeClass = 'badge-info';
    if (type === 'success') badgeClass = 'badge-success';

    auditEvents.push({ time, type, text });

    box.innerHTML += `<div class="log-item">[${time}] <span class="badge ${badgeClass}">${type.toUpperCase()}</span> ${text}</div>`;
    box.scrollTop = box.scrollHeight;
}

function triggerPrint() {
    logEvent('Spuštěn tiskový dialog (window.print).', 'warn');
    window.print();
}

function openPdf() {
    logEvent('Pokus o otevření souboru test.pdf v novém okně.', 'info');
    try {
        window.open('source/dummy.pdf', '_blank');
    } catch (err) {
        logEvent(`Otevření PDF selhalo: ${err.message}`, 'danger');
    }
}

async function testClipboardRead() {
    try {
        const text = await navigator.clipboard.readText();
        logEvent(`Úspěšně přečtena schránka: "${text}"`, 'danger');
    } catch (err) {
        logEvent('Čtení schránky zablokováno.', 'info');
    }
}

async function testClipboardWrite() {
    const val = document.getElementById('customClipboardInput').value;
    try {
        await navigator.clipboard.writeText(val);
        logEvent(`Do schránky zapsán vlastní text: "${val}"`, 'danger');
    } catch (err) {
        logEvent('Zápis do schránky zablokován.', 'info');
    }
}

function openCustomLink(url) {
    logEvent(`Pokus o navigaci na: ${url}`, 'danger');
    
    if (url.startsWith('chrome://') || url.startsWith('edge://')) {
        logEvent(`Upozornění: Prohlížeč blokuje skriptové spouštění interních schémat (${url}). Zkuste je případně zkopírovat do adresního řádku.`, 'warn');
        try {
            window.location.href = url;
        } catch (e) {
        }
        return;
    }

    try {
        const newWin = window.open(url, '_blank');
        if (!newWin) {
            logEvent(`Vyskakovací okno bylo zablokováno (Popup blocker).`, 'warn');
        }
    } catch (err) {
        logEvent(`Navigace selhala: ${err.message}`, 'info');
    }
}

function openCustomUrlInput() {
    const url = document.getElementById('customUrlInput').value.trim();
    if (url) {
        openCustomLink(url);
    } else {
        logEvent('Zadejte platné URL.', 'warn');
    }
}

let activeLoops = [];
let activeWorkers = [];
let activeSockets = [];
let isRunningCrasher = false;

function crashMemoryLeak() {
    logEvent('Pokus o pád: Masivní alokace paměti (OOM Leak)', 'danger');
    isRunningCrasher = true;
    let massiveArray = [];
    let interval = setInterval(() => {
        if (!isRunningCrasher) { clearInterval(interval); return; }
        try {
            massiveArray.push(new Array(10000000).fill(Math.random()));
        } catch(e) {
            logEvent('Paměť vyčerpána (OOM chycen).', 'danger');
            clearInterval(interval);
        }
    }, 20);
    activeLoops.push(interval);
}

function crashWasmHeapExhaustion() {
    logEvent('Pokus o pád: WebAssembly Heap Exhaustion (Wasm Memory Boom)', 'danger');
    try {
        const wasmBytes = new Uint8Array([
            0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
            0x01, 0x04, 0x01, 0x60, 0x00, 0x00, 0x03, 0x02,
            0x01, 0x00, 0x05, 0x03, 0x01, 0x01, 0xff, 0x01,
            0x0a, 0x04, 0x01, 0x02, 0x00, 0x0b
        ]);
        const wasmModule = new WebAssembly.Module(wasmBytes);
        const wasmInstance = new WebAssembly.Instance(wasmModule);
        logEvent('Wasm instance úspěšně vytvořena, pokus o expanzi paměti...', 'warn');
        
        let interval = setInterval(() => {
            try {
                wasmInstance.exports.memory.grow(1000);
            } catch (err) {
                logEvent(`Wasm paměť vyčerpána: ${err.message}`, 'danger');
                clearInterval(interval);
            }
        }, 10);
        activeLoops.push(interval);
    } catch (err) {
        logEvent(`Wasm alokace zablokována či selhala: ${err.message}`, 'info');
    }
}

function crashWorkerFlood() {
    logEvent('Pokus o pád: Nekonečný spawn Web Workerů (Thread Exhaustion)', 'danger');
    isRunningCrasher = true;
    const blobCode = `onmessage = function(e) { while(true) { postMessage(Math.random()); } }`;
    const blob = new Blob([blobCode], { type: 'application/javascript' });
    const blobUrl = URL.createObjectURL(blob);

    let interval = setInterval(() => {
        if (!isRunningCrasher) { clearInterval(interval); return; }
        try {
            for (let i = 0; i < 50; i++) {
                let worker = new Worker(blobUrl);
                worker.postMessage('start');
                activeWorkers.push(worker);
            }
        } catch (err) {
            logEvent(`Worker limit dosažen/systém zamrznul: ${err.message}`, 'danger');
            clearInterval(interval);
        }
    }, 50);
    activeLoops.push(interval);
}

function crashDomExplosion() {
    logEvent('Pokus o pád: DOM Element Explosion (Million Nodes)', 'danger');
    isRunningCrasher = true;
    let interval = setInterval(() => {
        if (!isRunningCrasher) { clearInterval(interval); return; }
        try {
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < 50000; i++) {
                let div = document.createElement('div');
                div.innerText = 'CRASH_NODE_' + Math.random();
                fragment.appendChild(div);
            }
            document.body.appendChild(fragment);
        } catch (err) {
            logEvent(`DOM strom přetečen: ${err.message}`, 'danger');
            clearInterval(interval);
        }
    }, 20);
    activeLoops.push(interval);
}

function crashWebSocketLoop() {
    logEvent('Pokus o pád: WebSocket / Loopback Connection Flood', 'danger');
    isRunningCrasher = true;
    let interval = setInterval(() => {
        if (!isRunningCrasher) { clearInterval(interval); return; }
        try {
            for (let i = 0; i < 20; i++) {
                let ws = new WebSocket('ws://127.0.0.1:9999');
                activeSockets.push(ws);
            }
        } catch (err) {
            logEvent(`Socket limit dosažen: ${err.message}`, 'info');
        }
    }, 50);
    activeLoops.push(interval);
}

function crashStorageFlood() {
    logEvent('Pokus o pád: LocalStorage / IndexedDB Quota Flood', 'danger');
    try {
        let data = new Array(1024 * 1024).join('X');
        let counter = 1;
        let interval = setInterval(() => {
            try {
                localStorage.setItem('crasher_key_' + counter, data);
                counter++;
            } catch (err) {
                logEvent(`Úložiště zcela zaplněno (QuotaExceeded): ${err.message}`, 'danger');
                clearInterval(interval);
            }
        }, 10);
        activeLoops.push(interval);
    } catch (err) {
        logEvent(`Storage flood zablokován: ${err.message}`, 'info');
    }
}

function stopCrasherLoops() {
    isRunningCrasher = false;
    activeLoops.forEach(id => clearInterval(id));
    activeLoops = [];
    
    activeWorkers.forEach(w => w.terminate());
    activeWorkers = [];

    activeSockets.forEach(s => { try { s.close(); } catch(e){} });
    activeSockets = [];

    try {
        localStorage.clear();
    } catch(e){}

    logEvent('Zastaveny veškeré probíhající zátěžové smyčky a uvolněny zdroje.', 'success');
}

function triggerOnScreenKeyboard(type) {
    logEvent(`Pokus o spuštění systémové klávesnice: ${type}`, 'danger');
    if (type === 'osk') {
        window.open('cmd://c:\\windows\\system32\\osk.exe', '_blank');
    } else if (type === 'tabtip') {
        window.open('shell:AppsFolder\\Microsoft.Windows.TabTip_8wekyb3d8bbwe!App', '_blank');
    } else if (type === 'onboard') {
        window.open('onboard://', '_blank');
    } else if (type === 'matchbox') {
        window.open('matchbox-keyboard://', '_blank');
    } else if (type === 'squeekboard') {
        window.open('squeekboard://', '_blank');
    }
}

function triggerVirtualInputFocus() {
    const input = document.getElementById('keyboardFocusInput');
    input.focus();
    logEvent('Fokus na testovací input pro vynucení virtuální klávesnice.', 'info');
}

function triggerDelayedRightClick() {
    logEvent('Spuštěn odpočet 3s pro simulaci pravého kliknutí...', 'warn');
    setTimeout(() => {
        const event = new MouseEvent('contextmenu', {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 2,
            buttons: 2
        });
        document.dispatchEvent(event);
        logEvent('Simulované pravé tlačítko myši (contextmenu) bylo úspěšně vyvoláno.', 'danger');
    }, 3000);
}

async function runWebRTCLeakTest() {
    const rtcBox = document.getElementById('webrtcLogBox');
    rtcBox.innerHTML = '<div class="log-item">Hledám IP adresy přes WebRTC...</div>';
    logEvent('Spuštěn WebRTC Leak Test pro zjištění lokální/veřejné IP adresy.', 'info');

    const ips = new Set();
    try {
        const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
        if (!RTCPeerConnection) {
            rtcBox.innerHTML = '<div class="log-item" style="color:var(--warn)">WebRTC není v tomto prohlížeči podporováno.</div>';
            logEvent('WebRTC nepodporováno.', 'warn');
            return;
        }

        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        pc.createDataChannel('');
        
        pc.onicecandidate = (event) => {
            if (!event || !event.candidate) return;
            const candidateLine = event.candidate.candidate;
            const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9:]+:+[a-f0-9:]+)/;
            const match = ipRegex.exec(candidateLine);
            if (match) {
                ips.add(match[1]);
            }
            
            let htmlContent = '';
            ips.forEach(ip => {
                let typeBadge = '<span class="badge badge-info">IP</span>';
                if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.') || ip.startsWith('fc') || ip.startsWith('fe')) {
                    typeBadge = '<span class="badge badge-danger">LOKÁLNÍ (VLAN)</span>';
                } else {
                    typeBadge = '<span class="badge badge-warn">VEŘEJNÁ</span>';
                }
                htmlContent += `<div class="log-item">${typeBadge} <b>[${ip}]</b></div>`;
            });
            rtcBox.innerHTML = htmlContent || '<div class="log-item">Žádné IP adresy nenalezeny.</div>';
        };

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        setTimeout(() => {
            if (ips.size === 0) {
                rtcBox.innerHTML = '<div class="log-item" style="color:var(--warn)">Žádná IP nebyla detekována (může být zablokováno polici/firewallem).</div>';
                logEvent('WebRTC IP Test dokončen bez odhalených adres.', 'warn');
            } else {
                logEvent(`WebRTC odhalilo ${ips.size} IP adres: ${Array.from(ips).join(', ')}`, 'danger');
            }
        }, 2000);

    } catch (err) {
        rtcBox.innerHTML = `<div class="log-item" style="color:var(--danger)">Chyba: ${err.message}</div>`;
        logEvent(`WebRTC Leak Test selhal: ${err.message}`, 'danger');
    }
}

async function runPortScan() {
    const scanBox = document.getElementById('portScanLogBox');
    scanBox.innerHTML = '<div class="log-item">Skenuji lokální porty na 127.0.0.1...</div>';
    logEvent('Spuštěn lokální Port Scan na 127.0.0.1.', 'info');

    const portsToScan = [
        { port: 80, name: 'HTTP / Web Server' },
        { port: 443, name: 'HTTPS / Secure Web' },
        { port: 3000, name: 'Node.js / Dev Server' },
        { port: 5000, name: 'Flask / Local API' },
        { port: 631, name: 'CUPS / Print Service' },
        { port: 8080, name: 'Kiosk API / Tomcat / Alt HTTP' },
        { port: 8443, name: 'Alt HTTPS' },
        { port: 9100, name: 'Raw Printing / JetDirect' }
    ];

    let openPortsCount = 0;
    let htmlContent = '';

    for (const item of portsToScan) {
        const port = item.port;
        const serviceName = item.name;
        
        let isOpen = false;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 800);
            
            await fetch(`http://127.0.0.1:${port}`, {
                mode: 'no-cors',
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            isOpen = true;
        } catch (err) {
            if (err.name !== 'AbortError') {
                isOpen = await checkPortViaWebSocket(port);
            }
        }

        if (isOpen) {
            openPortsCount++;
            htmlContent += `<div class="log-item"><span class="badge badge-danger">OTEVŘENO</span> Port <b>${port}</b> (${serviceName})</div>`;
            logEvent(`Nalezena otevřená služba na lokálním portu ${port} (${serviceName}).`, 'danger');
        } else {
            htmlContent += `<div class="log-item"><span class="badge badge-success">ZAVŘENO</span> Port ${port} (${serviceName})</div>`;
        }
        scanBox.innerHTML = htmlContent;
    }

    if (openPortsCount === 0) {
        logEvent('Port Scan dokončen. Žádné aktivní porty nebyly z 127.0.0.1 detekovány.', 'success');
    } else {
        logEvent(`Port Scan dokončen. Nalezeno ${openPortsCount} otevřených portů!`, 'danger');
    }
}

function checkPortViaWebSocket(port) {
    return new Promise((resolve) => {
        const socket = new WebSocket(`ws://127.0.0.1:${port}`);
        let resolved = false;

        const timer = setTimeout(() => {
            if (!resolved) {
                resolved = true;
                try { socket.close(); } catch(e){}
                resolve(false);
            }
        }, 400);

        socket.onopen = () => {
            if (!resolved) {
                resolved = true;
                clearTimeout(timer);
                try { socket.close(); } catch(e){}
                resolve(true);
            }
        };

        socket.onerror = () => {
            if (!resolved) {
                resolved = true;
                clearTimeout(timer);
                try { socket.close(); } catch(e){}
                resolve(true); 
            }
        };
    });
}

function testIframeNavigationEscape() {
    const container = document.getElementById('iframeEscapeContainer');
    container.innerHTML = '';
    logEvent('Testuji Iframe Sandbox Escape & Prototype Pollution/Object Leak...', 'info');

    const iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-scripts allow-top-navigation allow-popups allow-forms');
    iframe.style.width = '100%';
    iframe.style.height = '110px';
    iframe.style.border = '1px solid var(--border)';
    iframe.style.borderRadius = '4px';
    iframe.style.background = '#090d16';

    const iframeContent = `
        <html>
        <body style="color:#f8fafc; font-family:sans-serif; font-size:0.75rem; padding:8px; margin:0; text-align:center;">
            <div id="statusText">Sandbox iframe aktivní. Testuji přístup k DOM objektům...</div>
            <div style="margin-top:6px; display:flex; gap:6px; justify-content:center;">
                <button id="escapeBtn" style="padding:4px 8px; background:#ef4444; color:#fff; border:none; border-radius:4px; cursor:pointer;">Zkusit Top Navigaci</button>
                <button id="leakBtn" style="padding:4px 8px; background:#f59e0b; color:#000; border:none; border-radius:4px; cursor:pointer;">Test Window Leak</button>
            </div>
            <script>
                document.getElementById('escapeBtn').onclick = function() {
                    try {
                        window.top.location.href = 'https://google.com';
                    } catch(e) {
                        document.getElementById('statusText').innerHTML = '<b style="color:#22c55e">Top navigace úspěšně zablokována sandboxem!</b>';
                    }
                };
                document.getElementById('leakBtn').onclick = function() {
                    try {
                        const parentLoc = window.parent.location.href;
                        document.getElementById('statusText').innerHTML = '<b style="color:#ef4444">UNIK! Podařilo se číst rodičovskou URL: ' + parentLoc + '</b>';
                    } catch(e) {
                        document.getElementById('statusText').innerHTML = '<b style="color:#22c55e">Izolace funguje: Přístup k window.parent byl odepřen.</b>';
                    }
                };
            <\/script>
        </body>
        </html>
    `;

    iframe.srcdoc = iframeContent;
    container.appendChild(iframe);
    logEvent('Vylepšený iframe sandbox kontejner úspěšně inicializován.', 'warn');
}

async function testFileSystemAccess() {
    logEvent('Spuštěn pokus o přímý přístup k souborovému systému (File System Access API)...', 'info');
    if (!window.showOpenFilePicker) {
        logEvent('File System Access API není v tomto prohlížeči podporováno nebo je blokováno.', 'warn');
        alert('Prohlížeč nepodporuje File System Access API.');
        return;
    }
    try {
        const handles = await window.showOpenFilePicker({ multiple: false });
        if (handles && handles.length > 0) {
            const file = await handles[0].getFile();
            logEvent(`KRITICKÝ ÚNIK: Přístup k lokálnímu souboru povolen! Jméno: ${file.name}`, 'danger');
            alert(`Úspěšně získán přístup k souboru: ${file.name}`);
        }
    } catch (err) {
        if (err.name !== 'AbortError') {
            logEvent(`File System Access odepřen/chyba: ${err.message}`, 'info');
        } else {
            logEvent('Uživatel zrušil dialog File System Access.', 'info');
        }
    }
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', 'KIOSK_EXFILTRATION_PAYLOAD_TEST');
    logEvent('Zahájen pokus o přetažení dat (Drag Start).', 'info');
}

function handleDragOver(e) {
    e.preventDefault();
    document.getElementById('dropTargetBox').classList.add('dragover');
}

function handleDragLeave(e) {
    document.getElementById('dropTargetBox').classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    const box = document.getElementById('dropTargetBox');
    box.classList.remove('dragover');
    const dndLog = document.getElementById('dndLogBox');

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const fileName = e.dataTransfer.files[0].name;
        dndLog.innerHTML = `<div class="log-item" style="color:var(--danger)">Přetažen soubor: ${fileName}</div>`;
        logEvent(`Drag and Drop Exfiltration: Úspěšně zachycen vpuštěný soubor "${fileName}".`, 'danger');
    } else {
        const text = e.dataTransfer.getData('text/plain');
        dndLog.innerHTML = `<div class="log-item" style="color:var(--warn)">Přetažen text: ${text}</div>`;
        logEvent(`Drag and Drop Exfiltration: Přetažen textový payload: "${text}".`, 'warn');
    }
}

window.addEventListener('keydown', (e) => {
    if (document.getElementById('appContainer').style.display === 'block') {
        const keyLog = document.getElementById('keyLog');
        const time = new Date().toLocaleTimeString();
        let keys = [];
        if (e.ctrlKey) keys.push('Ctrl');
        if (e.altKey) keys.push('Alt');
        if (e.shiftKey) keys.push('Shift');
        keys.push(e.key);
        
        const opCombo = keys.join(' + ');
        keyLog.innerHTML += `<div class="log-item">[${time}] Stisknuto: <b>${opCombo}</b> (code: ${e.code})</div>`;
        keyLog.scrollTop = keyLog.scrollHeight;

        if (e.key === 'F11' || (e.ctrlKey && e.shiftKey && e.code === 'KeyI') || e.key === 'F12') {
            logEvent(`Zaznamenán pokus o systémovou/vývojářskou zkratku: ${opCombo}`, 'danger');
        }
    }
});

window.addEventListener('contextmenu', (e) => {
    if (document.getElementById('appContainer').style.display === 'block') {
        logEvent('Detekován pokus o kontextové menu.', 'warn');
    }
});

function exportReport() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditEvents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "kiosk_audit_report.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    logEvent('JSON report stažen.', 'info');
}


// --- PARTICLE ANIMACE NA POZADÍ ---
const canvas = document.getElementById('particleCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    
    let particles = [];
    let numParticles = 100; // Sníženo na 100 pro plynulý chod na slabších kioskových zařízeních (můžeš vrátit na 200)

    function Particle() {
        this.speed = 0.4;
        this.angle = Math.random() * 360;
        this.radius = 1.5;
        this.location = {
            x: Math.random() * W,
            y: Math.random() * H
        };
        // Laděno do stylu tvé modro-světlé palety, případně zachovává náhodné barvy
        this.color = 'rgba(56, 189, 248, 0.4)'; // Jemná modrá (--accent)
    }

    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }

    function drawFrame() {
        window.requestAnimationFrame(drawFrame);
        
        // Vyčištění plátna s lehkým překryvem pro efekt stopy (nebo čisté mazání tvojí barvou pozadí)
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, W, H);

        for (let i = 0; i < numParticles; i++) {
            let p = particles[i];
            
            // Spojování čarami pod určitou vzdálenost
            for (let n = 0; n < numParticles; n++) {
                let p2 = particles[n],
                    dx = p2.location.x - p.location.x,
                    dy = p2.location.y - p.location.y,
                    dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 80) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(56, 189, 248, ' + (1 - dist / 80) + ')';
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(p.location.x, p.location.y);
                    ctx.lineTo(p2.location.x, p2.location.y);
                    ctx.stroke();
                }
            }

            // Vykreslení tečky
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(p.location.x, p.location.y, p.radius, p.radius);

            // Pohyb a odrážení od stěn / obalování
            if (p.location.x > W) p.location.x = 0;
            if (p.location.x < 0) p.location.x = W;
            if (p.location.y > H) p.location.y = 0;
            if (p.location.y < 0) p.location.y = H;

            p.location.x += p.speed * Math.cos(p.angle * Math.PI / 180);
            p.location.y += p.speed * Math.sin(p.angle * Math.PI / 180);
        }
    }

    // Spuštění smyčky
    drawFrame();

    // Responzivita při změně velikosti okna
    window.addEventListener('resize', () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    });
}