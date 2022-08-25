var ok = false
var id_user = null
var id_rm=0
window.onload = function () {
  check()
  loading_roadmap()
  check_nw()
  loadRecCom()
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
      
    }
    else if (r.ok == false) {
      ok = false
      document.getElementById("container_funz").style.display="none"
      document.getElementById("roadmap_funz").innerHTML="<h2"
    }
  }
  xhr.send();
}

function loading_roadmap() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get('id')

  if (id != null && id >= 0) {
    id_rm=id
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
    if (r.data === undefined) {
      location.href = "/explore"
    }
    const quanti_stage = r.data.results.stages.length
    const roadmap = r.data.roadmap
    const user = r.data.user
    console.log(quanti_stage)
    console.log(roadmap)
    console.log(user)
    

    if (r.ok == true) {
      if (quanti_stage < 0) {
        location.href = "/explore"
      }
      else {
        var day = new Date(roadmap.dataCreazione)
        var month = day.getMonth() + 1;
        document.getElementById("titolo").innerText = roadmap.titolo
        document.getElementById("data").innerText = ' 🗓 ' + day.getDate() + "/" + month + "/" + day.getFullYear()
        document.getElementById("durata").innerText = ' ⏱ ' + roadmap.durataComplessiva
        document.getElementById("citta").innerText = ' 🏙 ' + roadmap.localita
        document.getElementById("utente").innerText = ' 👤 ' + user[0].username
        document.getElementById("descrizione").innerText = roadmap.descrizione
        funcCoktail(roadmap.punteggio)

        for (let i = 0; i < quanti_stage; i++) {
          var time = roadmap.stages.reachTime
          if (time == null) {
            time = " "
          }
          document.getElementById('lines').innerHTML += '<div class="dot" id="dot">' + time + '</div><div class="line" id="line"></div>'
          document.getElementById('cards').innerHTML += '<div class="card" id="card"> <h4>' + roadmap.stages[i].nome + '</h4><p>' + roadmap.stages[i].indirizzo + ' con durata di sosta: ' + roadmap.stages[i].durata + '; facendo ste cose: ' + roadmap.stages[i].descrizione_st + '</p></div>'

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

function loadRecCom(){
  var xhr = new XMLHttpRequest();

  xhr.open("GET", '/getRecCom?id='+id_rm, true);
  xhr.onload = function (event) {

    const r = JSON.parse(event.target.responseText);

    console.log(r)
    if (r.ok == true) {
      
    }
    else if (r.ok == false) {
      
    }
  }
  xhr.send();
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
    var decimal = Number("0."+decimalStr);
    if (decimal < 0.25) {
    } else if (decimal > 0.75) {
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
function saveRec() {
  if (ok == true) {
    console.log("Sito in costruzione: id: ", id_user)
  }
  else{alert("non !!!")}
}
function saveCom() {
  if (ok == true) {
    console.log("Sito in costruzione: id: ",id_user)
  }
  else{alert("non !!!")}
}



function forkaggio() {
  if (ok == true) {
    location.href="/create?roadmap_id="+id_rm
  }
  else { alert("non puoi passare!!") }
}