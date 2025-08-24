const { createClient } = supabase;
const SUPABASE_URL = 'https://dbwxeoshrqssbrvtggbf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRid3hlb3NocnFzc2JydnRnZ2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NzI2NTYsImV4cCI6MjA1NDI0ODY1Nn0.nf7q3-2sJI9uwQ2w-GxJ4iKUTZlYAjuYdy_pOMfiJBg'

let userName = localStorage.getItem("name")
let userGrade = localStorage.getItem("grade")
let userEmail = localStorage.getItem("user")
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
    const {data: teacherData, error: teacherError} = await supabase
        .from ('teachers')
        .select()
    if (data) {
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
                    for (t=0; t<teacherData.length; t++){
                        if (data[i].teacher_id === teacherData[t].id) {
                            document.querySelector(`.${asaDays[i]}`).innerHTML += `
                            Teacher: ${teacherData[t].first_name} ${teacherData[t].last_name} <br>
                            `
                        }
                    }
                    asaNumber+=1
                    asaIds.push(asaName)

                } else {
                    asaSlotsLeft.push(0)
                    document.querySelector(`.${asaDays[i]}`).innerHTML += `
                    <h3>${data[i].name} - no more open slots left.</h3> <br>
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
                asaActualIds.splice(p, 1)
                p-=1
            }
        }
    }
}, 10)

let problem = false
console.log(asaActualIds)
async function chooseAsas(){
    const supabase = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    if (document.querySelector('input[name="Monday"]:checked') 
        && document.querySelector('input[name="Tuesday"]:checked')
        && document.querySelector('input[name="Wednesday"]:checked')
        && document.querySelector('input[name="Thursday"]:checked')
        && document.querySelector('input[name="Friday"]:checked') ) {

        for (k=0;k<asaDays.length;k++) {
            if (!(asaDays[k] === 'replaced')) {
                if (!document.querySelector(`#none`+asaDays[k]).checked) {
                    if (document.querySelector(`#${asaIds[k]}`).checked) {
                        const userId = localStorage.getItem('id')
                        //reinput the asa slots to make sure they didn't change while the user was choosing asas
                        const {data: checkData, error: checkError} = await supabase
                        .from('asa')
                        .select('slots')
                        .eq('id', asaActualIds[k])
                        if (checkData[0].slots>0) {
                            asaSlotsLeft[k]=checkData[0].slots

                            const { error: errorOne } = await supabase
                                .from('members')
                                .insert({
                                asa: asaActualIds[k],
                                user: userId
                                })
                            if (errorOne) {
                                console.log('Error:', errorOne)
                            }

                            const {error: errorTwo} = await supabase
                                .from('asa')
                                .update({slots: asaSlotsLeft[k]-1})
                                .eq('id', asaActualIds[k])
                            if (errorTwo) {
                                console.log('supabase error when updating slots:', errorTwo)
                            }
                        } else {
                            alert('There are no more slots in one of the ASAs you want to choose. Please refresh the page')
                            problem = true
                            const {data: memberData, error: memberError} = await supabase
                            .from('members')
                            .select()
                            .eq('user', userId)
                            if (memberError) {
                                console.log(memberError)
                            }
                            console.log(memberData)
                            for (z=0; z<memberData.length; z++) {
                                for (y=0; y<asaActualIds.length; y++) {
                                    if (asaActualIds[y] === memberData[z].asa && !(y === k)) {
                                        console.log(asaIds[y],asaSlotsLeft[y])
                                        const {error: slotsError} = await supabase
                                        .from('asa')
                                        .update({slots: asaSlotsLeft[y]+1})
                                        .eq('id', asaActualIds[y])
                                    }
                                }
                            }
                            const {error: errorTen} = await supabase
                            .from('members')
                            .delete()
                            .eq('user', userId)
                        }
                    }
                }
            }
        }
        if (problem === false) {
            window.location.replace("../end/end.html")
        }
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
    <h3>${data[0].name}</h3>
    <p>${data[0].description}</p>
    `
    document.querySelector('.overlayBackground').style.display = 'flex';
}

function closeOverlay() {
    document.querySelector('.overlayBackground').style.display = 'none';
}