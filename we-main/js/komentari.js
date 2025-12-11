// js/komentari.js – KONAČNA VERZIJA: KOMENTARI SE VIDE ODMAH KAD UĐEŠ NA STRANICU

function escapeHtml(t) {
    const div = document.createElement('div');
    div.textContent = t || '';
    return div.innerHTML;
}

// UČITAJ KOMENTARE
async function loadComments(tip, item_id) {
    const container = document.getElementById(`comments-${tip}-${item_id}`);
    if (!container) return;

    try {
        const res = await fetch(`api/komentari.php?tip=${tip}&item_id=${item_id}&t=${Date.now()}`);
        const comments = await res.json();

        container.innerHTML = comments.length === 0
            ? "<p style='color:#888;font-style:italic;padding:20px 0;'>Još nema komentara. Budi prvi!</p>"
            : comments.map(c => `
                <div style="background:#222;padding:15px;border-radius:10px;margin:10px 0;">
                    <strong style="color:#0f0;">${escapeHtml(c.ime)}</strong>
                    <small style="color:#666;"> – ${new Date(c.datum).toLocaleString('hr-HR')}</small>
                    <p style="margin:8px 0 0 0;color:#eee;">${escapeHtml(c.tekst)}</p>
                </div>
            `).join("");
    } catch (e) {
        container.innerHTML = "<p style='color:red'>Greška.</p>";
    }
}

// DODAJ KOMENTAR
window.addComment = async function(tip, item_id) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Moraš biti prijavljen!");

    const textarea = document.getElementById(`commentText-${tip}-${item_id}`);
    const tekst = textarea?.value.trim();
    if (!tekst) return alert("Napiši komentar!");

    try {
        const res = await fetch("api/komentari.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.id, tip, item_id, tekst })
        });
        const data = await res.json();

        if (data.status === "ok") {
            textarea.value = "";
            alert("Komentar poslan!");
            loadComments(tip, item_id); // ← OVO JE BILO FALILO!
        } else {
            alert(data.message || "Greška!");
        }
    } catch (err) {
        alert("Greška sa serverom!");
    }
};

// GLAVNO: UČITAJ KOMENTARE ODMAH KAD SE STRANICA UČITA
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('[id^="comments-"]').forEach(el => {
        const parts = el.id.replace('comments-', '').split('-');
        if (parts.length >= 2) {
            loadComments(parts[0], parts[1]);
        }
    });
});