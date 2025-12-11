// js/quotes.js – KONAČNA VERZIJA: kompaktno, citat + lajk gore, komentari ispod, ne zauzima cijeli ekran

function escapeHtml(t) {
    const div = document.createElement('div');
    div.textContent = t || '';
    return div.innerHTML;
}

let likedQuotes = new Set();

async function loadUserLikes() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    try {
        const res = await fetch(`api/user_favorites.php?user_id=${user.id}`);
        const data = await res.json();
        data.quotes?.forEach(id => likedQuotes.add(parseInt(id)));
    } catch (e) {
        console.log("Ne mogu učitati lajkove citata");
    }
}

async function loadQuotes() {
    await loadUserLikes();
    const user = JSON.parse(localStorage.getItem("user"));
    const list = document.getElementById("citatiList");

    try {
        const res = await fetch("api/quotes.php");
        const quotes = await res.json();

        list.innerHTML = quotes.map(q => {
            const isLiked = likedQuotes.has(q.id);
            return `
                <!-- JEDAN KOMPAKTAN KARTON – ne zauzima cijeli ekran -->
                <div class="quote-card">
                    <!-- GORNJI DIO: slika + citat + lajk -->
                    <div class="quote-top">
                        ${q.slika ? `<img src="${escapeHtml(q.slika)}" alt="${escapeHtml(q.ime)}" class="quote-img">` : ''}
                        
                        <div class="quote-main">
                            <p class="quote-text">“${escapeHtml(q.tekst)}”</p>
                            <p class="quote-author">— ${escapeHtml(q.ime || "Nepoznato")}</p>
                            
                            <!-- LIKE DUGME -->
                            ${user ? `
                                <button onclick="event.stopPropagation(); toggleQuoteLike(${q.id}, this)"
                                        class="like-btn ${isLiked ? 'liked' : ''}">
                                    ${isLiked ? '♥' : '♡'}
                                </button>
                            ` : ''}
                        </div>
                    </div>

                    <!-- DONJI DIO: komentari -->
                    <div class="quote-bottom">
                        <h4>Komentari</h4>
                        <div id="comments-quote-${q.id}" class="comments-list"></div>

                        ${user ? `
                            <div class="comment-form">
                                <textarea id="commentText-quote-${q.id}" 
                                          placeholder="Tvoj komentar..." 
                                          class="comment-input"></textarea>
                                <button onclick="addComment('quote', ${q.id})" 
                                        class="comment-send">Pošalji</button>
                            </div>
                        ` : '<p class="login-msg">Prijavi se da komentiraš</p>'}
                    </div>
                </div>
            `;
        }).join("");

    } catch (err) {
        list.innerHTML = "<p style='color:red;text-align:center;padding:50px;'>Greška.</p>";
    }
}

async function toggleQuoteLike(quote_id, btn) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Moraš biti prijavljen!");

    const wasLiked = btn.classList.contains('liked');
    const res = await fetch("api/toggle_favorite.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({user_id: user.id, type: "quote", item_id: quote_id})
    });
    const data = await res.json();

    if (data.liked && !wasLiked) {
        btn.classList.add('liked');
        btn.innerHTML = '♥';
    } else if (!data.liked && wasLiked) {
        btn.classList.remove('liked');
        btn.innerHTML = '♡';
    }
}

loadQuotes();