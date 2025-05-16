const { createClient } = supabase;
const SUPABASE_URL = 'https://dbwxeoshrqssbrvtggbf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRid3hlb3NocnFzc2JydnRnZ2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NzI2NTYsImV4cCI6MjA1NDI0ODY1Nn0.nf7q3-2sJI9uwQ2w-GxJ4iKUTZlYAjuYdy_pOMfiJBg'


const asas = []
const asaNames = []
const userInfo = [
    [], //ids
    [], //names
    [], //surnames
    [], //emails
    [], //grades
    [] //parent emails
]
let memberData
let asaFullData

setTimeout(async () => {
    const supabase = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const {data: asaMemberData, error} = await supabase
            .from('members')
            .select()
    if (error) {
        console.log('Error when getting member data',error)
    }
    memberData = asaMemberData

    const {data: asaData, error: errorFive} = await supabase
            .from('asa')
            .select()
    if (error) {
        console.log('Error when getting asa data', errorFive)
    }
    asaFullData = asaData
    
    for (i=0;i<asaMemberData.length;i++) {
        let flag=false
        for (k=0;k<asas.length+1;k++) {
            if (asas[k]===asaMemberData[i].asa) {
                flag=true
            }
        }
        if (!flag) {
            asas.push(asaMemberData[i].asa) // pushing all the asas (their ids) with members into one array
        }
    }
    const {data: asaNameData, error: errorOne} = await supabase
        .from('asa')
        .select()
    if (errorOne) {
        console.log('Error when getting ASA names:', errorOne)
    }
    for (a=0; a<asas.length; a++) {
        for (b=0; b<asaNameData.length; b++) {
            if (asaNameData[b].id === asas[a]) {
                asaNames.push(asaNameData[b].name) // pushing all the names of the asas in the previous array into respective places
            }
        }
    }
    
    asaNames.sort()

        for (x=0; x<asaNames.length; x++) {
            for (y=0; y<asaFullData.length; y++) {
                if (asaFullData[y].name === asaNames[x]) {
                    asas[x] = asaFullData[y].id
                }
            }
        } // sorting asas based on sorted asaNames

    const {data: userData, error: errorThree} = await supabase
        .from('users')
        .select()
    if (errorThree) {
        console.log('Error when getting user data:', errorThree)
    }
    const {data: parentData, error: errorFour} = await supabase
        .from('parents')
        .select()
    if (errorFour) {
        console.log('Error when getting parent data', errorFour)
    }
    
    for (c=0; c<userData.length; c++) {
        userInfo[0].push(userData[c].id)
        userInfo[1].push(userData[c].first_name)
        userInfo[2].push(userData[c].last_name)
        userInfo[3].push(userData[c].email)
        userInfo[4].push(userData[c].grade)
        for (d=0; d<parentData.length; d++) {
            if (parentData[d].id === userData[c].parent_id) {
                userInfo[5].push(parentData[d].email)
            }
        }
    }

    for (e=0;e<asas.length;e++) {
        const members = []
        for (f=0;f<asaMemberData.length;f++) {
            if (asaMemberData[f].asa === asas[e]) {
                members.push(asaMemberData[f].user)
            }
        }
        document.querySelector('.main').innerHTML += `
        <table id="${asaNames[e].replaceAll(' ', '')}">
            <h3>${asaNames[e]}</h3>
            <th>Name:</th>
            <th>Surname:</th>
            <th>Email:</th>
            <th>Grade:</th>
            <th>Parent Email:</th>
        </table>
        `
        for (f=0; f<members.length; f++) {
            let index = 0
            for (g=0; g<userInfo[0].length; g++) {
                if (userInfo[0][g] === members[f]) {
                    index = g
                }
            }
            document.querySelector(`#${asaNames[e].replaceAll(' ', '')}`).innerHTML += `
            <tr>
            <td> ${userInfo[1][index]} </td>
            <td> ${userInfo[2][index]} </td>
            <td> ${userInfo[3][index]} </td>
            <td> ${userInfo[4][index]} </td>
            <td> ${userInfo[5][index]} </td>
            </tr>
        `
        }
    }
}, 1)

