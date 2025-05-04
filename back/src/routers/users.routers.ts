import { Control_createUser, Control_listUsers, Control_deleteUser, Control_getAuth } from "../controllers/users.controllers";
import { Router } from "express";
import UserModel from "../models/user.model";
import { middleware } from "../../utils/jwt.tools";

const UserRouter = Router();

UserRouter.get('/Users', Control_listUsers);
UserRouter.get('/Person',middleware,async (req:any,res:any)=>{
    const user:any = await UserModel.find({_id:req.id})
    user?
        res.status(200).json({ message: 'User listed succesfully', status: true, user:{Name:user.Name,Orgs:user.Orgs} }):
        res.status(404).json({ message: 'error for get user', status: false});

})
UserRouter.post('/NewUser', Control_createUser);
UserRouter.post('/Login', Control_getAuth);
UserRouter.delete('/DeleteUser', middleware, Control_deleteUser);

export default UserRouter;
