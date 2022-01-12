const key = localStorage.getItem("display_antrian");
function logout() {
  localStorage.removeItem("display_antrian")
  setTimeout(() => {
    window.location.reload();
  }, 300)
}
if (key) {
  const myForm = document.getElementById("my_form");
  const call = document.getElementById("call");
  myForm.style.display = 'block';
  const urlDisplay = document.getElementById("url_display");
  const display_name = document.getElementById("display_name");
  urlDisplay.innerHTML = window.location.origin + "/display";
  urlDisplay.href = window.location.origin + "/display";
  display_name.innerHTML = key;
  urlDisplay.target = "_blank";
  const no = document.getElementById("no");
  const counter = document.getElementById("counter");
  const form = document.getElementById("form");
  form.onsubmit = function (e) {
    e.preventDefault();
    if (call.disabled === true) return;
    fetch("./send/" + key, {
      method: "POST",
      body: JSON.stringify({
        no: no.value,
        counter: counter.value
      })
    })
      .then(data => {
        if (!data.ok) throw data;
        return data.json();
      })
      .then(data => {
        call.disabled = true;
        setTimeout(() => {
          call.disabled = false;
        }, 7000);
      })
      .catch(err => {
        err.json().then(data => {
          alert(data.message)
        })
      })
  }
} else {
  const myForm = document.getElementById("my_create_form");
  myForm.style.display = 'block';
  const form = document.getElementById("display_form");
  const display = document.getElementById("display");
  form.onsubmit = function (e) {
    e.preventDefault();
    localStorage.setItem("display_antrian", display.value);
    setTimeout(() => {
      window.location.reload();
    }, 500)
  }
}