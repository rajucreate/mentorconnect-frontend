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
          const mentorLabel = getPersonDisplay(session?.mentor, {
            name: session?.mentorName,
            email: session?.mentorEmail,
          });
          const menteeLabel = getPersonDisplay(session?.mentee, {
            name: session?.menteeName,
            email: session?.menteeEmail,
          });
          const key = sessionId || `${mentorLabel}-${menteeLabel}-${index}`;
          const status = String(session.status || 'PENDING').toUpperCase();
          const isPending = status === 'PENDING';
          const isProcessing = processingSessionId === sessionId;

          const startValue =
            pickValue(
              session.startTime,
              session.startDateTime,
              session.dateTime,
              session.scheduledAt,
              session.sessionDate,
              session.date,
              session.createdAt,
              session?.session?.startTime,
              session?.session?.startDateTime,
              session?.session?.dateTime,
              session?.session?.scheduledAt,
              session?.session?.sessionDate,
              session?.session?.date,
              session?.session?.createdAt
            );

          const endValue =
            pickValue(
              session.endTime,
              session.endDateTime,
              session.endDate,
              session?.session?.endTime,
              session?.session?.endDateTime,
              session?.session?.endDate
            );

          return (
            <TableRow key={key}>
              <TableCell>{mentorLabel}</TableCell>
              <TableCell>{menteeLabel}</TableCell>
              <TableCell>{formatDateTime(startValue)}</TableCell>
              <TableCell>{formatDateTime(endValue)}</TableCell>
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
