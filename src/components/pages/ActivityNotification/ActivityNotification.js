import React, { Component } from 'react';

class ActivityNotification extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>
        <div className="w-100 row" style={styles.pt50} />
        <div className="w-100 row" style={styles.height}>
          <div style={styles.w50}>
            <p style={styles.EDNstyle} className="pt-4 pl-4 w-100">
              EDN: 123.456.789
            </p>
            <p style={styles.USDstyle} className="pb-4 pl-4 w-100">
              USD :123.456.789
            </p>
          </div>
          <div style={styles.w5} />
          <div style={styles.w20}>
            <p style={styles.EDNstyle} className="pt-4 pl-4 w-100">
              19
            </p>
            <p style={styles.USDstyle} className="pb-4 pl-4 w-100">
              My ItemList
            </p>
          </div>
          <div style={styles.w5} />
          <div style={styles.w20}>
            <p style={styles.EDNstyle} className="pt-4 pl-4 w-100">
              13/25
            </p>
            <p style={styles.USDstyle} className="pb-4 pl-4 w-100">
              My Market
            </p>
          </div>
        </div>
        <div className="w-100 row" style={styles.pt50}>
          <p style={styles.headerText}>
            ACTIVITY NOTIFICATION
          </p>
          <div className="w-100" style={styles.boder2}>
            <p style={styles.timeStyle}>
            2018-07-01
            </p>
            <p style={styles.descriptionStyle}>
            click to see detail
            </p>
          </div>

          <div className="w-100" style={styles.boder2}>
            <p style={styles.timeStyle}>
              2018-07-01
            </p>
            <p style={styles.descriptionStyle}>
              click to see detail
            </p>
          </div>

          <div className="w-100" style={styles.boder2}>
            <p style={styles.timeStyle}>
              2018-07-01
            </p>
            <p style={styles.descriptionStyle}>
              click to see detail
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  height: {
    height: 160,
  },
  EDNstyle: {
    width: 361,
    height: 65,
    fontSize: 48,
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    color: '4a4a4a',
  },
  USDstyle: {
    width: 174,
    height: 30,
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    color: '#9b9b9b',
  },
  w5: {
    width: '5%',
  },
  w10: {
    width: '10%',
  },
  w50: {
    width: '50%',
    backgroundColor: 'white',
  },
  w20: {
    width: '20%',
    backgroundColor: 'white',
  },
  pt50: {
    paddingTop: 50,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#4a4a4a',
  },
  boder2: {
    border: '1px solid black',
    padding: 2,
    backgroundColor: 'white',
  },
  timeStyle: {
    width: 140,
    height: 19,
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#9b9b9b',
  },
  descriptionStyle: {
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#4a4a4a',
  },
};

export default ActivityNotification;
