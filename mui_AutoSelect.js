import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function ComboBox() {
  const [selectedOption, setSelectedOption] = React.useState(null);

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={top100Films}
      sx={{ width: 300 }}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.year === value}
      renderOption={(props, option) => (
        <li {...props} key={option.year}>
          {option.label}
        </li>
      )}
      renderInput={(params) => <TextField {...params} label="Movie" />}
      value={top100Films.find(option => option.year === selectedOption) || null}
      onChange={(event, value) => setSelectedOption(value ? value.year : null)}
    />
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
];
