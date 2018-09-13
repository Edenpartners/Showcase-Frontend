import React, { Component } from 'react';
import styled from 'styled-components';
import { message, Spin } from 'antd';
import {
  Container, Row, Col, Table,
} from 'reactstrap';
import PropTypes from 'prop-types';
import moment from 'moment';
import Tour from 'reactour';
import StatisticBlock from '../../common/StatisticBlock/StatisticBlock';
import RevenueHead from './RevenueHead';
import Pager from '../../common/Pager/Pager';
import DateRangePicker from '../../common/DateRangePicker/DateRangePicker';
import MyDashboard from '../../../services/MyDashboard';
import UserContext from '../../../context/UserContext';
import Common from '../../../services/Common';
import { API_ROOT } from '../../../config';
import { getRequest, getRequestRevenue } from '../../../services/axiosApi';
import NoDataTable from '../../common/NoDataTable/NoDataTable';
import ButtonTour from '../../common/ButtonAdd/ButtonTour';

class Revenue extends Component {
  constructor() {
    super();

    this.state = {
      currentPage: 1,
      activities: [],
      activitiesInfo: {},
      totalRecords: 0,
      showChargeBtn: true,
      isLoading: false,
      queryParams: {
        fromDate: null,
        toDate: null,
      },
      isTourOpen: false,

    };

    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.handleChargeConfirmed = this.handleChargeConfirmed.bind(this);
    this.generateDescription = this.generateDescription.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.getRevenues = this.getRevenues.bind(this);
    this.closeTour = this.closeTour.bind(this);
    this.openTour = this.openTour.bind(this);
  }

  handlePageChanged(page) {
    this.setState({ currentPage: page }, () => {
      this.getRevenues();
    });
  }

  closeTour() {
    this.setState({ isTourOpen: false });
  }

  openTour() {
    document.body.style.overflowY = 'hidden';
    this.setState({ isTourOpen: true });
  }

  handleChargeConfirmed() {
    const { handleUserUpdate } = this.props;
    MyDashboard.chargeEDN().then(() => {
      this.setState({ showChargeBtn: false });
      if (typeof handleUserUpdate === 'function') {
        handleUserUpdate();
      }
      message.success('Charge successfully!');
      this.getRevenues();
    }).catch(() => {
      message.error('Unable to charge EDN.');
    });
  }

