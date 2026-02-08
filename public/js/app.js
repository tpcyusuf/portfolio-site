const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.querySelector('input[name="name"]').value;
  const email = form.querySelector('input[name="email"]').value;
  const message = form.querySelector('textarea[name="message"]').value;

  try {
    const res = await fetch("https://portfolio-site-ox1v.onrender.com/send-mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    });

    const data = await res.json();

    alert(data.message);
    form.reset();
  } catch (err) {
    alert("Hata oluştu ❌");
    console.error(err);
  }
});
