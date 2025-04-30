import { Router } from "express";
import { NewOrg,ListOrgs, DeleteOrg,EditOrg } from "../controllers/orgs.controllers";
import { middleware } from "../../utils/jwt.tools";

const OrgRouter = Router()

OrgRouter.post('/NewOrg',middleware,NewOrg)
OrgRouter.get('/ListOrgs',middleware,ListOrgs)
OrgRouter.delete('/DeleteOrg',middleware,DeleteOrg)
OrgRouter.put('/EditOrg',middleware,EditOrg)

export default OrgRouter