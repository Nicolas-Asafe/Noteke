import { Control_createUser, Control_listUsers, Control_deleteUser, Control_getAuth } from "../controllers/users.controllers";
import { Router } from "express";
import { middleware } from "../../utils/jwt.tools";

const UserRouter = Router();

UserRouter.get('/Users', Control_listUsers);
UserRouter.post('/NewUser', Control_createUser);
UserRouter.post('/Login', Control_getAuth);
UserRouter.delete('/DeleteUser', middleware, Control_deleteUser);

export default UserRouter;
