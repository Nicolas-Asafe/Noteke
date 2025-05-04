import { Control_createUser, Control_listUsers, Control_deleteUser, Control_getAuth } from "../controllers/users.controllers";
import { Router } from "express";
import UserModel from "../models/user.model";
import { middleware } from "../../utils/jwt.tools";

const UserRouter = Router();

UserRouter.get('/Users', Control_listUsers);
UserRouter.get('/Person', middleware, async (req: any, res: any) => {
    try {
      const user = await UserModel.findById(req.id);
  
      if (user) {
        res.status(200).json({
          message: 'User listed successfully',
          status: true,
          user: {
            Name: user.Name,
            Orgs: user.Orgs
          }
        });
      } else {
        res.status(404).json({ message: 'User not found', status: false });
      }
    } catch (err:any) {
      res.status(500).json({ message: 'Server error', status: false, error: err.message });
    }
  });
  
UserRouter.post('/NewUser', Control_createUser);
UserRouter.post('/Login', Control_getAuth);
UserRouter.delete('/DeleteUser', middleware, Control_deleteUser);

export default UserRouter;
