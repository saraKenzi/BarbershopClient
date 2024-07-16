import { getAllAppointments, getFutureAppointmentsCount } from './appointmentApi';
import OneAppointment from './OneAppointment';
import './appointmentCss/allAppointments.css';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

// alert-successes-style
import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
// pagination-style
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { orange } from "@mui/material/colors";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/material';


import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { getUserDetailsByUserId, getUserIdByFirstName } from "../user/userApi";
import { useNavigate } from "react-router-dom";
import { userOut } from "../user/userSlice";


const cacheRtl = createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
});

const AllAppointments = () => {

    const [searchName, setSearchName] = useState('');
    const [active, setActive] = useState([]);
    const [typeToSort, setTypeToSort] = useState('');

    const [arrAppointmens, setArrAppointmens] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isConnection, setIsConnection] = useState(false);

    const itemsPerPage = 8;
    let [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    const [page, setPage] = useState(1);
    const handleChange = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        //המרת כל שדות התאריך לפורמט של תאריך
        const convertedArr = arrAppointmens.map(appointment => ({
            ...appointment,
            appointmentDate: new Date(appointment.appointmentDate)
        }));
        setArrAppointmens(convertedArr);
    }, []);

    useEffect(() => {
        sortBy(typeToSort);
    }, [typeToSort]);

    const sortBy = (typeToSort) => {
        let copy = [...active];

        switch (typeToSort) {

            case 1:
                // sort by date Up
                copy.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
                break;

            case 2:
                // sort by date Down  
                console.log(typeToSort);

                copy.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
                break;

            default:
                break;
        }
        setArrAppointmens(copy);
    }

    useEffect(() => {
        getFutureAppointmentsCount()
            .then(res => {
                let count = res.data;
                setTotalPages(Math.ceil(count / itemsPerPage));
            })
            .catch((err) => {
               
            })
    }, [page, active])

    useEffect(() => {
        getAllAppointments(page, itemsPerPage, "")
            .then(res => {
                setArrAppointmens(res.data);
                setLoading(false);
                setIsConnection(true);
                handleClick(SlideTransition, "התחברת בהצלחה לשרת")();
            })
            .catch((err) => {
                setLoading(false);
                handleClick(SlideTransition, err.message)();
                });
    }, [page]);

    useEffect(() => {
        setActive(arrAppointmens);
    }, [arrAppointmens]);

    const handleFilterName = async () => {
        try {
            if (!searchName) {
                // אם תיבת החיפוש ריקה, הצג את כל התוצאות ללא שליחת בקשה לשרת
                setActive(arrAppointmens);
                return;
            }
            const ids = await getUserIdByFirstName(searchName);

            if (ids && ids.length > 0) {
                const userIds = ids.map(user => user.userId);
                const filtered = arrAppointmens.filter(x => userIds.includes(x.userId));
                if (filtered.length > 0)
                    setActive(filtered);
                else {
                    setActive([]);
                    handleClick(SlideTransition, `אין תור ללקוח שמכיל את האותיות:${searchName}`)();
                }
            }
            else {
                setActive([]);
            }
        } catch (err) {
            setActive([]);
            handleClick(SlideTransition, err.response.data)();
        }
    };

    const onChange = (event) => {
        const value = event.target.value;
        setSearchName(value);
    }

    const handleChangeType = (e) => {
        setTypeToSort(e.target.value);
    };




    return (
        <div >
            {isConnection && <Grid container mt={1}>
                <div className=" list-container">
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <img src={'../../../pic/getAllAppoinments.png'} alt='createAppointment' style={{ width: "50%" }} />
                    </div>


                    <Box display="flex" justifyContent="center">
                        <FormControl sx={{ m: 1, minWidth: 200 }}>
                            <CacheProvider value={cacheRtl}>
                                <TextField
                                    id="outlined-basic"
                                    className='searchTextFile'
                                    value={searchName}
                                    label="חפש לקוח"

                                    onChange={(event) => {
                                        onChange(event);
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => { handleFilterName(); }}
                                                    sx={{ color: orange[900], padding: '4px' }}
                                                    aria-label="search"
                                                >
                                                    <SearchIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{ width: '100%' }}
                                />
                            </CacheProvider>
                        </FormControl>

                        <FormControl sx={{ m: 1, minWidth: 150 }}>
                            <InputLabel id="demo-simple-select-autowidth-label">מיון</InputLabel>
                            <Select
                                labelId="demo-simple-select-autowidth-label"
                                id="demo-simple-select-autowidth"
                                value={typeToSort}
                                onChange={handleChangeType}
                                autoWidth
                                label="מיון"
                                sx={{ height: 55 }}
                            >
                                <MenuItem value=""><em>ללא</em></MenuItem>
                                <MenuItem value={1}>מיון לפי תאריך עולה</MenuItem>
                                <MenuItem value={2}>מיון לפי תאריך יורד</MenuItem>

                            </Select>
                        </FormControl>
                    </Box>
                    {active.map((item) => (
                        <li className="listAppointmentStyle" key={item.appointmentId}>
                            <OneAppointment
                                one={item}
                                arr={arrAppointmens}
                                setArr={setArrAppointmens}
                            />
                        </li>
                    ))}
                </div>
            </Grid>}

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

            <br />

            {
                !loading && isConnection && (
                    <Stack className="footer" alignItems="center" spacing={2}>
                        <Pagination sx={{ zIndex: 1200 }}
                            count={totalPages}
                            onChange={handleChange}
                            page={page}
                            renderItem={(item) => (
                                <PaginationItem
                                    slots={{ previous: ArrowForwardIcon, next: ArrowBackIcon }}
                                    {...item}
                                />
                            )}
                        />
                    </Stack>
                )
            }
        </div >
    );
}

export default AllAppointments;

