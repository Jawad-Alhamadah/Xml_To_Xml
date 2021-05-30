const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const SaveFiles_Schema=new Schema({
    Name:{type:String,required:true},
    Content:{type:String,required:true},
    listOfTags:{type:Array,required:true}
},{timestamps:true});

const OutPutFile=mongoose.model("OutPutFile",SaveFiles_Schema)
module.exports=OutPutFile;