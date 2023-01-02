import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import BasketItem from './BasketItem'
import './order.scss'
import { setToken, URL } from '../../assets/api/URL'  
import { DebounceInput } from 'react-debounce-input'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { addToBasket } from '../../redux/orderSlice'
import scanIcon from "../../assets/images/scan.svg"
import { Button, Spin } from 'antd'
import PaymentPage from './PaymentPage'

const NewOrder = () => {
  const {t} = useTranslation()
  const [search, setSearch] = useState("")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const { branch_id, basket } = useSelector(state => state.orderReducer)
  const dispatch = useDispatch()
  const [currency, setCurrency] = useState({})
  const [searchClient, setSearchClient] = useState("")
  const [clients, setClients] = useState([])
  const clientSearchRef = useRef()
  const [selectedClient, setSelectedClient] = useState({})
  const [ordering, setOrdering] = useState(false)
  useEffect(() => {
    axios.get(`${URL}/api/currency`, setToken())
      .then((res) => {
        setCurrency(res.data.payload)
      })
  }, [])

  useEffect(() => {
    if (search === "") {
      setProducts([])
    } else {
      setLoading(true)
      axios.get(`${URL}/api/products?search=${search}&branch_id=${branch_id}&count=1`, setToken())
      .then((res) => {
        setProducts(res.data.payload.data)
      })
      .finally(() => {
        setLoading(false)
      })
    } 
  }, [search, branch_id])

  useEffect(() => {
    if (searchClient === "") {
      setClients([])
    } else {
      setLoading(true)
      axios.get(`${URL}/api/clients?search=${searchClient}&branch_id=${branch_id}&count=1`, setToken())
      .then((res) => {
        setClients(res.data.payload.data?.clients)
      })
      .finally(() => {
        setLoading(false)
      })
    } 
  }, [searchClient, branch_id])

  const handleAddToBasket = (item) => {
    dispatch(addToBasket({...item, currency: currency[1]?.rate[0]?.rate}))
    console.info(currency[1]?.rate[0]?.rate)
    setSearch("")
  }

  const getTotalBasketPrice = () => {
    const allSum = []
    basket?.map((item) => {
      allSum.push(Number(item?.price) * Number(item?.count))
    })

    return allSum.reduce((prev, curr) => {
      return prev + curr
    }, 0)
  }
 

  return (
    <div className='w-full p-4 rounded-sm flex gap-4 md:flex-col lg:flex-row'>
      <div className="order-overlay"></div>
      {
        !ordering ? (
          <>
            {/* left side */}
            <main className='sm:w-full lg:w-2/3 flex flex-col gap-y-4'>
            <div className='order-product-search w-full bg-white rounded-sm border border-gray-200 relative'>
              <DebounceInput
                autoFocus
                minLength={2}
                debounceTimeout={400} placeholder={t("find_product_by_name")}
                className="
                  px-4 py-5 w-full 
                  order-search-input
                " 
                onChange={(e) => {
                  setSearch(e.target.value)
                }} 
                value={search}
              />
              <div className='absolute w-full bg-background-color shadow-md border border-gray-500'>
                {
                  search ? (
                    loading ? (
                      <Spin spinning={true}>
                        <div  
                        className="
                        cursor-pointer 
                        bg-white
                            px-4 py-4 
                            shadow-md my-2 mx-2 
                            flex justify-between
                            border-b
                            border-gray-500
                            hover:text-indigo-500
                            ">
                              <center>
                                {t("kuting")}
                              </center>
                          </div>
                      </Spin>
                    ) : (
                      products?.filter(item => !basket.find(x => x.id === item.id))?.map((item) => (
                        <div key={item?.id} 
                        onClick={e => handleAddToBasket(item)}
                        className="
                          cursor-pointer 
                          bg-white
                          px-4 py-4 
                          shadow-md my-2 mx-2 
                          flex justify-between
                          border-b
                          border-gray-500
                          hover:text-indigo-500
                        ">
                          <span>{item?.name}</span>
                          <span>{item?.max_price?.price?.toLocaleString()} UZS</span>
                        </div>
                      ))
                    )
                  ) : null
                }
              </div>
            </div>  

            <section className='w-full bg-white rounded-sm border border-gray-200 p-4'>
              <div className='pb-4 basket-heading '>
                <span className='font-medium py-2 rounded-sm border-2 '>{t("basket_products")}: {basket?.length}</span>
              </div>

              {
                basket?.length === 0 ? (
                  <div className='w-full flex flex-col items-center  justify-center'
                  style={{
                    minHeight: "400px",
                    maxHeight: "400px",
                    overflowY: "auto"
                  }}
                  >
                    <img src={scanIcon} alt="" />
                    <h2 className='text-gray-500 font-medium text-lg'>{t("scan_please")}</h2>
                  </div>
                ) : (
                  <ul className="basket-list"
                    style={{
                      minHeight: "400px",
                      maxHeight: "400px",
                      overflowY: "auto"
                    }}
                  >
                    {
                      basket?.map((item) => (
                        <BasketItem key={item?.id} {...item} />
                      ))
                    }
                  </ul>
                )
              }
            </section>
          </main>
          {/* right side */}
          <aside className='sm:w-full lg:w-1/3 bg-white px-4 py-6 rounded-sm '>
              <div className='flex flex-col w-full bg-gray-100 rounded-sm'>
                <form className=''>
                <DebounceInput
                    autoFocus
                    minLength={2}
                    debounceTimeout={400} 
                    onChange={(e) => {
                      setSearchClient(e.target.value)
                    }} 
                    value={searchClient}
                    type="search"
                    className='bg-transparent px-4 py-2 w-full' 
                    placeholder={t("search_client")}
                    ref={clientSearchRef}
                  /> 
                </form>
                <ul style={{
                  maxHeight: "250px",
                  overflowY:"auto"
                }}>
                  {
                    searchClient ? (
                      loading ? (
                        <Spin spinning={loading}>
                          <li className='px-4 py-2 bg-white cursor-pointer hover:bg-gray-50 active:opacity-70'
                            style={{ borderBottom:"1px solid rgba(0,0,0,.05)" }}
                          >
                            {t("kuting")}
                          </li>
                        </Spin>
                      ) : (
                        clients?.map((item) => (
                          <li 
                            onClick={() => {
                              setSelectedClient(item)
                              setSearchClient("")
                            }}
                            className='px-4 py-2 bg-white cursor-pointer hover:bg-gray-50 active:opacity-70'
                            style={{ borderBottom:"1px solid rgba(0,0,0,.05)" }}
                          >
                            {item?.full_name}
                          </li>
                        ))
                      )
                    ):null
                  }
                </ul>

              </div>
              {
                selectedClient?.full_name ? (
                  <div className='px-4 py-2 mt-2 rounded-sm bg-gray-100 flex items-center justify-between'>
                    {selectedClient?.full_name}
                    <i 
                      onClick={() => setSelectedClient({})}
                      className='bx bx-x text-xl cursor-pointer hover:text-indigo-400 px-1  bg-white rounded-md'> </i>
                  </div>
                ) : (
                  <div className='px-4 py-2 mt-2 rounded-sm bg-gray-100 flex items-center justify-between opacity-50'>
                    {t("select_client")}
                  </div>
                )
              }

              <div className='border border-gray-500 px-4 py-2 bg-gray-100 mt-4'>
                <span className='flex items-center justify-between p-4 rounded-sm w-full bg-white'>
                  <b>{t("total_price")}:</b> {getTotalBasketPrice()?.toLocaleString()} uzs
                </span>
                <Button
                  className='mt-4 w-full btn btn-primary'
                  onClick={() => {
                    setOrdering(true)
                  }}
                >{t("order")}: {getTotalBasketPrice()?.toLocaleString()} uzs</Button>
              </div>
          </aside>
          </>
        ) : <PaymentPage ordering={ordering} setOrdering={setOrdering} selectedClient={selectedClient} />
      }
    </div>
  )
}

export default NewOrder