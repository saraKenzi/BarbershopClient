import { useForm } from "react-hook-form"
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import './userCss/login.css';
import { signUpInServer } from "./userApi";
import { useDispatch } from "react-redux";
import { userIn, userOut } from "./userSlice";
import { Link } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import { useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import { useNavigate } from "react-router-dom";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { TIMEOUTS } from "../../utils/constants";




const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});
const SignUp = () => {
    let dispatch = useDispatch();

    const schema = Joi.object({
        firstName: Joi.string().required()
            .messages({ 'string.empty': 'שם פרטי הוא שדה חובה.' }),

        lastName: Joi.string().required()
            .messages({ 'string.empty': 'שם משפחה הוא שדה חובה.' }),

        phone: Joi.string().pattern(/^05\d{8}$/).required()
            .messages({
                'string.pattern.base': 'מספר הטלפון חייב להיות 10 ספרות ולהתחיל ב-05.',
                'string.empty': 'מספר הטלפון הוא שדה חובה.'
            }),

            userName: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]+$')).required()
            .messages({
                'string.empty': 'שם המשתמש הוא שדה חובה.',
                'string.pattern.base': 'שם המשתמש חייב להכיל רק אותיות באנגלית ומספרים.'
            }),
    
            password: Joi.string().pattern(new RegExp('^[0-9]{4,}$')).required()
            .messages({
                'string.empty': 'הסיסמה היא שדה חובה.',
                'string.pattern.base': 'הסיסמה חייבת להכיל לפחות 4 ספרות.'
            })

    })


    let { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: "all",
        defaultValues: {
            // userName: "sara"
        }
        ,
        resolver: joiResolver(schema)
    });

    ///loading
    const [open, setOpen] = React.useState(false);
    const handleClose2 = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    ////

    const [welcome, setWelcome] = useState(false);
    let navigate = useNavigate();

    const signup = async (data) => {
        try {
            console.log(data);

            handleOpen();

            let res = await signUpInServer(data);
            // alert(res.data+"התחברת  בהצלחה");
            setOpen(false);
            setWelcome(true)
            dispatch(userIn(res.data));
            setTimeout(() => {
                navigate("/");

            }, 3000);
            setTimeout(() => {
                alert("לצורך הגנה, פג תוקף זמן השהות במערכת, תוכל להתחבר שוב אם תרצה");
                navigate("/login");
                dispatch(userOut());
            }, TIMEOUTS.AUTH_TIMEOUT);
        }
        catch (err) {
            setOpen(false);
            handleClick(SlideTransition, err.response.data)();
        }
    }

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };



    function SlideTransition(props) {
        return <Slide {...props} direction="up" />;
    }

    const [state, setState] = React.useState({
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


    return (<div className="signUp">
        <CacheProvider value={cacheRtl}>
            {welcome &&
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <img style={{ width: '30%' }} src={'../../../pic/welcom.png'} alt='welcome' />
                </div>}

            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh"  }}>
                <img src={'../../../pic/signup.png'} alt='logo' style={{ width: "15%" }} />

                <Box
                    component="form"
                    onSubmit={handleSubmit(signup)}
                    sx={{ mt: 0 }}
                >

                    <TextField sx={{
                        mb: 1
                    }}
                        id="outlined-start-adornment"
                        label="שם פרטי"
                        error={!!errors.firstName}
                        {...register("firstName")}

                    />

                    {errors.firstName && <span className="errMsg">{errors.firstName.message}</span>}
                    <TextField sx={{
                        mb: 1,
                    }}
                        id="outlined-start-adornment"
                        label="שם משפחה"
                        error={!!errors.lastName}

                        {...register("lastName")}

                    />
                    {errors.lastName && <span className="errMsg">{errors.lastName.message}</span>}

                    <TextField sx={{
                        mb: 1,
                    }}
                        id="outlined-start-adornment"
                        label="טלפון "
                        error={!!errors.phone}


                        {...register("phone")}

                    />
                    {errors.phone && <span className="errMsg">{errors.phone.message}</span>}

                    <TextField sx={{
                        mb: 1,
                    }}
                        id="outlined-start-adornment"
                        label="שם משתמש "
                        error={!!errors.userName}


                        {...register("userName")}

                    />
                    {errors.userName && <span className="errMsg">{errors.userName.message}</span>}

                    <Box display="flex" alignItems="center" ml={16}  >
                        <Typography fontSize={12}>להצגת הסיסמא</Typography>
                        <IconButton size="small"
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </Box>

                    <TextField sx={{
                        mb: 1,
                        //  minWidth: "38%"
                    }}
                        // required
                        id="outlined-start-adornment"
                        label="סיסמא"
                        type={showPassword ? 'text' : 'password'}
                        error={!!errors.password}

                        {...register("password")}

                    />
                    {errors.password && <span className="errMsg">{errors.password.message}</span>}





                    <Button variant="contained"
                        type="submit" sx={{ minWidth: "40%", mb: 3, mt: 2 }}
                    >הרשמה</Button>
                </Box>
                <div >
                    {/* <Link to="/SendMail">שכחתי סיסמא / </Link> */}
                    <Link to="/logIn">כבר נרשמתי בעבר</Link>
                </div>
            </Box >

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose2}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

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
    </div>
    );
}
export default SignUp;



