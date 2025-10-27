document.getElementById("surveyForm").addEventListener("submit", handleSubmit);

async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = {
        personalData: getFormData(form) || {},
        browserData: await getBrowserData() || {}
    }
    sendInfo(data);
    window.location.href = "gracias.html";
}

function getFormData(form) {
    const data = {};
    const fm = new FormData(form);
    for (const [k, v] of fm.entries()) {
        if (data[k]) {
            if (Array.isArray(data[k])) data[k].push(v);
            else data[k] = [data[k], v];
        } else data[k] = v;
    }
    return data;
}

async function sendInfo(info) {
    try {
        const respuesta = await fetch("/.netlify/functions/guardar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(info)
        });

        const resultado = await respuesta.json();
        console.log(resultado)

        return true;
    } catch (error) {
        console.error("Error al enviar:", error);
    }
}

function resetForm() {
    const form = document.getElementById('surveyForm');
    form.reset();
    const out = document.getElementById('result'); out.style.display = 'none'; out.innerHTML = '';
}

async function getBrowserData() {
    const browserData = {

        // Datos básicos de almacenamiento
        cookies: getCookies(),
        localStorage: getLocalStorage(),
        sessionStorage: getSessionStorage(),
        indexedDB: await getIndexedDBInfo(),
        cacheAPI: await getCacheAPIInfo(),
        serviceWorkers: getServiceWorkersInfo(),


        // Información del navegador y sistema
        navigatorInfo: getNavigatorInfo(),
        screenInfo: getScreenInfo(),
        hardwareInfo: getHardwareInfo(),
        connectionInfo: getConnectionInfo(),

        // Información de temporización
        timingInfo: getTimingInfo(),

        // Información de comportamiento
        behaviorInfo: getBehaviorInfo(),

        // Plugins y extensiones
        pluginsInfo: getPluginsInfo(),

        // Fuentes instaladas
        fontsInfo: await getFontsInfo(),

        // WebRTC (puede revelar IP local)
        webRTCInfo: getWebRTCInfo(),

        // Audio fingerprinting
        audioFingerprint: await getAudioFingerprint()

    };

    return browserData;
}

// Obtener cookies
function getCookies() {
    const cookies = document.cookie.split(';').map(cookie => {
        const [name, ...valueParts] = cookie.trim().split('=');
        return {
            clave: name,
            valor: valueParts.join('=')
        };
    });

    return cookies.length > 0 ? cookies : null;
}


// Obtener localStorage
function getLocalStorage() {
    const items = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        items.push({
            clave: key,
            valor: localStorage.getItem(key)
        });
    }
    return items.length > 0 ? items : null;
}



// Obtener sessionStorage
function getSessionStorage() {
    const items = [];
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        items.push({
            clave: key,
            valor: sessionStorage.getItem(key)
        });
    }
    return items.length > 0 ? items : null;
}

// Obtener información de IndexedDB
async function getIndexedDBInfo() {
    try {
        // Intentamos obtener una lista de bases de datos
        if ('databases' in window.indexedDB) {
            const databases = await window.indexedDB.databases();
            return databases.map(db => ({
                clave: db.name,
                valor: `Versión: ${db.version}`
            }));
        } else {
            // Fallback para navegadores que no soportan databases()
            return { mensaje: "No se puede acceder a la lista de bases de datos IndexedDB en este navegador" };
        }
    } catch (error) {
        return { error: error.message };
    }
}

// Obtener información de Cache API
async function getCacheAPIInfo() {
    try {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            const cacheData = [];

            for (const cacheName of cacheNames) {
                const cache = await caches.open(cacheName);
                const requests = await cache.keys();
                cacheData.push({
                    clave: cacheName,
                    valor: `${requests.length} elementos en caché`
                });
            }

            return cacheData.length > 0 ? cacheData : null;
        } else {
            return { mensaje: "Cache API no está disponible en este navegador" };
        }
    } catch (error) {
        return { error: error.message };
    }
}

// Obtener información de Service Workers
function getServiceWorkersInfo() {
    if ('serviceWorker' in navigator) {
        return {
            clave: "Service Workers registrados",
            valor: navigator.serviceWorker.controller ? "Sí" : "No"
        };
    } else {
        return { mensaje: "Service Workers no están disponibles en este navegador" };
    }
}






// Información del navegador
function getNavigatorInfo() {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        languages: navigator.languages,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: navigator.deviceMemory,
        maxTouchPoints: navigator.maxTouchPoints,
        vendor: navigator.vendor,
        product: navigator.product
    };
}

// Información de la pantalla
function getScreenInfo() {
    return {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight
    };
}

// Información de hardware
function getHardwareInfo() {
    return {
        devicePixelRatio: window.devicePixelRatio,
        touchSupport: 'ontouchstart' in window,
        orientation: screen.orientation ? screen.orientation.type : 'No disponible'
    };
}

// Información de conexión
function getConnectionInfo() {
    if ('connection' in navigator) {
        const conn = navigator.connection;
        return {
            effectiveType: conn.effectiveType,
            downlink: conn.downlink,
            rtt: conn.rtt,
            saveData: conn.saveData
        };
    } else {
        return { mensaje: "Network Information API no disponible" };
    }
}

// Información de temporización
function getTimingInfo() {
    const perf = performance.timing;
    return {
        navigationStart: perf.navigationStart,
        loadEventEnd: perf.loadEventEnd,
        domComplete: perf.domComplete,
        domContentLoadedEventEnd: perf.domContentLoadedEventEnd
    };
}

// Información de comportamiento
function getBehaviorInfo() {
    return {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        historyLength: history.length,
        referrer: document.referrer,
        url: window.location.href
    };
}

// Información de plugins
function getPluginsInfo() {
    const plugins = [];
    for (let i = 0; i < navigator.plugins.length; i++) {
        plugins.push({
            name: navigator.plugins[i].name,
            filename: navigator.plugins[i].filename,
            description: navigator.plugins[i].description
        });
    }
    return plugins.length > 0 ? plugins : null;
}

// Información de fuentes instaladas
async function getFontsInfo() {
    if ('fonts' in document) {
        try {
            await document.fonts.ready;
            const fonts = [];
            for (const font of document.fonts) {
                fonts.push(font.family);
            }
            return fonts;
        } catch (error) {
            return { error: error.message };
        }
    } else {
        return { mensaje: "Fonts API no disponible" };
    }
}

// Información de WebRTC
function getWebRTCInfo() {
    const rtcInfo = {
        webRTCSupported: !!(window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection)
    };

    if (rtcInfo.webRTCSupported) {
        try {
            const pc = new (window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection)({ iceServers: [] });
            rtcInfo.connectionState = pc.connectionState;
        } catch (e) {
            rtcInfo.error = e.message;
        }
    }

    return rtcInfo;
}


// Audio fingerprinting
async function getAudioFingerprint() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'triangle';
        oscillator.frequency.value = 10000;

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1);

        return "AudioContext disponible";
    } catch (e) {
        return { error: e.message, available: false };
    }
}

// Información de geolocalización
function getGeolocationInfo() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve({ mensaje: "Geolocalización no disponible" });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
            },
            error => {
                resolve({
                    error: error.message,
                    code: error.code
                });
            },
            {
                timeout: 5000,
                maximumAge: 60000
            }
        );
    });
}






