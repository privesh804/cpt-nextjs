import * as React from "react";
import { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";

export default function CustomDatePicker({
  label,
  date,
  setDate,
}: {
  label: string;
  date: Dayjs | null;
  setDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
}) {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#000", // Primary color for text and border
        light: "#444",
        900: "rgba(0, 0, 0, 0.20)", // Used for focus border
      },
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={theme}>
        <DatePicker
          label={label}
          format="MMM DD, YYYY"
          value={date}
          onChange={(newValue) => setDate(newValue)}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              borderRadius: "999px",
              transition:
                "border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
              "&.Mui-focused": {
                border: "0.5px",
                borderColor: "#444",
                boxShadow: "none", // Focus border using theme 900
              },
            },
            "& .MuiInputBase-input": {
              padding: "0.675rem",
              fontSize: "0.75rem",
              color: "#4B5675",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              outline: "none",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              outline: "none",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                boxShadow: "none",
                border: "1px solid #000",
              },
            "& .MuiSvgIcon-root": {
              width: "1rem",
              height: "1rem",
              color: "#444",
            },
          }}
        />
      </ThemeProvider>
    </LocalizationProvider>
  );
}
