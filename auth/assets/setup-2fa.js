const api = axios.create({ withCredentials: true });
const grid = document.getElementById("setupGrid");
const err = document.getElementById("err");

async function initSetup() {
  try {
    const res = await api.post("/api/auth/setup-2fa");
    const { otpauth, secret, backupCodes } = res.data;
    grid.classList.remove("hidden");
    document.getElementById("secret").textContent = secret;
    document.getElementById("qr").src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauth)}`;
    const list = document.getElementById("backup");
    list.innerHTML = backupCodes.map((c) => `<div class="box code-item">${c}</div>`).join("");
    document.getElementById("downloadCodes").onclick = () => {
      const blob = new Blob([backupCodes.join("\n")], { type: "text/plain" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "JUMVI_Backup_Codes.txt";
      a.click();
    };
  } catch (e) {
    if (e?.response?.status === 409) {
      grid.classList.add("hidden");
      return;
    }
    if (e?.response?.status === 401) {
      err.textContent = "Oturum bulunamadı. Lütfen tekrar giriş yapın.";
      err.classList.remove("hidden");
      setTimeout(() => { window.location.href = "/auth/login"; }, 1200);
    }
  }
}

document.getElementById("verifyBtn").onclick = async () => {
  err.classList.add("hidden");
  try {
    const res = await api.post("/api/auth/verify-2fa", { code: document.getElementById("code").value, trustDevice: document.getElementById("trust").checked });
    if (res.data?.trustedDevice) {
      localStorage.setItem("jumvi_device_token", res.data.trustedDevice);
    }
    sessionStorage.removeItem("jumvi_2fa_setup");
    window.location.href = "/panel";
  } catch (e) {
    err.textContent = e?.response?.data?.message || e?.response?.data?.error || "Kod hatalı";
    err.classList.remove("hidden");
  }
};

initSetup();
