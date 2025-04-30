import UserModel from "../models/user.model";
import {Verify} from '../../utils/verifybody'
import bcrypt from 'bcrypt';

import { ResponseType, buildResponse } from '../../utils/responses';
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

// Create a new user
async function CreateUser(body: CreateUserType): Promise<ResponseType> {
    console.log(`[CreateUser] Triggered with data: ${JSON.stringify(body)}`);

    verify.NewBody(createUserSchema);
    const [err, result] = verify.VerifyIfIsCorrect(body);
    if (!result) {
        console.warn(`[CreateUser] Validation failed: ${err}`);
        return buildResponse(err, false);
    }

    const userExists = await UserModel.findOne({ Name: body.NameUser });
    if (userExists) {
        console.warn(`[CreateUser] User already exists: ${body.NameUser}`);
        return buildResponse('User already exists', false);
    }

    try {
        const saltRounds = 10;
        const passwordWithHash = await bcrypt.hash(body.Password, saltRounds);
        const newUser = new UserModel({ Name: body.NameUser, Password: passwordWithHash });

        await newUser.save();
        console.log(`[CreateUser] User created successfully: ${body.NameUser}`);
        return buildResponse('User created successfully', true);
    } catch (err: any) {
        console.error(`[CreateUser] Error saving user:`, err);
        return buildResponse(`Error creating user: ${err.message || err}`, false);
    }
}

// Get all users
async function GetUsers(): Promise<ResponseType> {
    console.log(`[GetUsers] Fetching all users`);

    try {
        const users = await UserModel.find();
        console.log(`[GetUsers] Found ${users.length} user(s)`);
        return buildResponse('Users listed successfully', true, users);
    } catch (err: any) {
        console.error(`[GetUsers] Error fetching users:`, err);
        return buildResponse(`Error listing users: ${err.message || err}`, false);
    }
}

// Delete user by ID
async function DeleteUser(body: DeleteUserType, id: string): Promise<ResponseType> {
    console.log(`[DeleteUser] Attempting to delete user with ID: ${id}`);

    verify.NewBody(deleteUserSchema);
    const [err, result] = verify.VerifyIfIsCorrect(body);
    if (!result) {
        console.warn(`[DeleteUser] Validation failed: ${err}`);
        return buildResponse(err, false);
    }

    if (!id) {
        console.warn(`[DeleteUser] No user ID provided`);
        return buildResponse('You don\'t have a user ID', false);
    }

    const User = await UserModel.findById(id);
    if (!User) {
        console.warn(`[DeleteUser] User not found with ID: ${id}`);
        return buildResponse('User not exists', false);
    }

    const isMatch = await bcrypt.compare(body.Password, User.Password);
    if (!isMatch) {
        console.warn(`[DeleteUser] Incorrect password for user ID: ${id}`);
        return buildResponse('Incorrect password', false);
    }

    try {
        await UserModel.deleteOne({ _id: id });
        console.log(`[DeleteUser] User deleted successfully: ${id}`);
        return buildResponse('User deleted successfully', true);
    } catch (err: any) {
        console.error(`[DeleteUser] Error deleting user:`, err);
        return buildResponse(`Error deleting user: ${err.message || err}`, false);
    }
}

// Authenticate user and generate JWT
async function GetAuthOfUser(body: LoginUserType): Promise<ResponseType> {
    console.log(`[GetAuthOfUser] Login attempt for: ${body.NameUser}`);

    verify.NewBody(loginUserSchema);
    const [err, result] = verify.VerifyIfIsCorrect(body);
    if (!result) {
        console.warn(`[GetAuthOfUser] Validation failed: ${err}`);
        return buildResponse(err, false);
    }

    const User = await UserModel.findOne({ Name: body.NameUser });
    if (!User) {
        console.warn(`[GetAuthOfUser] User not found: ${body.NameUser}`);
        return buildResponse('User not exists', false);
    }

    const isMatch = await bcrypt.compare(body.Password, User.Password);
    if (!isMatch) {
        console.warn(`[GetAuthOfUser] Incorrect password for user: ${body.NameUser}`);
        return buildResponse('Incorrect password', false);
    }

    const [msg, res, token] = GenerateToken(User._id);
    console.log(`[GetAuthOfUser] User authenticated successfully: ${body.NameUser}`);

    return buildResponse(msg, res, token);
}

export { CreateUserType, CreateUser, GetUsers, DeleteUser, GetAuthOfUser };
