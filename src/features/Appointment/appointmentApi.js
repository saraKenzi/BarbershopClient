import axios from "axios";

let baseUrl = "https://localhost:44369/api/appointment"

const getAllAppointments = async (page, perPage, search) => {
    try {
        const response = await axios.get(`${baseUrl}/getAllAppointments?page=${page}&&perPage=${perPage}&&search=${search}`,
            { withCredentials: true }  // כולל את הקוקיז בבקשה

        );
        return response;
    }
    catch (error) {
        console.error('get all appointments error:', error);
        throw error;

    }
}


const getFutureAppointmentsCount = async () => {
    try {
        const response = await axios.get(`${baseUrl}/getFutureAppointmentsCount`,
            { withCredentials: true }
        );
        return response;
    }
    catch (error) {
        console.error('get future appointments count error:', error);
        throw error;

    }
}

const deleteAppointment = async (id) => {
    try {
        const response = await axios.delete(`${baseUrl}/deleteAppointment/${id}`,
            { withCredentials: true }

        );
        return response;
    }
    catch (error) {
        console.error('delete appointment error:', error);
        throw error;

    }
}

const createNewAppointment = async (appointmentDate) => {
    try {
        const response = await axios.post(`${baseUrl}/createNewAppointment`, appointmentDate,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }
        );
        return response;
    }
    catch (error) {
        console.error('create new appointment error:', error);
        throw error;

    }
}


const updateAppointmentDate = async (appId, updateAppointment) => {
    try {
        const response = await axios.put(`${baseUrl}/updateAppointmentDate/${appId}`, updateAppointment,
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }
        );
        return response;

    }
    catch (error) {
        console.error('update appointment date error:', error);
        throw error;

    }
}





export { getAllAppointments, createNewAppointment, updateAppointmentDate, deleteAppointment, getFutureAppointmentsCount };
