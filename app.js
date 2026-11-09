const CURRENT_VERSION = "2.1";

let savedProgress = localStorage.getItem('librogame_progress');
let playerProgress = savedProgress ? JSON.parse(savedProgress) : {};

let savedTheme = localStorage.getItem('librogame_theme') || 'theme-dark-fantasy';
document.body.className = savedTheme;

let isAdminMode = false;
let activeBookId = null;
let currentGameState = { currentNodeId: null, runtimeStats: {}, skillPoints: 0, pendingSpSpend: {}, notifications: [] };

function setTheme(themeName) { document.body.className = themeName; localStorage.setItem('librogame_theme', themeName); }
function openThemeModal() { document.getElementById('themeModal').style.display = 'flex'; }
function saveProgress() { localStorage.setItem('librogame_progress', JSON.stringify(playerProgress)); }

function confirmResetProgress() {
    if (confirm("⚠️ Vuoi davvero resettare tutti i progressi? Operazione irreversibile!")) {
        localStorage.removeItem('librogame_progress');
        location.reload();
    }
}

function toggleDrawer(open) {
    const drawer = document.getElementById('gameDrawer');
    const overlay = document.getElementById('drawerOverlay');
    if (open) { drawer.classList.add('open'); overlay.style.display = 'block'; } 
    else { drawer.classList.remove('open'); overlay.style.display = 'none'; }
}

function exportSaveGameCSV() {
    if (activeBookId) { playerProgress[activeBookId] = JSON.parse(JSON.stringify(currentGameState)); saveProgress(); }
    let csvLines = [];
    Object.keys(bookCatalog).forEach(bookId => {
        let book = bookCatalog[bookId];
        let prog = playerProgress[bookId];
        let nodeId = prog ? prog.currentNodeId : book.startingNodeId;
        let statValues = [];
        book.stats.forEach(s => {
            statValues.push((prog && prog.runtimeStats && prog.runtimeStats[s.id] !== undefined) ? prog.runtimeStats[s.id] : s.value);
        });
        let spValue = (prog && prog.skillPoints !== undefined) ? prog.skillPoints : 0;
        csvLines.push([book.id, `"${book.title.replace(/"/g, '""')}"`, nodeId, ...statValues, spValue].join(","));
    });
    let blob = new Blob([csvLines.join("\n")], { type: 'text/csv;charset=utf-8;' });
    let link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", "salvataggio_librogame.csv");
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// FIX SALVATAGGI MOBILE: Riconosce i CSV europei e resetta la memoria a ogni click
function importSaveGameCSVPrompt() {
    let input = document.getElementById('csvMobileInput');
    
    if (!input) {
        alert("Errore di sistema: input caricamento non trovato.");
        return;
    }

    // 1. Resetta il valore PRIMA del caricamento (così puoi selezionare anche lo stesso file 2 volte di fila)
    input.value = '';

    input.onchange = e => {
        if (!e.target.files.length) return;
        let file = e.target.files[0];
        let reader = new FileReader();
        
        reader.onload = event => {
            try {
                let text = event.target.result.trim();
                if (!text) {
                    alert("Attenzione: Il file selezionato è completamente vuoto.");
                    return;
                }

                let lines = text.split('\n');
                let loadedProgress = {};
                let bookTitlesInDb = {};
                Object.keys(bookCatalog).forEach(bId => bookTitlesInDb[bookCatalog[bId].title.trim().toLowerCase()] = bId);

                let salvataggiTrovati = 0;

                lines.forEach(line => {
                    if (!line.trim()) return;
                    
                    // Sostituisce eventuali punti e virgola (standard europeo) con virgole normali per non far bloccare il sistema
                    let cleanLine = line.replace(/;/g, ',');
                    
                    let bId, bTitle, nId, stats, sp;
                    let match = cleanLine.match(/^([^,]+),"([^"]+)",(.+)$/);
                    
                    if (match) {
                        bId = match[1].trim(); bTitle = match[2].trim();
                        let rest = match[3].split(',');
                        nId = rest[0].trim(); stats = rest.slice(1, 7).map(v => parseInt(v)); sp = parseInt(rest[7]);
                    } else {
                        let parts = cleanLine.split(',');
                        if (parts.length >= 9) {
                            bId = parts[0].trim(); bTitle = parts[1].trim(); nId = parts[2].trim();
                            stats = parts.slice(3, 9).map(v => parseInt(v)); sp = parseInt(parts[9]);
                        } else return;
                    }
                    
                    salvataggiTrovati++;
                    
                    let targetBookId = bookCatalog[bId] ? bId : bookTitlesInDb[bTitle.toLowerCase()];
                    if (targetBookId && bookCatalog[targetBookId]) {
                        let book = bookCatalog[targetBookId];
                        let runtimeStats = {};
                        book.stats.forEach((s, idx) => runtimeStats[s.id] = !isNaN(stats[idx]) ? stats[idx] : s.value);
                        loadedProgress[targetBookId] = { currentNodeId: nId || book.startingNodeId, runtimeStats: runtimeStats, skillPoints: !isNaN(sp) ? sp : 0, pendingSpSpend: {}, notifications: [] };
                    }
                });
                
                if (salvataggiTrovati === 0) {
                    alert("Errore: Il file non contiene salvataggi compatibili col gioco.");
                    return;
                }
                
                playerProgress = loadedProgress; 
                saveProgress(); 
                renderHome();
                
                if (activeBookId && playerProgress[activeBookId]) {
                    currentGameState = JSON.parse(JSON.stringify(playerProgress[activeBookId]));
                    if (!currentGameState.notifications) currentGameState.notifications = [];
                    renderGameNode();
                }
                alert("Partita caricata con successo!");
            } catch (err) { 
                alert("Errore critico nella lettura del file. Potrebbe essere danneggiato."); 
            }
        };
        reader.readAsText(file);
    };
    
    // Attiva il click sul pulsante nascosto
    input.click();
}

