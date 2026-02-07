const api = axios.create({ withCredentials: true });
const form = document.getElementById("loginForm");
const err = document.getElementById("err");
const togglePw = document.getElementById("togglePw");

togglePw.addEventListener("click", () => {
  const input = form.password;
  const isPw = input.type === "password";
  input.type = isPw ? "text" : "password";
  togglePw.textContent = isPw ? "Gizle" : "Göster";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  err.classList.add("hidden");
  const payload = {
    email: form.email.value,
    password: form.password.value,
    remember: form.remember.checked,
    deviceToken: localStorage.getItem("jumvi_device_token") || ""
  };
  try {
    const res = await api.post("/api/auth/login", payload);
    if (res.data.requires2fa) {
      sessionStorage.setItem("jumvi_2fa_setup", res.data.setup ? "1" : "0");
      window.location.href = "/auth/setup-2fa";
      return;
    }
    window.location.href = "/panel";
  } catch (e) {
    err.textContent = e?.response?.data?.message || e?.response?.data?.error || "Giriş başarısız";
    err.classList.remove("hidden");
  }
});
