import { Box, Typography, useTheme } from '@mui/material';
import linearGradient from '../assets/theme/functions/linearGradient';
import rgba from '../assets/theme/functions/rgba';

export default function Home() {
  const { palette: { gradients } } = useTheme();
  return (
    <>
      <Typography variant="h1">Home</Typography>
    </>
  );
}
