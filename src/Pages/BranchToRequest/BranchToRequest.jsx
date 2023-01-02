import {
  Select,
  DatePicker,
  Table,
  Skeleton,
  Button,
  Drawer,
  Modal,
  Tag,
  Collapse,
  Spin
} from "antd";
import React, { useState, useEffect } from "react";
import ModalAction from "../../components/ModalAction/ModalAction";

import axios from "axios";
import {
  fetchingProducts,
  fetchedProducts,
} from "../../redux/productsSlice";

import { useDispatch, useSelector } from "react-redux";

import { setToken, URL } from "../../assets/api/URL";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

import moment from "moment";

import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

const { RangePicker } = DatePicker;
const { Option } = Select;

const BranchToRequest = () => {
  const dispatch = useDispatch();
  const [baskets, setBaskets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBasket, setLoadingBasket] = useState(true);
  const { t } = useTranslation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modaltype, setModaltype] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [basketOrders, setBasketOrders] = useState([]);
  const [products, setProducts] = useState([])
  const [ingredients, setIngredients] = useState([])
  // UNIT ITEMS
  const unit_id_options = [
    { id: 1, label: t("dona") },
    { id: 2, label: t("tonna") },
    { id: 3, label: t("kilogram") },
    { id: 4, label: t("gramm") },
    { id: 5, label: t("meter") },
    { id: 6, label: t("sm") },
    { id: 7, label: t("liter") },
  ];
 
  // FETCHING INGREDIENTS
  useEffect(async () => {
    setLoading(true);

    const response = await axios.get(
      `${URL}/api/warehouse/orders`,
      setToken()
    );

    if (response.status === 200) {
      setBaskets(response.data.payload.data);
      setLoading(false);
    }
  }, [refresh]);

  // fetching products
  useEffect(async () => {
    const response = await axios.get(
      `${URL}/api/products`,
      setToken()
    );
    if (response.status === 200) {
      setProducts(response.data.payload.data)
    }
    const res2 = await axios.get(`${URL}/api/ingredients`, setToken());
    if (res2.status === 200) {
      setIngredients(res2.data.payload)
    }
  }, [])
 

  const dataSource = [];

  // TABLE DATA
  baskets?.map((item) => {
    dataSource.push({
      key: item?.id,
      branch: item?.branch.name,
      to_branch: item?.to_branch?.name,
      employee: item?.employee?.name,
      descr: item?.description,
      type: item?.type === "gift" ? t("gift") : item?.type === "return" ? t("return") : item?.type === "defect" ? t("defect") : item?.type,
      status: item?.status === "taken" ? t("taken") : item?.status,
      date: item?.created_at,
      action: (
        <div className='table-button__group'>
          <Button className="table-action" onClick={() => {
            takeBasket(item?.id)
          }}><i class='bx bx-check-circle'></i></Button>
          {/* <Button className="table-action"><i className="bx bx-trash"></i></Button> */}
        </div>
      )
    });
  });
  // TABLE HEADERS
  const columns = [
    {
      title: t("from_branch"),
      dataIndex: "branch",
      key: "key",
    },
    {
      title: t("to_branch"),
      dataIndex: "to_branch",
      key: "key",
    },
    {
      title: t("warehouseManager"),
      dataIndex: "employee",
      key: "key",
    }, 
    {
      title: t("type_return"),
      dataIndex: "type",
      key: "key",
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "key",
    },
    {
      title: t("date"),
      dataIndex: "date",
      key: "key",
    },
    {
      title: t("take"),
      dataIndex: "action",
      key: "key",
    },
  ];


  // TAKE BASKET
  const takeBasket = (id) => {
    setLoading(true)
    axios
      .get(`${URL}/api/warehouse/take/${id}`, setToken())
      .then(res => {
        setRefresh(!refresh)
        Swal.fire({
          title: t("muaffaqiyatli"),
          icon: "success"
        })
      }) 
      .finally(() => setLoading(false)) 
  }

  // GET BASKET ORDERS
  const getBasketOrders = (id) => {
    axios
      .get(`${URL}/api/warehouse/history/${id}`, setToken())
      .then((res) => {
        setBasketOrders(res.data.payload);
      })
      .finally(() => setLoadingBasket(false));
  }; 
  // MAIN RETURN
  return (
    <div className="section main-page">
      <h1 className="heading mb-4">{t("branchtoRequest")}</h1>
      <Modal
        width={780}
        visible={modalIsOpen}
        footer={null}
        onCancel={() => {
          setModalIsOpen(false);
          setBasketOrders([]);
        }}
        title={t("ishlab_chiqarish")}
      >
         <Spin spinning={loadingBasket}>
         <div className="h-500 overlfow-y-auto">
            <table className="min_table">
              <thead>
                <th>
                  {t("products")}
                </th>
                <th>
                  {t("count")}
                </th>
              </thead>
              <tbody>
              {
                basketOrders?.map((item) => (
                  <tr key={item.id}>
                    <td>{item?.product_name}</td>
                    <td>{item?.count} {unit_id_options.find((x) => x.id === item?.unit_id)?.label}</td>
                  </tr>
                ))
              }
              </tbody>
            </table>
          </div>
         </Spin>
      </Modal>
      <div className="content">
        <div className="content-top"></div>

        <div className="content-body">
          <Skeleton loading={loading} active>
            <Table
              className="content-table"
              dataSource={dataSource}
              columns={columns}
              rowClassName="cursor-pointer"
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    if (
                      event.target.classList[0] !== "table-btn" &&
                      event.target.classList[0] !== "bx" &&
                      event.target.classList[0] !== "ant-btn"
                    ) {
                      setModaltype("history");
                      setModalIsOpen(!modalIsOpen);
                      getBasketOrders(record.key);
                      setLoadingBasket(true)
                    }
                  },
                };
              }}
            />
 
          </Skeleton>
        </div>
      </div>
    </div>
  );
};

export default BranchToRequest;
