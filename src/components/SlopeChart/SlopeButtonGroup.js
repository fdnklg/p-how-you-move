/** @jsx jsx */
import { jsx, Box, Select } from "theme-ui";

export default p => {
  const {data, selectToggle} = p;
  const selectArr = ['time', 'count', 'distance'];
  return (
    <Box>
      <Select
        onChange={e => selectToggle(e.target.value)}
        sx={{ backgroundColor: "white" }}
        defaultValue={data}
      >
        {selectArr.map((item,i) => {
          return <option key={`${i}-key`} value={item}>{item}</option>;
        })}
      </Select>
    </Box>
  )
}