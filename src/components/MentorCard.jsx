import React from 'react';
import { Card, CardContent, CardActions, Grid, Typography, Button, CircularProgress } from '@mui/material';

const MentorCard = ({
  mentor,
  onRequestMentor,
  onBookSession,
  requestingMentorId,
  isAlreadyMatched,
  canBookSession,
}) => {
  const mentorId = mentor?.id ?? mentor?._id ?? mentor?.mentorId;
  const isRequesting = requestingMentorId === mentorId;

  return (
    <Card className="glass-card card-enter" sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#f2fbff', fontWeight: 700 }}>
          {mentor?.name || 'Unnamed Mentor'}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, color: 'rgba(236,246,255,0.95)' }}>
          Expertise: {mentor?.expertise || 'N/A'}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, color: 'rgba(236,246,255,0.95)' }}>
          Experience: {mentor?.experience || 'N/A'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(225,240,255,0.88)' }}>
          Bio: {mentor?.bio || 'No bio available.'}
        </Typography>
      </CardContent>
      <CardActions sx={{ pt: 0, pb: 2, px: 2 }}>
        <Grid container>
          <Grid size={12}>
            <Button
              variant="contained"
              className="gradient-button"
              fullWidth
              disabled={!mentorId || isRequesting || isAlreadyMatched}
              onClick={() => onRequestMentor(mentorId)}
            >
              {isAlreadyMatched
                ? 'Already Matched'
                : isRequesting
                  ? (
                    <>
                      <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
                      Requesting...
                    </>
                  )
                  : 'Request Mentor'}
            </Button>
          </Grid>
          <Grid size={12} sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              className="subtle-button"
              fullWidth
              disabled={!mentorId || !canBookSession}
              onClick={() => onBookSession(mentor)}
            >
              {canBookSession ? 'Book Session' : 'Request Match First'}
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default MentorCard;
