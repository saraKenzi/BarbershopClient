import { CacheProvider } from '@emotion/react';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import createCache from '@emotion/cache';
import { Box, Grid, TextField, Button } from '@mui/material';
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import { updateAppointmentDate } from './appointmentApi';
import { useNavigate } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';

const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

const EditAppointment = () => {
    const location = useLocation();
    const { appId } = useParams();
    const navigate = useNavigate();

    const { appointmentDate } = location.state || {};
    const [date, setDate] = useState('');
    const [hour, setHour] = useState('');

    useEffect(() => {
        if (appointmentDate) {
            const [datePart, hourPart] = appointmentDate.split('T');
            const changeFormatHour=hourPart.slice(0, 5);
            setDate(datePart);
            setHour(changeFormatHour);
        }
    }, [appointmentDate]);

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
                'date.format': 'התאריך חייב להיות בפורמט ISO',
                'date.greater': 'התאריך שבחרת צריך להיות גדול מהתאריך הנוכחי',
                'string.empty': 'שדה חובה'
            }),
        appointmentHour: Joi.string()
            .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/) //  HH:mm format
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

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "all",
        resolver: joiResolver(schema)
    });

    const changeFormatOfDate = (date) => {
        const changeDate = date.toISOString().split('T')[0];
        return changeDate;
    }

    const editAppointment = async (data) => {
        try {
            let changedDate = changeFormatOfDate(data.appointmentDate);
            let hour = data.appointmentHour;
            const dateAndHour = `${changedDate}T${hour}:00`;

            const appointmentData = { appointmentDate: dateAndHour };

            let addAppointmentToDB = await updateAppointmentDate(appId, appointmentData);
            if (addAppointmentToDB) {
                handleClick(SlideTransition, 'התור עודכן בהצלחה!')();
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            handleClick(SlideTransition, err.message)();
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

    return (
        <div style={{ margin: "auto", marginTop: "1%", maxWidth: "400px" }}>
            <CacheProvider value={cacheRtl}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <img src={'../../../pic/updateAppointment.png'} alt='createAppointment' style={{ width: "70%" }} />
                </div>
                <Box component="form" onSubmit={handleSubmit(editAppointment)} sx={{ width: 400 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                InputLabelProps={{ shrink: true }}
                                fullWidth
                                style={{ textAlign: "center", direction: "rtl" }} margin='normal'
                                id="outlined-start-adornment"
                                label="בתאריך"
                                value={date}
                                type='date'
                                {...register("appointmentDate")}
                                error={!!errors.appointmentDate}
                                helperText={errors.appointmentDate && errors.appointmentDate.message}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                id="outlined-search"
                                label="בשעה"
                                type='time'
                                value={hour}
                                {...register("appointmentHour")}
                                error={!!errors.appointmentHour}
                                helperText={errors.appointmentHour && errors.appointmentHour.message}
                                onChange={(e) => setHour(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                    <Button type="submit" variant="contained" sx={{ minWidth: "40%", mb: 3, mt: 2 }}>
                        עדכון התור :)
                    </Button>
                </Box>
                <div>
                    {state.open && (
                        <Snackbar
                            open={state.open}
                            onClose={handleClose}
                            TransitionComponent={state.Transition}
                            message={state.successMessage}
                            key={state.Transition.name}
                            autoHideDuration={3000}
                        />
                    )}
                </div>
            </CacheProvider>
        </div>
    );
}

export default EditAppointment;
