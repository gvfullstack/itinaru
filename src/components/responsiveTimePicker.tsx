import React, { useState, useRef } from "react";
import Stack from "@mui/material/Stack";
import {Box, Typography} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'
import { PickerChangeHandlerContext } from '@mui/x-date-pickers/internals/hooks/usePicker/usePickerValue.types';
import { TimeValidationError } from '@mui/x-date-pickers/models/validation';
import { ItineraryItem } from "./typeDefs";
import { itineraryItemsState } from "@/atoms/atoms";
import { useRecoilState } from "recoil";

interface ResponsiveTimePickerProps {
  propertyName: "startTime" | "endTime";
  itineraryItem: ItineraryItem;
}

const ResponsiveTimePicker = ({ itineraryItem, propertyName }: ResponsiveTimePickerProps) => {

  const [itineraryItemsInState, setItineraryItemsInState] = useRecoilState<ItineraryItem[]>(itineraryItemsState);
  const [selectedTime, setSelectedTime] = useState<Date | null>(itineraryItem[propertyName]?.time ?? null);

  const handleTimeEdit = (time: Date | null) => {
    
    if (time !== null && selectedTime !== null) {
      const index = itineraryItemsInState.findIndex(item => item.id === itineraryItem.id);
      const startTime = propertyName==="startTime" ? Number(selectedTime) : Number(itineraryItem.startTime?.time);
      const endTime = propertyName==="endTime" ? Number(selectedTime) : Number(itineraryItem.endTime?.time);
      const updatedDuration = endTime - startTime;
  
      const updatedItem = {
        ...itineraryItem,
        activityDuration: updatedDuration,
        userDefinedRespectedTime: true,
        [propertyName]: {
          ...itineraryItem[propertyName],
          time: selectedTime,
          beingEdited: !itineraryItem[propertyName]?.beingEdited
        },
      };
      const newItems = [...itineraryItemsInState];
      newItems[index] = updatedItem;
      setItineraryItemsInState(newItems);
    }
  };
  

  const handleClose = () => {
    handleTimeEdit(selectedTime);
  };

  
      
  const minTime = propertyName === "endTime" ? itineraryItem.startTime?.time : undefined;
  const maxTime = propertyName === "startTime" ? itineraryItem.endTime?.time : undefined;


  return (
    
      <Box>
        <Typography variant="h5" sx={{ fontWeight: "100" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileTimePicker
                  label="Set Time"
                  value={itineraryItem[propertyName]?.time}
                  format="hh:mm a"
                  ampmInClock = {true}
                  onChange={(value: Date | null, context: PickerChangeHandlerContext<TimeValidationError>) => setSelectedTime(value)}
                  onClose={handleClose}
                  minTime={minTime}
                  maxTime={maxTime}  
                  sx={{"& .MuiOutlinedInput-root": {color: "rgb(29, 29, 29)", fontSize: "12px"},
                  "& .MuiInputLabel-root": {color: "rgb(29, 29, 29)", fontSize: "12px"},
                  "& .MuiOutlinedInput-input": {border: "none", height: "0px", width: "55px", padding: "7px 5px", margin: "0px"},
                }}
                  slotProps={{
                    layout: {sx: {fontSize: "20px"}},
                  }}
                />
            </LocalizationProvider>
          </Stack>
        </Typography>
      </Box>
  )
};

export default ResponsiveTimePicker;
