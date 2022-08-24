var ok = false
var id_user = null
window.onload = function () {
  check()
  loading_roadmap()
  check_nw()
}

function check_nw() {
  var xhr = new XMLHttpRequest();

  xhr.open("GET", '/isLogWho', true);
  xhr.onload = function (event) {

    const r = JSON.parse(event.target.responseText);

    console.log(r)
    if (r.ok == true) {
      console.log("ok:", r.ok, "=>sei loggato!!! con questo id", r.whoLog)
      ok = true
      id_user = r.whoLog
      //check_ut(id_user)
    }
    else if (r.ok == false) {
      ok = false
    }
  }
  xhr.send();
}

function check_ut(id_user) {


  console.log("mammt si pure ca dint, id: ", id_user)
  var xhr = new XMLHttpRequest();

  xhr.open("GET", '/-recensione, valutazione, se seguita e/o preferita--', true);
  xhr.onload = function (event) {

    const r = JSON.parse(event.target.responseText);


    if (r.ok == true) {
      console.log("ok:", r.ok, "=>sei loggato!!! con questo id", r.whoLog)

    }
    else if (r.ok == false) {

    }
  }
  xhr.send();

}


function loading_roadmap() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id')

  if (id != null && id >= 0) {
    richiestaRoadmap(id)
  }
  else {
    location.href = "/explore"
  }
}
function richiestaRoadmap(id) {

  var xhr = new XMLHttpRequest();
  xhr.open("GET", '/viewrm?id=' + id, true);

  xhr.onload = function (event) {

    const r = JSON.parse(event.target.responseText);
    const quanti_stage = r.data.results_rm.length
    const result_rm = r.data.results_rm
    const result_us = r.data.results_us

    if (r.ok == true) {
      if (quanti_stage < 0) {
        location.href = "/explore"
      }
      else {
        var day = new Date(result_rm[0].dataCreazione)
        var month = day.getMonth() + 1;
        document.getElementById("titolo").innerText = result_rm[0].titolo
        document.getElementById("data").innerText = ' 🗓 ' + day.getDate() + "/" + month + "/" + day.getFullYear()
        document.getElementById("durata").innerText = ' ⏱ ' + result_rm[0].durataComplessiva
        document.getElementById("citta").innerText = ' 🏙 ' + result_rm[0].localita
        document.getElementById("utente").innerText = ' 👤 ' + result_us[0].username
        document.getElementById("descrizione").innerText = result_rm[0].descrizione
        funcCoktail(result_rm[0].punteggio)

        for(let i=0;i<quanti_stage;i++){
          document.getElementById('prova_stages').innerHTML += '<div class="dot"></div><div class="line"></div>'

          document.getElementById("prova_stages").innerHTML += result_rm[i].nome+'<br>'
          document.getElementById("prova_stages").innerHTML += result_rm[i].durata+'<br>'
          document.getElementById("prova_stages").innerHTML += result_rm[i].reachTime+'<br>'
          document.getElementById("prova_stages").innerHTML += result_rm[i].indirizzo+'<br>'
          document.getElementById("prova_stages").innerHTML += result_rm[i].descrizione_st+'<br>'

          document.getElementById("prova_stages").innerHTML += "<br><br><br><br>"

        }

      }
    }
    else if (r.ok == false) {
      console.log(r)
      alert("Problemi col db")
    }
  }
  xhr.send()
}
function rating(value) {
  if (ok == true) {
    var points = value
    //insert in tabella con id utente per la valutazione
    alert("Punteggio: " + points)

  }
  else {
    alert("non sei loggato!!! non puoi lasciare un reting")
  }
}

function heart() {

  if (ok == true) {
    const button = document.querySelector(".heart-like-button");
    var point = 0;
    //insert in tabella con id utente per dire se preferita
    if (button.classList.contains("liked")) {
      button.classList.remove("liked");
      point = 0
      alert("Non mi piace più, Punteggio=" + point)
    } else {
      button.classList.add("liked");
      point = 1
      alert("Mi piace, Punteggio=" + point)
    }
  }
  else {
    alert("non sei loggato!!! non puoi metterla tra i preferiti")
  }
}

function checked() {
  if (ok == true) {
    const button = document.querySelector(".checked-like-button");
    var point = 0;
    //insert in tabella con id utente per dire se effettuata
    if (button.classList.contains("liked")) {
      button.classList.remove("liked");
      point = 0
      alert("Non la seguo più, Punteggio=" + point)
    } else {
      button.classList.add("liked");
      point = 1
      alert("La seguo, Punteggio=" + point)
    }
  } else {
    alert("non sei loggato!!! non puoi dirci di averla fatta sta roadmap")
  }
}
function funcCoktail(punteggio) {
  /* prendo tutto il numero intero e stampo i cock pieni
   verifico poi se c'è parte decimale faccio il controllo e decido se aggiungere un cocktail pieno o mezzo
   verifico se ho fatto riferimento a 5 elementi, in caso contrario arrivo a 5 mettendo cocktail vuoti*/
  var spazioRoadmap = document.getElementById("rating");
  const html_codePieno = '<img src="/storage/cocktailPieno.png" style="width:25px;height: 25px;">'
  const html_codeMezzo = '<img src="/storage/cocktailMezzo.png" style="width:25px;height: 25px;">'
  const html_codeVuoto = '<img src="/storage/cocktailVuotoPiccolo.png" style="width:25px;height: 25px;">'
  var counterStamp = 0;
  if (Number.isInteger(punteggio)) {
    for (var iteratorInt = 0; iteratorInt < punteggio; iteratorInt++) {
      spazioRoadmap.insertAdjacentHTML("beforeend", html_codePieno);
      counterStamp++;
    }
  } else {
    for (var iteratorInt = 1; iteratorInt < punteggio; iteratorInt++) {  //iteratorInt parte da 1 così da non inserire interi fino a 0.75
      spazioRoadmap.insertAdjacentHTML("beforeend", html_codePieno);
      counterStamp++;
    }
    //inizio controllo sul decimale
    const decimalStr = punteggio.toString().split('.')[1];
    var decimal = Number(decimalStr);
    if (decimal < 2.5) {
    } else if (decimal > 7.5) {
      spazioRoadmap.insertAdjacentHTML("beforeend", html_codePieno);
      counterStamp++;
    } else {
      spazioRoadmap.insertAdjacentHTML("beforeend", html_codeMezzo);
      counterStamp++;
    }
  }
  while (counterStamp < 5) {
    spazioRoadmap.insertAdjacentHTML("beforeend", html_codeVuoto);
    counterStamp++;
  }
}
function forkaggio() {
  if (ok == true) {
    alert("Sito in distruzione")
  }
  else { alert("non puoi passare!!") }
}