function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function renderHome() {
    const container = document.getElementById('bookListContainer');
    container.innerHTML = "";
    const bookIds = Object.keys(bookCatalog);
    document.getElementById('bookCount').innerText = bookIds.length + (bookIds.length === 1 ? " titolo" : " titoli");

    if (bookIds.length === 0) return container.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin-top:40px;">Nessun libro disponibile.</p>`;

    bookIds.forEach(id => {
        const book = bookCatalog[id];
        const hasProgress = playerProgress[id] && playerProgress[id].currentNodeId;
        
        let progressText = hasProgress ? `<div class="book-progress">📍 Avventura Iniziata</div>` : "";

        const card = document.createElement('div'); card.className = 'book-card';
        card.innerHTML = `
            <div><span class="book-id">ID: ${book.id}</span><div class="book-title">${book.title}</div></div>
            <div class="book-desc">${book.description}</div>${progressText}
            <div class="row-end">
                <button class="btn btn-primary" onclick="openOrStartBook('${book.id}')">${hasProgress ? 'Riprendi' : 'Gioca'}</button>
            </div>`;
        container.appendChild(card);
    });
    document.getElementById('modeIndicator').innerText = isAdminMode ? "Admin Mode" : "Player Mode";
}

function returnToHome() {
    if (activeBookId) { playerProgress[activeBookId] = JSON.parse(JSON.stringify(currentGameState)); saveProgress(); }
    renderHome(); switchScreen('homeScreen');
}

