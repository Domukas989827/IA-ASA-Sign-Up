const { createClient } = supabase;
const SUPABASE_URL = 'https://dbwxeoshrqssbrvtggbf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRid3hlb3NocnFzc2JydnRnZ2JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2NzI2NTYsImV4cCI6MjA1NDI0ODY1Nn0.nf7q3-2sJI9uwQ2w-GxJ4iKUTZlYAjuYdy_pOMfiJBg'

let userEmail = null
function signIn() {
    setTimeout(async () => {

        userEmail = document.querySelector("#userEmail").value
        localStorage.setItem("user", userEmail)
        if (userEmail == '') {
            alert('The email is missing')
        } else {
            const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
            if (!document.querySelector('#parentBox').checked) {
                const { data, error: firstError } = await supabase
                .from('users')
                .select()
                .eq('email', userEmail)
                if (data.length > 0) {
                    alert('You have already completed this form')
                } else {
                    const {error} = await supabase
                        .from('users')
                        .insert ({
                            email: userEmail,
                        }
                        )
                    const {data: dataTwo, error: errorTwo} = await supabase
                    .from ('users')
                    .select()
                    .eq('email', userEmail)
                    userId = dataTwo[0].id
                    localStorage.setItem('id', userId)
                    if (errorTwo) {
                     console.log(errorTwo)
                    }
                        if (error) {
                            console.log('supabase error:', error)
                        } else {
                            document.querySelector(".firstPage").innerHTML = `
                        <div class="secondPage">
                        <h1>Enter your information:</h1>
                        <label for="user_name">Enter your name:</label>
                        <input type="text" id="user_name" placeholder="e.g. Jason">
                        <br>
                        <label for="user_surname">Enter your surname:</label>
                        <input type="text" id="user_surname" placeholder="e.g. Romey">
                        <br>
                        <label for="userGrade">Select your grade:</label>
                        <select userGrade = "grade" id="user_grade">
                        <option value="-3">Oak</option>
                        <option value="-2">Linden</option>
                        <option value="-1">Maple</option>
                        <option value="0">Kindergarten</option>

                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        </select>
                        <br>
                        <label for="parent_email">Enter the email of one of your parents (not necessary):</label>
                        <input type="text" id="parent_email" placeholder="example@email.com">
                        <br>
                        <button onclick="addUserInfo()">Enter</button>
                        </div>
                        `
                        }
                    }
            } else if (document.querySelector('#parentBox').checked){
                const { data: dataFive, error: errorFive } = await supabase
                .from('users')
                .select()
                .eq('email', userEmail)
                if (dataFive.length > 0) {
                    alert('You have already completed this form and you are not a parent')
                } else {
                    const { data, error } = await supabase
                    .from('parents')
                    .select()
                    .eq('email', userEmail)
                    if (data.length > 0) {
                        alert('You have already completed this form')
                    } else {
                        const {error} = await supabase
                            .from('parents')
                            .insert ({
                                email: userEmail,
                            }
                            )
                            if (error) {
                                console.log('supabase error:', error)
                            } else {
                                document.querySelector(".firstPage").innerHTML = `
                            <div class="secondPage">
                            <h1>Enter information about (one of) your child(ren):</h1>
                            <label for="user_name">Enter student's name:</label>
                            <input type="text" id="user_name" placeholder="e.g. Jason">
                            <br>
                            <label for="user_surname">Enter student's surname:</label>
                            <input type="text" id="user_surname" placeholder="e.g. Romey">
                            <br>
                            <label for="user_email">Enter student's email (if possible):</label>
                            <input type="text" id="user_email" placeholder="example@email.com">
                            <br>
                            <label for="userGrade">Select student's grade:</label>
                            <select userGrade = "grade" id="user_grade">
                            <option value="-3">Oak</option>
                            <option value="-2">Linden</option>
                            <option value="-1">Maple</option>
                            <option value="0">Kindergarten</option>

                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            </select>
                            <br>
                            <input type="checkbox" id="multipleChildrenBox">
                            <label for="multipleChildrenBox">I have more than 1 child attending ISR</label>
                            <br>
                            <button onclick="addParentInfo()">Enter</button>
                            </div>
                            `
                        }
                    }
                }
            }
        }
    }, 1);
}

