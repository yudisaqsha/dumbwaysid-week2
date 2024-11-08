const express = require("express");
const app = express();
const port = 3000;
const hbs = require("hbs");
const path = require("path");
const fileUpload = require("express-fileupload");
const config = require("./config/config");
const { Sequelize, QueryTypes } = require("sequelize");
const flash = require("express-flash");
const session = require("express-session");
const bcrypt = require("bcrypt")

require("dotenv").config()
// const environment = process.env.NODE_ENV
const sequelize = new Sequelize(config.production);
// const sequelize = new Sequelize(config.development);
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "hbs");

app.use("/js", express.static("js"));
app.use("/assets", express.static("assets"));
app.use("/css", express.static("css"));
app.use("/views", express.static("views"));
app.use("/upload", express.static("upload"));

app.use(flash());
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: "thissession",
    secret: "thissessionissecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 12 //12 jam
    },
  })
);


app.get("/", home);

app.get("/project", project);
app.get("/form", form);
app.get("/review", review);
app.get("/login", login);
app.get("/register", register);
app.get("/project-edit/:id", editData);
app.get("/project-detail/:id", showProject);
app.post("/project-edit/:id", editProject);
app.post("/project", getInput);
app.post("/project-delete/:id", deleteData);
app.post("/login", getLogin);
app.post("/logout", endSession)
app.post("/register", getRegister);

const listData = [];
async function home(req, res) {
  const user = req.session.user;
  const query = "select project_list.*,users.username from project_list inner join users on project_list.author_id = users.id order by id desc";
  let listData = await sequelize.query(query, { type: QueryTypes.SELECT });
  
  res.render("index", { listData, user });
}

async function project(req, res) {
  const user = req.session.user
  let listData =[]
  if(!user){
    const query = "select project_list.*,users.username from project_list inner join users on project_list.author_id = users.id order by id desc";
    listData = await sequelize.query(query, { type: QueryTypes.SELECT });
  } else {
    const query = `select project_list.*,users.username from project_list inner join users on project_list.author_id = users.id where users.id = '${user.id}' order by id desc`;
    listData = await sequelize.query(query, { type: QueryTypes.SELECT });
  }
  
  res.render("project", { listData,user });
}

function form(req, res) {
  const user = req.session.user
  res.render("form",{user});
}

function review(req, res) {
  const user = req.session.user
  res.render("review",{user});
}

function login(req, res) {
  const user = req.session.user
  if(user){
    return res.redirect('/')
  }
  res.render("login");
}
function register(req, res) {
  const user = req.session.user
  if(user){
    return res.redirect('/')
  }
  res.render("register");
}

async function getLogin(req, res) {
  const { email, password } = req.body;
  
  const query = `select * from users where email = '${email}'`;
  const logindata = await sequelize.query(query, { type: QueryTypes.SELECT });
  console.log(logindata);
  if (!logindata.length) {
    req.flash("error", "Email / password salah");
    return res.redirect("/login");
  }
  const passwordCheck = await bcrypt.compare(password, logindata[0].pw_user)
  if(!passwordCheck){
    console.log(passwordCheck)
    console.log(logindata[0])
    req.flash("error", "Email / password salah!");
    return res.redirect('/login')
  }
  
  req.session.user = logindata[0]
  req.flash("success", "Login Berhasil")
  res.redirect("/");
}

async function getRegister(req, res) {
  const { username, email, password } = req.body;
  const salt = 10
  const secretPassword = await bcrypt.hash(password, salt)
  let query = `select * from users where username = '${username}' and email = '${email}'`;
  const usercheck = await sequelize.query(query, { type: QueryTypes.SELECT });
  if (usercheck.length > 0) {
    req.flash("error","Email / username sudah digunakan");
    return res.redirect("/register");
  }

  query = `insert into users(username, email, pw_user) values('${username}','${email}','${secretPassword}')`;
  await sequelize.query(query, { type: QueryTypes.INSERT });
  req.flash("success", "Berhasil Register")
  res.redirect("/login");
}

