const { createClient } = supabase;
const SUPABASE_URL = 'https://dbwxeoshrqssbrvtggbf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRid3hlb3NocnFzc2JydnRnZ2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NzI2NTYsImV4cCI6MjA1NDI0ODY1Nn0.nf7q3-2sJI9uwQ2w-GxJ4iKUTZlYAjuYdy_pOMfiJBg'

let userName = localStorage.getItem("name")
let userGrade = localStorage.getItem("grade")
let asaNumber = 0
const asaIds = []
const asaActualIds = []
const asaDays = []
const asaSlotsLeft = []
setTimeout(async () => {
    const supabase = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const {data, error} = await supabase
            .from('asa')
            .select()
    if (data) {
        console.log('this is data', data)
        for (i=0;i<data.length;i++) {
            let asaName = data[i].name.replaceAll(' ', '')
            asaActualIds.push(data[i].id)
            asaDays.push(data[i].day)
            if (data[i].lowest_grade<=userGrade && userGrade<=data[i].highest_grade) {
                if (data[i].slots > 0) {
                    asaSlotsLeft.push(data[i].slots)
                    document.querySelector(`.${asaDays[i]}`).innerHTML += `
                    <input type="radio" id="${asaName}" name="${asaDays[i]}">
                    <label for="${asaName}">${data[i].name}</label>
                    <button class="description_button" onclick="overlayPopUp(${asaActualIds[i]})">Short description</button>
                    <br>
                    Duration: ${data[i].begin_time} - ${data[i].end_time} <br>
                    Available places left: ${data[i].slots} out of ${data[i].initial_slots}<br>
                    `
                    asaNumber+=1
                    asaIds.push(asaName)

                } else {
                    asaSlotsLeft.push(0)
                    document.querySelector(`.${asaDays[i]}`).innerHTML += `
                    <p1>${data[i].name} - no more open slots left.</p1> <br>
                    `
                    asaDays.splice(i, 1, 'replaced')
                    asaNumber+=1
                    asaIds.push(asaName)
                }
            } else {
                asaDays[i]='no'
            }
        }
        for (p=0;p<asaDays.length;p++) {
            if (asaDays[p]==='no') {
                asaDays.splice(p, 1)
                p-=1
            }
        }
    } else{
        console.log(error)
    }
}, 1)

async function chooseAsas(){
    if (document.querySelector('input[name="Monday"]:checked') 
        && document.querySelector('input[name="Tuesday"]:checked')
        && document.querySelector('input[name="Wednesday"]:checked')
        && document.querySelector('input[name="Thursday"]:checked')
        && document.querySelector('input[name="Friday"]:checked') ) {

        for (k=0;k<asaNumber;k++) {
            console.log(k)
            console.log(asaIds, asaDays)
            if (asaDays[k] === 'replaced') {
                console.log ('at', k, 'it was replaced')            } else {
                    if (!document.querySelector(`#none`+asaDays[k]).checked) {
                        console.log(asaIds)
                        if (document.querySelector(`#${asaIds[k]}`).checked) {
                            const userId = localStorage.getItem('id')
                            const supabase = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
                            const { error: errorOne } = await supabase
                                .from('members')
                                .insert({
                                asa: asaActualIds[k],
                                user: userId
                                })
                            if (errorOne) {
                                console.log('Error:', errorOne)
                            }
                            console.log("add successful")

                            const {error: errorTwo} = await supabase
                            .from('asa')
                            .update({slots: asaSlotsLeft[k]-1})
                            .eq('id', asaActualIds[k])
                            if (errorOne) {
                                console.log('supabase error when updating slots:', errorTwo)
                            }
                        }
                    } else {
                        console.log(asaDays[k], 'is checked none', k)
                    }
            }
        }
        window.location.replace("../end/end.html")
    } else {
        alert('Please check one option for every day (even if it is No ASAs for this day)')
    }
}

async function overlayPopUp(id) {
    const supabase = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const {data, error} = await supabase
            .from('asa')
            .select()
            .eq('id', id)
    if (error) {
        console.log(error)
    }
    document.querySelector('.overlay').innerHTML = `
    <button onclick="closeOverlay()">Close description</button>
    <h1>${data[0].name}</h1>
    <p>${data[0].description}</p>
    `
    document.querySelector('.overlayBackground').style.display = 'flex';
}

function closeOverlay() {
    document.querySelector('.overlayBackground').style.display = 'none';
}