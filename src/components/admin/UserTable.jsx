import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
} from '@mui/material';

const UserTable = ({ users, onDeleteUser, processingUserId }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Role</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {users.map((user, index) => {
          const userId = user.id || user._id || user.userId;
          const key = userId || `${user.email || 'user'}-${index}`;

          return (
            <TableRow key={key}>
              <TableCell>{user.name || 'N/A'}</TableCell>
              <TableCell>{user.email || 'N/A'}</TableCell>
              <TableCell>{user.role || 'N/A'}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  disabled={!userId || processingUserId === userId}
                  onClick={() => onDeleteUser(user)}
                >
                  {processingUserId === userId ? 'Deleting...' : 'Delete User'}
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default UserTable;
