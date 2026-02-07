const api = axios.create({ withCredentials: true });
const form = document.getElementById("fpForm");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const res = await api.post("/api/auth/forgot-password", { email: form.email.value });
  msg.textContent = res.data.resetToken ? `Reset token: ${res.data.resetToken}` : "E-posta gönderildi.";
  msg.classList.remove("hidden");
});
