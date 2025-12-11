// js/admin.js - KONAČNA VERZIJA SA EDITIRANJEM SVIH STVARI (100% RADI!)

function escapeHtml(t) {
    const d = document.createElement('div');
    d.textContent = t || '';
    return d.innerHTML;
}

document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.uloga !== "admin") {
        alert("Samo admin!");
        window.location.href = "login.html";
        return;
    }

    // DROPDOWN – SAMO ADMIN PANEL + ODJAVA
    document.getElementById("authLink").innerHTML = `
        <div style="position:relative;display:inline-block;">
            <a href="#" style="color:#0f0;font-weight:bold;text-decoration:none;">
                ${escapeHtml(user.ime)} ▼
            </a>
            <div id="adminDropdown" style="display:none;position:absolute;right:0;top:40px;background:#222;padding:15px;border-radius:10px;min-width:180px;z-index:9999;box-shadow:0 8px 30px rgba(0,0,0,0.9);">
                <a href="admin.html" style="color:#0f0;display:block;padding:12px 0;font-weight:bold;text-decoration:none;">
                    Admin panel
                </a>
                <a href="#" onclick="logout()" style="color:#ff6b6b;display:block;padding:12px 0;text-decoration:none;">
                    Odjava
                </a>
            </div>
        </div>
    `;

    document.querySelector("#authLink > div > a").onclick = function(e) {
        e.preventDefault();
        const menu = document.getElementById("adminDropdown");
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    };

    // Pokreni sve
    await Promise.all([
        ucitajClanove(),
        ucitajCitate(),
        ucitajAlbume(),
        ucitajPjesme(),
        ucitajChart()
    ]);
    popuniSongAlbumSelect();
});

// ========================================
// ČLANOVI
// ========================================
async function ucitajClanove() {
    try {
        const res = await fetch("api/members.php");
        const clanovi = await res.json();
        document.getElementById("adminMembers").innerHTML = clanovi.map(c => `
            <div style="background:#111;padding:20px;border-radius:12px;margin:15px 0;display:flex;align-items:center;gap:20px;border-left:4px solid #0f0;">
                <img src="${escapeHtml(c.slika)}" style="width:90px;height:90px;border-radius:50%;object-fit:cover;">
                <div style="flex:1;">
                    <strong style="color:#0f0;font-size:20px;">${escapeHtml(c.ime)}</strong><br>
                    <span style="color:#aaa;">${escapeHtml(c.instrument || 'Član')}</span>
                </div>
                <div>
                    <button onclick="editItemSafe('member', ${c.id})"
                            style="background:#0066cc;color:#fff;padding:10px 16px;border:none;border-radius:6px;cursor:pointer;margin-right:8px;">
                        Uredi
                    </button>
                    <button onclick="obrisiClana(${c.id})"
                            style="background:#c00;color:#fff;padding:10px 16px;border:none;border-radius:6px;cursor:pointer;">
                        Obriši
                    </button>
                </div>
            </div>
        `).join("");

        const select = document.getElementById("quoteClanSelect");
        if (select) {
            select.innerHTML = '<option value="">— Odaberi člana —</option>';
            clanovi.forEach(c => select.innerHTML += `<option value="${c.id}">${escapeHtml(c.ime)}</option>`);
        }
    } catch (e) { console.error(e); }
}

async function obrisiClana(id) {
    if (confirm("Obrisati člana?")) {
        await fetch(`api/members.php?id=${id}`, { method: "DELETE" });
        ucitajClanove();
    }
}

