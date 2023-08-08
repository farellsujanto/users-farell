import type { NextApiRequest, NextApiResponse } from 'next';
import { Low } from 'lowdb';
import { DbData } from 'src/interfaces/db-data-interface';
import { DEFAULT_VALUE, getDbAdapter } from 'src/db/db';
import { User } from 'src/interfaces/user-interface';
import { ResponseData } from 'src/interfaces/response-data-interface';
import { validateFirstName, validateLastName, validateUserName } from 'src/utils/user-data-util';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData<any>>,
) {
  try {
    const adapter = getDbAdapter();
    const db = new Low<DbData>(adapter, DEFAULT_VALUE);
    await db.read();

    if (req.method === 'GET') {
      res.status(200).json({
        error: false,
        message: 'Get Users Success!',
        data: db.data.users,
      });
      return;
    }

    if (req.method === 'POST') {
      const newUserData = req.body as User;
      const isUserNameExists = db.data.users.findIndex((e) => e.userName === newUserData.userName) !== -1;
      if (isUserNameExists) {
        res.status(400).json({
          error: true,
          message: 'Failed to Create User, User Exists',
          data: null,
        });
      }

      const userNameValidationErrorMessage = validateUserName(newUserData.userName);
      if (userNameValidationErrorMessage) {
        res.status(400).json({
          error: true,
          message: userNameValidationErrorMessage,
          data: null,
        });
        return;
      }

      const firstNameValidationErrorMessage = validateFirstName(newUserData.firstName);
      if (firstNameValidationErrorMessage) {
        res.status(400).json({
          error: true,
          message: firstNameValidationErrorMessage,
          data: null,
        });
        return;
      }

      const lastNameValidationErrorMessage = validateLastName(newUserData.lastName);
      if (lastNameValidationErrorMessage) {
        res.status(400).json({
          error: true,
          message: lastNameValidationErrorMessage,
          data: null,
        });
        return;
      }

      db.data.users.push(newUserData);
      await db.write();

      res.status(400).json({
        error: false,
        message: 'User Created!',
        data: newUserData,
      });
      return;
    }
  } catch (e) {
    res.status(500).json({
      error: true,
      message: 'Internal Server Error.',
      data: null,
    });
  }
}
