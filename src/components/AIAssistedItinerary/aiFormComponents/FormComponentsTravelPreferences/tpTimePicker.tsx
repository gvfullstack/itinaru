import React, { useEffect } from "react";
import Stack from "@mui/material/Stack";
import {Box, Typography} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'
import { useRecoilState } from "recoil";
import {tripPreferencesAtom} from "@/atoms/atoms";
import styles from "./tpTimePicker.module.css";

const UserInputTimePicker = () => {
  
  const [tripPreferences, setTripPreferences] = useRecoilState(tripPreferencesAtom)
  const travelDate = tripPreferences.travelDate;

  
  useEffect(() => {
    const updateTimes = () => {
      if (travelDate && tripPreferences.startTime) {
        const updatedStartTime = new Date(travelDate);
        updatedStartTime.setHours(tripPreferences.startTime.getHours(), tripPreferences.startTime.getMinutes());
        setTripPreferences((prevTripPreferences) => ({
          ...prevTripPreferences,
          startTime: updatedStartTime,
        }));
      }

      if (travelDate && tripPreferences.endTime) {
        const updatedEndTime = new Date(travelDate);
        updatedEndTime.setHours(tripPreferences.endTime.getHours(), tripPreferences.endTime.getMinutes());
        setTripPreferences((prevTripPreferences) => ({
          ...prevTripPreferences,
          endTime: updatedEndTime,
        }));
      }
    };

    updateTimes();
  }, [travelDate]);

  const handleStartTimeChange = (value: Date | null) => {
    if (value !== null) {
      const startTime = new Date(travelDate? travelDate : new Date());
      startTime.setHours(value.getHours(), value.getMinutes());
      setTripPreferences((prevTripPreferences) => ({
        ...prevTripPreferences,
        startTime: startTime,
      }));
    }
  };

  const handleEndTimeChange = (value: Date | null) => {
    if (value !== null) {
      const endTime = new Date(travelDate? travelDate : new Date());
      endTime.setHours(value.getHours(), value.getMinutes());
      setTripPreferences((prevTripPreferences) => ({
        ...prevTripPreferences,
        endTime: endTime,
      }));
    }
  };

  return (
    
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "100" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <div className={styles.datePickerContainer}>
                <MobileTimePicker
                  label="Start Time"
                  value={tripPreferences.startTime}
                  format="h:mm a"
                  ampmInClock = {true}
                  onChange={handleStartTimeChange}
                  maxTime={tripPreferences.endTime}  
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

                }}
                  slotProps={{
                    layout: {sx: {fontSize: "20px"}},
                  }}
                />

                <MobileTimePicker
                  label="End Time"
                  value={tripPreferences.endTime}
                  format="hh:mm a"
                  ampmInClock = {true}
                  onChange={handleEndTimeChange}
                  minTime={tripPreferences.startTime}
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
                  "& .MuiOutlinedInput-label": {
                     color: "grey",
                  },
                  width: "90%",
                  maxWidth: '20rem',
                  alignSelf: 'center',
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

export default UserInputTimePicker;

