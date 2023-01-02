import { Button, Input, InputNumber, message } from 'antd'
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { setToken, URL } from '../../assets/api/URL'

const PaymentPage = ({
  ordering, 
  setOrdering,
  selectedClient
}) => {
  const { branch_id, basket } = useSelector(state => state.orderReducer)
  const { t } = useTranslation()
  const [paidSumm, setPaidSumm] = useState(0)

  const [paymentTypes, setPaymentTypes] = useState({
    card: 0,
    cash: 0,
    debt: 0
  })
  
  const getTotalBasketPrice = () => {
    const allSum = []
    basket?.map((item) => {
      allSum.push(Number(item?.price) * Number(item?.count))
    })
    return allSum.reduce((prev, curr) => {
      return prev + curr
    }, 0)
  }

  useEffect(() => {
    const {card, cash, debt} = paymentTypes
    setPaidSumm((card + cash + debt))
  }, [paymentTypes])

  const handleSendOrder = () => {
    const products = []
    basket?.map((item) => {
      products.push({count: item?.count, price: item?.price, product_id: item?.id, unit_id: item?.warehouse?.unit?.id})
    })
    const data = {
      ...paymentTypes,
      description:"",
      client_id: selectedClient?.id,
      orders:products,
      term:""
   }

   axios.post(`${URL}/api/order`, data, setToken())
    .then((res) => {
      message.success(t("muaffaqiyatli"))
    })
    .catch(() => {
      message.error(t("xatolik"))
    })
  }

  return (
    <div className='flex gap-4 items-scratch w-full min-h-screen sm:flex-col md:flex-row  lg:flex-row'>
      <div className="check bg-white p-4 rounded-sm lg:w-1/3 md:w-1/3 sm:w-full ">
        This is check page
      </div>
      <div className='lg:w-2/3 md:w-2/3 bg-white rounded-sm p-4 sm:w-full flex flex-col'>
        <header className='flex w-full justify-between items-center'>
          <span
            onClick={() =>setOrdering(false)}
            className='flex items-center font-medium cursor-pointer py-2 px-4 bg-gray-100 inline-flex active:opacity-70'>
          <i class='bx bx-chevron-left mt-0.5'></i>
          {t("cancel")}
          </span>
          <span>
          <span className='font-medium'>{t("total_price")}: {getTotalBasketPrice()?.toLocaleString()} uzs</span> <br />
          <span className='font-medium'>{t("remaining_sum")}: {(getTotalBasketPrice() - paidSumm).toLocaleString()} uzs</span>
          </span>
        </header>
        <span className='mt-8 mb-2 font-medium text-gray-500'>{t("tolov_turi")}</span>
        <div className='grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1	w-full gap-4'>
          <button
            disabled={getTotalBasketPrice() === paidSumm || getTotalBasketPrice() < paidSumm} 
            onClick={() => {
              if (paidSumm < getTotalBasketPrice()){
                setPaymentTypes({
                  ...paymentTypes,
                  card:  paymentTypes?.card + getTotalBasketPrice() - paidSumm
                })
              }
            }}
            className='
              disabled:opacity-50
              disabled:cursor-not-allowed
              bg-gray-200 p-4 rounded-md cursor-pointer flex items-scratch justify-between active:opacity-70'>
            <span
              className='font-medium text-md '
            >{t("card")}</span>
            <i className='bx bx-plus text-xl text-indigo-500 '></i>
          </button>
          <button
          disabled={getTotalBasketPrice() === paidSumm || getTotalBasketPrice() < paidSumm}  
            onClick={() => {
              if (paidSumm < getTotalBasketPrice()){
              setPaymentTypes({
                ...paymentTypes,
                cash: paymentTypes?.cash + getTotalBasketPrice() - paidSumm
              })}
            }}
            className='
            disabled:opacity-50
            disabled:cursor-not-allowed
              bg-gray-200 p-4 rounded-md cursor-pointer flex items-scratch justify-between active:opacity-70'>
            <span
              className='font-medium text-md '
            >{t("cash")}</span>
            <i className='bx bx-plus text-xl text-indigo-500 '></i>
          </button>
          <button
            disabled={getTotalBasketPrice() === paidSumm || getTotalBasketPrice() < paidSumm}  
            onClick={() => {
              if (paidSumm < getTotalBasketPrice()){
              setPaymentTypes({
                ...paymentTypes,
                debt: paymentTypes?.debt + getTotalBasketPrice() - paidSumm
              })
            } else {
              console.info(getTotalBasketPrice())
            }
            }}
            className='
              disabled:opacity-50
              disabled:cursor-not-allowed
              bg-gray-200 p-4 rounded-md cursor-pointer flex items-scratch justify-between active:opacity-70'>
            <span
              className='font-medium text-md '
            >{t("qarz")}</span>
            <i className='bx bx-plus text-xl text-indigo-500 '></i>
          </button>
        </div>

        <div className='p-4 bg-gray-100 grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1	w-full gap-4 mt-8'
          style={{minHeight: "120px"}}
        >
            {
              paymentTypes?.card !== 0 ? (
                <div className='bg-white p-2 rounded-md flex flex-col'>
                  <div className='flex w-full flex justify-between items-scratch'>
                  <span className='font-medium text-center mb-2'>{t("card")}</span>
                  <i 
                    onClick={() => setPaymentTypes({...paymentTypes, card: 0})}
                    className='bx bx-x text-red-500 cursor-pointer text-xl'></i>
                  </div>
                  <InputNumber
                    className='w-full' 
                    onChange={e => {
                      setPaymentTypes({...paymentTypes, card: e})
                    }}
                    value={paymentTypes?.card}
                  />
                </div>
              ) : null
            }
            {
              paymentTypes?.cash !== 0 ? (
                <div className='bg-white p-2 rounded-md flex flex-col'>
                  <div className='flex w-full flex justify-between items-scratch'>
                  <span className='font-medium text-center mb-2'>{t("cash")}</span>
                  <i 
                    onClick={() => setPaymentTypes({...paymentTypes, cash: 0})}
                    className='bx bx-x text-red-500 cursor-pointer text-xl'></i>
                  </div>
                  <InputNumber 
                    className='w-full'
                    onChange={e => {
                      setPaymentTypes({...paymentTypes, cash: e})
                    }}
                    value={paymentTypes?.cash}
                  />
                </div>
              ) : null
            }
            {
              paymentTypes?.debt !== 0 ? (
                <div className='bg-white p-2 rounded-md flex flex-col'>
                  <div className='flex w-full flex justify-between items-scratch'>
                  <span className='font-medium text-center mb-2'>{t("qarz")}</span>
                  <i 
                    onClick={() => setPaymentTypes({...paymentTypes, debt: 0})}
                    className='bx bx-x text-red-500 cursor-pointer text-xl'></i>
                  </div>
                  <InputNumber
                    className='w-full'
                    onChange={e => {
                      setPaymentTypes({...paymentTypes, debt: e})
                    }}
                    value={paymentTypes?.debt}
                  />
                </div>
              ) : null
            }
        </div>

        <div className='w-full flex items-center justify-end'>
            <Button
              onClick={handleSendOrder}
              disabled={paidSumm < getTotalBasketPrice() || !selectedClient?.id}
              className='btn btn-primary mt-4'
            >{t("order")}</Button>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage