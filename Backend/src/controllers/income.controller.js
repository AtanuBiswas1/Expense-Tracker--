import { ApiError } from "../utils/ApiError.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import { asyncHandaler } from "../utils/asyncHandaler.js";
import {Budget} from "../model/budget.model.js"


const userIncomeSave= asyncHandaler(async (req,resp)=>{
    const {amount,category}=req.body;
    console.log(req.body)
    if(amount===""|| category===""){
        console.log(new ApiError(400,"Must be fill all fild"));

    }
    //const user = await User.findById(req.user?._id);
    console.log(req.user?._id)
    const userExpenceCreate=await Budget.create({
        user:req.user?._id,
        amount,
        category,
    })
    const checkUserIncomeCreate=await Budget.findById(userExpenceCreate._id)
    if(!checkUserIncomeCreate){
        console.log(new ApiError(500,"server Error for add Income of user"))
        return resp
        .status(500)
        .json(
            new ApiResponce(500," ","server Error for add Incoe of user")
        )

    }
    //console.log("submitted")

    return resp
    .status(201)
    .json(
        new ApiResponce(200," ","successfully submitted")
    )

})




//2. all Income sent to frontend with pagination technique



export {userIncomeSave}