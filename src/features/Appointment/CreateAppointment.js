import { CacheProvider } from '@emotion/react';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import createCache from '@emotion/cache';
import { Box, Grid, TextField, Button } from '@mui/material';
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import InputAdornment from '@mui/material/InputAdornment';
import { useSelector } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import { createNewAppointment } from './appointmentApi';
import { useNavigate } from 'react-router-dom';







const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});




const CreateAppointment = () => {
    const schema = Joi.object({
        appointmentDate: Joi.date()
            .iso()
            .greater('now')
            .custom((value, helpers) => {
                const date = new Date(value);
                if (date.getDay() === 6) {
                    return helpers.message('אנחנו סגורים בשבת');
                }
                return value;
            })
            .required()
            .messages({
                'date.base': 'התאריך חייב להיות תאריך חוקי',
                'date.format': ' התאריך חייב להיות בפורמט ISO ',
                'date.greater': 'התאריך שבחרת- צריך להיות גדול מהתאריך הנוכחי ',
                'string.empty': 'שדה חובה'
            }),
        appointmentHour: Joi.string()
            .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/) // Regular expression to match HH:mm format
            .custom((value, helpers) => {
                const [hours, minutes] = value.split(':').map(Number);
                const now = new Date();
                const currentHours = now.getHours();
                const currentMinutes = now.getMinutes();
                const selectedDate = new Date(helpers.state.ancestors[0].appointmentDate);
                
                // Check if the date is today
                const isToday = selectedDate.toDateString() === now.toDateString();
                
                if (hours < 10 || hours >= 18) {
                    return helpers.message('הפגישה חייבת להיות בין השעות 10 בבוקר ל-6 אחר הצהריים');
                }

                if (isToday && ((hours < currentHours) || (hours === currentHours && minutes <= currentMinutes))) {
                    return helpers.message('השעה חייבת להיות יותר מהשעה הנוכחית');
                }

                return value;
            })
            .required()
            .messages({
                'string.pattern.base': 'השעה חייבת להיות בפורמט HH:mm',
                'string.empty': 'שדה חובה'

            })
    });


    let { register, handleSubmit, formState: { errors } } = useForm({
        mode: "all",
        defaultValues: {
        }
        ,
        resolver: joiResolver(schema)
    });
    const navigate = useNavigate();

    const changeFormatOfDate = (date) => {
        const changeDate = date.toISOString().split('T')[0];
        return changeDate;
    }
    
    const addAppointment = async (data) => {
        try {
            let changedDate = changeFormatOfDate(data.appointmentDate);
            let hour = data.appointmentHour;
            const dateAndHour = `${changedDate}T${hour}:00`;
    
            const appointmentData = { appointmentDate: dateAndHour };
    
            let addAppointmentToDB = await createNewAppointment(appointmentData);
            if (addAppointmentToDB) {
                handleClick(SlideTransition, 'התור נקבע בהצלחה!')();
                navigate('/');
                
            }
        } catch (err) {
            handleClick(SlideTransition, err.response.data)();
        }
    }


    function SlideTransition(props) {
        return <Slide {...props} direction="up" />;
    }

    const [state, setState] = useState({
        open: false,
        Transition: Fade,
        successMessage: "",
    });

    const handleClick = (Transition, message) => () => {
        setState({
            open: true,
            Transition,
            successMessage: message,
        });
    };

    const handleClose = () => {
        setState({
            ...state,
            open: false,
        });
    };
    return (<div
        style={{ margin: "auto", marginTop: "1%", maxWidth: "400px" }}>

        <CacheProvider value={cacheRtl}>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <img src={'../../../pic/createAppointment.png'} alt='createAppointment' style={{ width: "70%" }} />
            </div>
            <Box
                component="form"
                onSubmit={handleSubmit(addAppointment)}
                sx={{ width: 400 }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>

                        <TextField
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            style={{ textAlign: "center", direction: "rtl" }} margin='normal'
                            id="outlined-start-adornment"
                            label="בתאריך"
                            type='date'
                            {...register("appointmentDate")}
                            error={!!errors.appointmentDate}
                            helperText={errors.appointmentDate && errors.appointmentDate.message}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            InputLabelProps={{ shrink: true }}

                            id="outlined-search"
                            label="בשעה"
                            type='time'

                            {...register("appointmentHour")}
                            error={!!errors.appointmentHour}
                            helperText={errors.appointmentHour && errors.appointmentHour.message}

                        />
                    </Grid>

                </Grid>
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ minWidth: "40%", mb: 3, mt: 2 }}
                > תקבעו לי תור למספרה :)</Button>
            </Box>
            <div>
                {state.open && <Snackbar
                    open={state.open}
                    onClose={handleClose}
                    TransitionComponent={state.Transition}
                    message={state.successMessage}
                    key={state.Transition.name}
                    autoHideDuration={3000}
                />}
            </div>
        </CacheProvider>

    </div >);
}

export default CreateAppointment;