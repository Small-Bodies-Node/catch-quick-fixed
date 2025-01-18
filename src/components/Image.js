import * as React from "react";
import Grid from "@mui/material/Grid2";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
    maxWidth: "none",
  },
}));

/**
 * ra dec in decimal degrees or HMS, DMS
 * size in arcmin
 */
export default function Image({ meta, delay, onClick }) {
  const [load, setLoad] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => setLoad(true), delay);
    return () => clearTimeout(timeout);
  });

  return (
    <Grid
      name={meta.product_id}
      onClick={onClick}
      style={{ width: 100, height: 100, display: "flex" }}
    >
      {load && (
        <HtmlTooltip
          title={
            <>
              {meta.product_id}
              <br />
              <b>Date</b>: {meta.date}
              <br />
              <b>Filter</b>: {meta.filter}
              <br />
              <b>Exposure</b>: {meta.exposure} s
              <br />
            </>
          }
          slotProps={{
            popper: {
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, -10],
                  },
                },
              ],
            },
          }}
        >
          <img
            loading="lazy"
            src={meta.preview_url}
            style={{
              objectFit: "contain",
              border: "1px solid #eee",
            }}
            alt=""
          />
        </HtmlTooltip>
      )}
    </Grid>
  );
}
