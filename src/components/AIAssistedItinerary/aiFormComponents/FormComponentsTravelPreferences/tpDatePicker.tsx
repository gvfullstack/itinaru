import React, { useState, useRef } from "react";
import Stack from "@mui/material/Stack";
import {Box, Typography} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { MobileDatePicker  } from '@mui/x-date-pickers/MobileDatePicker'
import { useRecoilState } from "recoil";
import { tripPreferencesAtom } from "../../aiItinAtoms";
import styles from "./tpTimePicker.module.css";


const UserInputDatePicker = () => {
  
  const [tripPreferences, setTripPreferences] = useRecoilState(tripPreferencesAtom)
  const travelDate = tripPreferences.travelDate;

  return (
    
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "100", height:"4rem" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <div className={styles.datePickerContainer}>
                <MobileDatePicker 
                  label="Travel Date"
                  value={travelDate}
                  disablePast={true}
                  onChange={(value: Date | null) => {if (value !== null) { 
                    setTripPreferences((prevTravelState) => ({...prevTravelState, travelDate: value}))
                    
                    ;}}}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'theme.palette.primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'theme.palette.primary.main',
                      },
                      borderRadius: '30px',
                      borderColor: 'pink',
                    },
                    '& .MuiOutlinedInput-input': {
                      fontSize: '18px',
                      fontWeight: '400',
                      padding: '10px 10px 10px 20px',
                    },
                    width: "90%",
                    maxWidth: '20rem',
                    alignSelf: 'center',
                    justifySelf: 'top',
                    height: "4rem",
                    marginTop: "-2.5rem",
                  }}
                    slotProps={{
                      layout: {sx: {fontSize: "20px"}},
                    }}
                />
                </div>
            </LocalizationProvider>
          </Stack>
        </Typography>
      </Box>
  )
};

export default UserInputDatePicker;

