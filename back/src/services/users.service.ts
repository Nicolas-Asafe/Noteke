import { Verify } from "verifybody";
import UserModel from "../models/user.model";
import {ResponseType,buildResponse} from '../../utils/responses'

const verify = new Verify({});


type CreateUserType = { NameUser: string; Password: string };
type DeleteUserType = { UserId: string; Password: string };


const createUserSchema = { NameUser: '', Password: '' };
const deleteUserSchema = { UserId: '', Password: '' };
const nameSchema = { NameUser: '' };
const idSchema = { UserId: '' };


async function CreateUser(body: CreateUserType): Promise<ResponseType> {
    console.log("CreateUser was triggered");

    verify.NewBody(createUserSchema);
    const [err, result] = verify.VerifyIfIsCorrect(body);
    if (!result) return buildResponse(err, false);

    const [msg, userExists] = await GetOneUserByName({ NameUser: body.NameUser });
    if (userExists) return buildResponse('User already exists', false);

    try {
        const newUser = new UserModel(body);
        await newUser.save();
        return buildResponse('User created successfully', true);
    } catch (err: any) {
        return buildResponse(`Error creating user: ${err.message || err}`, false);
    }
}

async function GetUsers(): Promise<ResponseType> {
    console.log("GetUsers was triggered");

    try {
        const users = await UserModel.find();
        return buildResponse('Users listed successfully', true, users);
    } catch (err: any) {
        return buildResponse(`Error listing users: ${err.message || err}`, false);
    }
}

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

async function GetOneUserByName(body: { NameUser: string }): Promise<ResponseType> {
    console.log("GetOneUserByName was triggered");

    verify.NewBody(nameSchema);
    const [err, result] = verify.VerifyIfIsCorrect(body);
    if (!result) return buildResponse(err, false);

    try {
        const user = await UserModel.findOne({ NameUser: body.NameUser });
        if (!user) return buildResponse('User not found', false);
        return buildResponse('User found', true, user);
    } catch (err: any) {
        return buildResponse(`Error finding user: ${err.message || err}`, false);
    }
}

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

export { CreateUser, GetUsers, GetOneUserByName, GetOneUserById, DeleteUser };
