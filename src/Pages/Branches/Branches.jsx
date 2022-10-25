import { Select, DatePicker, Table, Skeleton, Button, Modal, Drawer, Form, Input, message } from 'antd'
import React, { useState, useEffect } from 'react'
import ModalAction from '../../components/ModalAction/ModalAction';

import axios from 'axios';
import { fetchingProducts, fetchedProducts } from '../../redux/productsSlice';

import './Branches.scss';
import { useDispatch, useSelector } from 'react-redux';

import { setToken, URL } from '../../assets/api/URL'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

import moment from 'moment'

import { useTranslation } from 'react-i18next';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Branches = () => {
  const dispatch = useDispatch()
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalType, setModalType] = useState("")
  const [newBranch, setNewBranch] = useState({
    name: "",
    is_main: false
  })
  const [selectedBranch, setSelectedBranch] = useState({})
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    if (modalType === "add") {
      setNewBranch({
        name: "",
        is_main: false
      })
    } else if (modalType === "update") {
      setNewBranch({
        name: selectedBranch?.name,
        is_main: selectedBranch?.is_main
      })
    }
  }, [modalType, modalIsOpen])


  useEffect(async () => {
    setLoading(true)
    const response = await
      axios.get(`
        ${URL}/api/branches`, setToken())

    if (response.status === 200) {
      setBranches(response.data.payload)
      setLoading(false)
    }

  }, [refresh])



  const dataSource = [];

  branches?.map(item => {
    dataSource.push({
      key: item?.product_id,
      branch: item?.name,
      is_main: item?.is_main ? t("yes") : t("no"),
      actions: (
        <div className='table-button__group'>
          <Button className="table-action" onClick={() => {
            setModalType("update")
            setSelectedBranch(item)
            setModalIsOpen(true)
          }}><i className="bx bx-edit"></i></Button>
          {/* <Button className="table-action"><i className="bx bx-trash"></i></Button> */}
        </div>
      )
    })
  })

  const columns = [
    {
      title: t('branches'),
      dataIndex: 'branch',
      key: 'key',
      width: "70%"
    },
    {
      title: t('main_branch'),
      dataIndex: 'is_main',
      key: 'key',
    },
    {
      title: t("action"),
      dataIndex: "actions",
      key: "actions"
    }
  ];

  const handleSubmit = () => {
    if (newBranch.name && newBranch.is_main !== null) {
      if (modalType === "add") {
        const index = branches.findIndex(item => item.name === newBranch.name)
        if (index === -1){
          axios.post(`${URL}/api/branches`, newBranch, setToken())
            .then((res) => {
              message.success(t("muaffaqiyatli"))
              setModalIsOpen(false)
              setNewBranch({ name: "", is_main: "" })
              setRefresh(!refresh)
            })
            .catch((res) => {
              setModalIsOpen(false)
              setNewBranch({ name: "", is_main: "" })
              message.error(t("xatolik"))
            })
        } else {
          message.error(t("already_branch"))
        }
      } else if (modalType === "update") {
        axios.patch(`${URL}/api/branches/${selectedBranch.id}`, newBranch, setToken())
          .then((res) => {
            message.success(t("muaffaqiyatli"))
            setModalIsOpen(false)
            setNewBranch({ name: "", is_main: "" })
            setRefresh(!refresh)
          })
          .catch((res) => {
            setModalIsOpen(false)
            setNewBranch({ name: "", is_main: "" })
            message.error(t("xatolik"))
          })
      }
    }
  }

  const content = () => (
    <Form layout='vertical' onFinish={handleSubmit} >
      <Form.Item required label={t('branch_name')}>
        <Input   required placeholder={t('branch_name')} className="form__input" onChange={(e) => {setNewBranch({...newBranch, name: e.target.value})}} value={newBranch.name} />
      </Form.Item> 
      <Form.Item required label={t('main_branch')}>
        <Select required className='form__input' onChange={e => setNewBranch({ ...newBranch, is_main: e })} value={newBranch.is_main}>
          <Select.Option value={true}>{t("yes")}</Select.Option>
          <Select.Option value={false}>{t("no")}</Select.Option>
        </Select>
      </Form.Item> 
      <Form.Item>
          <Button htmlType='submit' className="btn btn-primary" style={{display: 'block'}}>
              {t('save')}
          </Button>
      </Form.Item>
    </Form>
  )




  return (

    <div className="section main-page">
      <h1 className="heading">{ t('main') }</h1>

      {
        modalIsOpen ? (
          <Drawer
            onClose={ () => setModalIsOpen(false) }
            visible={ modalIsOpen }
            title={ modalType === "add" ? t("create_branch") : t("update_branch") }
          >
            {content()}
          </Drawer>
        ) : null
      }

      <div className="content">
        <div className="content-top">
          <div className='content-top__group'></div>
          <div className='content-top__group'>
            <Button onClick={ () => {
              setModalIsOpen(true)
              setModalType("add")
            } } className='btn btn-primary btn-md'>{ t("create_branch") }</Button>
          </div>
        </div>


        <div className="content-body" >
          <Skeleton loading={ loading } active>
            <Table className="content-table lg-table" dataSource={ dataSource } columns={ columns } />

            <div className="responsive__table">
              { branches &&
                branches.length > 0 ?
                branches.map((item, index) => {
                  return (
                    <div
                      className="responsive__table-item justify-between"
                      key={ index }
                    >
                      <div className="responsive__table-item__details-name">
                        <h3>{ item?.product_name }</h3>
                      </div>

                      <div className="responsive__table-item__details-count">
                        <h3>{ item?.count }</h3>
                      </div>


                    </div>
                  );
                }) : null }
            </div>

          </Skeleton>
        </div>
      </div>
    </div>
  )
}

export default Branches
