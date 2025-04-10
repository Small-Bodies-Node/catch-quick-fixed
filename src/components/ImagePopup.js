import * as React from "react";

import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const display = [
  "source_name",
  "date",
  "filter",
  "exposure",
  "airmass",
  "maglimit",
  "preview_url",
  "cutout_url",
];

function CopyButton({ url }) {
  const [open, setOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const copyUrl = () => {
    const item = new ClipboardItem({ "text/plain": url });
    navigator.clipboard.write([item]).then(handleTooltipOpen);
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <span>
        <Tooltip
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title="Copied URL"
          slotProps={{
            popper: {
              disablePortal: true,
            },
          }}
        >
          <IconButton size="small" onClick={copyUrl}>
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
      </span>
    </ClickAwayListener>
  );
}

const urlFormatter = (url, suffix) => {
  return (
    <span>
      <CopyButton url={url} />
      {suffix}
    </span>
  );
};

const stringFormatter = (text, suffix) => {
  return `${text} ${suffix}`;
};

// item: [label, suffix, formatter]
const adornments = {
  source_name: ["Source", "", stringFormatter],
  date: ["Date (mid-exposure)", "UTC", stringFormatter],
  filter: ["Filter", "", stringFormatter],
  exposure: ["Exposure", "s", stringFormatter],
  airmass: ["Airmass", "", stringFormatter],
  maglimit: ["Limiting magnitude", "mag", stringFormatter],
  preview_url: ["Preview URL", "", urlFormatter],
  cutout_url: ["FITS cutout URL", "", urlFormatter],
};

function Metadata({ item, meta }) {
  const [label, suffix, formatter] = adornments[item];
  return (
    <>
      <ListItem sx={{ p: 0 }}>
        <ListItemText
          disableTypography
          primary={
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" color="textPrimary">
                {label}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {formatter(meta[item], suffix)}
              </Typography>
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
          alt={`A cutout from ${open.product_id}`}
        />
        <DialogContent>
          <DialogContentText component="div">
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
