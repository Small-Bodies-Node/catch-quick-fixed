import * as React from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const display = [
  "source_name",
  "date",
  "filter",
  "exposure",
  "airmass",
  "maglimit",
];

// item: [label, suffix]
const adornments = {
  source_name: ["Source", ""],
  date: ["Date (mid-exposure)", "UTC"],
  filter: ["Filter", ""],
  exposure: ["Exposure", "s"],
  airmass: ["Airmass", ""],
  maglimit: ["Limiting magnitude", "mag"],
};

function Metadata({ item, meta }) {
  const [label, suffix] = adornments[item];
  return (
    <>
      <ListItem sx={{ p: 0 }}>
        <ListItemText
          disableTypography
          primary={
            <Stack direction="row" spacing={2}>
              <Typography variant="body2" color="textPrimary">
                {label}:
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
              >{`${meta[item]} ${suffix}`}</Typography>
            </Stack>
          }
        />
      </ListItem>
    </>
  );
}

export default function ImagePopup({ open, setOpen }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    !!open && (
      <Dialog open={!!open} onClose={handleClose} maxWidth="md">
        <DialogTitle>{open.product_id}</DialogTitle>
        <img
          loading="lazy"
          src={open.preview_url}
          style={{ imageRendering: "pixelated" }}
          alt={`Image cutout from ${open.product_id}`}
        />
        <DialogContent>
          <DialogContentText>
            <List>
              {display.map((key) => (
                <Metadata key={key} item={key} meta={open} />
              ))}
            </List>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  );
}
