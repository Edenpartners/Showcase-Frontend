import React, { Component } from 'react';
import styled from 'styled-components';
import { Spin } from 'antd';
import {
  Container, Row, Col, Table,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import Tour from 'reactour';
import StatisticBlock from '../../common/StatisticBlock/StatisticBlock';
import MyDashboard from '../../../services/MyDashboard';
import Common from '../../../services/Common';
import UserContext from '../../../context/UserContext';
import Pager from '../../common/Pager/Pager';
import NoDataTable from '../../common/NoDataTable/NoDataTable';
import ButtonTour from '../../common/ButtonAdd/ButtonTour';

class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      currentPage: 1,
      totalActivityItem: 0,
      activities: [],
      totalItem: 0,
      totalMarketItem: 0,
      totalOpenMarketItem: 0,
      isTourOpen: false,
    };

    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.closeTour = this.closeTour.bind(this);
    this.openTour = this.openTour.bind(this);
  }

  componentDidMount() {
    MyDashboard.get().then((response) => {
      this.setState({
        // activities: response.data.activities,
        totalItem: response.data.totalItem,
        totalMarketItem: response.data.totalMarketItem,
        totalOpenMarketItem: response.data.totalOpenMarketItem,
      });
    });
    this.fetchActivityData();
  }

  closeTour() {
    this.setState({ isTourOpen: false });
  }

  openTour() {
    document.body.style.overflowY = 'hidden';
    this.setState({ isTourOpen: true });
  }

  fetchActivityData(page = 1) {
    this.setState({ isLoading: true }, () => {
      MyDashboard.getMyActivities(page).then((response) => {
        this.setState({
          activities: response.data.results,
          totalActivityItem: response.data.meta.total_record,
          isLoading: false,
        });
      });
    });
  }

  handlePageChanged(page) {
    this.setState({ currentPage: page }, this.fetchActivityData(page));
  }

  renderActivities() {
    const { activities } = this.state;
    return activities.map(activity => (
      <tr key={activity.id}>
        <td style={{ border: 'none' }}>
          <div style={styles.actionContainerStyle}>
            <p style={styles.datetimeStyle}>
              {Common.formatDate(activity.created_date)}
            </p>
            <p style={styles.actionStyle}>
              {`${activity.message} `}
              <Link to={Common.getActivityDetailLink(activity.type, activity.entry_id)}>
                Click to see detail
              </Link>
            </p>
          </div>
        </td>
      </tr>
    ));
  }

  render() {
    const {
      totalMarketItem, totalOpenMarketItem, totalItem,
      currentPage, totalActivityItem, isLoading, activities, isTourOpen,
    } = this.state;
    const myItem = (
      <span data-tut="tour_items">
        {totalItem}
      </span>
    )

    const myMarket = (
      <span>
        <span data-tut="tour_number">
          {totalOpenMarketItem}
        </span>
        <span>
          {' / '}
        </span>

        <span data-tut="tour_items_currently">
          {totalMarketItem}
        </span>
      </span>
    );

    return (
      <div>
        <ButtonTour handleCloseTuor={this.openTour} />
        <Container style={styles.containerStyle}>
          <Row style={styles.statisticContainerStyle}>
            <Col md="6">
              <UserContext.Consumer>
                {({ user }) => (
                  <StatisticBlock
                    title={`EDN ${Common.formatNumber(user.balance)}`}
                    subTitle={`USD ${Common.formatNumber(user.balance / user.rate)}`}
                  />
                )}
              </UserContext.Consumer>
            </Col>
            <Col md="3">
              <StatisticBlock title={myItem} subTitle="My item list" containerStyles={styles.myItemListStyle} />
            </Col>
            <Col md="3">
              <StatisticBlock title={myMarket} subTitle="My market" containerStyles={styles.myMarketStyle} />
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <h4 style={styles.titleStyle}>
                ACTIVITY NOTIFICATION
              </h4>
              <Spin size="large" spinning={isLoading}>
                <div style={styles.activityContainer}>
                  {activities.length === 0 && (
                    <NoDataTable message="There is no activity" />
                  )}
                  {activities.length > 0 && (
                    <TableStriped striped>
                      <tbody>
                        {this.renderActivities()}
                      </tbody>
                    </TableStriped>
                  )}
                </div>
              </Spin>
            </Col>
          </Row>
          <Row>
            <Col md="12" style={{ marginTop: 10 }}>
              <Pager
                className="pull-right"
                pageChanged={this.handlePageChanged}
                pageSize={10}
                currentPage={currentPage}
                totalItem={totalActivityItem}
              />
            </Col>
          </Row>
        </Container>
        <Tour
          onRequestClose={this.closeTour}
          steps={tourConfig}
          isOpen={isTourOpen}
          maskClassName="mask"
          className="helper"
          rounded={5}
        />
      </div>
    );
  }
}

const TableStriped = styled(Table)`
  tbody {
    tr:nth-of-type(odd) {
      background-color: #ffffff;
    }
    tr:nth-of-type(even) {
      background-color: #f7f7f7;
    }
  }
`;
const tourConfig = [
  {
    selector: '[data-tut="tour_items"]',
    content: 'Total items which can be registered to the market',
  },
  {
    selector: '[data-tut="tour_number"]',
    content: 'Total number of items which are available to be exchanged',
  },
  {
    selector: '[data-tut="tour_items_currently"]',
    content: 'Total items currently in the market',
  },


];

const styles = {
  containerStyle: {
    minHeight: 'calc(100vh - 167px)',
  },
  itemWrapper: {
    marginBottom: 25,
  },
  myItemListStyle: {
    backgroundColor: '#39898a',
    boxShadow: 'none',
  },
  myMarketStyle: {
    backgroundColor: '#39898a',
    boxShadow: 'none',
  },
  statisticContainerStyle: {
    marginBottom: 40,
    marginTop: 30,
  },
  spinnerWrapper: {
    backgroundColor: '#ffffff',
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
  activityContainer: {
    minHeight: 'calc(100vh - 500px)',
    backgroundColor: '#ffffff',
  },
};

export default Dashboard;
