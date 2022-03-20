import db from '../db';
import User from '../models/user';
import DatabaseError from '../models/database.error.model';

class userRepository
{

    async findAllUsers() : Promise <User[]>
    {
        const query = `
          SELECT 
            uuid, username
          FROM
            application_user;                 
        `;

      const {rows } = await db.query<User>(query);      
      return rows || [];
    }

    async findbyID(uuid : string) : Promise <User>
    {

        try {
          const query = `
            SELECT 
              uuid, username
            FROM
              application_user;
            WHERE
              uuid = $1;                 
          `;

        const values = [uuid];
        const {rows } = await db.query<User>(query,values);      
        const  [user] = rows;

        return user;
      }catch (error){          
          throw new DatabaseError('Erro na consulta por ID', error); 

      }
    } 


    async findByUserNameAndPassWord(username : string, passWord : string) : Promise <User>
    {

        try {
          const query = `
            SELECT 
              uuid, username
            FROM
              application_user;
            WHERE
            username = $1 
            and password = crypt($2, 'mySalt');                 
          `;

        const values = [username,passWord];
        const {rows } = await db.query<User>(query,values);      
        const  [user] = rows;

        return user || null;
      }catch (error){          
          throw new DatabaseError('Erro na consulta por username e passWord', error);

      }
    }     
    
    async createUser(user: User) : Promise <string>
    {

        const insert_script = `
          INSERT INTO application_user (username) VALUES ($1, crypt($2,'mySalt')
          RETURNING uuid;
        `;

       const values = [user.userName, user.password];

       const {rows} = await db.query<{uuid: string}>(insert_script, values);
       const [newUser] = rows;
       return newUser.uuid;
    }

    async updateUser(user: User) : Promise <void>
    {
        const update_script = `
          UPDATE 
            application_user;
          SET
            username = $1,
            password = crypt($2,'mySalt')
          WHERE
            uuid = $3;                 
        `;

      const values = [user.userName, user.password,user.uuid];
      await db.query(update_script,values); 
    } 
    
    async removeUser(uuid : string):Promise<void>
    {
        const delete_script =`
          DELTE FROM 
            application_user
          WHERE 
          uuid = $1;
        `;
        
        const values =[uuid];
        await db.query(delete_script,values); 
    }

}

export default new userRepository();