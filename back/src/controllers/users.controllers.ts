import { CreateUser, DeleteUser, GetUsers, GetAuthOfUser } from '../services/users.services';

// Controlador para listar usuários
async function Control_listUsers(req: any, res: any) {
    try {
        const [msg, result, users] = await GetUsers();

        result?
        res.status(200).json({ message: msg, status: result, users: users }):
        res.status(404).json({ message: msg, status: result});

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Controlador para criar um usuário
async function Control_createUser(req: any, res: any) {
    try {
        const [msg, result] = await CreateUser(req.body);

        result?
        res.status(200).json({ message: msg, status: result}):
        res.status(404).json({ message: msg, status: result});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Controlador para deletar um usuário
async function Control_deleteUser(req: any, res: any) {
  try {
      // Passando o ID do usuário a partir do token
      const userId = req.id;
      const [msg, result] = await DeleteUser(req.body, userId);

      result?
      res.status(200).json({ message: msg, status: result }):
      res.status(404).json({ message: msg, status: result});
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
  }
}


// Controlador para autenticar um usuário
async function Control_getAuth(req: any, res: any) {
    try {
        const [msg, result, token] = await GetAuthOfUser(req.body);
        result?
      res.status(200).json({ message: msg, status: result,token:token }):
      res.status(404).json({ message: msg, status: result});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export { Control_createUser, Control_listUsers, Control_deleteUser, Control_getAuth };
