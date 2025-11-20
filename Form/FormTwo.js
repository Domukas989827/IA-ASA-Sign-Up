const { createClient } = supabase;
const SUPABASE_URL = 'https://dbwxeoshrqssbrvtggbf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRid3hlb3NocnFzc2JydnRnZ2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NzI2NTYsImV4cCI6MjA1NDI0ODY1Nn0.nf7q3-2sJI9uwQ2w-GxJ4iKUTZlYAjuYdy_pOMfiJBg'
let userGrade = localStorage.getItem("grade")
let asaNumber = 0
const asaIds = []
const asaActualIds = []
const asaDays = []
const asaSlotsLeft = []
const userId = localStorage.getItem('id')
setTimeout(async () => {
    const supabase = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const {data: dataTwo, error: errorTwo} = await supabase
        .from('asa')
        .select()
        .lte("lowest_grade", userGrade) // less or equal than
        .gte("highest_grade", userGrade) // greater or equal than
    for (x=0;x<dataTwo.length;x++) {
        asaSlotsLeft.push(dataTwo[x].slots)
        asaActualIds.push(dataTwo[x].id)
    }
    if (errorTwo) {
        console.log('there was an error in placing slots into array', errorTwo)
    }
    const {data: dataOne, error: errorOne} = await supabase
        .from('members')
        .select()
        .eq('user', userId)
            if (errorOne) {
                console.log('Error in getting user data:', errorOne)
            } else if (dataOne.length>0) {
                for (b=0;b<dataOne.length;b++) {
                    for (y=0;y<asaActualIds.length;y++) {
                        if (asaActualIds[y] === dataOne[b].asa) {
                            const { error: errorThree } = await supabase
                            .from('asa')
                            .update({
                            slots: asaSlotsLeft[y]+1,
                            })
                            .eq ('id', dataOne[b].asa)
                            asaSlotsLeft[y]+=1
                            if (errorThree) {
                                console.log('Error in updating slots:', errorThree)
                            }
                        }
                    }
                }
            }
            const {error: errorFour} = await supabase
                .from('members')
                .delete()
                .eq('user', userId)
            if (errorFour) {
                console.log("error when deleting user from asas:", errorFour)
            }
    const {data: teacherData, error: teacherError} = await supabase
        .from ('teachers')
        .select()
    if (dataTwo) {
        for (i=0;i<dataTwo.length;i++) {
            let asaName = dataTwo[i].name.replaceAll(' ', '')
            asaDays.push(dataTwo[i].day)
            if (dataTwo[i].slots > 0) {
                document.querySelector(`.${asaDays[i]}`).innerHTML += `
                <input type="radio" id="${asaName}" name="${asaDays[i]}">
                <label for="${asaName}"> 
                ${dataTwo[i].name} </label>
                <button onclick="overlayPopUp(${asaActualIds[i]})" class="description_button">Short description</button> <br>
                Duration: ${dataTwo[i].begin_time} - ${dataTwo[i].end_time} <br>
                Available places left: ${dataTwo[i].slots} out of ${dataTwo[i].initial_slots}<br>
                `
                for (t=0; t<teacherData.length; t++){
                    if (dataTwo[i].teacher_id === teacherData[t].id) {
                        document.querySelector(`.${asaDays[i]}`).innerHTML += `
                        Teacher: ${teacherData[t].first_name} ${teacherData[t].last_name} <br>
                        `
                    }
                }
                asaIds.push(asaName)
            } else {
                document.querySelector(`.${asaDays[i]}`).innerHTML += `
                <h3>${dataTwo[i].name} - no more open slots left.</h3> <br>
                `
                asaDays.splice(i, 1, 'replaced')
                asaIds.push(asaName)
            }
        }
    }
}, 1)

let problem = false
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
                        console.log(asaIds[k])
                        console.log(asaActualIds[k])
                        const userId = localStorage.getItem('id')
                        //reinput the asa slots to make sure they didn't change while the user was choosing asas
                        const {data: checkData, error: checkError} = await supabase
                        .from('asa')
                        .select('slots')
                        .eq('id', asaActualIds[k])
    
                        asaSlotsLeft[k]=checkData[0].slots
                        if (checkData[0].slots>0) {
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
                            for (z=0; z<memberData.length; z++) {
                                for (y=0; y<asaActualIds.length; y++) {
                                    if (asaActualIds[y] === memberData[z].asa && !(y === k)) {
                                        console.log(asaIds[y],asaSlotsLeft[y])
                                        const {error: slotsError} = await supabase
                                        .from('asa')
                                        .update({slots: asaSlotsLeft[y]})
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
        alert('You have not checked an option for every day (even if it is No ASAs for this day)')
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