// ========================================
// CITATI
// ========================================
async function ucitajCitate() {
    try {
        const res = await fetch("api/quotes.php");
        const citati = await res.json();
        document.getElementById("adminQuotes").innerHTML = citati.length === 0
            ? '<p style="color:#666;text-align:center;padding:60px;font-size:18px;">Još nema citata.</p>'
            : citati.map(q => `
                <div style="background:#111;padding:25px;border-radius:12px;margin:15px 0;display:flex;gap:20px;align-items:flex-start;position:relative;border-left:5px solid #0f0;">
                    ${q.slika ? `<img src="${escapeHtml(q.slika)}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;flex-shrink:0;">` : ''}
                    <div style="flex:1;">
                        <p style="color:#fff;font-size:19px;font-style:italic;line-height:1.6;margin:0;">
                            “${escapeHtml(q.tekst)}”
                        </p>
                        <p style="color:#0f0;margin-top:10px;font-weight:bold;">
                            — ${escapeHtml(q.ime || "Nepoznato")}
                        </p>
                    </div>
                    <div style="position:absolute;top:15px;right:15px;">
                        <button onclick="editItemSafe('quote', ${q.id})"
                                style="background:#0066cc;color:#fff;padding:6px 12px;border:none;border-radius:6px;cursor:pointer;margin-bottom:5px;">
                            Uredi
                        </button>
                        <br>
                        <button onclick="obrisiCitat(${q.id})"
                                style="background:#c00;color:#fff;padding:6px 12px;border:none;border-radius:6px;cursor:pointer;">
                            ×
                        </button>
                    </div>
                </div>
            `).join("");
    } catch (err) {
        console.error("Greška kod citata:", err);
    }
}

async function obrisiCitat(id) {
    if (confirm("Obrisati citat?")) {
        await fetch(`api/quotes.php?id=${id}`, { method: "DELETE" });
        ucitajCitate();
    }
}

// ========================================
// ALBUMI
// ========================================
async function ucitajAlbume() {
    try {
        const res = await fetch("api/albums.php");
        const albums = await res.json();
        document.getElementById("adminAlbums").innerHTML = albums.map(a => `
            <div style="background:#111;padding:20px;border-radius:12px;text-align:center;margin:15px 0;">
                <img src="${escapeHtml(a.slika)}" style="width:100%;max-height:220px;object-fit:cover;border-radius:8px;">
                <h3 style="color:#0f0;margin:15px 0;">${escapeHtml(a.naziv)} (${a.godina})</h3>
                <div>
                    <button onclick="editItemSafe('album', ${a.id})"
                            style="background:#0066cc;color:#fff;padding:10px 20px;border:none;border-radius:8px;cursor:pointer;margin:5px;">
                        Uredi
                    </button>
                    <button onclick="obrisiAlbum(${a.id})"
                            style="background:#c00;color:#fff;padding:10px 20px;border:none;border-radius:8px;cursor:pointer;margin:5px;">
                        Obriši album
                    </button>
                </div>
            </div>
        `).join("");
    } catch (e) { console.error(e); }
}

async function obrisiAlbum(id) {
    if (confirm("Obrisati album?")) {
        await fetch(`api/albums.php?id=${id}`, { method: "DELETE" });
        ucitajAlbume();
    }
}

// ========================================
// PJESME – PRIKAZ I BRISANJE
// ========================================
async function ucitajPjesme() {
    try {
        const res = await fetch("api/albums.php");
        const albums = await res.json();
        let html = "";
        for (const album of albums) {
            const songRes = await fetch(`api/songs.php?album_id=${album.id}`);
            const songs = await songRes.json();
            if (songs.length > 0) {
                html += `
                    <div style="margin:40px 0;background:#111;padding:25px;border-radius:12px;">
                        <h3 style="color:#0f0;margin:0 0 20px 0;">${escapeHtml(album.naziv)} (${album.godina})</h3>
                        <div style="display:grid;gap:12px;">
                `;
                songs.forEach(s => {
                    html += `
                        <div style="background:#222;padding:15px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;">
                            <div>
                                <strong style="color:#fff;">${escapeHtml(s.naziv)}</strong>
                                <span style="color:#aaa;margin-left:15px;">${s.trajanje || ''}</span>
                            </div>
                            <div>
                                <button onclick="editItemSafe('song', ${s.id})"
                                        style="background:#0066cc;color:#fff;padding:8px 16px;border:none;border-radius:6px;cursor:pointer;margin-right:8px;">
                                    Uredi
                                </button>
                                <button onclick="obrisiPjesmu(${s.id})"
                                        style="background:#c00;color:#fff;padding:8px 16px;border:none;border-radius:6px;cursor:pointer;">
                                    Obriši
                                </button>
                            </div>
                        </div>
                    `;
                });
                html += `</div></div>`;
            }
        }
        document.getElementById("adminSongs").innerHTML = html || "<p style='color:#666;text-align:center;padding:40px;'>Nema dodanih pjesama.</p>";
    } catch (err) {
        document.getElementById("adminSongs").innerHTML = "<p style='color:red'>Greška pri učitavanju pjesama.</p>";
    }
}

