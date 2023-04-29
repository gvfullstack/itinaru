import React, { useState, useRef } from "react";
import Stack from "@mui/material/Stack";
import {Box, Typography} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'
import { MobileDatePicker  } from '@mui/x-date-pickers/MobileDatePicker'
import { PickerChangeHandlerContext } from '@mui/x-date-pickers/internals/hooks/usePicker/usePickerValue.types';
import { TimeValidationError } from '@mui/x-date-pickers/models/validation';
import { ItineraryItem } from "../typeDefs";
import { itineraryItemsState } from "@/atoms/atoms";
import { useRecoilState } from "recoil";
import {travelDateState} from "@/atoms/atoms";
import styles from "./itinBuilderCSS/userInputTimePicker.module.css";
import { styled } from "@mui/system";

const UserInputDatePicker = () => {
  
  const [travelDate, setTravelDate] = useRecoilState(travelDateState)

  return (
    
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "100" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <div className={styles.datePickerContainer}>
                <MobileDatePicker 
                  label="Travel Date"
                  value={travelDate}
                  disablePast={true}
                  onChange={(value: Date | null) => {if (value !== null) { setTravelDate(value);}}}
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

