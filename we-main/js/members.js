// js/members.js – SLIKA VEĆA I ŠIRA (300px široka, 400px visoka)

async function loadMembers() {
    const list = document.getElementById("clanoviList");
    try {
        const res = await fetch("api/members.php");
        if (!res.ok) throw new Error("Greška");
        const members = await res.json();
        const user = JSON.parse(localStorage.getItem("user"));

        list.innerHTML = members.map(m => `
            <div class="member-card">
                <!-- SLIKA – VEĆA I ŠIRA (300x400) -->
                <div class="member-img">
                    <img src="${m.slika || 'https://via.placeholder.com/300x400'}" alt="${m.ime}">
                </div>

                <!-- TEKST – LIJEVO -->
                <div class="member-text">
                    <h3>${m.ime}</h3>
                    <p><strong>Instrument:</strong> ${m.instrument || 'N/A'}</p>
                    ${m.biografija ? `<p class="bio">${m.biografija}</p>` : ''}

                    <!-- KOMENTARI -->
                    <div class="member-comments">
                        <h4>Komentari</h4>
                        <div id="comments-member-${m.id}"></div>

                        ${user ? `
                            <textarea id="commentText-member-${m.id}" 
                                      placeholder="Napiši komentar..." 
                                      class="comment-box"></textarea>
                            <button onclick="addComment('member', ${m.id})" class="comment-send">
                                Pošalji
                            </button>
                        ` : '<p class="login-msg">Prijavi se da komentiraš</p>'}
                    </div>
                </div>
            </div>
        `).join("");

    } catch (err) {
        list.innerHTML = "<p style='color:red;text-align:center;padding:50px;'>Greška.</p>";
    }
}

loadMembers();