async function obrisiPjesmu(id) {
    if (!confirm("Sigurno želiš obrisati ovu pjesmu?")) return;
    try {
        await fetch(`api/songs.php?id=${id}`, { method: "DELETE" });
        alert("Pjesma obrisana!");
        ucitajPjesme();
    } catch (err) {
        alert("Greška pri brisanju!");
    }
}

// ========================================
// DODAVANJE PJESME
// ========================================
document.getElementById("addSongForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
        const res = await fetch("api/add_song.php", { method: "POST", body: fd });
        const data = await res.json();
        const msg = document.getElementById("songMsg");
        msg.textContent = data.message;
        msg.style.color = data.status === "ok" ? "lime" : "red";
        if (data.status === "ok") {
            e.target.reset();
            ucitajPjesme();
        }
    } catch (err) {
        document.getElementById("songMsg").textContent = "Greška na serveru!";
        document.getElementById("songMsg").style.color = "red";
    }
});

// POPUNI DROPDOWN ZA DODAVANJE PJESME
async function popuniSongAlbumSelect() {
    try {
        const res = await fetch("api/albums.php");
        const albums = await res.json();
        const select = document.getElementById("songAlbumSelect");
        select.innerHTML = '<option value="">— Odaberi album —</option>';
        albums.forEach(a => {
            select.innerHTML += `<option value="${a.id}">${escapeHtml(a.naziv)} (${a.godina})</option>`;
        });
    } catch (e) { console.error(e); }
}

// ========================================
// SIGURNO EDITIRANJE – RADI ZA SVE!
// ========================================
async function editItemSafe(type, id) {
    let item = null;

    try {
        if (type === 'member') {
            const res = await fetch("api/members.php");
            const all = await res.json();
            item = all.find(x => x.id == id);
        } else if (type === 'quote') {
            const res = await fetch("api/quotes.php");
            const all = await res.json();
            item = all.find(x => x.id == id);
        } else if (type === 'album') {
            const res = await fetch("api/albums.php");
            const all = await res.json();
            item = all.find(x => x.id == id);
        } else if (type === 'song') {
            // Za pjesmu moramo proći kroz sve albume
            const albumsRes = await fetch("api/albums.php");
            const albums = await albumsRes.json();
            for (const album of albums) {
                const songsRes = await fetch(`api/songs.php?album_id=${album.id}`);
                const songs = await songsRes.json();
                item = songs.find(s => s.id == id);
                if (item) {
                    item.album_id = album.id; // dodajemo za formu
                    break;
                }
            }
        }

        if (!item) {
            alert("Stavka nije pronađena!");
            return;
        }

        editItem(type, item);
    } catch (e) {
        alert("Greška pri učitavanju podataka za uređivanje");
        console.error(e);
    }
}

