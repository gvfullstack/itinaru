import React, { useState, useRef } from "react";
import Stack from "@mui/material/Stack";
import {Box, Typography} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'
import { PickerChangeHandlerContext } from '@mui/x-date-pickers/internals/hooks/usePicker/usePickerValue.types';
import { TimeValidationError } from '@mui/x-date-pickers/models/validation';
import { ItineraryItem } from "../typeDefs";
import { itineraryItemsState } from "@/atoms/atoms";
import { useRecoilState } from "recoil";
import {itinStartTimeState, itinEndTimeState} from "@/atoms/atoms";
import styles from "./itinBuilderCSS/userInputTimePicker.module.css";
import { styled } from "@mui/system";

const UserInputTimePicker = () => {
  
  const [itinStartTime, setItinStartTime] = useRecoilState(itinStartTimeState)
  const [itinEndTime, setItinEndTime] = useRecoilState(itinEndTimeState) 

  return (
    
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "100" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <div className={styles.datePickerContainer}>
                <MobileTimePicker
                  label="Start Time"
                  value={itinStartTime}
                  format="h:mm a"
                  ampmInClock = {true}
                  onChange={(value: Date | null) => {if (value !== null) { setItinStartTime(value);}}}
                  maxTime={itinEndTime}  
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
                    fontSize: '22px',
                    fontWeight: '400',
                    padding: '10px 10px 10px 20px',
                  },
                }}
                  slotProps={{
                    layout: {sx: {fontSize: "20px"}},
                  }}
                />

                <MobileTimePicker
                  label="End Time"
                  value={itinEndTime}
                  format="hh:mm a"
                  ampmInClock = {true}
                  onChange={(value: Date | null) => {if (value !== null) { setItinEndTime(value);}}}
                  minTime={itinStartTime}
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
                    fontSize: '22px',
                    fontWeight: '400',
                    padding: '10px 10px 10px 20px',
                  },
                  "& .MuiOutlinedInput-label": {
                     color: "grey",
                  }
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

