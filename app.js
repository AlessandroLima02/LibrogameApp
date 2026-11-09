const CURRENT_DB_VERSION = "2.00"; 

let savedVersion = localStorage.getItem('librogame_db_version');
let savedData = localStorage.getItem('librogame_db');
let db;

// defaultDb viene caricato automaticamente perché index.html carica storia.js prima di app.js
if (savedVersion !== CURRENT_DB_VERSION || !savedData) {
    db = defaultDb;
    localStorage.setItem('librogame_db_version', CURRENT_DB_VERSION);
    localStorage.setItem('librogame_db', JSON.stringify(db));
} else {
    db = JSON.parse(savedData);
}

let savedProgress = localStorage.getItem('librogame_progress');
let playerProgress = savedProgress ? JSON.parse(savedProgress) : {};

let savedTheme = localStorage.getItem('librogame_theme') || 'theme-dark-fantasy';
document.body.className = savedTheme;

function setTheme(themeName) {
    document.body.className = themeName;
    localStorage.setItem('librogame_theme', themeName);
}

function openThemeModal() {
    document.getElementById('themeModal').style.display = 'flex';
}

function saveDb() {
    localStorage.setItem('librogame_db', JSON.stringify(db));
}

function saveProgress() {
    localStorage.setItem('librogame_progress', JSON.stringify(playerProgress));
}

function confirmResetProgress() {
    if (confirm("⚠️ ATTENZIONE: Vuoi davvero resettare tutti i progressi e le statistiche di gioco? Questa operazione è irreversibile!")) {
        if (confirm("Confermi l'eliminazione definitiva di tutti i dati salvati nel browser?")) {
            localStorage.removeItem('librogame_progress');
            localStorage.removeItem('librogame_db');
            localStorage.removeItem('librogame_db_version');
            alert("Progressi resettati con successo!");
            location.reload();
        }
    }
}

let isAdminMode = false;
let activeBookId = null;
let editingOriginalNodeId = null;
let currentGameState = { 
    currentNodeId: null, 
    runtimeStats: {}, 
    skillPoints: 0, 
    pendingSpSpend: {}, 
    notifications: [] 
};

function toggleDrawer(open) {
    const drawer = document.getElementById('gameDrawer');
    const overlay = document.getElementById('drawerOverlay');
    if (open) {
        drawer.classList.add('open');
        overlay.style.display = 'block';
    } else {
        drawer.classList.remove('open');
        overlay.style.display = 'none';
    }
}

