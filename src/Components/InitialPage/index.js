import React from 'react';
import ScaleLoader from 'react-spinners/ScaleLoader';
import axios from 'axios';

import {css} from '@emotion/core';
import SideNav, {
  Toggle,
  Nav,
  NavItem,
  NavIcon,
  NavText,
} from '@trendmicro/react-sidenav';

import '@trendmicro/react-sidenav/dist/react-sidenav.css';

import './InitialPage.css';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

class InitialPage extends React.Component {
  constructor (props) {
    super (props);
    this.childRef = React.createRef ();
    this.state = {
      gridList: 'list',
      usersList: [],
      loading: true,
      selectedUser: [],
      addOrEdit: '',
      showAddEditModal: false,
      total: null,
      per_page: null,
      current_page: null,
    };
    this.handleChange = this.handleChange.bind (this);
    this.handleGridListButton = this.handleGridListButton.bind (this);
    this.handleSort = this.handleSort.bind (this);
  }

  componentDidMount () {
    setTimeout (() => {
      this.setState (prevState => ({
        loading: false,
      }));
    }, 3000);
    this.getUser (1);
  }

  componentDidUpdate (prevProps) {}

  getUser (page) {
    let currentComponent = this;
    axios
      .get ('https://reqres.in/api/users?page=' + page)
      .then (function (response) {
        console.log (response);
        // usersList = response.data;
        currentComponent.setState (prevState => ({
          usersList: response.data,
          searchUserList: response.data,
          current_page: response.data.page,
          total_pages: response.data.total_pages,
        }));
      })
      .catch (function (error) {
        console.log (error);
      });
  }
  handleChange (e) {
    const {name, value} = e.target;
    this.setState (prevState => ({
      [name]: value,
    }));
    let tempList = [];
    const {searchUserList, usersList} = this.state;
    if (value !== '') {
      tempList = searchUserList.data.filter (
        user =>
          user.first_name.toLowerCase ().indexOf (value.toLowerCase ()) > -1 ||
          user.last_name.toLowerCase ().indexOf (value.toLowerCase ()) > -1 ||
          user.email.toLowerCase ().indexOf (value.toLowerCase ()) > -1
      );
    } else {
      tempList = searchUserList.data;
    }
    const list = {
      ...usersList,
      data: tempList,
    };
    this.setState (prevState => ({
      selectedUser: [],
      usersList: list,
    }));
  }

  handleGridListButton (data) {
    this.setState (prevState => ({
      gridList: data,
    }));
  }
  handleSort () {
    const {usersList, sorted} = this.state;
    let tempList;
    if (sorted) {
      tempList = usersList.data.sort ((a, b) => {
        var nameA = a.first_name.toLowerCase (),
          nameB = b.first_name.toLowerCase ();
        if (
          nameA < nameB //sort string ascending
        )
          return -1;
        if (nameA > nameB) return 1;
        return 0; //default return value (no sorting)
      });
    } else {
      tempList = usersList.data.sort ((a, b) => {
        var nameA = a.first_name.toLowerCase (),
          nameB = b.first_name.toLowerCase ();
        if (
          nameA > nameB //sort string ascending
        )
          return -1;
        if (nameA < nameB) return 1;
        return 0; //default return value (no sorting)
      });
    }
    console.log (tempList);
    const list = {
      ...usersList,
      data: tempList,
    };
    console.log (list);
    this.setState (prevState => ({
      sorted: !this.state.sorted,
      usersList: list,
    }));
  }

