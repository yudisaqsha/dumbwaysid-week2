const listProject = [
    {
        name : 'This is a new project',
        datestart : '2024/11/30',
        dateend : `2025/12/25`,
        datachoosen : ['Node JS', 'ReactJS'],
        datadesc : 'Hellow Guys',
        imgData : './assets/IMG_2043.JPG',
    },
    {
        name : 'This is a new project',
        datestart : '2024/11/30',
        dateend : `2024/12/25`,
        datachoosen : ['Node JS', 'ReactJS'],
        datadesc : 'Hellow Guys',
        imgData : './assets/IMG_2043.JPG',
    },
    {
        name : 'This is a new project',
        datestart : '2023/11/30',
        dateend : `2024/12/25`,
        datachoosen : ['Node JS', 'ReactJS'],
        datadesc : 'Hellow Guys',
        imgData : './assets/IMG_2043.JPG',
    },
]
showBlog(listProject)
console.log(localStorage.getItem("listProject"))
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
    
    const dataProject = JSON.stringify(listProject);
    localStorage.setItem("listProject",dataProject)
    const projectData = JSON.parse(localStorage.getItem("listProject"))
    
    showBlog(projectData)
    
    

    // const a = document.createElement('a');
    // a.href = 'mailto:'+emailData+'?subject='+subjectData+'&body='+msgData;
    // a.click();
}

function showBlog(data_array){
    let newcontent = []
    data_array.forEach((x)=>{
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
