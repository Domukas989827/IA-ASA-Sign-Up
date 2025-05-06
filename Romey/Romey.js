const { createClient } = supabase;
const SUPABASE_URL = 'https://dbwxeoshrqssbrvtggbf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRid3hlb3NocnFzc2JydnRnZ2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NzI2NTYsImV4cCI6MjA1NDI0ODY1Nn0.nf7q3-2sJI9uwQ2w-GxJ4iKUTZlYAjuYdy_pOMfiJBg'

setTimeout(async () => {
    const supabase = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const { data, error } = await supabase
    .from('teachers')
    .select()
    for (i=0; i<data.length; i++) {
        document.querySelector("#teachers").innerHTML += `
        <option value="${data[i].id}" >${data[i].first_name} ${data[i].last_name}</option>
        `
    }
    const {data: dataOne, error: errorOne} = await supabase
    .from('asa')
    .select()
    for (k=0; k<dataOne.length; k++) {
        document.querySelector("#asaToRemove").innerHTML += `
        <option value="${dataOne[k].name}">${dataOne[k].name}</option>
        `
    }
    }, 2)

function addAsa() {
    setTimeout(async () => {
        
    const name = document.querySelector("#asa_name").value
    const beginTime = document.querySelector("#begin_time").value
    const endTime = document.querySelector("#end_time").value
    const lowestGrade = document.querySelector("#low_grade").value
    const highestGrade = document.querySelector("#high_grade").value
    const slots = document.querySelector("#slots").value
    const teacherId = document.querySelector("#teachers").value
    const weekDay = document.querySelector("#weekday").value
    const description = document.querySelector("#asa_description").value

    const supabase = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    const {error} = await supabase
        .from('asa')
        .insert ({
            teacher_id: teacherId,
            name: name,
            begin_time: beginTime,
            end_time: endTime,
            lowest_grade: lowestGrade,
            highest_grade: highestGrade,
            slots: slots,
            day: weekDay,
            initial_slots: slots,
            description: description
        }
        )

    error ? console.log('error:', error) : alert('ASA successfully added!')
    }, 1);
}

function removeAsa() {
    setTimeout(async () => {
        const aboutToRemove = document.querySelector('#asaToRemove')
        let removeId = 0
        const supabase = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
        const {data, error: errorTwo} = await supabase
        .from('asa')
        .select()
        .eq('name', aboutToRemove.value)
        if (errorTwo) {
            console.log('supabase error when removing members:', errorTwo)
        } else {
            removeId = data[0].id
        }

        const {error: errorOne} = await supabase
        .from('members')
        .delete()
        .eq('asa', removeId)
        if (errorOne) {
            console.log('supabase error when removing members:', errorOne)
        }

        const {error} = await supabase
        .from('asa')
        .delete()
        .eq('name', aboutToRemove.value)
        if (error) {
            console.log('supabase error when removing asa:', error)
        }
        aboutToRemove.remove(aboutToRemove.selectedIndex)
        alert('ASA successfully removed!')
    }, 1);
}

function addTeacher() {
    setTimeout(async () => {
        teacherName = document.querySelector("#teacher_name").value
        teacherSurname = document.querySelector("#teacher_surname").value
        const supabase = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
        const {error} = await supabase
        .from('teachers')
        .insert(
            {
                first_name: teacherName,
                last_name: teacherSurname
            }
        )
        if (error) {
            console.log('supabase error when adding teacher:', error)
        }
    }, 1);
}