function exportSaveGameCSV() {
    if (activeBookId) {
        playerProgress[activeBookId] = JSON.parse(JSON.stringify(currentGameState));
        saveProgress();
    }
    saveDb();

    let csvLines = [];

    Object.keys(db.books).forEach(bookId => {
        let book = db.books[bookId];
        let prog = playerProgress[bookId];

        let nodeId = prog ? prog.currentNodeId : book.startingNodeId;
        
        let statValues = [];
        book.stats.forEach(s => {
            let val;
            if (prog && prog.runtimeStats && prog.runtimeStats[s.id] !== undefined) {
                val = prog.runtimeStats[s.id];
            } else {
                val = s.value;
            }
            statValues.push(val);
        });

        let spValue = (prog && prog.skillPoints !== undefined) ? prog.skillPoints : 0;
        let escapedTitle = `"${book.title.replace(/"/g, '""')}"`;
        let row = [book.id, escapedTitle, nodeId, ...statValues, spValue].join(",");
        csvLines.push(row);
    });

    let csvContent = csvLines.join("\n");
    let blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    let link = document.createElement("a");
    let url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "salvataggio_globale_librogame.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function importSaveGameCSVPrompt() {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv, .txt';
    input.onchange = e => {
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = event => {
            try {
                let content = event.target.result.trim();
                let lines = content.split('\n');
                
                let loadedProgress = {};
                let missingBooks = [];
                let missingProgressBooks = [];

                let booksById = db.books;
                let bookTitlesInDb = {};
                Object.keys(booksById).forEach(bId => {
                    bookTitlesInDb[booksById[bId].title.trim().toLowerCase()] = bId;
                });

                lines.forEach(line => {
                    if (!line.trim()) return;

                    let bId, bTitle, nId, stats, sp;
                    let match = line.match(/^([^,]+),"([^"]+)",(.+)$/);
                    if (match) {
                        bId = match[1].trim();
                        bTitle = match[2].trim();
                        let rest = match[3].split(',');
                        nId = rest[0].trim();
                        stats = rest.slice(1, 7).map(v => parseInt(v));
                        sp = parseInt(rest[7]);
                    } else {
                        let parts = line.split(',');
                        if (parts.length >= 9) {
                            bId = parts[0].trim();
                            bTitle = parts[1].trim();
                            nId = parts[2].trim();
                            stats = parts.slice(3, 9).map(v => parseInt(v));
                            sp = parseInt(parts[9]);
                        } else {
                            return;
                        }
                    }

                    let targetBookId = null;
                    if (booksById[bId]) {
                        targetBookId = bId;
                    } else {
                        let normTitle = bTitle.toLowerCase();
                        if (bookTitlesInDb[normTitle]) {
                            targetBookId = bookTitlesInDb[normTitle];
                        }
                    }

                    if (targetBookId && booksById[targetBookId]) {
                        let book = booksById[targetBookId];
                        let runtimeStats = {};
                        book.stats.forEach((s, idx) => {
                            let val = stats[idx];
                            runtimeStats[s.id] = !isNaN(val) ? val : s.value;
                        });

                        loadedProgress[targetBookId] = {
                            currentNodeId: book.nodes[nId] ? nId : book.startingNodeId,
                            runtimeStats: runtimeStats,
                            skillPoints: !isNaN(sp) ? sp : 0,
                            pendingSpSpend: {},
                            notifications: []
                        };
                    } else {
                        missingBooks.push(`${bTitle} - Mancante`);
                    }
                });

                Object.keys(booksById).forEach(bId => {
                    if (!loadedProgress[bId]) {
                        missingProgressBooks.push(booksById[bId].title);
                    }
                });

                playerProgress = loadedProgress;
                saveProgress();
                saveDb();

                renderHome();
                if (activeBookId && playerProgress[activeBookId]) {
                    currentGameState = JSON.parse(JSON.stringify(playerProgress[activeBookId]));
                    if (!currentGameState.notifications) currentGameState.notifications = [];
                    renderGameNode();
                }

                let alertMsg = "Partita caricata con successo!";
                if (missingBooks.length > 0) {
                    alertMsg += "\n\n⚠️ Libri mancanti nel sistema:\n- " + missingBooks.join("\n- ");
                }
                if (missingProgressBooks.length > 0) {
                    alertMsg += "\n\n⚠️ Progressi non trovati per:\n- " + missingProgressBooks.join("\n- ");
                }
                alert(alertMsg);

            } catch (err) {
                alert("Errore nel file di salvataggio CSV. Il file non è valido.");
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function renderHome() {
    const container = document.getElementById('bookListContainer');
    container.innerHTML = "";
    const bookIds = Object.keys(db.books);
    document.getElementById('bookCount').innerText = bookIds.length + (bookIds.length === 1 ? " titolo" : " titoli");

    if (bookIds.length === 0) {
        container.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin-top:40px;">Nessun libro disponibile.</p>`;
        return;
    }

    bookIds.forEach(id => {
        const book = db.books[id];
        const hasProgress = playerProgress[id] && playerProgress[id].currentNodeId;
        
        let progressText = "";
        if (hasProgress) {
            const currentNodeId = playerProgress[id].currentNodeId;
            const nodeKeys = Object.keys(book.nodes);
            const totalNodes = nodeKeys.length;
            const currentIndex = nodeKeys.indexOf(currentNodeId);
            
            if (currentIndex !== -1 && totalNodes > 0) {
                let percent = Math.round(((currentIndex + 1) / totalNodes) * 100);
                const nodeObj = book.nodes[currentNodeId];
                const chapterDisplay = nodeObj ? nodeObj.chapterTitle : currentNodeId;
                progressText = `<div class="book-progress">📍 ${chapterDisplay} (${percent}%)</div>`;
            }
        }

        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <div>
                <span class="book-id">ID: ${book.id}</span>
                <div class="book-title">${book.title}</div>
            </div>
            <div class="book-desc">${book.description}</div>
            ${progressText}
            <div class="row-end">
                ${isAdminMode ? `
                    <button class="btn btn-danger" onclick="deleteBook('${book.id}')">Elimina</button>
                    <button class="btn btn-gold" onclick="openAdminEditor('${book.id}')">Modifica Storia</button>
                ` : `
                    <button class="btn btn-primary" onclick="openOrStartBook('${book.id}')">${hasProgress ? 'Riprendi' : 'Gioca'}</button>
                `}
            </div>
        `;
        container.appendChild(card);
    });

    document.getElementById('addBookHeaderBtn') ? document.getElementById('addBookHeaderBtn').style.display = isAdminMode ? 'block' : 'none' : null;
    document.getElementById('modeIndicator').innerText = isAdminMode ? "Admin Mode" : "Player Mode";
}

function returnToHome() {
    if (activeBookId) {
        playerProgress[activeBookId] = JSON.parse(JSON.stringify(currentGameState));
        saveProgress();
    }
    saveDb();
    renderHome();
    switchScreen('homeScreen');
}

function openOrStartBook(bookId) {
    activeBookId = bookId;
    const book = db.books[bookId];

    if (playerProgress[bookId] && playerProgress[bookId].currentNodeId) {
        currentGameState = JSON.parse(JSON.stringify(playerProgress[bookId]));
        if (!currentGameState.notifications) currentGameState.notifications = [];
    } else {
        initFreshGame(book);
    }

    switchScreen('gameScreen');
    renderGameNode();
}

function initFreshGame(book) {
    currentGameState.currentNodeId = book.startingNodeId;
    currentGameState.runtimeStats = {};
    currentGameState.skillPoints = 0; 
    currentGameState.pendingSpSpend = {};
    currentGameState.notifications = [];
    book.stats.forEach(s => { currentGameState.runtimeStats[s.id] = s.value; });
}

function renderGameNode() {
    const book = db.books[activeBookId];
    const node = book.nodes[currentGameState.currentNodeId];

    if (!node) {
        document.getElementById('gameStoryText').innerText = "Errore: Nodo '" + currentGameState.currentNodeId + "' non trovato.";
        document.getElementById('gameChapterTitle').innerText = "Errore";
        document.getElementById('gameChoicesContainer').innerHTML = "";
        return;
    }

    document.getElementById('gameChapterTitle').innerText = node.chapterTitle;

    let htmlContent = "";
    if (currentGameState.notifications && currentGameState.notifications.length > 0) {
        currentGameState.notifications.forEach(notif => {
            htmlContent += `<span class="notif-text ${notif.cssClass}">${notif.text}</span>`;
        });
        currentGameState.notifications = []; 
    }

    htmlContent += node.text;

    document.getElementById('gameStoryText').innerHTML = htmlContent;

    const choicesBox = document.getElementById('gameChoicesContainer');
    choicesBox.innerHTML = "";

    node.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.style.textAlign = "left";
        btn.innerText = choice.text;
        btn.onclick = () => handleChoice(choice);
        choicesBox.appendChild(btn);
    });
}

function handleChoice(choice) {
    if (choice.target === "RELOAD") {
        location.reload();
        return;
    }

    const book = db.books[activeBookId];
    currentGameState.notifications = []; 

    if (choice.stat && choice.threshold) {
        let statVal = currentGameState.runtimeStats[choice.stat] || 0;
        const passed = statVal >= choice.threshold;
        let checkText = passed ? `✅ Test Superato (${choice.stat}: ${statVal} ≥ ${choice.threshold})` : `❌ Imprevisto! (${choice.stat}: ${statVal} < ${choice.threshold})`;
        currentGameState.notifications.push({
            text: checkText,
            cssClass: passed ? "notif-success" : "notif-fail"
        });
        currentGameState.currentNodeId = passed ? choice.target : (choice.failTarget || choice.target);
    } else {
        currentGameState.currentNodeId = choice.target;
    }

    if (currentGameState.currentNodeId === book.startingNodeId) {
        book.stats.forEach(s => { currentGameState.runtimeStats[s.id] = s.value; });
        currentGameState.skillPoints = 0;
    }

    if (choice.statMod && choice.modValue) {
        let statObj = book.stats.find(s => s.id === choice.statMod);
        let statName = statObj ? statObj.name : choice.statMod;
        let val = choice.modValue;

        if (currentGameState.runtimeStats[choice.statMod] !== undefined) {
            currentGameState.runtimeStats[choice.statMod] += val;
        } else {
            currentGameState.runtimeStats[choice.statMod] = val;
        }

        let sign = val > 0 ? `+${val}` : `${val}`;
        let statMsg = val >= 0 ? `📈 ${statName} aumentata (${sign})` : `📉 ${statName} ridotta (${sign})`;
        currentGameState.notifications.push({
            text: statMsg,
            cssClass: val >= 0 ? "notif-success" : "notif-fail"
        });
    }

    if (choice.spReward) {
        currentGameState.skillPoints += choice.spReward;
        currentGameState.notifications.push({
            text: `⭐ Hai ottenuto +${choice.spReward} Punto Abilità (SP)!`,
            cssClass: "notif-success"
        });
    }

    playerProgress[activeBookId] = JSON.parse(JSON.stringify(currentGameState));
    saveProgress();
    saveDb();

    renderGameNode();
    document.querySelector('#gameScrollArea').scrollTo(0, 0);
}

function openStatsModal() {
    currentGameState.pendingSpSpend = {};
    updateStatsModalUI();
    document.getElementById('statsModal').style.display = 'flex';
}

function updateStatsModalUI() {
    const book = db.books[activeBookId];
    document.getElementById('statsModalTitle').innerText = `Scheda: ${book.protagonist} (${book.title})`;
    document.getElementById('availableSkillPoints').innerText = currentGameState.skillPoints;

    let html = "";
    let totalPending = Object.values(currentGameState.pendingSpSpend).reduce((a, b) => a + b, 0);

    book.stats.forEach(st => {
        let baseVal = currentGameState.runtimeStats[st.id] !== undefined ? currentGameState.runtimeStats[st.id] : st.value;
        let pending = currentGameState.pendingSpSpend[st.id] || 0;
        let displayVal = baseVal + pending;

        html += `
            <div class="stat-row">
                <div>
                    <span style="font-weight:500;">${st.name}</span>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="color:var(--accent-gold); font-weight:bold; font-size:16px;">${displayVal}</span>
                    <button class="btn" style="padding:2px 8px; font-size:14px;" onclick="adjustStat('${st.id}', 1)" ${currentGameState.skillPoints <= 0 ? 'disabled style="opacity:0.5;"' : ''}>+</button>
                    ${pending > 0 ? `<button class="btn btn-danger" style="padding:2px 6px; font-size:12px;" onclick="adjustStat('${st.id}', -1)">-</button>` : ''}
                </div>
            </div>
        `;
    });

    document.getElementById('statsListContainer').innerHTML = html;
    document.getElementById('statConfirmContainer').style.display = totalPending > 0 ? 'block' : 'none';
}

function adjustStat(statId, amount) {
    if (amount > 0 && currentGameState.skillPoints > 0) {
        currentGameState.skillPoints -= 1;
        currentGameState.pendingSpSpend[statId] = (currentGameState.pendingSpSpend[statId] || 0) + 1;
    } else if (amount < 0) {
        let pending = currentGameState.pendingSpSpend[statId] || 0;
        if (pending > 0) {
            currentGameState.pendingSpSpend[statId] = pending - 1;
            currentGameState.skillPoints += 1;
        }
    }
    updateStatsModalUI();
}

function confirmSkillPoints() {
    for (let [statId, val] of Object.entries(currentGameState.pendingSpSpend)) {
        if (currentGameState.runtimeStats[statId] !== undefined) {
            currentGameState.runtimeStats[statId] += val;
        }
    }
    currentGameState.pendingSpSpend = {};
    playerProgress[activeBookId] = JSON.parse(JSON.stringify(currentGameState));
    saveProgress();
    saveDb();
    updateStatsModalUI();
    alert("Punti Abilità assegnati con successo!");
}

function cancelSkillPoints() {
    let totalRefund = Object.values(currentGameState.pendingSpSpend).reduce((a, b) => a + b, 0);
    currentGameState.skillPoints += totalRefund;
    currentGameState.pendingSpSpend = {};
    updateStatsModalUI();
}

function openPasswordModal() {
    if (!isAdminMode) {
        document.getElementById('adminPwdInput').value = "";
        document.getElementById('passwordModal').style.display = 'flex';
    } else {
        isAdminMode = false;
        renderHome();
    }
}

function verifyAdminPassword() {
    if (document.getElementById('adminPwdInput').value === "Magium") {
        isAdminMode = true;
        closeModal('passwordModal');
        renderHome();
        alert("Accesso Admin Autorizzato!");
    } else {
        alert("Password errata!");
    }
}

function openCreateBookModal() {
    document.getElementById('newBookTitle').value = "";
    document.getElementById('newBookDesc').value = "";
    document.getElementById('newBookProtagonist').value = "Sabrina";
    document.getElementById('createBookModal').style.display = 'flex';
}

function saveNewBook() {
    const title = document.getElementById('newBookTitle').value.trim();
    if (!title) return alert("Inserisci un titolo.");

    db.lastIdNumber++;
    const newId = String(db.lastIdNumber).padStart(8, '0');
    const startNodeId = "1.1.a";

    db.books[newId] = {
        id: newId,
        title: title,
        description: document.getElementById('newBookDesc').value.trim() || "Nessuna descrizione.",
        protagonist: document.getElementById('newBookProtagonist').value.trim() || "Sabrina",
        stats: [
            { id: "forza", name: "Forza", value: 1 },
            { id: "tempra", name: "Tempra", value: 1 },
            { id: "destrezza", name: "Destrezza", value: 1 },
            { id: "riflessi", name: "Riflessi", value: 1 },
            { id: "concentrazione", name: "Concentrazione", value: 1 },
            { id: "osservazione", name: "Osservazione", value: 1 }
        ],
        startingNodeId: startNodeId,
        nodes: {
            [startNodeId]: {
                id: startNodeId,
                chapterTitle: "Capitolo 1 - Pagina 1.a",
                text: "Inizio della storia...",
                choices: []
            }
        }
    };

    saveDb();
    closeModal('createBookModal');
    renderHome();
}

function deleteBook(id) {
    if (confirm("Vuoi eliminare questo libro?")) {
        delete db.books[id];
        delete playerProgress[id];
        saveProgress();
        saveDb();
        renderHome();
    }
}

function openAdminEditor(bookId) {
    activeBookId = bookId;
    const book = db.books[bookId];
    document.getElementById('adminHeaderTitle').innerText = `Editor: ${book.title}`;
    renderAdminNodeList();
    switchScreen('adminScreen');
}

function renderAdminNodeList() {
    const book = db.books[activeBookId];
    const container = document.getElementById('adminNodeListContainer');
    container.innerHTML = "";

    const sortedNodeIds = Object.keys(book.nodes).sort();

    sortedNodeIds.forEach(nodeId => {
        const node = book.nodes[nodeId];
        const card = document.createElement('div');
        card.className = 'node-card';
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:16px; font-weight:bold; color:var(--accent-gold);">ID: ${nodeId}</span>
                <span style="font-size:13px; color:var(--text-main);">${node.chapterTitle}</span>
            </div>
            <div style="font-size:14px; color:var(--text-muted); margin: 8px 0; line-height:1.4;">${node.text}</div>
            <div style="font-size:12px; color:var(--accent-blue); margin-bottom:8px;">Opzioni di scelta: ${node.choices.length}</div>
            <div class="row-end">
                <button class="btn btn-danger" onclick="deleteNode('${nodeId}')">Elimina</button>
                <button class="btn btn-gold" onclick="openNodeEditor('${nodeId}')">Modifica Nodo</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function openNodeEditor(nodeId) {
    editingOriginalNodeId = nodeId;
    const book = db.books[activeBookId];

    if (nodeId) {
        const node = book.nodes[nodeId];
        document.getElementById('nodeEditorModalTitle').innerText = "Modifica Nodo: " + nodeId;
        document.getElementById('editNodeId').value = node.id;
        document.getElementById('editNodeTitle').value = node.chapterTitle;
        document.getElementById('editNodeText').value = node.text;

        const choicesContainer = document.getElementById('choicesListContainer');
        choicesContainer.innerHTML = "";
        node.choices.forEach(c => addChoiceRow(c));
    } else {
        document.getElementById('nodeEditorModalTitle').innerText = "Nuovo Nodo (es. 1.1.a)";
        document.getElementById('editNodeId').value = "1.1.b";
        document.getElementById('editNodeTitle').value = "Capitolo - Pagina";
        document.getElementById('editNodeText').value = "";
        document.getElementById('choicesListContainer').innerHTML = "";
    }

    document.getElementById('nodeEditorModal').style.display = 'flex';
}

function addChoiceRow(data = null) {
    const container = document.getElementById('choicesListContainer');
    const row = document.createElement('div');
    row.className = 'choice-editor-box';
    row.innerHTML = `
        <label>Testo Pulsante Scelta</label>
        <input type="text" class="ce-text" placeholder="Es. Attacca con decisione" value="${data ? data.text : ''}">
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
            <div>
                <label>Destinazione (Successo)</label>
                <input type="text" class="ce-target" placeholder="es. 1.2.a" value="${data ? data.target : ''}">
            </div>
            <div>
                <label>Check Statistica (opz.)</label>
                <input type="text" class="ce-stat" placeholder="es. forza" value="${data ? (data.stat || '') : ''}">
            </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
            <div>
                <label>Soglia Minima</label>
                <input type="number" class="ce-thresh" placeholder="es. 3" value="${data ? (data.threshold || '') : ''}">
            </div>
            <div>
                <label>Destinazione (Fallimento)</label>
                <input type="text" class="ce-fail" placeholder="es. 3.b" value="${data ? (data.failTarget || '') : ''}">
            </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; margin-top:4px;">
            <div>
                <label>Modifica Stat (opz.)</label>
                <select class="ce-statmod">
                    <option value="">Nessuna</option>
                    <option value="forza" ${data && data.statMod === 'forza' ? 'selected' : ''}>Forza</option>
                    <option value="tempra" ${data && data.statMod === 'tempra' ? 'selected' : ''}>Tempra</option>
                    <option value="destrezza" ${data && data.statMod === 'destrezza' ? 'selected' : ''}>Destrezza</option>
                    <option value="riflessi" ${data && data.statMod === 'riflessi' ? 'selected' : ''}>Riflessi</option>
                    <option value="concentrazione" ${data && data.statMod === 'concentrazione' ? 'selected' : ''}>Concentrazione</option>
                    <option value="osservazione" ${data && data.statMod === 'osservazione' ? 'selected' : ''}>Osservazione</option>
                </select>
            </div>
            <div>
                <label>Valore Modifica (+/-)</label>
                <input type="number" class="ce-modval" placeholder="es. 2 o -1" value="${data ? (data.modValue || '') : ''}">
            </div>
        </div>

        <div style="margin-top:4px;">
            <label>Premio Punti Abilità (SP) alla scelta</label>
            <input type="number" class="ce-sp" placeholder="es. 1" value="${data ? (data.spReward || '') : ''}">
        </div>

        <button class="btn btn-danger" style="padding:4px 8px; font-size:11px; margin-top:8px; width:100%;" onclick="this.parentElement.remove()">Rimuovi Scelta</button>
    `;
    container.appendChild(row);
}

function saveNodeFromEditor() {
    const book = db.books[activeBookId];
    const newId = document.getElementById('editNodeId').value.trim();
    const title = document.getElementById('editNodeTitle').value.trim();
    const text = document.getElementById('editNodeText').value.trim();

    if (!newId || !title) return alert("Inserisci ID (es. 1.1.a) e Titolo.");

    let choices = [];
    document.querySelectorAll('#choicesListContainer > div').forEach(row => {
        const text = row.querySelector('.ce-text').value.trim();
        const target = row.querySelector('.ce-target').value.trim();
        const stat = row.querySelector('.ce-stat').value.trim();
        const threshold = parseInt(row.querySelector('.ce-thresh').value);
        const failTarget = row.querySelector('.ce-fail').value.trim();
        const statMod = row.querySelector('.ce-statmod').value;
        const modValue = parseInt(row.querySelector('.ce-modval').value);
        const spReward = parseInt(row.querySelector('.ce-sp').value);

        if (text && target) {
            let choice = { text, target };
            if (stat && !isNaN(threshold)) {
                choice.stat = stat;
                choice.threshold = threshold;
                if (failTarget) choice.failTarget = failTarget;
            }
            if (statMod && !isNaN(modValue)) {
                choice.statMod = statMod;
                choice.modValue = modValue;
            }
            if (!isNaN(spReward) && spReward > 0) {
                choice.spReward = spReward;
            }
            choices.push(choice);
        }
    });

    if (editingOriginalNodeId && editingOriginalNodeId !== newId) {
        delete book.nodes[editingOriginalNodeId];
    }

    book.nodes[newId] = {
        id: newId,
        chapterTitle: title,
        text: text,
        choices: choices
    };

    saveDb();
    closeModal('nodeEditorModal');
    renderAdminNodeList();
}

function deleteNode(nodeId) {
    const book = db.books[activeBookId];
    if (Object.keys(book.nodes).length <= 1) {
        return alert("Non puoi eliminare l'unico nodo rimasto.");
    }
    if (confirm(`Eliminare il nodo ${nodeId}?`)) {
        delete book.nodes[nodeId];
        saveDb();
        renderAdminNodeList();
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

renderHome();