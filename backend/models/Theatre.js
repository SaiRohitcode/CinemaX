const mongoose = require("mongoose");

const theatreSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    googleMapsLink:{
        type:String,
        required:true
    },
    facilities:{
        type:[String],
        default:[]
    },
    rating:{
        type:Number,
        default:0
    },
    isActive:{
        type:Boolean,
        default:true
    }
},
{
    timestamps:true
});
module.exports = mongoose.model("Theatre", theatreSchema);