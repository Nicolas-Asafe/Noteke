import UserModel from "../models/user.model";
import Verify from 'verifybody'
import {ResponseType,buildResponse} from '../../utils/responses'
import { GenerateToken } from "../../utils/jwt.tools";
const verify = new Verify({});

//LEIA ISSO: 
/*
  Passo a passo para criar um metodo para o serviço de usuários
  
  1 - Primeiro: Na seção types crie um type com as credenciais do seu metodo,
  O nome do type precisa ficar assim: [NomeDoMetodo + UserType]

  2 - Segundo: Depois na seção de schemas crie um schema em
  relação com o seu type

  3 - terceiro: Crie seu metodo, nos parametros, coloque o paremetro (body), 
  o tipo dele será o seu type que você criou, o tipo de resposta do seu metodo é: Promise<ResponseType>
  quando você começar a criar seu metodo,coloque o seguinte codigo:

   async function Metodo(body:MetodoUserType): Promise<ResponseType>{
     verify.NewBody(MetodoUserSchema);
     const [err, result] = verify.VerifyIfIsCorrect(body);
     if (!result) return buildResponse(err, false);
    }

  você pode implementar sua lógica depois disso, mas não se esqueça que sempre você tem que usar
  buildResponse('Menssagem descritiva',statusDoMetodo que pode ser bom ou ruim, e se vc quiser dados)

  Exemplo:
    return buildResponse('Metodo funcionou',true,{userName:'João'})
*/


//types:
type CreateUserType = { NameUser: string; Password: string };
type DeleteUserType = { UserId: string; Password: string };
type LoginUserType = {NameUser:string,Password:string}

//schemas:
const createUserSchema = { NameUser: '', Password: '' };
const deleteUserSchema = { UserId: '', Password: '' };
const loginUserSchema = {NameUser:'',Password:''}
const nameSchema = { NameUser: '' };
const idSchema = { UserId: '' };


//Metodos do serviço de usuários:

//Cria um usuário
async function CreateUser(body: CreateUserType): Promise<ResponseType> {
    console.log("CreateUser was triggered");

    verify.NewBody(createUserSchema);
    const [err, result] = verify.VerifyIfIsCorrect(body);
    if (!result) return buildResponse(err, false);

    const [msg, userExists] = await GetOneUserByName({ NameUser: body.NameUser });
    if (userExists) return buildResponse('User already exists', false);

    try {
        const newUser = new UserModel({Name:body.NameUser,Password:body.Password});
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

// deleta um usuário
async function DeleteUser(body: DeleteUserType): Promise<ResponseType> {
    console.log("DeleteUser was triggered");

    verify.NewBody(deleteUserSchema);
    const [err, result] = verify.VerifyIfIsCorrect(body);
    if (!result) return buildResponse(err, false);

    const [msg, found, user] = await GetOneUserById({ UserId: body.UserId });
    if (!found) return buildResponse('User not exists', false);

    if (user.Password !== body.Password) {
        return buildResponse('Incorrect password', false);
    }

    try {
        await UserModel.deleteOne({ _id: body.UserId });
        return buildResponse('User deleted successfully', true);
    } catch (err: any) {
        return buildResponse(`Error deleting user: ${err.message || err}`, false);
    }
}

//Acha um usuário por nome
async function GetOneUserByName(body: { NameUser: string }): Promise<ResponseType> {
    console.log("GetOneUserByName was triggered");

    verify.NewBody(nameSchema);
    const [err, result] = verify.VerifyIfIsCorrect(body);
    if (!result) return buildResponse(err, false);

    try {
        const user = await UserModel.findOne({ Name: body.NameUser });
        if (!user) return buildResponse('User not found', false);
        return buildResponse('User found', true, user);
    } catch (err: any) {
        return buildResponse(`Error finding user: ${err.message || err}`, false);
    }
}

// Acha um usuário por id
async function GetOneUserById(body: { UserId: string }): Promise<ResponseType> {
    console.log("GetOneUserById was triggered");

    verify.NewBody(idSchema);
    const [err, result] = verify.VerifyIfIsCorrect(body);
    if (!result) return buildResponse(err, false);

    try {
        const user = await UserModel.findOne({ _id: body.UserId });
        if (!user) return buildResponse('User not found', false);
        return buildResponse('User found', true, user);
    } catch (err: any) {
        return buildResponse(`Error finding user: ${err.message || err}`, false);
    }
}

async function GetAuthOfUser(body:LoginUserType):Promise <ResponseType>{
    verify.NewBody(loginUserSchema)
    const [err,result] = verify.VerifyIfIsCorrect(body)
    if(!result) return buildResponse(err,result)

    const [_,UserExists,User] = await GetOneUserByName({NameUser:body.NameUser})

    if(!User) return buildResponse('User not exists',false)
    if(User.Password !== body.Password) return buildResponse('The password is incorrect',false)

    const [msg,res,token] = GenerateToken(User._id)

    return buildResponse(msg,res,token)
}



export { CreateUserType,CreateUser, GetUsers, GetOneUserByName, GetOneUserById, DeleteUser,GetAuthOfUser };
