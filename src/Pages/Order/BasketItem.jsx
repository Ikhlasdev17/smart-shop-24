import { Button, InputNumber, message } from 'antd'
import axios from 'axios'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setToken, URL } from '../../assets/api/URL'
import { changeProductCount, changeProductPrice, removeFromBasket } from '../../redux/orderSlice'
import './order.scss'
const BasketItem = (props) => {
  const { name, id, image, brand, price, warehouse, min_price, max_price, whole_price, count } = props
  const [newPrice, setNewPrice] = useState(null)
  const [newCount, setNewCount] = useState(null)
  const dispatch = useDispatch()
  const [currency, setCurrency] = useState({})
  const unit_id_options = [
    { id: 1, label: t("dona") },
    { id: 2, label: t("tonna") },
    { id: 3, label: t("kilogram") },
    { id: 4, label: t("gramm") },
    { id: 5, label: t("meter") },
    { id: 6, label: t("sm") },
    { id: 7, label: t("liter") },
  ];
  const usdRate = currency[1]?.rate[0]?.rate

  useEffect(() => {
    axios.get(`${URL}/api/currency`, setToken())
      .then((res) => {
        setCurrency(res.data.payload)
      })
  }, [])

  useEffect(() => {
    if (newCount) {
      if (newCount > warehouse?.count) {
        message.error(t("max_count")+" "+":"+warehouse?.count)
        setNewCount(warehouse?.count)
        dispatch(changeProductCount({id: id, count: warehouse?.count}))
      } else {
        dispatch(changeProductCount({id: id, count: newCount}))
      }
    }
  }, [newCount])

 const changePriceFunc = () => {
  const minPrice = Math.min(
    min_price?.code === "UZS" ? min_price?.price : (Number(min_price?.price) * Number(usdRate)), 
    max_price?.code === "UZS" ? max_price?.price : (Number(max_price?.price) * Number(usdRate)), 
    whole_price?.code === "UZS" ? whole_price?.price : (Number(whole_price?.price) * Number(usdRate)), 
  )
  if (newPrice && newPrice !== 0) {
    if (newPrice < minPrice) {
      message.error(`${t("min_price")}: ${minPrice}`)
      setNewPrice(minPrice)
    } else if (newPrice > max_price?.price) {
      message.error(`${t("max_price")}: ${minPrice}`)
      setNewPrice(max_price?.price)
    } else {
      dispatch(changeProductPrice({id: id, price: newPrice}))
    }
  } else {
    message.error("Xatolik")
  }
 }


  return (
    <li className='
      shadow-md 
      rounded-md 
      my-2 p-4
      flex
      bg-gray-100
      gap-x-2
    '>
      <img 
        src={image ? image : "https://www.lg.com/lg5-common/images/common/product-default-list-350.jpg"}
        alt={name}
        width={100}
        className="shadow-sm"
      />

      <div className='px-2 w-full'>
        <div className='flex gap-x-4 items-start w-full justify-between'>
          <div className=''>
          <h2 className='text-xl'>{name}</h2>
          <span className='font-medium'>
            <>{t("brend")}: {brand}</>
          </span>
          </div>

          <div>
            {
              Number(price) < Number(max_price?.code === "UZS" ? max_price?.price : (usdRate * max_price?.price)) ? (
                <del className='text-lg text-red-500'>
                <span className='font-medium'>
                  {Number(max_price?.code === "UZS" ? max_price?.price : (usdRate * max_price?.price))?.toLocaleString()} 
                </span> UZS</del>
              ) : null
            }

            <h2 className='text-xl'>
            <span className='font-medium'>
              {Number(price)?.toLocaleString()} 
            </span> UZS</h2>
            <h3 className='text-lg'>
            <span className='font-medium'>{t("")}{
              Number(warehouse?.count)?.toLocaleString()
            }</span>  {
            warehouse?.unit?.id ?
            unit_id_options?.find(item => item?.id === warehouse?.unit?.id)?.label : "" }</h3>
          </div>
        </div>
        <br />
        <div className='flex gap-x-2 items-scratch justify-between'>
          <div className='flex gap-x-2 items-scratch'>
          <div className='flex gap-x-2 items-scratch'>
            <InputNumber 
              className=' '
              placeholder={t("price")}
              type="number" 
              onChange={e => setNewPrice(e)}
              value={newPrice}
            />
            <Button
              className='btn btn-primary'
              disabled={!newPrice}
              onClick={changePriceFunc}
            >{t("save")}</Button>
          </div>
          <div className='flex  items-scratch'>
          <Button
              className='btn btn-primary'
              disabled={newCount === 1 || !newCount}
              onClick={() => {
                setNewCount(prev => prev - 1)
              }}
              icon={<i className='bx bx-minus'></i>}
            ></Button>
            <InputNumber 
              className=' '
              placeholder={t("count")}
              type="number" 
              onChange={e => {
                  setNewCount(e)
              }}
              value={count}
              min={1}
            />
            <Button
              className='btn btn-primary'
              disabled={newCount === warehouse?.count}
              icon={<i className='bx bx-plus'></i>}
              onClick={() => {
                setNewCount(prev => prev + 1)
              }}
            ></Button>
          </div>
          </div>
          
          <Button
            icon={<i className='bx bx-trash'></i>}
            className="btn btn-primary"
            onClick={() => {
              dispatch(removeFromBasket(id))
              console.info(id)
            }}
          >
            
          </Button>
        </div>
      </div>
    </li>
  )
}

export default BasketItem