function addUserInfo() {
    setTimeout(async () => {

        const userName = document.querySelector("#user_name").value
        const userSurname = document.querySelector("#user_surname").value
        const userGrade = document.querySelector("#user_grade").value
        const userEmail = localStorage.getItem("user")
        const parentEmail = document.querySelector("#parent_email").value
        localStorage.setItem("grade", userGrade)
        localStorage.setItem("multipleChildren", false)
        let parentId = 0
        

        const supabase = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
        
        const {error: errorOne} = await supabase
            .from('parents')
            .insert({
                email: parentEmail
            })
        if (errorOne) {
            console.log('First error',errorOne)
        }

        const {data, errorTwo} = await supabase
            .from('parents')
            .select()
            .eq('email',parentEmail)

        if (data) {
            parentId = data[0].id
        } else if (errorTwo) {
            console.log('Second Error', errorTwo)
        }

        const {error} = await supabase
            .from('users')
            .update({
                first_name: userName,
                last_name: userSurname,
                grade: userGrade,
                parent_id: parentId
            }
            )
            .eq('email',userEmail)
            if (error) {
                console.log('supabase error:', error)
            } else {
                window.location.replace("../Form/Form.html")
            }
        }, 100);
}

function addParentInfo() {
    setTimeout(async () => {

        const userName = document.querySelector("#user_name").value
        const userSurname = document.querySelector("#user_surname").value
        const userGrade = document.querySelector("#user_grade").value
        const userEmail = document.querySelector("#user_email").value
        const parentEmail = localStorage.getItem("user")
        const multipleChildren = document.querySelector("#multipleChildrenBox").checked
        localStorage.setItem("multipleChildren", multipleChildren)
        localStorage.setItem("user", userEmail)
        localStorage.setItem("grade", userGrade)
        let parentId = 0
        const supabase = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

        const {data, error: errorOne} = await supabase
            .from('parents')
            .select()
            .eq('email', parentEmail)

        if (data) {
            parentId = data[0].id
        } else if (errorOne) {
            console.log('Supabase error', errorTwo)
        }
        const {error} = await supabase
            .from('users')
            .insert({
                first_name: userName,
                last_name: userSurname,
                grade: userGrade,
                email: userEmail,
                parent_id: parentId
            }
            )
            if (error) {
                console.log('supabase error:', error)
            } else {
                const {data: dataTwo, error: errorTwo} = await supabase
                .from ('users')
                .select()
                .eq('parent_id', parentId)
                userId = dataTwo[0].id
                localStorage.setItem('id', userId)
                if (errorTwo) {
                    console.log(errorTwo)
                } else {
                    window.location.replace("../Form/Form.html")
                }
            }
        }, 4);
}

function logIn() {
    setTimeout(async () => {
        if (!document.querySelector('#parentBox').checked) {
            
            userEmail = document.querySelector("#userEmail").value
            localStorage.setItem("user", userEmail)
            

            const supabase = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
            const {data, error} = await supabase
                .from('users')
                .select ()
                .eq('email', userEmail)

                if (error) {
                    console.log(error)
                } else if (data.length === 0) {
                    alert('Incorrect email')
                } else {
                    let userId = data[0].id
                    localStorage.setItem('id', userId)
                    localStorage.setItem('grade', data[0].grade)
                    window.location.replace("../Form/FormTwo.html")
                }
            
        } else {
            userEmail = document.querySelector("#userEmail").value
            localStorage.setItem("user", userEmail)

            const supabase = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
            const {data: dataParents, error: errorParents} = await supabase
                .from('parents')
                .select ()
                .eq('email', userEmail)

                if (errorParents) {
                    console.log(error)
                } else if (dataParents.length === 0) {
                    alert('Incorrect email')
                } else {
                    const {data, error} = await supabase
                    .from('users')
                    .select ()
                    .eq('parent_id', dataParents[0].id)
                    document.querySelector(".container").innerHTML = `
                    <h1>Choose what you want to do:</h1>
                    <h3>Input selection for another child</h3>
                    <button onclick="anotherChildSelection()">Select ASAs for your other child</button>
                    <br>
                    `
                    for (k=0; k<data.length; k++) {
                        document.querySelector(".container").innerHTML += `
                        <input type="radio" id="${data[k].first_name}" name="goodName">
                        <label for="#${data[k].first_name}">Change the selection of ${data[k].first_name}</label>
                        <br>
                        `
                    }

                    console.log(data)
                    document.querySelector(".container").innerHTML += `
                    <br>
                    <button onclick="changeSelection()">Change Selection</button>
                    <br>
                    `
                }
        }
    }, 2);
}

