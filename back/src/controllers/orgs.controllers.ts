import { FromOrg_NewOrg,FromOrg_ListMyOrgs,FromOrg_DeleteOrg, FromOrg_EditOrg } from "../services/orgs.services";

async function NewOrg(req: any, res: any) {
   try {
        const [msg, result] = await FromOrg_NewOrg(req.body, req.id)
        result 
        ?res.status(200).json({ message: msg, status: result }) 
        :res.status(404).json({ message: msg, status: result })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function ListOrgs(req:any,res:any){
    try {
        const [msg, result,orgs] = await FromOrg_ListMyOrgs(req.id)
        result 
        ?res.status(200).json({ message: msg, status: result,orgs:orgs }) 
        :res.status(404).json({ message: msg, status: result })
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function DeleteOrg(req:any,res:any){
    try{
        const [msg, result] = await FromOrg_DeleteOrg(req.id,req.body)
        result 
        ?res.status(200).json({ message: msg, status: result }) 
        :res.status(404).json({ message: msg, status: result })
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
async function EditOrg(req:any,res:any){
    try{
        const [msg, result] = await FromOrg_EditOrg(req.id,req.body)
        result 
        ?res.status(200).json({ message: msg, status: result }) 
        :res.status(404).json({ message: msg, status: result })
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { NewOrg,ListOrgs,DeleteOrg,EditOrg }