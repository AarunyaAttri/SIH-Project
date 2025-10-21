async function loadConfig() {
    if (!window.appConfig) {
        const response = await fetch("config.json");
        window.appConfig = await response.json();
    }
    return window.appConfig;
}

async function postRequest(endpoint, data) {
    const config = await loadConfig();
    const url = config.apiBaseUrl + config.endpoints[endpoint];

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    return await res.json();
}

async function studentLogin(username, password) {
    return await postRequest("studentLogin", { username, password });
}

async function markAttendance(studentId, base64Image) {
    return await postRequest("markAttendance", { studentId, base64: base64Image });
}
async function adminLogin(email, password) {
  const res = await fetch("http://127.0.0.1:5000/admin-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}