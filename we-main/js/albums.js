// js/albums.js – 100% radi – like/unlike + pamti stanje zauvijek

let user = null;
let likedSongs = new Set();
let likedAlbums = new Set();

async function initUser() {
    user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
        const res = await fetch(`api/user_favorites.php?user_id=${user.id}`);
        const data = await res.json();
        likedSongs = new Set(data.songs.map(id => parseInt(id)));
        likedAlbums = new Set(data.albums.map(id => parseInt(id)));
    } catch (e) { console.log("Greška lajkovi"); }
}

async function loadAlbums() {
    await initUser();

    const list = document.getElementById("albumList");
    try {
        const res = await fetch("api/albums.php");
        const albums = await res.json();

        list.innerHTML = "";
        albums.forEach(a => {
            const isLiked = likedAlbums.has(a.id);
            const div = document.createElement("div");
            div.className = "album";
            div.innerHTML = `
                <img src="${a.slika || 'https://via.placeholder.com/300'}" alt="${a.naziv}">
                <h3>${a.naziv}</h3>
                <p>${a.godina}</p>
                <button class="btn-songs" onclick="toggleSongs(${a.id}, this)">Show songs</button>
                ${user ? `<button class="like-btna album-like" 
                    onclick="event.stopPropagation(); toggleLike('album', ${a.id}, this)"
                    style="color:${isLiked ? '#fff' : '#ccc'}">
                    ${isLiked ? 'Liked' : 'Like album'}
                </button>` : ''}
                <div id="songs-${a.id}" class="songs" style="display:none;"></div>
            `;
            list.appendChild(div);
        });
    } catch (err) {
        list.innerHTML = "<p style='color:red'>Greška</p>";
    }
}

async function toggleSongs(album_id, btn) {
    const div = document.getElementById(`songs-${album_id}`);
    if (div.style.display === "block") { div.style.display = "none"; btn.textContent = "Show songs"; return; }
    if (div.innerHTML.trim() !== "") { div.style.display = "block"; btn.textContent = "Hide songs"; return; }

    try {
        const res = await fetch(`api/songs.php?album_id=${album_id}`);
        const songs = await res.json();

        div.innerHTML = songs.map(s => {
            const isLiked = likedSongs.has(s.id);
            return `
                <div class="song-item" onclick="showLyrics(${s.id})">
                    <span class="song-title">${s.naziv}</span>
                    <span class="duration">${s.trajanje || ""}</span>
                    <span class="likes">❤️ ${s.ocjene  || 0}</span>
                    ${user ? `<button class="like-btna" 
                        onclick="event.stopPropagation(); toggleLike('song', ${s.id}, this)"
                        style="color:${isLiked ? '#fff' : '#ccc'}">
                        ${isLiked ? 'Liked' : 'Like'}
                    </button>` : ''}
                </div>
                <div id="lyrics-${s.id}" class="lyrics"></div>
            `;
        }).join("");

        div.style.display = "block";
        btn.textContent = "Hide songs";
    } catch (err) {
        div.innerHTML = "<p style='color:red'>Greška</p>";
    }
}

// UNIVERZALNA FUNKCIJA – radi i za pjesmu i za album
async function toggleLike(type, item_id, btn) {
    if (!user) return alert("Moraš biti prijavljen!");

    const wasLiked = btn.textContent.includes("Liked");

    const res = await fetch("api/toggle_favorite.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({user_id: user.id, type, item_id})
    });
    const data = await res.json();

    if (data.liked && !wasLiked) {
        btn.style.color = "#fff";
        btn.textContent = "Liked";
        if (type === 'song') likedSongs.add(item_id);
        else likedAlbums.add(item_id);

        if (type === 'song') {
            const span = btn.closest('.song-item').querySelector('.likes');
            const curr = parseInt(span.textContent.trim().split(' ')[1] || '0') || 0;
            span.innerHTML = `❤️ ${curr + 1}`;
        }
    } else if (!data.liked && wasLiked) {
        btn.style.color = "#ccc";
        btn.textContent = type === 'song' ? "Like" : "Like album";
        if (type === 'song') likedSongs.delete(item_id);
        else likedAlbums.delete(item_id);

        if (type === 'song') {
            const span = btn.closest('.song-item').querySelector('.likes');
            const curr = parseInt(span.textContent.trim().split(' ')[1] || '0') || 0;
            span.innerHTML = `❤️ ${curr - 1}`;
        }
    }
}

async function showLyrics(id) {
    const div = document.getElementById(`lyrics-${id}`);
    if (div.style.display === "block") { div.style.display = "none"; return; }
    if (div.innerHTML.trim() !== "") { div.style.display = "block"; return; }
    const res = await fetch(`api/songs.php?id=${id}`);
    const data = await res.json();
    div.innerHTML = `<pre>${data.tekst || 'Text is not available.'}</pre>`;
    div.style.display = "block";
}

loadAlbums();