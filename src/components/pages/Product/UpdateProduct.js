import React, { Component } from 'react';
import {
  Row,
  Col,
  Label,
  Input,
  Button,
  Container,
} from 'reactstrap';
import axios from 'axios/index';
import ButtonAdd from '../../common/ButtonAdd/ButtonAdd';
import Authentication from '../../../services/Authentication';
import { API_ROOT } from '../../../config';


// const sampleItem = require('../../../assets/img/sample-rubber.jpg');
class CreateProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assert: {
        images: '',
        name: '',
        quantity: 0,
        description: '',
        category: '',
      },
    };
    this.submitAddProduct = this.submitAddProduct.bind(this);
    this.cancelCreateProduct = this.cancelCreateProduct.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.handleErrorPopup = this.handleErrorPopup.bind(this);
  }

  componentDidMount() {
    const nameAssert = window.location.href.split('/').pop();
    axios.get(`${API_ROOT}/assets/${nameAssert}`, {
      headers: {
        authorization: Authentication.getAuthKey(),
      },
    }).then((res) => {
      console.log(res.data);
      this.setState({ assert: res.data });
    })
      .catch((err) => {
        console.log(err);
      });
  }

  handleErrorPopup() {
    this.setState(prevState => ({
      errorSubmit: !prevState.errorSubmit,
    }));
  }


  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  submitAddProduct() {
    const {
      name, count, description, category, images,
    } = this.state;

    console.log(`${name} ----${count} ----${description} ----${category} ----${images} ----`);
  }

  cancelCreateProduct() {
    const { history } = this.props;
    history.push('/account/product-management');
    // this.props.history.push('/store/product-management');
  }

  // handleClickAdd() {
  //   console.log('click btntntntnntntn');
  // }

  handleChangeCategory(e) {
    const { options } = e.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    } this.setState({ category: value });
  }


  render() {
    const { assert } = this.state;
    return (
      <div style={styles.containerStyle}>

        <Container style={styles.container}>
          <Row className="pl-3 pt-3">
            <Label style={styles.textFont}>
              Product Image
            </Label>
          </Row>
          <Row>
            <Col>
              <Row style={styles.fixedHeight}>
                <Col sm={2}>
                  <ButtonAdd widthBg={100} heightBg={100} btnClickedFunc={this.handleClickAdd} />
                </Col>
                <Col sm={4}>
                  <div>
                    <div style={styles.imgPreview}>
                      <img className="img" alt="" src={assert.images} />
                    </div>
                  </div>
                </Col>
              </Row>
              <Label style={styles.textFont}>
                Information
              </Label>

              <Row>
                <Col sm={10}>
                  <Row>
                    <Col sm={2}>
                      <Label className="float-right">
                        Category
                      </Label>
                    </Col>
                    <Col sm={10}>
                      <Input
                        type="select"
                        name="category"
                        id="exampleSelect"
                        onChange={this.handleChangeCategory}
                        required
                      >
                        <option value={assert.category}>
                          {assert.category}
                        </option>
                      </Input>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col sm={2}>
                      <Label className="float-right">
                        {' '}
                        Item Name
                      </Label>
                    </Col>
                    <Col sm={10}>
                      <Input name="name" id="inputDescription" onChange={this.handleChange} value={assert.name} />
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col sm={2}>
                      <Label className="float-right">
                        Description
                      </Label>
                    </Col>
                    <Col sm={10}>
                      <Input type="textarea" rows={8} name="description" id="inputDescription" onChange={this.handleChange} value={assert.description} />
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col sm={2}>
                      <Label className="float-right">
                        Count
                      </Label>
                    </Col>
                    <Col sm={4}>
                      <Input type="number" name="count" onChange={this.handleChange} value={assert.quantity} />
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col sm={2} />
                    <Col sm={10}>
                      <Button className="float-left mr-4" onClick={this.cancelCreateProduct}>
                        {' '}
                        Cancel
                      </Button>
                    </Col>
                  </Row>

                </Col>
              </Row>
            </Col>
          </Row>
          <br />
          <Row />
        </Container>
      </div>
    );
  }
}

const styles = {
  paddingPage: {
    marginBottom: 25,
    backgroundColor: '#ededed',
    borderColor: '#cfcfcf',
    paddingBottom: 40,
    paddingTop: 9,
    borderRadius: 2,
  },
  fileInput: {
    borderBottom: '4px solid lightgray',
    borderRight: '4px solid lightgray',
    borderTop: '1px solid black',
    borderLeft: '1px solid black',
    padding: 10,
    margin: 15,
    cursor: 'pointer',
  },

  imgPreview: {
    textAlign: 'center',
    margin: '5px 15px',
    width: '50px',
    img: {
      width: '100%',
      height: '100%',

    },
  },
  previewText: {
    width: '100%',
    marginTop: 20,
  },
  bgRow: {
    backgroundColor: '#EEEEEE',
    paddingTop: 20,
    paddingBottom: 20,
  },
  btnAddImage: {
    backgroundColor: '#808080',
    width: '100%',
    height: '100%',
    textAlign: 'center',
  },
  fixedHeight: {
    height: 160,
  },
  container: {
    marginTop: 50,
    color: '#010228',
    background: '#fff',
    paddingLeft: 24,
  },
  textFont: {
    fontSize: 18,
    fontWeight: 600,
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#010228',
  },
  textTitlePopup: {
    fontSize: 30,
    fontWeight: 600,
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#010228',
  },
  textStyle: {
    fontSize: 18,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#4a4a4a',
  },
  textStyleEDN: {
    fontSize: 40,
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#47c215',
  },
  itemWrapper: {
    marginBottom: 25,
  },
  containerStyle: {
    marginTop: 20,
    minHeight: '80vh',
  },
};

export default CreateProduct;
