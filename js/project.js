const listProject = []

listProject.push(JSON.parse(localStorage.getItem("listProject")))
console.log(listProject)
function createProject(event){
    
    event.preventDefault();
    const nameData = document.getElementById("name").value;
    const startDate = document.getElementById("date-start").value;
    const endDate = document.getElementById("date-end").value;
    const descData = document.getElementById("desc").value;
    const choosenData = showChecked();
    const dataimg = document.getElementById('file').files;


    const imageData = URL.createObjectURL(dataimg[0]);
    

    let dataInsert = {
        name : nameData,
        datestart : startDate,
        dateend : endDate,
        datachoosen : [choosenData],
        datadesc : descData,
        imgData : imageData,
    }
    listProject.push(dataInsert);
    showBlog();
    const dataProject = JSON.stringify(listProject);
    localStorage.setItem("listProject",dataProject)
    // const projectData = JSON.parse(localStorage.getItem("listProject"))
    
    
    
    

    // const a = document.createElement('a');
    // a.href = 'mailto:'+emailData+'?subject='+subjectData+'&body='+msgData;
    // a.click();
}

function showBlog(){
    let newcontent = []
    listProject.forEach((x)=>{
        newcontent.push(`
        <div class="container-card">
            <div class="picture">
                <img class="image" src="${x.imgData}">
            </div>
            <div class="detail">
                <h1 class="poppins-bold"> <a href="project-detail.html" style="text-decoration-line: none; color: black;">${x.name}</a></h1>
                <p class="date-info poppins-medium">${dateDistance(x.datestart,x.dateend)} days project | author : Yudis Aqsha</p>
                <p class="textintro poppins-medium">
                    ${x.datadesc}
                </p>
                <p class="tech-used poppins-bold">Tech Used : ${x.datachoosen}</p>
                <button class="btn-action poppins-medium">Edit</button>
                // <button class="btn-action poppins-medium" onclick="deleteList()">Delete</button>
            </div>
        </div>
        `)
    })
    document.getElementById('content').innerHTML = newcontent;
   
}
function showChecked(){
    let checkboxes =
                document.getElementsByClassName('tech');
            let result = [];
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    result.push(checkboxes[i].value)
                }
            }
    return result;
}

function deleteList(index){
    if(index>0){
        listProject.splice(index,1)
    } else if (index==0) {
        listProject.pop()
    }
    
    showBlog()
}

function dateDistance(x,y){
    const first_date = new Date(x)
    const second_date = new Date(y);

    const firstMs = first_date.getTime()
    const secMs = second_date.getTime()

    const distance = secMs-firstMs

    const dayDiff = Math.round(distance/(24 * 60 * 60 * 1000))
    return dayDiff
}
