/** @jsx jsx */
import { jsx, Box } from "theme-ui";
import React from "react";

export default p => {
  const { data } = p;
  const filtered = data.filter(d => d.id != 'TOTAL')
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: "row"
      }}
    >
      {filtered.map(item => (
        <>
          <div
            sx={{
              width: "fit-content",
              height: "auto",
              p: "1",
              mx: '2',
              fontSize: "0",
              color: "black",
              backgroundColor: item.color
            }}
          >
            {item.id}
          </div>
        </>
      ))}
    </Box>
  );
};
