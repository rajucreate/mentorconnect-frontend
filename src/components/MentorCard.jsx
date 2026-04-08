import React from 'react';
import { Card, CardContent, CardActions, Grid, Typography, Button } from '@mui/material';

const MentorCard = ({ mentor, onRequestMentor, onBookSession, requestingMentorId, isAlreadyMatched }) => {
  const mentorId = mentor?.id ?? mentor?._id ?? mentor?.mentorId;
  const isRequesting = requestingMentorId === mentorId;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {mentor?.name || 'Unnamed Mentor'}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Expertise: {mentor?.expertise || 'N/A'}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Experience: {mentor?.experience || 'N/A'}
        </Typography>
        <Typography variant="body2">
          Bio: {mentor?.bio || 'No bio available.'}
        </Typography>
      </CardContent>
      <CardActions>
        <Grid container>
          <Grid size={12}>
            <Button
              variant="contained"
              fullWidth
              disabled={!mentorId || isRequesting || isAlreadyMatched}
              onClick={() => onRequestMentor(mentorId)}
            >
              {isAlreadyMatched ? 'Already Matched' : isRequesting ? 'Requesting...' : 'Request Mentor'}
            </Button>
          </Grid>
          <Grid size={12} sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              fullWidth
              disabled={!mentorId}
              onClick={() => onBookSession(mentor)}
            >
              Book Session
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default MentorCard;
