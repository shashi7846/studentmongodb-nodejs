const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb");
const URL =   "mongodb+srv://shashikanth:user123@cluster0.pviae.mongodb.net?retryWrites=true&w=majority";
const DB = "studentmongodb";
const bcrypt = require("bcryptjs");
app.use(cors());
app.use(express.json());

// now mongo will automatically create an ID right so thats why comented this getting ID part

let students = [];
app.get("/students", async function (req, res) {
  try {
    let connection = await mongodb.connect(URL);
    let db = connection.db(DB);
    let students = await db.collection("students").find().toArray();
    await connection.close();
    res.json(students);
  } catch (error) {
    console.log(erroe);
  }
});

app.post("/register", async function (req, res) {
  try {
    let connection = await mongodb.connect(URL);
    let db = connection.db(DB);
    let isEmailUnique = await db.collection("users").findOne({email:req.body.email});
    if(isEmailUnique){
      res.status(401).json({
        message:"Email already exists"
      })
    }else{
    //Genereate a salt
    let salt = await bcrypt.genSalt(10);
    //Hash the password with salt
    let hash = await bcrypt.hash(req.body.password, salt);

    //store it in DB
    req.body.password = hash;

    let users = await db.collection("users").insertOne(req.body);
    await connection.close();
    res.json({
      message: "User Registerd",
    })
  }
  } catch (error) {}
});

// app.post("/login", async function (req, res) {

//   try {

//     let connection = await mongodb.connect(URL);

//     let db = connection.db(DB);

//     //Find the user with email

//     let user = await db.collection("users").findOne({ email: req.body.email })

//     //hash the password

//     if (user) {

//       let isPassword = await bcrypt.compare(res.body.password , user.password)

//       if (isPassword) {

//         res.json({

//           message: "Allow"
//         })
//       } else {
//         res.status(404).json({
//           message: "email or password is incorrect"
//         })
//       }
//     } else {

//       res.status(404).json({

//         message: "Email or Password is InCorrect"
//       })
//     }
//   } catch (error) {
//     console.log(error)
//   }
// })

app.post("/login",async function(req,res){
  try {
      let connection = await mongodb.connect(URL);
      let db = connection.db(DB);

      let user=await db.collection("users").findOne({email : req.body.email})

      if(user){
          let isPassword=await bcrypt.compare(req.body.password,user.password);
          if(isPassword){
              res.json({
                  message:"allow"
              })
          }else{
              res.status(404).json({
                  message:"Email or password is incorrect"
              })
          }
      }else{
          res.status(404).json({
              message:"Email or password is incorrect"
          })
      }
  } catch (error) {
      
  }
})

app.post("/student", async function (req, res) {
  // req.body.id = students.length + 1;
  // students.push(req.body);
  // steps
  try {
    //1.connect to db server

    let connection = await mongodb.connect(URL);

    //2.select the particular db
    let db = connection.db(DB);

    //3.do crud operation
    await db.collection("students").insertOne(req.body);

    //4. close the connection
    await connection.close();
    res.json({
      message: "Student Created",
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/student/:id", async function (req, res) {
  try {
    let connection = await mongodb.connect(URL);
    let db = connection.db(DB);
    let student = await db
      .collection("students")
      .findOne({ _id: mongodb.ObjectID(req.params.id) });
    await connection.close();
    res.json(student);
  } catch (error) {
    console.log(error);
  }
});

app.put("/student/:id", async function (req, res) {
  try {
    let connection = await mongodb.connect(URL);
    let db = connection.db(DB);
    await db
      .collection("students")
      .updateOne({ _id: mongodb.ObjectID(req.params.id) }, { $set: req.body });
    await connection.close();
    res.json({
      message: "User UPdated",
    });
  } catch (error) {
    console.log(error);
  }
});

app.delete("/student/:id", async function (req, res) {
  try {
    let connection = await mongodb.connect(URL);
    let db = connection.db(DB);
    await db
      .collection("students")
      .deleteOne({ _id: mongodb.ObjectID(req.params.id) });
    await connection.close();
    res.json({
      message: "deleted",
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/dashboard",function(req,res){
  res.json({
    message:"Secure data"
  })
})

app.listen(process.env.PORT || 3000);