  getRevenues() {
    const { queryParams, currentPage } = this.state;
    let newQueryParams = `index=${currentPage}&page_size=10`;
    if (queryParams.fromDate && queryParams.toDate) {
      newQueryParams += `&fromDate=${queryParams.fromDate}&toDate=${queryParams.toDate}`;
    }
    this.setState({
      isLoading: true,
    }, () => {
      const api = getRequestRevenue(`${API_ROOT}/accounts/revenues`, newQueryParams);
      api.then((response) => {
        this.setState({
          activities: response.results,
          totalRecords: response.meta.total_record,
          isLoading: false,
        }, () => {
          this.generateDescription();
        });
      });
    });
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    }, () => {
      const api = getRequest(`${API_ROOT}/accounts/revenues?index=1&page_size=10`);
      api.then((response) => {
        this.setState({
          activities: response.results,
          totalRecords: response.meta.total_record,
          isLoading: false,
        }, () => {
          this.generateDescription();
        });
      });
    });
  }

  handleDateChange(dates) {
    const { queryParams } = this.state;
    const newParams = Object.assign({}, queryParams, {
      fromDate: dates && typeof dates[0] !== 'undefined' ? dates[0].format('DD/MM/YYYY') : '',
      toDate: dates && typeof dates[1] !== 'undefined' ? dates[1].format('DD/MM/YYYY') : '',
    });
    this.setState({ queryParams: newParams }, () => { this.getRevenues(); });
  }

  generateDescription() {
    const { activities, activitiesInfo } = this.state;
    activitiesInfo.totalIn = 0.0;
    activitiesInfo.totalOut = 0.0;
    activities.forEach((activity) => {
      if (activity.type === 'BUY') {
        activity.description = `You bought ${activity.name} for  ${activity.price ? activity.price : 0} EDN`;
      } else if (activity.type === 'SOLD') {
        activity.description = `You sold ${activity.name} for  ${activity.price ? activity.price : 0} EDN`;
      } else {
        activity.description = `Your balance has been charged  ${activity.price ? activity.price : 0} EDN`;
      }
      if (!isNaN(activity.out)) {
        activitiesInfo.totalOut += activity.out || 0;
      }
      if (!isNaN(activity.in)) {
        activitiesInfo.totalIn += activity.in || 0;
      }
    });
    activities.sort((a, b) => {
      const dateA = a.created_date;
      const dateB = b.created_date;
      return (dateA > dateB) ? -1 : (dateA < dateB) ? 1 : 0;
    });
    this.setState({
      activities,
      activitiesInfo,
    });
  }

  renderActivities() {
    const { activities } = this.state;
    return activities.map(activity => (
      <tr key={activity.id}>
        <td>
          {moment.unix(activity.created_date)
            .format('DD/MM/YYYY hh:mm A')}
        </td>
        <td>
          {activity.description}
        </td>
        <td>
          {activity.in ? activity.in : 0}
        </td>
        <td>
          {activity.out ? activity.out : 0}
        </td>
        <td>
          {activity.balance ? activity.balance : 0}
        </td>
      </tr>
    ));
  }

  render() {
    const {
      showChargeBtn, isLoading, activities, activitiesInfo, currentPage, totalRecords, isTourOpen,
    } = this.state;
    return (
      <div>
        <Spin spinning={isLoading} size="large">
          <UserContext.Consumer>
            {({ user }) => {
              if (user.chargeable) {
                return (
                  <ButtonTour handleCloseTuor={this.openTour} />
                );
              }
              return null;
            }}
          </UserContext.Consumer>
          <Container style={styles.containerStyle}>
            <Row style={styles.statisticContainerStyle}>
              <Col md="12">
                <UserContext.Consumer>
                  {({ user }) => (
                    <StatisticBlock
                      title={`EDN ${Common.formatNumber(user.balance)}`}
                      subTitle={`USD ${Common.formatNumber(user.balance / user.rate)}`}
                      showExtraBtn={showChargeBtn}
                      onChargeConfirmed={this.handleChargeConfirmed}
                    />
                  )}
                </UserContext.Consumer>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <div style={{ height: 40 }}>
                  <h4 className="pull-left" style={styles.titleStyle}>
                  Product Management
                  </h4>
                  <div className="pull-right" style={styles.dateRangeStyle}>
                    <DateRangePicker onChange={this.handleDateChange} />
                  </div>
                </div>
                <div style={{ backgroundColor: '#ffffff', minHeight: 'calc(100vh - 500px)', position: 'relative' }}>
                  <RevenueHead
                    activitiesInfo={activitiesInfo}
                  />
                  {activities && activities.length > 0
                    ? (
                      <TableStriped striped>
                        <thead>
                          <tr>
                            <th>
                          Date
                            </th>
                            <th>
                          Description
                            </th>
                            <th>
                          In
                            </th>
                            <th>
                          Out
                            </th>
                            <th>
                          Balance
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.renderActivities()}
                        </tbody>
                      </TableStriped>
                    )
                    : <NoDataTable message="No data" />
                }
                </div>
              </Col>
            </Row>
            {
            (totalRecords > 0)
              ? (
                <Row>
                  <Col md="12" style={{ marginTop: 10 }}>
                    <Pager
                      className="pull-right"
                      pageChanged={this.handlePageChanged}
                      totalDisplayed={5}
                      pageSize={10}
                      currentPage={currentPage}
                      totalItem={totalRecords}
                    />
                  </Col>
                </Row>
              ) : null
          }
          </Container>
          <Tour
            onRequestClose={this.closeTour}
            steps={tourConfig}
            isOpen={isTourOpen}
            maskClassName="mask"
            className="helper"
            rounded={5}
          />
        </Spin>
      </div>
    );
  }
}

Revenue.propTypes = {
  handleUserUpdate: PropTypes.func,
};

Revenue.defaultProps = {
  handleUserUpdate: null,
};
const tourConfig = [
  {
    selector: '[data-tut="tour_charge"]',
    content: 'Let\'s charge to get 1000 EDN free after signup',
  },
];
const TableStriped = styled(Table)`
  border-bottom: 1px solid #dee2e6;
  thead {
    tr {
      background-color: #f7f7f7;
      th {
        border-left: 1px solid #dee2e6;
        border-bottom: none;
        text-align: center;
      }
    }
  }
  tbody {
    tr:nth-of-type(odd) {
      background-color: #ffffff;
    }
    tr:nth-of-type(even) {
      background-color: #f7f7f7;
    }
    td {
      border-left: 1px solid #dee2e6;
      text-align: center;
      &:nth-child(2) {
        text-align: justify;
        width: 50%;
      }
    }
  }
`;

const styles = {
  containerStyle: {
    minHeight: 'calc(100vh - 167px)',
  },
  itemWrapper: {
    marginBottom: 25,
  },
  statisticContainerStyle: {
    marginBottom: 40,
    marginTop: 30,
  },
  titleStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#010228',
    marginBottom: 20,
  },
  datetimeStyle: {
    fontSize: 14,
    color: '#637097',
    margin: 0,
  },
  actionStyle: {
    fontSize: 16,
    color: '#010228',
    margin: 0,
  },
  actionContainerStyle: {
    paddingLeft: 30,
  },
  dateRangeStyle: {
    width: 240,
  },
};

export default Revenue;
