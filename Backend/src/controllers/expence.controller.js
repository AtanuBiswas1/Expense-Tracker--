import { ApiError } from "../utils/ApiError.js";
import { asyncHandaler } from "../utils/asyncHandaler.js";
import {Expense} from "../model/expence.model.js"
import { ApiResponce } from "../utils/ApiResponce.js";


//1.expence save in backend
const userExpenceSave= asyncHandaler(async (req,resp)=>{
    const {amount,date,category,description}=req.body;
    //console.log(req.body)
    if(amount==="" || date==="" || category==="" || description===""){
        console.log(new ApiError(400,"Must be fill all fild"));

    }
    //const user = await User.findById(req.user?._id);
    console.log(req.user?._id)
    const userExpenceCreate=await Expense.create({
        user:req.user?._id,
        amount,
        date,
        category,
        description,
    })
    const checkUserExpenceCreate=await Expense.findById(userExpenceCreate._id)
    if(!checkUserExpenceCreate){
        console.log(new ApiError(500,"server Error for add Expence of user"))
        return resp
        .status(500)
        .json(
            new ApiResponce(500," ","server Error for add Expence of user")
        )

    }
    //console.log("submitted")

    return resp
    .status(201)
    .json(
        new ApiResponce(200," ","successfully submitted")
    )

})




//2. all expence sent to frontend with pagination technique



export {userExpenceSave}