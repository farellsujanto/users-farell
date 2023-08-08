import type { NextApiRequest, NextApiResponse } from 'next';
import { Low } from 'lowdb';
import { DbData } from 'src/interfaces/db-data-interface';
import { DEFAULT_VALUE, getDbAdapter } from 'src/db/db';
import { User } from 'src/interfaces/user-interface';
import { ResponseData } from 'src/interfaces/response-data-interface';
import { validateFirstName, validateLastName } from 'src/utils/user-data-util';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData<any>>,
) {
  try {
    const adapter = getDbAdapter();
    const db = new Low<DbData>(adapter, DEFAULT_VALUE);
    await db.read();

    const { userName } = req.query;
    const userIndex = db.data.users.findIndex((e) => e.userName === userName);
    const isUserNameExists = userIndex !== -1;

    if (req.method === 'DELETE') {
      if (!isUserNameExists) {
        res.status(400).json({
          error: true,
          message: 'Failed to Delete User, User Not Exist',
          data: null,
        });
        return;
      }
      db.data.users.splice(userIndex, 1);
      await db.write();

      res.status(200).json({
        error: false,
        message: 'User Deleted!',
        data: null,
      });
    }

    if (req.method === 'PATCH') {
      const updatedUserData = req.body as User;
      if (!isUserNameExists) {
        res.status(400).json({
          error: true,
          message: 'Failed to Update User, User Not Exist',
          data: null,
        });
        return;
      }

      const firstNameValidationErrorMessage = validateFirstName(updatedUserData.firstName);
      if (firstNameValidationErrorMessage) {
        res.status(400).json({
          error: true,
          message: firstNameValidationErrorMessage,
          data: null,
        });
        return;
      }

      const lastNameValidationErrorMessage = validateLastName(updatedUserData.lastName);
      if (lastNameValidationErrorMessage) {
        res.status(400).json({
          error: true,
          message: lastNameValidationErrorMessage,
          data: null,
        });
        return;
      }

      db.data.users[userIndex] = {
        ...db.data.users[userIndex],
        firstName: updatedUserData.firstName,
        lastName: updatedUserData.lastName,
      }
      await db.write();

      res.status(200).json({
        error: false,
        message: 'User Updated!',
        data: db.data.users[userIndex],
      });
    }
  } catch (e) {
    res.status(500).json({
      error: true,
      message: 'Internal Server Error.',
      data: null,
    });
  }
}
