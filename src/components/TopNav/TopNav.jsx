import React, { useState } from 'react'
import { Avatar, Button, Dropdown, Layout, Menu, Space } from 'antd';
import logo from '../../assets/images/SmartSHOP.svg'

import brandIcon from '../../assets/images/top-nav-brand-name-icon.svg'
import avatarLogo from '../../assets/images/avatar.jpg'

import { useDispatch } from 'react-redux'

import './TopNav.scss'
import { userLogout } from '../../redux/userSlice';
import i18next from 'i18next';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { setToken, URL } from '../../assets/api/URL';
import { changeBranch } from '../../redux/orderSlice';
import { useSelector } from 'react-redux';

const { Header } = Layout;


const languages = [
  {lang: 'uz', icon: 'uz', label: "O'zbekcha"},
  {lang: 'ru', icon: 'ru', label: "Русский"},
  {lang: 'qq', icon: 'ga', label: "Qaraqalpaqsha"},
]




 

const TopNav = ({ collapsed, setCollapsed, width, setLogged }) => {
  const dispatch = useDispatch()
  const { branch_id } = useSelector(state => state.orderReducer)
  const [currentLang, setCurrentLang] = useState(document.cookie.split('=')[1])
  const [currentLangLabel, setCurrentLabel] = useState(languages.filter(item => item.lang === currentLang)[0] ? languages.filter(item => item.lang === currentLang)[0].label : "O'zbekcha")
  const [allBranches, setAllBranches] = useState([])
  const changeLang = (lang, label) => {
    i18next.changeLanguage(lang)
    setCurrentLang(lang)
    setCurrentLabel(label)
  }
  const { t } = useTranslation()
  const avatar = JSON.parse(localStorage.getItem('user'))?.avatar


  useEffect(() => {
    axios.get(`${URL}/api/branches`, setToken())
      .then((res) => {
        setAllBranches(res.data.payload)
        dispatch(changeBranch(res.data.payload[0]?.id))
      })
  }, [])
 
  const brandMenu = (
    <Menu>
      <Menu.Item>
          {t('statistika')}
      </Menu.Item>
      <Menu.Item>
          {t('malumot')}
      </Menu.Item>
      <Menu.Item>
          {t('korish')}
      </Menu.Item>
    </Menu>
  );

  const branchesMenu = (
    <Menu>
      {allBranches?.map((item) => (
        <Menu.Item key={item.id} onClick={() => dispatch(changeBranch(item.id))}>
          <button className="dropdown-btn" disabled={branch_id === item.id}> 
          {item.name}  
          </button>
      </Menu.Item>
      ))}
    </Menu>
  )
  
  
  const languageMenu = (
    <Menu>
      {languages.map(item => (
        <Menu.Item key={item.lang} onClick={() => changeLang(item.lang, item.label)}>
            <button className="dropdown-btn" disabled={currentLang === item.lang}> 
            <span className={`fi fi-${item.icon} top-nav_icon`}></span> 
            {" "}
            {" "}
            {item.label}  
            </button>
        </Menu.Item>
      ))} 
    </Menu>
  );



  const profileMenu = (
    <Menu>
      <Menu.Item>
          <Link to={'/profile'}>
          <div className="profile__user-item">
              <div className="profile__user-item__image">
                  {
                      avatar !== null ?(
                          <img style={{borderRadius: '50%', objectFit: 'cover'}} src={avatar} alt="Product Photo" />
                      ) : (
                          <img style={{borderRadius: '50%'}} src={'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png'} alt="Product Photo" />
                      )
                  }
              </div>
              <div className="profile__user-item__name">
                  <h3>{JSON.parse(localStorage.getItem('user'))?.name}</h3>
                  <h4>{JSON.parse(localStorage.getItem("user"))?.role === "ceo" ? "CEO" : JSON.parse(localStorage.getItem("user"))?.role === "admin" && t('admin') }</h4>
              </div>
          </div>
          </Link>
      </Menu.Item> 
      <Menu.Item onClick={() => {
        localStorage.removeItem('token')
        setLogged('logout')
        }} >
          {t('chiqish')}
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="topnav">
      <div className="topnav__left">
      <div className="header__brand" style={width < 1200 ? {display: 'none'} : {}}>
        <img src={logo} alt="SmartShop" />
      </div>
      <Button onClick={setCollapsed}className="toggle__menu">
      <i className='bx bx-menu'></i></Button>
      </div>
      <div className="topnav__right-menu">
        <Dropdown overlay={branchesMenu} placement="bottomLeft" className="dropdown">
          <span >
          <i class='bx bx-git-branch'></i>
            <span className='dropdown__text'>
            {
              allBranches?.find(item => item.id === branch_id)?.name || t("branch")
            }
            </span>
          </span>
        </Dropdown>
        <Dropdown overlay={brandMenu} placement="bottomLeft" className="dropdown">
          <span >
            <img src={brandIcon} alt="" />
            <span className='dropdown__text'>
            {t('brend')}
            </span>
          </span>
        </Dropdown>
        <Dropdown overlay={languageMenu} placement="bottomLeft" className="dropdown">
            <span>
            <i className={`fi fi-${languages.filter(item => item.lang === currentLang)[0] ? languages.filter(item => item.lang === currentLang)[0].icon : 'uz'} drop top-nav_icon`}></i>
            {" "}
            <span className='dropdown__text'>{currentLangLabel}</span>
            </span>
        </Dropdown>
        <Dropdown overlay={profileMenu} placement="bottomLeft" >
          <Avatar width="40" src={avatar !== null ? avatar : 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/2048px-Circle-icons-profile.svg.png'} style={{cursor: 'pointer'}}/>
        </Dropdown>
      </div>
    </header>
  )
}

export default TopNav
