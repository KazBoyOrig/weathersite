function sendMail() {
  let params = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    msg: document.getElementById("message").value
  };

  emailjs
    .send("service_gwqyph9", "template_rojjfmx", params)
    .then(() => {
      alert("Пікіріңіз жіберілді!");
    })
    .catch((err) => {
      console.error("Қате:", err);
      alert("Қате пайда болды, кейінірек қайталап көріңіз.");
    });
}
