import * as React from "react";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";

import { useFixedTargetQuery, parameterDefaults } from "../services/catch";
import FunButtonBar from "./FunButtonBar";
import ResultsView from "./ResultsView";
import SettingsDialog from "./SettingsDialog";

/** If units are not provided, then degrees if decimal values, or HMS DMS
 * otherwise.  */
function parseCoordinates(coordinates) {
  if (coordinates === null) return { ra: null, dec: null };

  const values = coordinates.split(/\s+/, 6);
  if (values.length === 1) return { ra: null, dec: null };

  if (values.length % 2 !== 0)
    throw Error("Cannot parse as an RA and Dec pair.");

  const n = Math.trunc(values.length / 2);
  return {
    ra: values.slice(0, n).join(" "),
    dec: values.slice(n, 2 * n).join(" "),
  };
}

function parseSexagesimal(angle) {
  if (!angle) return null;
  const parts =
    angle.indexOf(":") === -1
      ? angle.trim().split(" ")
      : angle.trim().split(":");
  const sign = Math.sign(parts[0]);
  const scales = [1, sign * 60, sign * 3600];
  return parts.reduce(
    (value, part, i) => value + parseFloat(part) / scales[i],
    0
  );
}

function parseRA(ra) {
  return isNaN(ra) ? parseSexagesimal(ra) * 15.0 : parseFloat(ra);
}

function parseDec(dec) {
  return isNaN(dec) ? parseSexagesimal(dec) : parseFloat(dec);
}

function fixCutout(url, ra, dec, size) {
  const base = url.split("?")[0];
  return `${base}?ra=${ra}&dec=${dec}&size=${size}arcmin`;
}

/**
 * Mangle the results to use the desired cutout sizes.
 * ra, dec in decimal degrees
 * size in armin
 */
function setCutoutURLs(results, ra, dec, size, align) {
  if (!results) return results;

  const updated = results?.data
    ? results.data.map((meta) => {
      const cutoutURL = fixCutout(meta.cutout_url, ra, dec, size);
      return {
        ...meta,
        preview_url: cutoutURL + `&align=${align}&format=jpeg`,
        cutout_url: cutoutURL + "&format=fits",
      };
    })
    : null;
  return { ...results, data: updated };
}

/**
 * Check that parameters contains valid RA and Dec.
 */
function validParameters(parameters) {
  return (
    parameters.ra &&
    !isNaN(parseRA(parameters.ra)) &&
    parameters.dec &&
    !isNaN(parseDec(parameters.dec))
  );
}

export default function FixedTargetQuery() {
  // parameters is the pending set of parameters for the next query
  const [parameters, setParameters] = React.useState(parameterDefaults);

  // queryParameters is the parameters of the current query, but with ra and dec parsed
  const [queryParameters, setQueryParameters] = React.useState(parameters);
  const query = useFixedTargetQuery(queryParameters);

  const results = setCutoutURLs(
    query.data,
    parseRA(queryParameters.ra),
    parseDec(queryParameters.dec),
    parseFloat(queryParameters.size),
    queryParameters.align,
  );

  // messages
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [message, setMessage] = React.useState(null);

  if (query.isError) setErrorMessage(query.error.message);

  // SettingsDialog
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const handleOpenSettings = () => {
    setSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setSettingsOpen(false);
  };

  // parameter updates
  const handleUpdates = (updates) => {
    // parameters can be set directly, in which case this function handles the UI

    if (typeof updates !== "undefined")
      setParameters({ ...parameters, ...updates });

    if (queryParameters?.ra && queryParameters?.dec && query.isSuccess)
      setMessage("Previous results cleared.");
    setQueryParameters({});
  };

  const cancelUpdates = () => {
    // restore parameters to the current query
    setParameters({ ...queryParameters });
  };

  // submit the query
  const handleSubmit = (event) => {
    event.preventDefault();

    // clear messages
    setMessage(null);
    setErrorMessage(null);

    try {
      setQueryParameters({
        ...parameters,
        ...parseCoordinates(parameters.coordinates),
      });
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <Box width={450} sx={{ my: 2 }}>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {results?.message && <Alert severity="info">{results.message}</Alert>}
        {validParameters(queryParameters) && results?.data.length === 0 && (
          <Alert severity="info">No observations found.</Alert>
        )}
        {message && <Alert severity="info">{message}</Alert>}
      </Box>

      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "flex-start",
          alignItems: "baseline",
          mb: 2,
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <TextField
          id="coordinates"
          label="Coordinates"
          helperText="RA Dec in decimal degrees or HH:MM:SS and DD:MM:SS"
          value={parameters.coordinates}
          onChange={(event) =>
            handleUpdates({ coordinates: event.target.value })
          }
          sx={{ width: "50ch" }}
          variant="outlined"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="search"
                    type="submit"
                    edge="end"
                    sx={{ m: "1px" }}
                  >
                    <SearchIcon />
                  </IconButton>
                  <Divider sx={{ height: 32, m: 1 }} orientation="vertical" />
                  <IconButton
                    onClick={handleOpenSettings}
                    aria-label="settings"
                    edge="end"
                    sx={{ mr: "-4px" }}
                  >
                    <SettingsIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Stack>

      <Box width={450} sx={{ my: 2 }}>
        {query.isPending && <LinearProgress />}
      </Box>

      <FunButtonBar handleUpdates={handleUpdates} />

      {results?.count > 0 && <ResultsView results={results} />}

      <SettingsDialog
        open={settingsOpen}
        onClose={() => {
          cancelUpdates();
          handleCloseSettings();
        }}
        handleClose={handleCloseSettings}
        parameters={parameters}
        setParameters={setParameters}
        cancelUpdates={cancelUpdates}
        handleUpdates={handleUpdates}
      />
    </>
  );
}
