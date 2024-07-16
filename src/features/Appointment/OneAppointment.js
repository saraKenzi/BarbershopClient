import React, { useEffect, useState } from "react";
import { ListItemButton, ListItemText, Button } from '@mui/material';
import './appointmentCss/oneAppointment.css';
import PetsIcon from '@mui/icons-material/Pets';
import { Link, Outlet } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Fade from '@mui/material/Fade';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { getUserDetailsByUserId } from "../user/userApi";
import { deleteAppointment } from "./appointmentApi";

const OneAppointment = ({ one, arr, setArr, details }) => {
    const user = useSelector(state => state.user.currentUser);
    const [stateS, setStateS] = React.useState({
        open: false,
        Transition: Fade,
        successMessage: "",
    });

    const [openD, setOpenD] = React.useState(false);
    const [openA, setOpenA] = React.useState(false);
    const [userDetails, setUserDetails] = useState(null);

    const handleClickOpenD = () => setOpenD(true);
    const handleCloseD = () => setOpenD(false);
    const handleClickOpenA = () => setOpenA(true);
    const handleCloseA = () => setOpenA(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }
    
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    useEffect(() => {
        if (one && one.userId) {
            getUserDetails(one.userId);
        }
    }, [one]);

    const getUserDetails = async (userId) => {
        try {
            const response = await getUserDetailsByUserId(userId);
            setUserDetails(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const deleteFromServer = async (appointmentIdToDelete) => {
        try {
            handleCloseD();
            const res = await deleteAppointment(appointmentIdToDelete);
            if (res) {
                const updatedAppointment = arr.filter(appointment => appointment.appointmentId !== appointmentIdToDelete);
                setArr(updatedAppointment);
            }
        } catch (err) {
            console.error("error in delete from server function", err);
        }
    }

    if (!one) {
        return <div>אין מידע על התור</div>;
    }

    return (
        <>
            <React.Fragment>
                <Dialog
                    open={openD}
                    onClose={handleCloseD}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"אזהרה!"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            האם אתה בטוח שברצונך למחוק את התור?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseD}>לא, בטעות לחצתי</Button>
                        <Button onClick={() => deleteFromServer(one.appointmentId)} autoFocus>
                            כן, מאשר מחיקה
                        </Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>

            <React.Fragment>
                <Dialog
                    open={openA}
                    onClose={handleCloseA}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" sx={{ textAlign: "center", fontWeight: "bold" }}>
                        פרטי התור הקיים במערכת:
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Typography sx={{ ml: 2, flex: 1, textAlign: "center" }} variant="h6" component="div">
                                <b>שם:</b> {userDetails?.firstName ?? ''} {userDetails?.lastName ?? ''}
                            </Typography>
                            <Typography sx={{ ml: 2, flex: 1, textAlign: "center" }} variant="h6" component="div">
                                <b>מספר מזהה:</b> {userDetails?.userId ?? ''}
                            </Typography>
                            <Typography sx={{ ml: 2, flex: 1, textAlign: "center" }} variant="h6" component="div">
                                <b> טלפון ליצירת קשר:</b> {userDetails?.phone ?? ''}
                            </Typography>
                            <Typography sx={{ ml: 2, flex: 1, textAlign: "center" }} variant="h6" component="div">
                                <b> מתי ניפגש ?</b>
                            </Typography>
                            <Typography sx={{ ml: 2, flex: 1, textAlign: "center" }} variant="h6" component="div">
                                <b> בתאריך:</b> {formatDate(one.appointmentDate)}
                            </Typography>
                            <Typography sx={{ ml: 2, flex: 1, textAlign: "center" }} variant="h6" component="div">
                                <b> בשעה: </b>{formatTime(one.appointmentDate)}
                            </Typography>
                            <Typography sx={{ ml: 2, flex: 1, textAlign: "center", fontStyle: 'italic' }} variant="h9" component="div">
                                <b>תור זה נוצר בתאריך:</b> {formatDate(one.createdDate)}
                            </Typography>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseA}>הבנתי, מעולה!</Button>
                    </DialogActions>
                </Dialog>
            </React.Fragment>

            <div className="item-appointment-container">
                <ListItemButton className="listItemStyle">
                    <Button className="btnStyle">
                        <PetsIcon fontSize="small" />
                    </Button>
                    <ListItemText sx={{ ml: 2 }} primary={`${formatDate(one.appointmentDate)}`} />
                    <ListItemText sx={{ ml: 2 }} primary={`${formatTime(one.appointmentDate)}`} />
                    <ListItemText sx={{ ml: 2 }} secondary={`${userDetails?.firstName ?? ''} ${userDetails?.lastName ?? ''}`} />
                    <div className="quantity-controls">
                        <Tooltip title="פרטי התור" placement="bottom">
                            <Button className="btnStyle" onClick={handleClickOpenA}>
                                <VisibilityIcon fontSize="small" />
                            </Button>
                        </Tooltip>
                        {user && user.userId === one.userId ? (
                            <Link to={`/editAppointment/${one.appointmentId}`} state={{ appointmentDate: one.appointmentDate }}>
                                <Tooltip title="עריכה" placement="bottom">
                                    <Button className="btnStyle">
                                        <EditIcon fontSize="small" />
                                    </Button>
                                </Tooltip>
                            </Link>
                        ) : (
                            <Tooltip title="עריכה לא זמינה" placement="bottom">
                                <Button className="btnStyleGrey">
                                    <EditOffIcon fontSize="small" />
                                </Button>
                            </Tooltip>
                        )}
                        {user && user.userId === one.userId ? (
                            <Tooltip title="מחיקה" placement="bottom">
                                <Button className="btnStyle" onClick={handleClickOpenD}>
                                    <DeleteIcon fontSize="small" />
                                </Button>
                            </Tooltip>
                        ) : (
                            <Tooltip title="מחיקה לא זמינה" placement="bottom">
                                <Button className="btnStyleGrey">
                                    <DeleteForeverIcon fontSize="small" />
                                </Button>
                            </Tooltip>
                        )}
                    </div>
                </ListItemButton>
            </div>
        </>
    );
};

export default OneAppointment;