// LOGICA DI CARICAMENTO DINAMICO ANTI-CACHE
function openOrStartBook(bookId) {
    document.getElementById('loadingIndicator').style.display = 'block';
    
    if (window.loadedBooks && window.loadedBooks[bookId]) {
        document.getElementById('loadingIndicator').style.display = 'none';
        launchBook(bookId);
        return;
    }

    let script = document.createElement('script');
    
    // Il timestamp obbliga il cellulare a scaricare i testi sempre aggiornati
    const cacheBuster = new Date().getTime();
    script.src = `${bookId}.js?v=${cacheBuster}`;
    
    script.onload = () => {
        document.getElementById('loadingIndicator').style.display = 'none';
        if (window.loadedBooks && window.loadedBooks[bookId]) {
            launchBook(bookId);
        } else {
            alert(`Errore: il file ${bookId}.js è stato caricato ma il nodo della storia è mancante o formattato male.`);
        }
    };
    script.onerror = () => {
        document.getElementById('loadingIndicator').style.display = 'none';
        alert(`Impossibile trovare il file della storia: ${bookId}.js`);
    };
    document.head.appendChild(script);
}

function launchBook(bookId) {
    activeBookId = bookId;
    const bookMeta = bookCatalog[bookId];

    if (playerProgress[bookId] && playerProgress[bookId].currentNodeId) {
        currentGameState = JSON.parse(JSON.stringify(playerProgress[bookId]));
        if (!currentGameState.notifications) currentGameState.notifications = [];
    } else {
        currentGameState = { currentNodeId: bookMeta.startingNodeId, runtimeStats: {}, skillPoints: 0, pendingSpSpend: {}, notifications: [] };
        bookMeta.stats.forEach(s => currentGameState.runtimeStats[s.id] = s.value);
    }
    switchScreen('gameScreen'); 
    renderGameNode();
}

function renderGameNode() {
    const bookNodes = window.loadedBooks[activeBookId];
    const node = bookNodes[currentGameState.currentNodeId];
    
    if (!node) {
        document.getElementById('gameStoryText').innerText = "Errore: Nodo '" + currentGameState.currentNodeId + "' non trovato in questo libro.";
        return;
    }

    document.getElementById('gameChapterTitle').innerText = node.chapterTitle;

    let htmlContent = "";
    if (currentGameState.notifications?.length > 0) {
        currentGameState.notifications.forEach(n => htmlContent += `<span class="notif-text ${n.cssClass}">${n.text}</span>`);
        currentGameState.notifications = []; 
    }

    document.getElementById('gameStoryText').innerHTML = htmlContent + node.text;

    const choicesBox = document.getElementById('gameChoicesContainer');
    choicesBox.innerHTML = "";
    node.choices.forEach(choice => {
        const btn = document.createElement('button'); btn.className = 'btn'; btn.style.textAlign = "left"; btn.innerText = choice.text;
        btn.onclick = () => handleChoice(choice);
        choicesBox.appendChild(btn);
    });
}

function handleChoice(choice) {
    if (choice.target === "RELOAD") { location.reload(); return; }

    const bookMeta = bookCatalog[activeBookId];
    currentGameState.notifications = []; 

    if (choice.stat && choice.threshold) {
        let statVal = currentGameState.runtimeStats[choice.stat] || 0;
        const passed = statVal >= choice.threshold;
        currentGameState.notifications.push({ text: passed ? `✅ Superato (${choice.stat}: ${statVal} ≥ ${choice.threshold})` : `❌ Imprevisto (${choice.stat}: ${statVal} < ${choice.threshold})`, cssClass: passed ? "notif-success" : "notif-fail" });
        currentGameState.currentNodeId = passed ? choice.target : (choice.failTarget || choice.target);
    } else {
        currentGameState.currentNodeId = choice.target;
    }

    if (currentGameState.currentNodeId === bookMeta.startingNodeId) {
        bookMeta.stats.forEach(s => currentGameState.runtimeStats[s.id] = s.value);
        currentGameState.skillPoints = 0;
    }

    if (choice.statMod && choice.modValue) {
        let statName = bookMeta.stats.find(s => s.id === choice.statMod)?.name || choice.statMod;
        currentGameState.runtimeStats[choice.statMod] = (currentGameState.runtimeStats[choice.statMod] || 0) + choice.modValue;
        currentGameState.notifications.push({ text: choice.modValue >= 0 ? `📈 ${statName} +${choice.modValue}` : `📉 ${statName} ${choice.modValue}`, cssClass: choice.modValue >= 0 ? "notif-success" : "notif-fail" });
    }

    if (choice.spReward) {
        currentGameState.skillPoints += choice.spReward;
        currentGameState.notifications.push({ text: `⭐ +${choice.spReward} Punto Abilità!`, cssClass: "notif-success" });
    }

    playerProgress[activeBookId] = JSON.parse(JSON.stringify(currentGameState));
    saveProgress(); 
    renderGameNode();
    document.querySelector('#gameScrollArea').scrollTo(0, 0);
}