async function anotherChildSelection() {
    document.querySelector(".firstPage").innerHTML = `
        <div class="secondPage">
        <h1>Enter information about (one of) your child(ren):</h1>
        <label for="user_name">Enter student's name:</label>
        <input type="text" id="user_name" placeholder="e.g. Jason">
        <br>
        <label for="user_surname">Enter student's surname:</label>
        <input type="text" id="user_surname" placeholder="e.g. Romey">
        <br>
        <label for="user_email">Enter student's email (if possible):</label>
        <input type="text" id="user_email" placeholder="example@email.com">
        <br>
        <label for="userGrade">Select student's grade:</label>
        <select userGrade = "grade" id="user_grade">
        <option value="-3">Oak</option>
        <option value="-2">Linden</option>
        <option value="-1">Maple</option>
        <option value="0">Kindergarten</option>

        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
        </select>
        <br>
        <button onclick="addAnotherChild()">Enter</button>
        </div>
        `
}

async function addAnotherChild() {
    setTimeout(async () => {
        const userName = document.querySelector("#user_name").value
        const userSurname = document.querySelector("#user_surname").value
        const userGrade = document.querySelector("#user_grade").value
        const userEmail = document.querySelector("#user_email").value
        const parentEmail = localStorage.getItem("user")
        localStorage.setItem("grade", userGrade)
        let parentId = 0
        const supabase = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

        const {data, error: errorOne} = await supabase
            .from('parents')
            .select()
            .eq('email', parentEmail)

        if (data) {
            parentId = data[0].id
        } else if (errorOne) {
            console.log('Supabase error', errorTwo)
        }
        const {error} = await supabase
            .from('users')
            .insert({
                first_name: userName,
                last_name: userSurname,
                grade: userGrade,
                email: userEmail,
                parent_id: parentId
            }
            )
            if (error) {
                console.log('supabase error:', error)
            } else {
                const {data: dataTwo, error: errorTwo} = await supabase
                .from ('users')
                .select()
                .eq('parent_id', parentId)
                for (l=0;l<dataTwo.length;l++) {
                    if (dataTwo[l].first_name === userName) {
                        userId = dataTwo[l].id
                        console.log(userId)
                        localStorage.setItem('id', userId)
                        if (errorTwo) {
                            console.log(errorTwo)
                        } else {
                            window.location.replace("../Form/Form.html")
                        }
                    }
                }
            }
        }, 4);
}

async function changeSelection() {
    const supabase = await createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const {data: dataParents, error: errorParents} = await supabase
        .from('parents')
        .select ()
        .eq('email', userEmail)
    const {data, error} = await supabase
        .from('users')
        .select ()
        .eq('parent_id', dataParents[0].id)
    let flag = false
    for (x=0; x<data.length; x++) {
        if (document.querySelector(`#${data[x].first_name}`).checked) {
            let userId = data[x].id
            localStorage.setItem('id', userId)
            localStorage.setItem('grade', data[x].grade)
            flag = true
            window.location.replace("../Form/FormTwo.html")
        }
    }
    if (!flag) {
        alert('You have not selected a child to change the selection for.')
    }
}