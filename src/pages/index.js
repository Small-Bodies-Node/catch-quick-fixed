import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import FixedTargetQuery from "../components/FixedTargetQuery";

const queryClient = new QueryClient();

export default function Index() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
              CATCH Quick Fixed
            </Typography>
            <Typography variant="subtitle1" component="p">
              A simple search of the NASA Planetary Data System sky surveys for
              images anywhere in the sky.
            </Typography>
          </Box>
          <FixedTargetQuery />
        </Container>
      </QueryClientProvider>
    </>
  );
}

export function Head() {
  return <title>CATCH: Quick Fixed Coordinate Image Search</title>
}
