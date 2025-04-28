import UserModel from "../models/user.model";
import Verify from 'verifybody'
import { ResponseType, buildResponse } from '../../utils/responses'
import { GenerateToken } from "../../utils/jwt.tools";

const verify = new Verify({});

// Types
type CreateUserType = { NameUser: string; Password: string };
type DeleteUserType = { Password: string };
type LoginUserType = { NameUser: string; Password: string };

// Schemas
const createUserSchema = { NameUser: '', Password: '' };
const deleteUserSchema = { Password: '' };
const loginUserSchema = { NameUser: '', Password: '' };
const nameSchema = { NameUser: '' };
const idSchema = { UserId: '' };

// Métodos do serviço de usuários:

// Cria um usuário
async function CreateUser(body: CreateUserType): Promise<ResponseType> {
    console.log("CreateUser was triggered");

    verify.NewBody(createUserSchema);
    const [err, result] = verify.VerifyIfIsCorrect(body);
    if (!result) return buildResponse(err, false);

    const userExists = await UserModel.findOne({ Name: body.NameUser });
    if (userExists) return buildResponse('User already exists', false);

    try {
        const newUser = new UserModel({ Name: body.NameUser, Password: body.Password });
        await newUser.save();
        return buildResponse('User created successfully', true);
    } catch (err: any) {
        return buildResponse(`Error creating user: ${err.message || err}`, false);
    }
}

// Retorna todos os usuários
async function GetUsers(): Promise<ResponseType> {
    console.log("GetUsers was triggered");

    try {
        const users = await UserModel.find();
        return buildResponse('Users listed successfully', true, users);
    } catch (err: any) {
        return buildResponse(`Error listing users: ${err.message || err}`, false);
    }
}

// Deleta um usuário
async function DeleteUser(body: DeleteUserType, id: string): Promise<ResponseType> {
    console.log("DeleteUser was triggered");


    verify.NewBody(deleteUserSchema);
    const [err, result] = verify.VerifyIfIsCorrect(body);
    if (!result) return buildResponse(err, false);


    const User = await UserModel.findOne({_id:id});
    if (!User) return buildResponse('User not exists', false);


    if (User.Password !== body.Password) {
        return buildResponse('Incorrect password', false);
    }


    try {
        await UserModel.deleteOne({ _id: id }); 
        return buildResponse('User deleted successfully', true);
    } catch (err: any) {
        return buildResponse(`Error deleting user: ${err.message || err}`, false);
    }
}



// Autenticação de usuário
async function GetAuthOfUser(body: LoginUserType): Promise<ResponseType> {
    verify.NewBody(loginUserSchema);
    const [err, result] = verify.VerifyIfIsCorrect(body);
    if (!result) return buildResponse(err, result);

    const User = await UserModel.findOne({ Name: body.NameUser });

    if (!User) return buildResponse('User not exists', false);
    if (User.Password !== body.Password) return buildResponse('The password is incorrect', false);

    const [msg, res, token] = GenerateToken(User._id);

    return buildResponse(msg, res, token);
}

export { CreateUserType, CreateUser, GetUsers, DeleteUser, GetAuthOfUser };
