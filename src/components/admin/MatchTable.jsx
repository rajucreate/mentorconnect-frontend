import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Chip,
  Stack,
} from '@mui/material';

const pickValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== '');

const getPersonDisplay = (entity, fallbacks = {}) => {
  const profile = entity?.user || entity?.profile || entity;
  return (
    pickValue(
      entity?.name,
      entity?.fullName,
      entity?.username,
      profile?.name,
      profile?.fullName,
      profile?.username,
      entity?.email,
      profile?.email,
      fallbacks?.name,
      fallbacks?.email
    ) || 'N/A'
  );
};

const getStatusColor = (status) => {
  const normalizedStatus = String(status || '').toUpperCase();

  if (normalizedStatus === 'PENDING') {
    return 'warning';
  }
  if (normalizedStatus === 'APPROVED') {
    return 'success';
  }
  if (normalizedStatus === 'REJECTED') {
    return 'error';
  }
  return 'default';
};

const MatchTable = ({ matches, onUpdateMatchStatus, processingMatchId }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Mentor Name</TableCell>
          <TableCell>Mentee Name</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {matches.map((match, index) => {
          const matchId = match.id || match._id || match.matchId;
          const mentorLabel = getPersonDisplay(match?.mentor, {
            name: match?.mentorName,
            email: match?.mentorEmail,
          });
          const menteeLabel = getPersonDisplay(match?.mentee, {
            name: match?.menteeName,
            email: match?.menteeEmail,
          });
          const key = matchId || `${mentorLabel}-${menteeLabel}-${index}`;
          const status = String(match.status || 'PENDING').toUpperCase();
          const isPending = status === 'PENDING';
          const isProcessing = processingMatchId === matchId;

          return (
            <TableRow key={key}>
              <TableCell>{mentorLabel}</TableCell>
              <TableCell>{menteeLabel}</TableCell>
              <TableCell>
                <Chip label={status} color={getStatusColor(status)} size="small" />
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    size="small"
                    disabled={!matchId || !isPending || isProcessing}
                    onClick={() => onUpdateMatchStatus(match, 'APPROVED')}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    disabled={!matchId || !isPending || isProcessing}
                    onClick={() => onUpdateMatchStatus(match, 'REJECTED')}
                  >
                    Reject
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default MatchTable;
