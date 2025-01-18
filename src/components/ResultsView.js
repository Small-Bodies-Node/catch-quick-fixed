import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Image from "./Image";
import ImagePopup from "./ImagePopup";

/**
 * Package the results into a URL.
 */
export function useDownloadableResults(results) {
  const [url, setURL] = React.useState(null);
  React.useEffect(() => {
    // https://javascript.info/blob
    if (results) {
      var json = JSON.stringify(results);
      const blob = new Blob([json], { type: "application/json" });
      setURL(URL.createObjectURL(blob));
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [results]);
  return url;
}

export default function ResultsView({ results }) {
  const data = [...results.data].sort((a, b) => a.mjd_start - b.mjd_start);
  const [openImageMeta, setOpenImageMeta] = React.useState(null);

  const first = data[0].date.slice(0, 10);
  const last = data[data.length - 1].date.slice(0, 10);

  const resultsURL = useDownloadableResults(results);

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="baseline"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="body2" gutterBottom>
          {data.length === 1
            ? `1 observation found on ${first}.`
            : `${data.length} observations found from ${first} to ${last}.`}
        </Typography>

        {resultsURL && (
          <Button
            variant="outlined"
            color="primary"
            component="a"
            download="results.json"
            href={resultsURL}
            size="small"
          >
            Download (json)
          </Button>
        )}
      </Stack>

      <Grid container>
        {data.map((meta, i) => (
          <Image
            meta={meta}
            delay={50 * i * (meta.preview_url.includes("uxzqjwo0ye") ? 20 : 1)}
            key={i}
            onClick={() => {
              setOpenImageMeta(meta);
            }}
          />
        ))}
      </Grid>

      <ImagePopup open={openImageMeta} setOpen={setOpenImageMeta} />
    </Box>
  );
}
