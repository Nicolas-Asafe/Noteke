import { Router } from "express";
import { NewOrg,ListOrgs, DeleteOrg,EditOrg } from "../controllers/orgs.controllers";
import { middleware } from "../../utils/jwt.tools";

const OrgRouter = Router()

OrgRouter.use(middleware)
OrgRouter.post('/NewOrg',NewOrg)
OrgRouter.get('/ListOrgs',ListOrgs)
OrgRouter.delete('/DeleteOrg',DeleteOrg)
OrgRouter.put('/EditOrg',EditOrg)

export default OrgRouter