import { Select,DatePicker, Table, Skeleton, Input } from 'antd'
import React, { useState, useEffect } from 'react'

import axios from 'axios';

import '../Main/Main.scss';
import { useDispatch } from 'react-redux';

import { setToken, URL } from '../../assets/api/URL'
import 'react-medium-image-zoom/dist/styles.css'


import { useTranslation } from 'react-i18next';

const {Option} = Select;

const Profit = () => {
  const dispatch = useDispatch()
  const [ casheir, setCasheir ] = useState([]) 
  const [loading, setLoading] = useState(true)
  const {t} = useTranslation()
  const [branches, setBranches] = useState([])
  const [branch_id, setBranch_id] = useState("")


  const months = [
    {id: 1, name: t('yanvar')},
    {id: 2, name: t('fevral')},
    {id: 3, name: t('mart')},
    {id: 4, name: t('aprel')},
    {id: 5, name: t('may')},
    {id: 6, name: t('iyun')},
    {id: 7, name: t('iyul')},
    {id: 8, name: t('avgust')},
    {id: 9, name: t('sentyabr')},
    {id: 10, name: t('oktyabr')},
    {id: 11, name: t('noyabr')},
    {id: 12, name: t('dekabr')},
  ]

  useEffect(async () => {

    setLoading(true)

    const response = await axios.get(`${URL}/api/profit?branch_id=${branch_id}`, setToken())

    if (response.status === 200) {
      setCasheir(response.data.payload)
      setLoading(false)
    }

    

  } ,[branch_id])

  useEffect(() => {
    axios
      .get(`${URL}/api/branches`, setToken())
      .then((res) => setBranches(res.data.payload))
  }, [])


  const dataSource = [];

  casheir.length > 0 && casheir?.map(item => {
    dataSource.push({
      key: item?.category_id,
      oy:<div className="table-title">
        <h2>{item?.category_name}</h2>   
        </div>,
      card: item.amount?.toLocaleString(),
      sof_foyda: item?.profit?.toLocaleString(),
    })
  })
  
  const columns = [
    {
      title: t('categories'),
      dataIndex: 'oy',
      key: 'key',
    },
    {
      title: t('total_income'),
      dataIndex: 'card',
      key: 'key',
    }, 
    {
      title: t('sof_foyda'),
      dataIndex: 'sof_foyda',
      key: 'key',
    }
  ];
 

  return (
    
    <div className="section main-page">
      <h1 className="heading mb-4">{t('sof_foyda')}</h1>

      <div className="content">
          <div className="content-top">  

            <div className="content-top__group">
{/* 
              <DatePicker
              clearIcon={false}
                className="content__range-picker content-top__input form__input pl-1"
                placeholder={t('from')}
                onChange={(value, string) => {
                  setFrom(string)
                } }
                value={moment(from)}
                />


              <DatePicker
              clearIcon={false}
                className="content__range-picker content-top__input form__input  pl-1"
                placeholder={t('from')}
                onChange={(value, string) => {
                  setTo(string)
                } }
                value={moment(to)}
                />*/}
                <Select
                  className="form__input content-select content-top__input wdith_3"
                  showSearch
                  placeholder={t("all_branches")}
                  optionFilterProp="children" 
                  onChange={(e) => setBranch_id(e)}
                  value={branch_id}
                >
                  <Option value={""}>{t("all_branches")}</Option>
                  {branches?.map((branch) => {
                    return <Select.Option value={branch.id}>{branch.name}</Select.Option>;
                  })}
                </Select>
                </div> 

             
          </div>

          


          <div className="content-body" >
          <Skeleton loading={loading} active> 
          <Table  className="content-table" dataSource={dataSource} columns={columns} />
          </Skeleton>
          </div>
      </div>
    </div>
  )
}

export default Profit
