async function loadProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return location.href = 'login.html';

    document.getElementById('profileInfo').innerHTML = `
        <p><strong>Ime:</strong> ${user.ime}</p>
        <p><strong>Email:</strong> ${user.email || 'Nije upisan'}</p>
        <p><strong>Uloga:</strong> ${user.uloga === 'admin' ? 'Administrator' : 'Fan'}</p>
    `;

    const res = await fetch(`api/favorites.php?user_id=${user.id}`);
    const data = await res.json();

    const render = (arr, container, type) => {
        const el = document.getElementById(container);
        if (!arr.length) {
            el.innerHTML = '<div class="no-fav">Još nisi lajkao ništa ovdje.</div>';
            return;
        }
        el.innerHTML = arr.map(item => `
            <div class="fav-item">
                ${item.album_slika || item.slika ? `<img src="${item.album_slika || item.slika}" alt="">` : ''}
                <div>
                    ${type==='song' ? `<strong>${item.naziv}</strong><br><small>${item.album_naziv}</small>` : ''}
                    ${type==='album' ? `<strong>${item.naziv}</strong> (${item.godina})` : ''}
                    ${type==='quote' ? `<em>„${item.tekst}“</em><br><strong>— ${item.ime}</strong>` : ''}
                </div>
            </div>
        `).join('');
    };

    render(data.songs,  'likedSongs',  'song');
    render(data.albums, 'likedAlbums', 'album');
    render(data.quotes, 'likedQuotes', 'quote');
}
loadProfile();