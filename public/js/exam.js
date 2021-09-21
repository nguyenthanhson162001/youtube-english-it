var vocaublary = document.getElementById('vocaublary')
var optionForm = document.getElementById('list-option')
var type = document.getElementById('type')
var indexQuestion = document.getElementById('number-question')
var finishForm = document.getElementById('finish')
var examForm = document.getElementById('exam')
var uncorrectTable = document.getElementById('tableUncorrect')
var percent = document.getElementById('percent')
var numberTotal = 0
var delay = 500
var socket = io('/')
var optionID
var audio = document.getElementById('reading')
var srcAudio = `https://api.voicerss.org/?key=19d2c8b86ed1444198305384a7129452&hl=en-us&c=MP3&f=16khz_16bit_stereo&src=`

promptGetUser()


function promptGetUser() {
    let person = prompt("Please enter your name:");
    if (person == null || person == "") {
        userName = "No Name";
    } else {
        userName = person
    }
    // http://localhost:3001/exam/unit-1-life?
    let slug = window.location.href.split('/')

    //http: , , localhost:3001,exam,unit-3-somthing?
    socket.emit('start', { userName, slug: slug[slug.length - 1].replace('?', '') })
}
socket.on('server-ok', (l) => {
    requestGetQuestion()
    numberTotal = l
})
socket.on('server-send-question', (data) => {
    indexQuestion.innerText = `${data.index + 1}/${numberTotal}`
    type.innerText = `(${data.type})`
    vocaublary.innerText = data.english
    optionForm.innerHTML = `
              <div class="col-6 p-2"><button type="button" class="btn btn-outline-dark w-100 shadow-sm  " id='option1' onclick="choiseOption('option1')" > ${data.option[0]}</button></div>
                <div class="col-6 p-2"><button type="button" class="btn btn-outline-dark w-100 shadow-sm " id='option2' onclick="choiseOption('option2')" >${data.option[1]}</button></div>
                <div class="col-6 p-2"><button type="button" class="btn btn-outline-dark w-100 shadow-sm " id='option3' onclick="choiseOption('option3')"  >${data.option[2]}</button></div>
                <div class="col-6 p-2"><button type="button" class="btn btn-outline-dark w-100 shadow-sm " id='option4' onclick="choiseOption('option4')" >${data.option[3]}</button></div>


    `
    audio.setAttribute('src', srcAudio + data.english)
    audio.play()
})
socket.on('finish-exam', (data) => {
    finishForm.style.display = 'block'
    examForm.style.display = 'none'
    let index = 1;
    let list = data.map((e) => {
        return ` <tr>
                            <td>${index++}</td>
                            <td>${e.english}</td>
                            <td>${e.vietnamese}</td>
                            <td>(${e.type})</td>
                 </tr>`
    })
    uncorrectTable.innerHTML = list.join('')
    console.log(numberTotal, data.length)
    percent.innerText = parseInt((numberTotal - data.length) * (100 / numberTotal)) + "%"
})
socket.on('server-send-result-answer', (data) => {
    if (data.status) {
        document.getElementById(optionID).className = 'btn btn-outline-success w-100 shadow-sm '
        window.setTimeout(() => {
            requestGetQuestion()
        }, delay);

    } else {
        document.getElementById(optionID).className = 'btn btn-outline-danger w-100 shadow-sm '
    }
})

function requestGetQuestion() {
    socket.emit('request-get-question')
}

function choiseOption(id) {
    optionID = id
    let option = document.getElementById(optionID).innerText;

    socket.emit('request-check-answer', { option: option });
}