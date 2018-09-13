import * as React from 'react';
import { Modal } from 'antd';
import { PURCHASE_TITLE } from '../../common/const/MenuItem';
import './StyleBuyItemModal.css';


export const BuyItemModal = ({ visible, onCancel, onOk, price }):Props => (
  <div>
    <Modal className="buy-item" width={593.3}
           title={PURCHASE_TITLE}
           visible={visible}
           onOk={onOk}
           onCancel={onCancel}>
      <div style={styles.body}>
        <p style={styles.transactionAmount}>Transaction amount</p>
        <p style={styles.price}>EDN {price}</p>
      </div>
    </Modal>
  </div>
);

const styles = {
  transactionAmount: {
    fontSize: 18,
    color: '#010228',
    margin: 0,
  },
  body: {
    textAlign: 'center',
  },
  price: {
    color: '#ff8976',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
  }

};
