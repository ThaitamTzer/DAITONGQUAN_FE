import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery,
  Skeleton,
} from '@mui/material';

const CategoryCardSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid item container xs={12} spacing={3}>
      {Array.from(new Array(6)).map((_, index) => (
        <Grid item container lg={4} md={6} sm={6} xs={6} key={index} sx={{ display: 'flex' }}>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                sx={{ padding: '7px 0 0 7px !important' }}
                title={<Skeleton width={isMobile ? '70%' : '50%'} />}
                avatar={
                  <Box
                    sx={{
                      width: {
                        xs: 30,
                        sm: 40
                      },
                      height: {
                        xs: 30,
                        sm: 40
                      },
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: theme.palette.grey[300]
                    }}
                  >
                    <Skeleton variant="circular" width={isMobile ? 30 : 40} height={isMobile ? 30 : 40} />
                  </Box>
                }
              />
              <CardContent
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0px !important'
                }}
              >
                <Box sx={{ marginLeft: 2, display: 'flex', alignItems: 'center' }}>
                  <Skeleton variant="rectangular" width={isMobile ? 80 : 120} height={isMobile ? 20 : 30} />
                </Box>
                <Box>
                  <IconButton>
                    <Skeleton variant="circular" width={isMobile ? 30 : 40} height={isMobile ? 30 : 40} />
                  </IconButton>
                  <IconButton>
                    <Skeleton variant="circular" width={isMobile ? 30 : 40} height={isMobile ? 30 : 40} />
                  </IconButton>
                  <IconButton>
                    <Skeleton variant="circular" width={isMobile ? 30 : 40} height={isMobile ? 30 : 40} />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
};

export default CategoryCardSkeleton;