function sort() {
    if (document.querySelector('#sorting').value === 'byGrade') {
        document.querySelector('.main').innerHTML = `
        <label for="sorting">Sort Tables</label>
        <select sortBy="option" id="sorting"> 
            <option value="byName">by Name</option>
            <option value="bySurname">by Surname</option>
            <option value="byGrade">by Grade</option>
        </select>
        <button onclick="sort()">Sort</button>`
        let oneAsaMembers = []
        let oneAsaMemberGrades = []
        for (m=0; m<asas.length; m++) {
            for (n=0; n<memberData.length; n++) {
                if (memberData[n].asa === asas[m]) {
                    oneAsaMembers.push(memberData[n].user)
                    for (t=0; t<userInfo[0].length; t++) {
                        if (userInfo[0][t] === memberData[n].user) {
                            oneAsaMemberGrades.push(userInfo[4][t])
                        }
                    }
                }
            }

            for (k=0; k<oneAsaMemberGrades.length; k++) {
                let minIndex = k
                for (l=k+1; l<oneAsaMemberGrades.length; l++) {
                    if (oneAsaMemberGrades[l]<oneAsaMemberGrades[minIndex]) {
                        minIndex = l
                    }
                }
                let temp = oneAsaMemberGrades[k]
                oneAsaMemberGrades[k] = oneAsaMemberGrades[minIndex]
                oneAsaMemberGrades[minIndex] = temp

                let tempTwo = oneAsaMembers[k]
                oneAsaMembers[k] = oneAsaMembers[minIndex]
                oneAsaMembers[minIndex] = tempTwo
                
            }

            document.querySelector('.main').innerHTML += `
            <table id="${asaNames[m].replaceAll(' ', '')}">
                <h3>${asaNames[m]}</h3>
                <th>Name:</th>
                <th>Surname:</th>
                <th>Email:</th>
                <th>Grade:</th>
                <th>Parent Email:</th>
            </table>
            `
            for (f=0; f<oneAsaMembers.length; f++) {
                let index = 0
                for (g=0; g<userInfo[0].length; g++) {
                    if (userInfo[0][g] === oneAsaMembers[f]) {
                        index = g
                    }
                }
                document.querySelector(`#${asaNames[m].replaceAll(' ', '')}`).innerHTML += `
                <tr>
                <td> ${userInfo[1][index]} </td>
                <td> ${userInfo[2][index]} </td>
                <td> ${userInfo[3][index]} </td>
                <td> ${userInfo[4][index]} </td>
                <td> ${userInfo[5][index]} </td>
                </tr>
            `
            }
            oneAsaMembers = []
            oneAsaMemberGrades = []
        }
            
    } else if (document.querySelector('#sorting').value === 'byName') {

        document.querySelector('.main').innerHTML = `
        <label for="sorting">Sort Tables</label>
        <select sortBy="option" id="sorting"> 
            <option value="byName">by Name</option>
            <option value="bySurname">by Surname</option>
            <option value="byGrade">by Grade</option>
        </select>
        <button onclick="sort()">Sort</button>` //reset body to just sorting button

        let oneAsaMembers = []
        let oneAsaMemberNames = []

        for (m=0; m<asas.length; m++) {
            for (n=0; n<memberData.length; n++) {
                if (memberData[n].asa === asas[m]) {
                    oneAsaMembers.push(memberData[n].user)
                    for (t=0; t<userInfo[0].length; t++) {
                        if (userInfo[0][t] === memberData[n].user) {
                            oneAsaMemberNames.push(userInfo[1][t])
                        }
                    }
                }
            }

            oneAsaMemberNames.sort()

            for (k=0; k<oneAsaMembers.length; k++) {
                for (l=0; l<userInfo[1].length; l++) {
                    if (userInfo[1][l] === oneAsaMemberNames[k]) {
                        oneAsaMembers[k] = userInfo[0][l]
                    }
                }
            }

            document.querySelector('.main').innerHTML += `
            <table id="${asaNames[m].replaceAll(' ', '')}">
                <h3>${asaNames[m]}</h3>
                <th>Name:</th>
                <th>Surname:</th>
                <th>Email:</th>
                <th>Grade:</th>
                <th>Parent Email:</th>
            </table>
            `
            for (f=0; f<oneAsaMembers.length; f++) {
                let index = 0
                for (g=0; g<userInfo[0].length; g++) {
                    if (userInfo[0][g] === oneAsaMembers[f]) {
                        index = g
                    }
                }
                document.querySelector(`#${asaNames[m].replaceAll(' ', '')}`).innerHTML += `
                <tr>
                <td> ${userInfo[1][index]} </td>
                <td> ${userInfo[2][index]} </td>
                <td> ${userInfo[3][index]} </td>
                <td> ${userInfo[4][index]} </td>
                <td> ${userInfo[5][index]} </td>
                </tr>
            `
            }
            oneAsaMembers = []
            oneAsaMemberNames = []
        }
    } else if (document.querySelector('#sorting').value === 'bySurname') {

        document.querySelector('.main').innerHTML = `
        <label for="sorting">Sort Tables</label>
        <select sortBy="option" id="sorting"> 
            <option value="byName">by Name</option>
            <option value="bySurname">by Surname</option>
            <option value="byGrade">by Grade</option>
        </select>
        <button onclick="sort()">Sort</button>` //reset body to just sorting button

        let oneAsaMembers = []
        let oneAsaMemberSurnames = []

        for (m=0; m<asas.length; m++) {
            for (n=0; n<memberData.length; n++) {
                if (memberData[n].asa === asas[m]) {
                    oneAsaMembers.push(memberData[n].user)
                    for (t=0; t<userInfo[0].length; t++) {
                        if (userInfo[0][t] === memberData[n].user) {
                            oneAsaMemberSurnames.push(userInfo[2][t])
                        }
                    }
                }
            }

            oneAsaMemberSurnames.sort()

            for (k=0; k<oneAsaMembers.length; k++) {
                for (l=0; l<userInfo[1].length; l++) {
                    if (userInfo[2][l] === oneAsaMemberSurnames[k]) {
                        oneAsaMembers[k] = userInfo[0][l]
                    }
                }
            }

            document.querySelector('.main').innerHTML += `
            <table id="${asaNames[m].replaceAll(' ', '')}">
                <h3>${asaNames[m]}</h3>
                <th>Name:</th>
                <th>Surname:</th>
                <th>Email:</th>
                <th>Grade:</th>
                <th>Parent Email:</th>
            </table>
            `
            for (f=0; f<oneAsaMembers.length; f++) {
                let index = 0
                for (g=0; g<userInfo[0].length; g++) {
                    if (userInfo[0][g] === oneAsaMembers[f]) {
                        index = g
                    }
                }
                document.querySelector(`#${asaNames[m].replaceAll(' ', '')}`).innerHTML += `
                <tr>
                <td> ${userInfo[1][index]} </td>
                <td> ${userInfo[2][index]} </td>
                <td> ${userInfo[3][index]} </td>
                <td> ${userInfo[4][index]} </td>
                <td> ${userInfo[5][index]} </td>
                </tr>
            `
            }
            oneAsaMembers = []
            oneAsaMemberSurnames = []
        }
    }
}


//Links for website
// Add ASA: https://domukas989827.github.io/IA-ASA-Sign-Up/Romey/Romey.html
// Sign-Up for ASA: https://domukas989827.github.io/IA-ASA-Sign-Up/Student/Student.html
// Results: https://domukas989827.github.io/IA-ASA-Sign-Up/results/results.html

//Add update to github:
// ctrl + ` for terminal
// cd IA
// git add .
// git status
// git commit -m 'message'
// git push