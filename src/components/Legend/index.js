/** @jsx jsx */
import { jsx, Box } from "theme-ui";
import React from "react";

export default p => {
  const { data } = p;
  return (
    <Box
      sx={{
        flexDirection: "column"
      }}
    >
      {data.map(item => (
        <>
          <div
            sx={{ width: "fit-content", height: "auto", p: '1', fontSize: '0', color: 'white', backgroundColor: item.color }}
          >
            {item.id}
          </div>
        </>
      ))}
    </Box>
  );
};