function openStatsModal() { currentGameState.pendingSpSpend = {}; updateStatsModalUI(); document.getElementById('statsModal').style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }

function updateStatsModalUI() {
    const bookMeta = bookCatalog[activeBookId];
    document.getElementById('statsModalTitle').innerText = `Scheda: ${bookMeta.protagonist}`;
    document.getElementById('availableSkillPoints').innerText = currentGameState.skillPoints;

    let html = "";
    let totalPending = Object.values(currentGameState.pendingSpSpend).reduce((a, b) => a + b, 0);

    bookMeta.stats.forEach(st => {
        let displayVal = (currentGameState.runtimeStats[st.id] ?? st.value) + (currentGameState.pendingSpSpend[st.id] || 0);
        html += `<div class="stat-row"><div><span style="font-weight:500;">${st.name}</span></div><div style="display:flex; align-items:center; gap:10px;"><span style="color:var(--accent-gold); font-weight:bold; font-size:16px;">${displayVal}</span><button class="btn" style="padding:2px 8px;" onclick="adjustStat('${st.id}', 1)" ${currentGameState.skillPoints <= 0 ? 'disabled' : ''}>+</button>${(currentGameState.pendingSpSpend[st.id] || 0) > 0 ? `<button class="btn btn-danger" style="padding:2px 6px;" onclick="adjustStat('${st.id}', -1)">-</button>` : ''}</div></div>`;
    });

    document.getElementById('statsListContainer').innerHTML = html;
    document.getElementById('statConfirmContainer').style.display = totalPending > 0 ? 'block' : 'none';
}

function adjustStat(id, val) {
    if (val > 0 && currentGameState.skillPoints > 0) { currentGameState.skillPoints--; currentGameState.pendingSpSpend[id] = (currentGameState.pendingSpSpend[id] || 0) + 1; }
    else if (val < 0 && currentGameState.pendingSpSpend[id] > 0) { currentGameState.pendingSpSpend[id]--; currentGameState.skillPoints++; }
    updateStatsModalUI();
}

function confirmSkillPoints() {
    for (let [id, val] of Object.entries(currentGameState.pendingSpSpend)) currentGameState.runtimeStats[id] = (currentGameState.runtimeStats[id] ?? 0) + val;
    currentGameState.pendingSpSpend = {}; playerProgress[activeBookId] = JSON.parse(JSON.stringify(currentGameState));
    saveProgress(); updateStatsModalUI(); alert("Punti assegnati!");
}

function cancelSkillPoints() { currentGameState.skillPoints += Object.values(currentGameState.pendingSpSpend).reduce((a,b)=>a+b,0); currentGameState.pendingSpSpend = {}; updateStatsModalUI(); }

function openPasswordModal() { if (!isAdminMode) { document.getElementById('adminPwdInput').value = ""; document.getElementById('passwordModal').style.display = 'flex'; } else { isAdminMode = false; renderHome(); } }
function verifyAdminPassword() { if (document.getElementById('adminPwdInput').value === "Magium") { isAdminMode = true; closeModal('passwordModal'); renderHome(); } else alert("Password errata!"); }

// L'editor visivo di creazione/modifica è disabilitato
function openAdminEditor() { alert("Nella versione Multi-File, aggiungi i nodi modificando direttamente i file .js della storia."); }

renderHome();