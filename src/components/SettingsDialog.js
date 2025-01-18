import * as React from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { parameterDefaults } from "../services/catch";

/**
 * Source keys and names.
 * @readonly
 * @enum {string}
 */
const Sources = Object.freeze({
  atlas_haleakela: "ATLAS, Haleakela",
  atlas_mauna_loa: "ATLAS, Mauna Loa",
  catalina_bigelow: "Catalina Sky Survey, Mt. Bigelow",
  catalina_lemmon: "Catalina Sky Survey, Mt. Lemmon",
  loneos: "LONEOS",
  neat_palomar_tricam: "NEAT, Mt. Palomar (Tricam)",
  neat_maui_geodss: "NEAT, Haleakela (GEODSS)",
  spacewatch: "Spacewatch",
});

/**
 * Areal search types.
 * @readonly
 * @enum {string}
 */
const IntersectionType = Object.freeze({
  ImageIntersectsArea: "Image intersects area",
  ImageContainsArea: "Image contains area",
  AreaContainsImage: "Area contains image",
});

/** Expected format: YYYY-MM-DD [HH:MM[:SS.sss]][Z]
 */
function isDateValid(date) {
  const matches = date
    .trim()
    .match(/\d\d\d\d-\d\d-\d\d([\sT]\d\d:\d\d(:\d\d(\.\d+)?)?)?Z?/);
  return matches !== null && matches[0].length === matches.input.length;
}

export default function SettingsDialog({
  open,
  handleClose,
  parameters,
  setParameters,
  handleUpdates,
  cancelUpdates,
  ...props
}) {
  const [invalidStartDate, setInvalidStartDate] = React.useState(false);
  const [invalidStopDate, setInvalidStopDate] = React.useState(false);

  const handleChange = (key, event) => {
    let value = event.target.value;
    if (key === "radius") {
      value = Math.min(Math.max(parseFloat(event.target.value), 0), 120);
      if (isNaN(value)) value = "";
    }

    if (key === "start_date" && invalidStartDate) setInvalidStartDate(false);

    if (key === "stop_date" && invalidStopDate) setInvalidStopDate(false);

    setParameters({ ...parameters, [key]: value });
  };

  const resetParameters = () => {
    setParameters({
      ...parameterDefaults,
      coordinates: parameters.coordinates,
    });
  };

  const saveAndClose = () => {
    if (parameters.start_date && !isDateValid(parameters.start_date)) {
      setInvalidStartDate(true);
      return;
    }

    if (parameters.stop_date && !isDateValid(parameters.stop_date)) {
      setInvalidStopDate(true);
      return;
    }

    handleUpdates();
    handleClose();
  };

  const cancelAndClose = () => {
    cancelUpdates();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="settings-dialog-title"
      aria-describedby="settings-dialog-description"
      {...props}
    >
      <DialogTitle id="settings-dialog-title">Settings</DialogTitle>
      <DialogContent>
        <DialogContentText id="settings-dialog-description" sx={{ mb: 4 }}>
          Set search parameters. Dates and radius are optional.
        </DialogContentText>

        <Stack spacing={2}>
          <FormControl>
            <InputLabel id="select-source-label">Source</InputLabel>
            <Select
              labelId="select-source-label"
              id="select-source"
              value={parameters.source}
              label="Source"
              onChange={(event) => handleChange("source", event)}
              sx={{ width: "100%" }}
            >
              {Object.entries(Sources).map(([key, name]) => (
                <MenuItem value={key} key={key}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider />
          <TextField
            label="Start date"
            value={parameters.start_date || ""}
            onChange={(event) => handleChange("start_date", event)}
            error={invalidStartDate}
            helperText={
              invalidStartDate &&
              "Date format: YYYY-MM-DD HH:MM:SS.sss, all fields optional"
            }
          />
          <TextField
            label="End date"
            value={parameters.stop_date || ""}
            onChange={(event) => handleChange("stop_date", event)}
            error={invalidStopDate}
            helperText="Date format: YYYY-MM-DD HH:MM:SS.sss, all fields optional"
          />

          <Divider />
          <TextField
            label="Areal search radius"
            inputMode="number"
            value={parameters.radius || ""}
            step={1}
            onChange={(event) => handleChange("radius", event)}
            helperText="0 to 120 arcmin"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">arcmin</InputAdornment>
                ),
              },
            }}
          />

          <FormControl>
            <InputLabel id="select-intersection-type-label">
              Areal search intersection type
            </InputLabel>
            <Select
              labelId="select-intersection-type-label"
              id="select-intersection-type"
              value={parameters.intersection_type}
              label="Areal search intersection type"
              onChange={(event) => handleChange("intersection_type", event)}
              sx={{ width: "100%" }}
            >
              {Object.entries(IntersectionType).map(([key, name]) => (
                <MenuItem value={key} key={key}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Divider />
          <TextField
            label="Cutout image size"
            inputMode="number"
            value={parameters.size}
            step={1}
            onChange={(event) => handleChange("size", event)}
            helperText="1 to 30 arcmin"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">arcmin</InputAdornment>
                ),
              },
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={resetParameters} variant="outlined">
          Reset
        </Button>
        <Button onClick={cancelAndClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={saveAndClose} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
