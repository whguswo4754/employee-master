// Since not many routes are there. Hence, I will be putting all the routes and the database parameters in this controller.js file

// requiring objectId from mongodb which is used later for updating the database

var objectId = require('mongodb').ObjectID;


// requiring body-parser which lets us use req.body coming from form inputs and for saving it to database

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });



//requiring mongoose for easy and efficient interaction with mongodb
var mongoose = require('mongoose');




//connecting with the cloud mongodb.Atlas database  
mongoose.connect('mongodb+srv://shoaib:shoaib@cluster0-hgnzq.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser: true})




// defining the schema which will be used to save the data
var employeeSchema =new mongoose.Schema({
    name: String,
    email: String,
    location: String,
    phone: Number,
    title: String,
    address: String,
    age: Number,
    gender: String,
    salary: Number
})



//defining model
var employeeModel = mongoose.model('addEmployee', employeeSchema);




module.exports = (app)=>{
    
    
//Route for home    
    app.get('/', (req,res)=>{
        employeeModel.find({},function(err,data){
            if(err) throw err;
            res.render('index', {employee : data});
        }) 
    });
    
    
//Post request for adding employee
    app.post('/', urlencodedParser, (req,res)=>{
          var newEmployee = employeeModel(req.body).save(function(err,data){
            if(err) throw err;
              res.redirect('/')
        })
    })
    
    

    
//Route for specific employee    
    app.get('/:_id',(req,res)=>{
        
        employeeModel.find({_id: req.params._id},(err,data)=>{
            
        res.render('employee', {employee: data});    
                      })
        
    });
    
//deleting employee by matching its id on the database    
    app.delete('/:_id',(req,res)=>{
        
        employeeModel.find({_id: req.params._id}).deleteOne((err,data)=>{
            if(err) throw err;
            res.json(data)
        })
        
    });
    
    
//updating the employee's fields    
    app.post('/:_id',urlencodedParser,(req,res)=>{
        
        
        var item = {
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            address: req.body.address,
            phone: req.body.phone,
            title: req.body.title,
            salary: req.body.salary,
        }
        var id = req.params._id;
        
        employeeModel.updateOne( {"_id": objectId(id)},{$set: item},(err,data)=>{
            if(err) throw err;
            res.redirect('back')
        })
        
    });
    
};
