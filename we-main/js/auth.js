
document.getElementById("loginForm")?.addEventListener("submit", async function(e) {
    e.preventDefault();

    const login   = this.login.value.trim();
    const lozinka = this.lozinka.value;
    const msg     = document.getElementById("loginMsg");

    msg.textContent = "Provjeravam...";

    try {
        const res = await fetch("api/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `login=${encodeURIComponent(login)}&lozinka=${encodeURIComponent(lozinka)}`
        });

        const data = await res.json();
        msg.textContent = data.message;

        if (data.status === "ok") {
            localStorage.setItem("user", JSON.stringify(data.user));
            msg.style.color = "lime";
            setTimeout(() => {
                location.href = data.user.uloga === "admin" ? "admin.html" : "albums.html";
            }, 600);
        } else {
            msg.style.color = "red";
        }
    } catch (err) {
        msg.textContent = "Greška sa serverom";
    }
});