const express = require("express");
const app = express();
const port = 3000;
const hbs = require("hbs")
const path = require("path");
const fileUpload = require('express-fileupload');
const config = require("./config/config.json");
const { Sequelize, QueryTypes } = require("sequelize");
const sequelize = new Sequelize(config.development);



app.use(express.urlencoded({ extended: true }));

app.set("view engine", "hbs");

app.use('/js', express.static('js'))
app.use('/assets', express.static('assets'))
app.use('/css', express.static('css'))
app.use('/views', express.static('views'))
app.use('/upload', express.static('upload'))

app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({extended : true}))

app.get('/', home)

app.get('/project', project)
app.get('/form', form)
app.get('/review', review)
app.get('/project-edit/:id',editData)
app.get('/project-detail/:id',showProject)
app.post('/project-edit/:id', editProject)
app.post('/project',getInput)
app.post('/project-delete/:id', deleteData)




const listData =[]
async function home(req, res) {
  const query = "select * from project_list order by id desc"
  let listData = await sequelize.query(query, {type: QueryTypes.SELECT})
  listData = listData.map((x)=>({
    ...x
  }))
  res.render("index",{listData});
}

async function project(req, res) {
  const query = "select * from project_list order by id desc"
  let listData = await sequelize.query(query, {type: QueryTypes.SELECT})
  listData = listData.map((x)=>({
    ...x
  }))
  res.render("project", {listData});
}

function form(req, res) {
  res.render("form");
}

function review(req, res) {
  res.render("review");
}

function dataUpload(req,res){
  
  console.log(req.files.imageUpload)
}

async function getInput(req, res){
  const{title, datestart,dateend,desc, selectbox} = req.body
  const data_img = req.files.imageUpload;
  const pathUpload = __dirname + "/upload/" + data_img.name;
  data_img.mv(pathUpload)
  const imagename = data_img.name;

  const query = `insert into project_list(title,project_desc,selected,date_start,date_end,image_data) values ('${title}', '${desc}', '${selectbox}', '${datestart}', '${dateend}', '${imagename}')`
  await sequelize.query(query,{type:QueryTypes.INSERT})
 
  
  console.log(listData)
  res.redirect('/project')
}

async function editData(req,res){
  const {id} = req.params;
  const query = `select * from project_list where id=${id}`
  let data_project = await sequelize.query(query, {type: QueryTypes.SELECT})
  

  console.log(data_project)
  res.render('project-edit',{data_project:data_project[0]})
}

async function deleteData(req,res){
  const {id} =req.params
  const query = `delete from project_list where id=${id}`
  await sequelize.query(query,{type:QueryTypes.DELETE})

  res.redirect('/project')
}

async function showProject(req,res){
  const {id} = req.params
  const query = `select * from project_list where id=${id}`
  let data_project = await sequelize.query(query, {type: QueryTypes.SELECT})
  

  res.render('project-detail',{data_project:data_project[0]})
  
}
async function editProject(req,res){
  const {id} = req.params
  const{title, datestart,dateend,desc, selectbox} = req.body
  const data_img = req.files.imageUpload;
  const pathUpload = __dirname + "/upload/" + data_img.name;
  data_img.mv(pathUpload)
  const imagename = data_img.name;
  const query = `update project_list set title='${title}', project_desc='${desc}', selected='${selectbox}', date_start='${datestart}', date_end='${dateend}', image_data ='${imagename}' where id=${id}`
  await sequelize.query(query,{type:QueryTypes.UPDATE})

  res.redirect('/project')
}

hbs.registerHelper("data_distance", (x,y)=>{
  const first_date = new Date(x)
    const second_date = new Date(y);

    const firstMs = first_date.getTime()
    const secMs = second_date.getTime()

    const distance = secMs-firstMs

    const dayDiff = Math.round(distance/(24 * 60 * 60 * 1000))
    return dayDiff
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });