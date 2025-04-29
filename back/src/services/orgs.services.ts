import UserModel from "../models/user.model";
import Verify from 'verifybody';
import { buildResponse, ResponseType } from "../../utils/responses";
import crypto from "crypto";

const verify = new Verify();

// Types
type OrgNoteType = { Name: string, Description: string };

type BodyNewOrgType = { Body: OrgNoteType, Type: 'Note' };
type BodyEditOrgType = { Body: OrgNoteType, OrgId: string }

// Schemas
const OrgNoteSchema = {
    Name: '',
    Description: '',
};

// Cria um org
async function FromOrg_NewOrg(ParamBody: BodyNewOrgType, UserId: string): Promise<ResponseType> {
    console.log(`[FromOrg_NewOrg] Start processing request to create new organization for UserId: ${UserId}`);

    if (!ParamBody?.Body) {
        console.warn(`[FromOrg_NewOrg] Missing "Body" in request payload`);
        return buildResponse('Field "Body" is required.', false);
    }
    if (!ParamBody?.Type) {
        console.warn(`[FromOrg_NewOrg] Missing "Type" in request payload`);
        return buildResponse('Field "Type" is required.', false);
    }

    const validTypes = ['Note'];
    if (!validTypes.includes(ParamBody.Type)) {
        console.warn(`[FromOrg_NewOrg] Invalid organization type provided: ${ParamBody.Type}`);
        return buildResponse(`Invalid organization type: ${ParamBody.Type}`, false);
    }

    const User = await UserModel.findById(UserId);
    if (!User) {
        console.error(`[FromOrg_NewOrg] No user found with ID: ${UserId}`);
        return buildResponse(`User not found with ID: ${UserId}`, false);
    }

    const OrgNameExists = User.Orgs.find(o => o.Name === ParamBody.Body.Name);
    if (OrgNameExists) {
        console.warn(`[FromOrg_NewOrg] Duplicate organization name attempted: "${ParamBody.Body.Name}"`);
        return buildResponse(`Organization name "${ParamBody.Body.Name}" already exists. Please choose another.`, false);
    }

    verify.NewBody(OrgNoteSchema);
    const [msg, result] = verify.VerifyIfIsCorrect(ParamBody.Body);
    if (!result) {
        console.warn(`[FromOrg_NewOrg] Validation failed for organization body: ${msg}`);
        return buildResponse(`Validation error: ${msg}`, false);
    }

    const newOrgId = crypto.randomUUID();
    User.Orgs.push({
        Name: ParamBody.Body.Name,
        Description: ParamBody.Body.Description,
        TypeOrg: ParamBody.Type,
        Id: newOrgId
    });

    await User.save();

    console.log(`[FromOrg_NewOrg] Successfully created organization "${ParamBody.Body.Name}" with ID: ${newOrgId} for user ${UserId}`);
    return buildResponse(`Organization "${ParamBody.Body.Name}" created successfully.`, true);
}

// Lista os orgs do usuário
async function FromOrg_ListMyOrgs(UserId: string): Promise<ResponseType> {
    console.log(`[FromOrg_ListMyOrgs] Listing organizations for UserId: ${UserId}`);

    const User = await UserModel.findById(UserId);
    if (!User) {
        console.error(`[FromOrg_ListMyOrgs] User not found with ID: ${UserId}`);
        return buildResponse(`User not found with ID: ${UserId}`, false);
    }

    if (!User.Orgs || User.Orgs.length === 0) {
        console.log(`[FromOrg_ListMyOrgs] No organizations found for user ${UserId}`);
        return buildResponse(`No organizations found.`, true, []);
    }

    console.log(`[FromOrg_ListMyOrgs] Retrieved ${User.Orgs.length} organizations for user ${UserId}`);
    return buildResponse('Organizations retrieved successfully.', true, User.Orgs);
}

//Deleta org por id
async function FromOrg_DeleteOrg(UserId: string, OrgId: { id: string }): Promise<ResponseType> {
    console.log(`[FromOrg_DeleteOrg] Request to delete organization with ID: ${OrgId.id} for UserId: ${UserId}`);

    const User = await UserModel.findById(UserId);
    if (!User) {
        console.error(`[FromOrg_DeleteOrg] User not found with ID: ${UserId}`);
        return buildResponse(`User not found with ID: ${UserId}`, false);
    }

    const orgIndex = User.Orgs.findIndex(o => o.Id === OrgId.id);
    if (orgIndex === -1) {
        console.warn(`[FromOrg_DeleteOrg] Organization with ID ${OrgId.id} not found for user ${UserId}`);
        return buildResponse(`Organization not found with ID: ${OrgId.id}`, false);
    }

    const deletedOrg = User.Orgs[orgIndex];
    User.Orgs.splice(orgIndex, 1);
    await User.save();

    console.log(`[FromOrg_DeleteOrg] Successfully deleted organization "${deletedOrg.Name}" (ID: ${OrgId.id}) for user ${UserId}`);
    return buildResponse(`Organization "${deletedOrg.Name}" deleted successfully.`, true);
}



async function FromOrg_EditOrg(UserId: string, ParamBody: BodyEditOrgType): Promise<ResponseType> {
    console.log(`[FromOrg_EditOrg] Start editing org with ID: ${ParamBody.OrgId} for UserId: ${UserId}`);

    if (!ParamBody?.Body || !ParamBody?.OrgId) {
        return buildResponse('Missing required fields "Body" or "OrgId".', false);
    }

    const allowedFields = ['Name', 'Description'];
    const unknownFields = Object.keys(ParamBody.Body).filter(
        key => !allowedFields.includes(key)
    );
    if (unknownFields.length > 0) {
        return buildResponse(`Unknown fields in Body: ${unknownFields.join(', ')}`, false);
    }

    const User = await UserModel.findById(UserId);
    if (!User) return buildResponse(`User not found with ID: ${UserId}`, false);

    const orgIndex = User.Orgs.findIndex(o => o.Id === ParamBody.OrgId);
    if (orgIndex === -1) return buildResponse(`Organization not found with ID: ${ParamBody.OrgId}`, false);

    const currentOrg = User.Orgs[orgIndex];

    if ('Name' in ParamBody.Body && ParamBody.Body.Name) {
        const nameExists = User.Orgs.some(
            (o, index) => o.Name === ParamBody.Body.Name && index !== orgIndex
        );
        if (nameExists) return buildResponse(`Another organization already uses the name "${ParamBody.Body.Name}"`, false);

        currentOrg.Name = ParamBody.Body.Name;
    }

    if ('Description' in ParamBody.Body && ParamBody.Body.Description) {
        currentOrg.Description = ParamBody.Body.Description;
    }

    await User.save();

    console.log(`[FromOrg_EditOrg] Org "${ParamBody.OrgId}" edited successfully for user ${UserId}`);
    return buildResponse(`Organization "${currentOrg.Name}" updated successfully.`, true);
}



export { FromOrg_NewOrg, FromOrg_ListMyOrgs, FromOrg_DeleteOrg, FromOrg_EditOrg };
