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

const getStatusColor = (status) => {
  const normalizedStatus = String(status || '').toUpperCase();

  if (normalizedStatus === 'PENDING') {
    return 'warning';
  }
  if (normalizedStatus === 'APPROVED' || normalizedStatus === 'ACCEPTED') {
    return 'success';
  }
  if (normalizedStatus === 'REJECTED') {
    return 'error';
  }
  if (normalizedStatus === 'CANCELLED') {
    return 'default';
  }
  return 'default';
};

const formatDateTime = (value) => {
  if (!value) {
    return 'N/A';
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleString();
};

const SessionTable = ({ sessions, onUpdateSessionStatus, processingSessionId }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Mentor</TableCell>
          <TableCell>Mentee</TableCell>
          <TableCell>Start Time</TableCell>
          <TableCell>End Time</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sessions.map((session, index) => {
          const sessionId = session.id || session._id || session.sessionId || session?.session?.id || session?.session?._id;
          const key = sessionId || `${session.mentorName || 'mentor'}-${session.menteeName || 'mentee'}-${index}`;
          const status = String(session.status || 'PENDING').toUpperCase();
          const isPending = status === 'PENDING';
          const isProcessing = processingSessionId === sessionId;

          return (
            <TableRow key={key}>
              <TableCell>{session?.mentor?.name || session.mentorName || session?.mentor?.email || 'N/A'}</TableCell>
              <TableCell>{session?.mentee?.name || session.menteeName || session?.mentee?.email || 'N/A'}</TableCell>
              <TableCell>{formatDateTime(session.startTime || session.startDateTime || session.dateTime)}</TableCell>
              <TableCell>{formatDateTime(session.endTime || session.endDateTime || session.endDate)}</TableCell>
              <TableCell>
                <Chip label={status} color={getStatusColor(status)} size="small" />
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    size="small"
                    disabled={!sessionId || !isPending || isProcessing}
                    onClick={() => onUpdateSessionStatus(session, 'APPROVED')}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    disabled={!sessionId || !isPending || isProcessing}
                    onClick={() => onUpdateSessionStatus(session, 'REJECTED')}
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

export default SessionTable;