  // Created simple navbar for design purpose
  renderMenu () {
    return (
      <div>
        <SideNav
          onSelect={selected => {
            // Add your code here
          }}
        >
          <Toggle />
          <Nav defaultSelected="home">
            <NavItem eventKey="home">
              <NavIcon>
                <i className="fa fa-fw fa-home" style={{fontSize: '1.75em'}} />
              </NavIcon>
              <NavText>
                Home
              </NavText>
            </NavItem>
            <NavItem eventKey="charts">
              <NavIcon>
                <i
                  className="fa fa-fw fa-line-chart"
                  style={{fontSize: '1.75em'}}
                />
              </NavIcon>
              <NavText>
                Charts
              </NavText>
              <NavItem eventKey="charts/linechart">
                <NavText>
                  Line Chart
                </NavText>
              </NavItem>
              <NavItem eventKey="charts/barchart">
                <NavText>
                  Bar Chart
                </NavText>
              </NavItem>
            </NavItem>
          </Nav>
        </SideNav>
        <div className="nav-bar-slide">
          <div className="navbar">
            Users
          </div>
        </div>
      </div>
    );
  }

  renderContactList () {
    const {usersList} = this.state;
    return usersList.data.map ((item, i) => {
      // const color = item.color;
      return (
        <div
          className="container"
          key={'flip-card' + i}
          style={{width: this.state.gridList === 'list' ? '100%' : '18%'}}
        >
          <div
            className="container-img"
            style={{display: this.state.gridList === 'list' && 'flex'}}
          >
            <img
              src={item.avatar}
              alt="Avatar"
              style={{
                width: this.state.gridList === 'list' ? '200px' : '100%',
                height: '200px',
                borderRadius: '0%',
              }}
            />
            <div>
              <div className="user-name">
                {item.first_name + ' ' + item.last_name}
              </div>
              <div className="user-title"> Reqres Company </div>
              <div className="user-title">{item.email}</div>
              <button
                className="view-more-btn"
                type="submit"
                onClick={this.handleSort}
              >
                View More {' '}
              </button>
            </div>
          </div>
        </div>
      );
    });
  }

  render () {
    const {loading, usersList, current_page, total_pages, search} = this.state;
    if (loading) {
      return (
        <div className="sweet-loading">
          <ScaleLoader
            css={override}
            size={150}
            color={'#123abc'}
            loading={loading}
          />
        </div>
      );
    }

    return (
      <div>
        {this.renderMenu ()}
        <div className="page-margin">
          <div className="search-sort">
            <div className="pagin">
              <div className="margin-right">
                {' '}Showing page {current_page} of {total_pages}{' '}
              </div>
              <div className="margin-right">
                <span
                  className={
                    current_page === 1
                      ? 'pagination-number pagination-number-active'
                      : 'pagination-number'
                  }
                  onClick={() => this.getUser (1)}
                >
                  1
                </span>
                <span
                  className={
                    current_page === 2
                      ? 'pagination-number pagination-number-active'
                      : 'pagination-number'
                  }
                  onClick={() => this.getUser (2)}
                >
                  2
                </span>
              </div>
            </div>
            <div className="search-input-btn">
              <input
                className="search-input"
                type="text"
                placeholder="Search.."
                name="search"
                value={search || ''}
                onChange={this.handleChange}
              />
              <button className="search-icon-btn" type="submit">
                <i className="fa fa-search" />
              </button>
            </div>
            <div className="grid-sort">
              <button
                className="grid-icon-btn"
                type="submit"
                onClick={this.handleSort}
              >
                Sort {' '}
                <i className="fa fa-sort" />
              </button>
              <button
                className={
                  this.state.gridList === 'list'
                    ? 'grid-icon-btn grid-icon-btn-active'
                    : 'grid-icon-btn'
                }
                type="submit"
                onClick={() => {
                  this.handleGridListButton ('list');
                }}
              >
                <i className="fa fa-list-ul" />
              </button>
              <button
                className={
                  this.state.gridList === 'grid'
                    ? 'grid-icon-btn grid-icon-btn-active'
                    : 'grid-icon-btn'
                }
                type="submit"
                onClick={() => {
                  this.handleGridListButton ('grid');
                }}
              >
                <i className="fa fa-th" />
              </button>
            </div>
          </div>
          <div className="contact-list">
            {usersList.data.length > 0 &&
              <div className="list-container">
                {this.renderContactList ()}
              </div>}
            {usersList.data.length === 0 &&
              <div className="no-data">
                No user/s found.!
              </div>}
          </div>
        </div>
      </div>
    );
  }
}

export default InitialPage;