async function getInput(req, res) {
  
  const { title, datestart, dateend, desc, selectbox } = req.body;
  const {id} = req.session.user
  const allowedFile = ["image/png", "image/jpeg"];
  const data_img = req.files.imageUpload;
  data_img.name = dateFormat() +'_'+data_img.name;
  const allowedFormat = allowedFile.find((x) => {
    return x == data_img.mimetype;
  });
  if (!allowedFormat) {
    req.flash("error","format tidak sesuai");
    return res.redirect("/project");
  }
  const pathUpload = __dirname + "/upload/" + data_img.name;
  data_img.mv(pathUpload);

  const imagename = data_img.name;

  const query = `insert into project_list(title,project_desc,selected,date_start,date_end,image_data,author_id) values ('${title}', '${desc}', '${selectbox}', '${datestart}', '${dateend}', '${imagename}' ,'${id}')`;
  await sequelize.query(query, { type: QueryTypes.INSERT });

  console.log(listData);
  req.flash("success", "Data berhasil ditambahkan")
  res.redirect("/project");
}

async function editData(req, res) {
  const user = req.session.user
  if(!user){
    return res.redirect('/login')
  }
  const { id } = req.params;
  const query = `select * from project_list where id=${id}`;
  let data_project = await sequelize.query(query, { type: QueryTypes.SELECT });
  console.log(data_project.author_id)
  console.log(user.id)
  if(data_project[0].author_id!=user.id){
    return res.redirect('/project')
  }
  

  console.log(data_project);
  res.render("project-edit", { data_project: data_project[0], user });
}

async function deleteData(req, res) {
  const { id } = req.params;
  const query = `delete from project_list where id=${id}`;
  await sequelize.query(query, { type: QueryTypes.DELETE });

  res.redirect("/project");
}

async function showProject(req, res) {
  const user = req.session.user

  const { id } = req.params;
  const query = `select project_list.*,users.username from project_list inner join users on project_list.author_id = users.id where project_list.id =${id} order by id desc`;
  let data_project = await sequelize.query(query, { type: QueryTypes.SELECT });

  res.render("project-detail", { data_project: data_project[0], user });
}
async function editProject(req, res) {
  const { id } = req.params;
  const { title, datestart, dateend, desc, selectbox } = req.body;
  const allowedFile = ["image/png", "image/jpeg"];
  const data_img = req.files.imageUpload;
  data_img.name = dateFormat() +'_'+data_img.name;
  const allowedFormat = allowedFile.find((x) => {
    return x == data_img.mimetype;
  });
  if (!allowedFormat) {
    req.flash("error","format tidak sesuai (JPG/PNG)");
    return res.redirect(`/project-edit/${id}`);
  }
  const pathUpload = __dirname + "/upload/" + data_img.name;
  data_img.mv(pathUpload);

  const imagename = data_img.name;
  const query = `update project_list set title='${title}', project_desc='${desc}', selected='${selectbox}', date_start='${datestart}', date_end='${dateend}', image_data ='${imagename}' where id=${id}`;
  await sequelize.query(query, { type: QueryTypes.UPDATE });
  req.flash("success", "Data Berhasil diubah")
  res.redirect("/project");
}

function endSession(req,res){
  req.session.destroy((err) => {
    if (err) return console.error(err);
    res.redirect("/");
  });
}

function dateFormat() {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();
  let hh = today.getHours();
  let minutes = today.getMinutes();
  let ss = today.getSeconds();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return (formattedToday = dd + mm + yyyy + "_" + hh + minutes + ss);
}
hbs.registerHelper("data_distance", (x, y) => {
  const first_date = new Date(x);
  const second_date = new Date(y);

  const firstMs = first_date.getTime();
  const secMs = second_date.getTime();

  const distance = secMs - firstMs;

  const dayDiff = Math.round(distance / (24 * 60 * 60 * 1000));
  return dayDiff;
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
