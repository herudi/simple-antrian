const key = localStorage.getItem("display_antrian");
const origin = window.location.origin;
window.logout = () => {
  localStorage.removeItem("display_antrian")
  setTimeout(() => {
    window.location.reload();
  }, 300)
}
window.resetDisplay = () => {
  fetch("./reset/" + key, {
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
if (key) {
  const myForm = document.getElementById("my_form");
  const call = document.getElementById("call");
  myForm.style.display = 'block';
  const urlDisplay = document.getElementById("url_display");
  const display_name = document.getElementById("display_name");
  urlDisplay.innerHTML = origin + "/display";
  urlDisplay.href = origin + "/display";
  display_name.innerHTML = key;
  urlDisplay.target = "_blank";
  const no = document.getElementById("no");
  const counter = document.getElementById("counter");
  const form = document.getElementById("form");
  window.resetDisplay = () => {
    fetch(origin + "/reset/" + key, {
      method: "POST"
    })
      .then(data => {
        if (!data.ok) throw data;
        return data.json();
      })
      .then(_ => {
        no.value = void 0;
        counter.value = void 0;
        alert("Success reset display");
      })
      .catch(err => {
        err.json().then(data => {
          alert(data.message)
        })
      })
  }
  form.onsubmit = function (e) {
    e.preventDefault();
    if (call.disabled === true) return;
    fetch(origin + "/send/" + key, {
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