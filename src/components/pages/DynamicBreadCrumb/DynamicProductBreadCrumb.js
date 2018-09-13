import * as React from 'react';
import { Link } from 'react-router-dom';


export const DynamicProductBreadCrumb = ({category, productName}) :Props =>(
    <div className="row position-absolute" style={styles.top123}>
      <Link to={`${baseRouter}${category}`}>
        <p style={styles.textCategory}>{category}</p>
      </Link>
      &nbsp; &nbsp;
      <p style={styles.textProduct}>
        >
      </p>
      &nbsp; &nbsp;
      <p style={styles.textProduct}>{productName.length < 50 ? productName : `${productName.substring(0, 47)}...`}</p>
    </div>
);
const styles = {
    top123:{
        top: 123,

    },
    textCategory: {
      fontSize: 16,
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontStretch: 'normal',
      lineHeight: 'normal',
      letterSpacing: 'normal',
      color: '#39898a',
    },
    textProduct: {
      fontSize: 16,
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontStretch: 'normal',
      lineHeight: 'normal',
      letterSpacing: 'normal',
      color: '#101820',
    },
};

const baseRouter = '/store/offers/'