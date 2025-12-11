// js/profil.js – KAO PRIJE + MOJI KOMENTARI (bez dugmeta za uklanjanje!)

async function loadProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return location.href = 'login.html';

    // Osnovne informacije
    document.getElementById('profileInfo').innerHTML = `
        <p><strong>Ime:</strong> ${user.ime}</p>
        <p><strong>Uloga:</strong> ${user.uloga === 'admin' ? 'Administrator' : 'Fan'}</p>
    `;

    try {
        // ---------- LAJKOVI ----------
        const favRes = await fetch(`api/favorites.php?user_id=${user.id}`);
        const favData = await favRes.json();

        // Pjesme
        const songsDiv = document.getElementById('likedSongs');
        songsDiv.innerHTML = favData.songs.length === 0
            ? '<p class="no-fav">Još nisi lajkao nijednu pjesmu.</p>'
            : favData.songs.map(s => `
                <div class="fav-item">
                    ${s.album_slika ? `<img src="${s.album_slika}" alt="cover">` : ''}
                    <div>
                        <strong>${s.naziv}</strong><br>
                        <small>${s.album_naziv}</small>
                    </div>
                </div>
            `).join('');

        // Albumi
        const albumsDiv = document.getElementById('likedAlbums');
        albumsDiv.innerHTML = favData.albums.length === 0
            ? '<p class="no-fav">Još nisi lajkao nijedan album.</p>'
            : favData.albums.map(a => `
                <div class="fav-item">
                    <img src="${a.slika}" alt="${a.naziv}">
                    <div>
                        <strong>${a.naziv}</strong> (${a.godina})
                    </div>
                </div>
            `).join('');

        // Citati
        const quotesDiv = document.getElementById('likedQuotes');
        quotesDiv.innerHTML = favData.quotes.length === 0
            ? '<p class="no-fav">Još nisi lajkao nijedan citat.</p>'
            : favData.quotes.map(q => `
                <div class="fav-item">
                    ${q.slika ? `<img src="${q.slika}" alt="${q.ime}">` : ''}
                    <div>
                        <em>„${escapeHtml(q.tekst)}“</em><br>
                        <strong style="color:#0f0;">— ${escapeHtml(q.ime)}</strong>
                    </div>
                </div>
            `).join('');

        // ---------- MOJI KOMENTARI ----------
        const commRes = await fetch(`api/moji_komentari.php?user_id=${user.id}`);
        const komentari = await commRes.json();

        const commDiv = document.getElementById('mojiKomentari');
        if (komentari.length === 0) {
            commDiv.innerHTML = '<p class="no-fav">Još nisi napisao nijedan komentar.</p>';
        } else {
            commDiv.innerHTML = komentari.map(k => {
                let gdje = "";
                if (k.tip === 'member') gdje = `na članu: <strong>${escapeHtml(k.clan_ime || 'Nepoznato')}</strong>`;
                if (k.tip === 'quote')  gdje = `na citatu: <em>„${k.quote_tekst ? escapeHtml(k.quote_tekst.substring(0,60)) + '...' : '...'}</em>`;
                if (k.tip === 'album')  gdje = `na albumu: <strong>${escapeHtml(k.album_naziv || 'Nepoznato')}</strong>`;

                return `
                    <div class="fav-item">
                        <div>
                            <p style="margin:0;color:#fff;line-height:1.5;">${escapeHtml(k.tekst)}</p>
                            <small style="color:#0f0;">${gdje}</small><br>
                            <small style="color:#888;">${new Date(k.datum).toLocaleString('hr-HR')}</small>
                        </div>
                    </div>
                `;
            }).join('');
        }

    } catch (err) {
        console.error("Greška pri učitavanju profila:", err);
        document.querySelectorAll('#likedSongs, #likedAlbums, #likedQuotes, #mojiKomentari')
                .forEach(el => el.innerHTML = '<p style="color:red">Greška pri učitavanju.</p>');
    }
}

// escapeHtml – ako ga nemaš drugdje
function escapeHtml(t) {
    const div = document.createElement('div');
    div.textContent = t || '';
    return div.innerHTML;
}

loadProfile();