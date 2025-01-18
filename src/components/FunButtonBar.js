import * as React from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function FunButtonBar({ handleUpdates }) {
  return (
    <Stack
      direction="row"
      spacing={2}
      useFlexGap
      sx={{
        width: "100%",
        justifyContent: "flex-start",
        alignItems: "baseline",
        flexWrap: "wrap",
        mb: 2,
      }}
    >
      <Button
        size="small"
        onClick={() => {
          handleUpdates({ coordinates: "05:34:32.0 +22:00:48" });
        }}
      >
        The Crab
      </Button>
      <Button
        size="small"
        onClick={() => {
          handleUpdates({ coordinates: "18 53 35 +33 01 45", size: 2 });
        }}
      >
        The Ring
      </Button>
      <Button
        size="small"
        onClick={() => {
          handleUpdates({ coordinates: "21 29 58.33 +12 10 01.2" });
        }}
      >
        The Great Pegasus
      </Button>
      <Button
        size="small"
        onClick={() => {
          handleUpdates({ coordinates: "18 02 22 -23 01 00" });
        }}
      >
        The Trifid
      </Button>
      <Button
        size="small"
        onClick={() => {
          handleUpdates({
            coordinates: "12 21 54.93 +04 28 25.6",
            size: 5,
          });
        }}
      >
        Spot the supernova
      </Button>
      <Button
        size="small"
        onClick={() => {
          handleUpdates({
            coordinates: "205.10371 9.95205",
            source: "atlas_haleakela",
            size: 10,
          });
        }}
      >
        Spot the comet (level 1)
      </Button>
      <Button
        size="small"
        onClick={() => {
          handleUpdates({
            coordinates: "115.30437 -16.27104",
            source: "atlas_haleakela",
            size: 5,
          });
        }}
      >
        Spot the comet (level 2)
      </Button>
    </Stack>
  );
}
