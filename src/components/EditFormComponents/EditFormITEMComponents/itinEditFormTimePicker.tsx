import React from 'react';
import { TimePicker, TimePickerProps } from '@mui/x-date-pickers/TimePicker';
import { ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import dayjs from 'dayjs';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        secondary: { main: '#ff4081' },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
    },
});

type CustomTimePickerProps = TimePickerProps<dayjs.Dayjs> & {
    label?: string;
    value: dayjs.Dayjs | null;
    onChange: (date: dayjs.Dayjs | null) => void;
};

const ItinEditFormTimePicker: React.FC<CustomTimePickerProps> = (props) => (
    <ThemeProvider theme={theme}>
        <DesktopTimePicker {...props} />
    </ThemeProvider>
);

export default ItinEditFormTimePicker;