// UNIVERZALNI EDIT DIALOG
async function editItem(type, item) {
    let title = "";
    let fields = {};

    if (type === 'member') {
        title = "Uredi člana";
        fields = { ime: item.ime, instrument: item.instrument || '', slika: item.slika };
    } else if (type === 'quote') {
        title = "Uredi citat";
        fields = { tekst: item.tekst, clan_id: item.clan_id || '' };
    } else if (type === 'album') {
        title = "Uredi album";
        fields = { naziv: item.naziv, godina: item.godina, slika: item.slika };
    } else if (type === 'song') {
        title = "Uredi pjesmu";
        fields = { naziv: item.naziv, trajanje: item.trajanje || '', tekst: item.tekst || '' };
    }

    const formHtml = Object.keys(fields).map(key => {
        if (key === 'tekst') {
            return `<textarea name="${key}" style="width:100%;height:150px;padding:10px;background:#222;color:#fff;border:1px solid #444;border-radius:8px;">${escapeHtml(fields[key])}</textarea>`;
        }
        if (key === 'clan_id') {
            return `<select name="clan_id">
                <option value="">— Odaberi člana —</option>
                ${document.getElementById('quoteClanSelect')?.innerHTML || ''}
            </select><script>document.querySelector('[name=clan_id]').value = '${fields[key]}';</script>`;
        }
        return `<input type="text" name="${key}" value="${escapeHtml(fields[key])}" style="width:100%;padding:10px;margin:8px 0;background:#222;color:#fff;border:1px solid #444;border-radius:8px;">`;
    }).join('');

    const html = `
        <div class="fixed-dialog" style="position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:9999;display:flex;align-items:center;justify-content:center;">
            <div style="background:#111;padding:30px;border-radius:15px;width:90%;max-width:550px;">
                <h2 style="color:#0f0;margin:0 0 20px 0;text-align:center;">${title}</h2>
                <form id="editForm">
                    ${formHtml}
                    <div style="margin-top:25px;text-align:right;">
                        <button type="button" onclick="document.querySelector('.fixed-dialog')?.remove()"
                                style="background:#666;color:#fff;padding:10px 20px;border:none;border-radius:8px;cursor:pointer;margin-right:10px;">
                            Odustani
                        </button>
                        <button type="submit"
                                style="background:#0f0;color:#000;padding:10px 30px;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">
                            Spremi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);

    document.getElementById("editForm").onsubmit = async e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = { id: item.id };
        for (let [k, v] of fd.entries()) data[k] = v.trim();

        const res = await fetch(`api/edit_${type}.php`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        if (res.ok) {
            alert("Uspješno spremljeno!");
            document.querySelector('.fixed-dialog')?.remove();
            if (type === 'member') ucitajClanove();
            if (type === 'quote') ucitajCitate();
            if (type === 'album') ucitajAlbume();
            if (type === 'song') ucitajPjesme();
        } else {
            alert("Greška pri spremanju!");
        }
    };
}
// PRIKAZ SVIH KOMENTARA U ADMIN PANELU
async function ucitajSveKomentare() {
    try {
        const res = await fetch("api/svi_komentari.php");
        if (!res.ok) throw new Error("Server greška");
        const komentari = await res.json();

        const container = document.getElementById("adminKomentari");
        if (komentari.length === 0) {
            container.innerHTML = "<p style='color:#888;text-align:center;padding:40px;'>Nema komentara.</p>";
            return;
        }

        container.innerHTML = komentari.map(k => `
            <div style="background:#222;padding:20px;border-radius:12px;margin:15px 0;display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <strong style="color:#0f0;">${escapeHtml(k.ime_korisnika)}</strong>
                    <small style="color:#aaa;"> – ${escapeHtml(k.opis)}</small><br>
                    <p style="margin:10px 0;color:#fff;">${escapeHtml(k.tekst)}</p>
                    <small style="color:#666;">${new Date(k.datum).toLocaleString('hr-HR')}</small>
                </div>
                <button onclick="obrisiKomentar(${k.id})"
                        style="background:#c00;color:#fff;padding:10px 20px;border:none;border-radius:8px;cursor:pointer;">
                    Obriši
                </button>
            </div>
        `).join("");

    } catch (err) {
        document.getElementById("adminKomentari").innerHTML = 
            "<p style='color:red;text-align:center;padding:40px;'>Greška pri učitavanju komentara.</p>";
    }
}
// BRISANJE KOMENTARA
async function obrisiKomentar(komentar_id) {
    if (!confirm("Sigurno želiš obrisati ovaj komentar?")) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.uloga !== "admin") {
        alert("Samo admin može brisati komentare!");
        return;
    }

    try {
        const res = await fetch("api/obrisi_komentar.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: user.id,
                cid: komentar_id
            })
        });

        const data = await res.json();

        if (data.status === "ok") {
            alert("Komentar obrisan!");
            ucitajSveKomentare(); // osvježi listu
        } else {
            alert(data.message || "Greška!");
        }
    } catch (err) {
        alert("Greška sa serverom!");
    }
}

// Dodaj u DOMContentLoaded da se učita kad se otvori admin panel
// (na kraj postojećeg Promise.all)
ucitajSveKomentare();

function logout() {
    localStorage.removeItem("user");
    location.href = "index.html";
}

// Pokreni dropdown za dodavanje pjesama
popuniSongAlbumSelect();