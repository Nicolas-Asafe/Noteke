import {CreateUser,CreateUserType,DeleteUser,GetOneUserById,GetOneUserByName,GetUsers,GetAuthOfUser} from '../services/users.services'

 
async function Control_listUsers(req: any, res: any) {
    try {
      const [msg, result, users] = await GetUsers(); 
   
      if (result) {
        res.status(200).json({ message: msg, status: result, users: users });
      } else {
        res.status(404).json({ message: msg, status: result });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
}
async function Control_createUser(req:any, res:any){
  try{
    const [msg,result] = await CreateUser(req.body)
    
    if (result) {
      res.status(200).json({ message: msg, status: result });
    } else {
      res.status(404).json({ message: msg, status: result });
    }
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}  
async function Control_deleteUser(req:any,res:any){
  try{
    const [msg,result] = await DeleteUser(req.body)
    if(result){
      res.status(200).json({message:msg,status:result})
    }
    else{
      res.status(404).json({message:msg,status:result})
    }
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
async function Control_getAuth(req:any,res:any){
  try{
    const [msg,result,token] = await GetAuthOfUser(req.body)
    if(result){
      res.status(200).json({message:msg,status:result,token:token})
    }
    else{
      res.status(404).json({message:msg,status:result})
    }
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export {Control_createUser,Control_listUsers,Control_deleteUser,Control_getAuth}