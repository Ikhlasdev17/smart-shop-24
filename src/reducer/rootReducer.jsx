import { combineReducers } from "redux";

import productsReducer from '../redux/productsSlice'
import clientsReducer from './../redux/clientsReducer';
import sellersReducer from './../redux/sellersSlice'
import categoriesReducer from './../redux/categoriesSlice'
import ordersReducer from './../redux/ordersSlice'
import consumptionReducer from '../redux/consumtionSlice'
import userReducer from '../redux/userSlice'
import orderReducer from "../redux/orderSlice";

const rootReducer = combineReducers({
    userReducer,
    productsReducer,
    clientsReducer,
    sellersReducer,
    categoriesReducer,
    consumptionReducer,
    ordersReducer,
    orderReducer
})

export default rootReducer