const { createClient } = supabase;
const SUPABASE_URL = 'https://dbwxeoshrqssbrvtggbf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRid3hlb3NocnFzc2JydnRnZ2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NzI2NTYsImV4cCI6MjA1NDI0ODY1Nn0.nf7q3-2sJI9uwQ2w-GxJ4iKUTZlYAjuYdy_pOMfiJBg'

let userEmail=localStorage.getItem("user")
function fillFormAgain() {
   window.location.replace("../Form/FormTwo.html")
}
const asaNames = []
const asaDays = []
const userId = localStorage.getItem('id')
const multipleChildren = localStorage.getItem("multipleChildren")
setTimeout(async () => {
    const supabase = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const {data: memberData, error: memberError} = await supabase
    .from ('members')
    .select()
    .eq('user', userId)

    const {data: asaData, error: asaError} = await supabase
    .from ('asa')
    .select()

    for (a=0; a<memberData.length; a++) {
        for (b=0; b<asaData.length; b++) {
            if (asaData[b].id === memberData[a].asa) {
                asaNames.push(asaData[b].name)
                asaDays.push(asaData[b].day)
            }
        }
    }
    for (c=0; c<asaNames.length; c++) {
        if (asaDays[c] === "Monday") {
            document.querySelector("#end_confirmation").innerHTML += `
            ${asaDays[c]} - ${asaNames[c]} <br>
            `
        }
    }
    for (d=0; d<asaNames.length; d++) {
        if (asaDays[d] === "Tuesday") {
            document.querySelector("#end_confirmation").innerHTML += `
            ${asaDays[d]} - ${asaNames[d]} <br>
            `
        }
    }
    for (e=0; e<asaNames.length; e++) {
        if (asaDays[e] === "Wednesday") {
            document.querySelector("#end_confirmation").innerHTML += `
            ${asaDays[e]} - ${asaNames[e]} <br>
            `
        }
    }
    for (f=0; f<asaNames.length; f++) {
        if (asaDays[f] === "Thursday") {
            document.querySelector("#end_confirmation").innerHTML += `
            ${asaDays[f]} - ${asaNames[f]} <br>
            `
        }
    }
    for (g=0; g<asaNames.length; g++) {
        if (asaDays[g] === "Friday") {
            document.querySelector("#end_confirmation").innerHTML += `
            ${asaDays[g]} - ${asaNames[g]}
            `
        }
    }

    if (multipleChildren) {
        document.querySelector("#another_child").innerHTML += `
            <h3>If you want to fill in the form for another child, click the following button, enter your email, and use the 'Sign In' button.</h3>
            <button onclick="redirectBack()">Go back to beginning</button>
            `
    }

}, 1)
function redirectBack() {
    window.location.replace("../Student/Student.html")
}