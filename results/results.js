const { createClient } = supabase;
const SUPABASE_URL = 'https://dbwxeoshrqssbrvtggbf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRid3hlb3NocnFzc2JydnRnZ2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NzI2NTYsImV4cCI6MjA1NDI0ODY1Nn0.nf7q3-2sJI9uwQ2w-GxJ4iKUTZlYAjuYdy_pOMfiJBg'


const asas = []
const asaNames = []
setTimeout(async () => {
    const supabase = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
        const {data, error} = await supabase
                .from('members')
                .select()
        if (error) {
            console.log('first error:',error)
        }
        for (i=0;i<data.length;i++) {
            let flag=false
            for (k=0;k<asas.length+1;k++) {
                if (asas[k]===data[i].asa) {
                    flag=true
                }
            }
            if (!flag) {
                asas.push(data[i].asa)
            }
        }
    for (a=0;a<asas.length;a++) {
        const {data: dataOne, error: errorOne} = await supabase
                .from('asa')
                .select('name')
                .eq('id', asas[a])
        if (errorOne) {
            console.log('second error:', errorOne)
        }
        const asaName = dataOne[0].name.replaceAll(' ', '')
        const {data: dataTwo, error: errorTwo} = await supabase
                .from('members')
                .select('user')
                .eq('asa', asas[a])
        if (errorTwo) {
            console.log('third error:', errorTwo)
        }
        const users = []
        for (c=0;c<dataTwo.length;c++) {
            users.push(dataTwo[c].user)
        }

        document.querySelector('.main').innerHTML += `
        <table id="${asaName}">
            <h3>${dataOne[0].name}</h3>
            <th>Name:</th>
            <th>Surname:</th>
            <th>Email:</th>
            <th>Grade:</th>
            <th>Parent Email:</th>
        </table>
        `
        const userInfo = [
            [], //name
            [], //surname
            [], //email
            [], //grade
            [] //parent email
        ]
        for (d=0;d<users.length;d++) {
            const {data: dataThree, error: errorThree} = await supabase
                    .from('users')
                    .select()
                    .eq('id', users[d])
            if (errorThree) {
                console.log('third error:', errorThree)
            }
            const {data: dataFour, error: errorFour} = await supabase
            .from('parents')
            .select()
            .eq('id', dataThree[0].parent_id)
            if (errorFour) {
                console.log('third error:', errorFour)
            }

            userInfo[0].push(dataThree[0].first_name)
            userInfo[1].push(dataThree[0].last_name)
            userInfo[2].push(dataThree[0].email)
            userInfo[3].push(dataThree[0].grade)
            userInfo[4].push(dataFour[0].email)
            document.querySelector(`#${asaName}`).innerHTML += `
            <tr>
            <td> ${userInfo[0][d]} </td>
            <td> ${userInfo[1][d]} </td>
            <td> ${userInfo[2][d]} </td>
            <td> ${userInfo[3][d]} </td>
            <td> ${userInfo[4][d]} </td>
            </tr>
        `
        }
    }
}, 1)


