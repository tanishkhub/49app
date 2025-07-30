import {axiosi} from '../../config/axios'


export const createOrder=async(order)=>{
    try {
        const res=await axiosi.post("/orders",order)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}

export const getOrderByUserId=async(id)=>{
    try {
        const res=await axiosi.get(`/orders/user/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}

// export const getAllOrders=async()=>{
//     try {
//         const res=await axiosi.get(`/orders`)
//         return res.data
//     } catch (error) {
//         throw error.response.data
//     }
// }

export const getAllOrders=async(page, rowsPerPage,searchId,filterStatus,sortOrder)=>{
    try {
        const res=await axiosi.get(`/orders?page=` + page + '&limit=' + rowsPerPage + '&searchId=' + searchId +'&filterStatus='+ filterStatus +'&sortOrder='+sortOrder)
        // alert(res.headers['x-total-count']);
        const totalOrders=await res.headers.get("x-total-count")
        return {orders:res.data,count:totalOrders}
    } catch (error) {
        throw error.response.data
    }
}

export const updateOrderById=async(update)=>{
    try {
        const res=await axiosi.patch(`/orders/${update._id}`,update)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}