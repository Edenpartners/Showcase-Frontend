import React, { Component } from 'react';
import { message, Spin } from 'antd';
import {
  Container, Row, Col, Table,
} from 'reactstrap';
import styled from 'styled-components';
import FilterGroup from '../../common/FilterGroup/FilterGroup';
import Pager from '../../common/Pager/Pager';
import Offers from '../../../services/Offers';
import Common from '../../../services/Common';
import NoDataTable from '../../common/NoDataTable/NoDataTable';

class TransactionList extends Component {
  constructor() {
    super();

    this.state = {
      isLoading: false,
      currentPage: 1,
      totalItem: 0,
      items: [],
      tableLabels: ['No.', 'Type', 'Title', 'Price', 'Status', 'Partner', 'Comments'],
      queryParams: {
        fromDate: null,
        toDate: null,
        status: '',
        type: '',
        name: '',
        category: '',
      },
    };

    this.handlePageChanged = this.handlePageChanged.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  /**
   * Fetch data from server
   * @param queryParams
   * @param page
   */
  fetchData(queryParams = {}, page = 1) {
    this.setState({ isLoading: true }, () => {
      Offers.getTransactionList(queryParams, page).then((response) => {
        this.setState({
          items: response.data.results,
          isLoading: false,
          currentPage: page,
          totalItem: response.data.meta.total_record,
        });
      }).catch(() => {
        message.error('Unable to fetch transaction data from server. Please try again!');
      });
    });
  }

  /**
   * Handle page changed
   * @param page
   */
  handlePageChanged(page) {
    const { queryParams } = this.state;
    this.setState({ currentPage: page }, this.fetchData(queryParams, page));
  }

  handleDateChange(dates) {
    const { queryParams } = this.state;
    const newParams = Object.assign({}, queryParams, {
      fromDate: dates && typeof dates[0] !== 'undefined' ? dates[0].format('DD/MM/YYYY') : '',
      toDate: dates && typeof dates[1] !== 'undefined' ? dates[1].format('DD/MM/YYYY') : '',
    });
    this.setState({ queryParams: newParams }, this.fetchData(newParams));
  }

  handleStatusChange(status) {
    const { queryParams } = this.state;
    const newParams = Object.assign({}, queryParams, { status });
    this.setState({ queryParams: newParams }, this.fetchData(newParams));
  }

  handleSearch(category, value) {
    const { queryParams } = this.state;
    const newParams = Object.assign({}, queryParams, {
      category: category !== 'All' ? category : '',
      name: value,
    });
    this.setState({ queryParams: newParams }, this.fetchData(newParams));
  }

  handleTypeChange(type) {
    const { queryParams } = this.state;
    const newParams = Object.assign({}, queryParams, { type });
    this.setState({ queryParams: newParams }, this.fetchData(newParams));
  }

  renderItems() {
    const { items, currentPage } = this.state;
    const { history } = this.props;
    return items.map((item, index) => (
      <tr key={`${item.item_id}-${item.created_date}`} onClick={() => { item.name !== 'EDN' ? history.push(`/store/transaction-details/${item.item_id}`) : history.push('/account/revenue'); }}>
        <td>
          {currentPage * (index + 1)}
        </td>
        <td>
          {item.type}
        </td>
        <td>
          {item.name}
        </td>
        <td>
          {item.price ? Common.formatNumber(item.price) : ''}
        </td>
        <td>
          {item.status}
        </td>
        <td>
          {item.buyer_seller}
        </td>
        <td>
          {item.total_comment}
        </td>
      </tr>
    ));
  }

  renderTableHead() {
    const { tableLabels } = this.state;
    return tableLabels.map(label => (
      <th key={label}>
        {label}
      </th>
    ));
  }

  render() {
    const {
      currentPage, totalItem, isLoading, items,
    } = this.state;
    return (
      <div>
        <FilterGroup
          searchInput
          showType
          onDateChange={this.handleDateChange}
          onStatusChange={this.handleStatusChange}
          onTypeChange={this.handleTypeChange}
          onSearch={this.handleSearch}
          style={{ background: 'none' }}
        />
        <Container style={styles.containerStyle}>
          <Row>
            <Col md="12">
              <Spin size="large" spinning={isLoading}>
                <div style={styles.tableWrapperStyle}>
                  {items.length === 0 && (
                    <NoDataTable message="There is no transaction" />
                  )}
                  {items.length > 0 && (
                    <TableBodered bordered>
                      <thead>
                        <tr>
                          {this.renderTableHead()}
                        </tr>
                      </thead>
                      <tbody>
                        {this.renderItems()}
                      </tbody>
                    </TableBodered>
                  )}
                </div>
              </Spin>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Pager
                className="pull-right"
                pageChanged={this.handlePageChanged}
                currentPage={currentPage}
                totalItem={totalItem}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const TableBodered = styled(Table)`
  th {
    text-align: center;
  }
  td {
    text-align: center;
  }
`;

const styles = {
  itemWrapper: {
    marginBottom: 25,
  },
  containerStyle: {
    minHeight: 'calc(100vh - 211px)',
  },
  tableWrapperStyle: {
    backgroundColor: '#ffffff',
    minHeight: 'calc(100vh - 350px)',
  },
};

export default TransactionList;
