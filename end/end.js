const { createClient } = supabase;
const SUPABASE_URL = 'https://dbwxeoshrqssbrvtggbf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRid3hlb3NocnFzc2JydnRnZ2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NzI2NTYsImV4cCI6MjA1NDI0ODY1Nn0.nf7q3-2sJI9uwQ2w-GxJ4iKUTZlYAjuYdy_pOMfiJBg'

let userEmail=localStorage.getItem("user")
console.log(userEmail)
function fillFormAgain() {
    setTimeout(async () => {
        const supabase = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
        const {error: queueInsertError} = await supabase
            .from('queue')
            .insert({
                user: userEmail
            })
        let waitingPosition = 1
        while (0<1) {
            const {data: queueData, error: queueError} = await supabase
            .from('queue')
            .select()

            for (q=0; q<queueData.length;q++) {
                if (queueData[q].user === userEmail) {
                    waitingPosition = q
                }
            }
                            
            if (queueData[0].user === userEmail) {
                window.location.replace("../Form/FormTwo.html")
            } else {
                alert("You are in the queue to access the ASA selection, please wait. There are", waitingPosition, "people in front of you.")
            }
            await sleep(3000)
        }
    }, 10)
}

// const userId = localStorage.getItem('id')
// setTimeout(async () => {
//     const supabase = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
//     const {data: memberData, error: memberError} = await supabase
// }, 1)
// document.querySelector("#end_confirmation").innerHTML += 'hi'