const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const todoSchema=new Schema({
    task:{type:String,required:true,trim:true},// trim use to 
    deadLine:{type:Date},
    Status:{type:String,
        enum:["pending","in_progress","completed"],
        default:"pending"
    }
});

const todoModel=mongoose.model("todoModel",todoSchema);

module.exports={todoModel}
