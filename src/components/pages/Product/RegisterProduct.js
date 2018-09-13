import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  Form,
  FormFeedback,
  ModalHeader,
  ModalBody,
  Modal,
  Button,
  FormGroup,
} from 'reactstrap';
import { REGISTER_TITLE } from '../../common/const/MenuItem';
import './StyleRegisterPopup.css';
import {message, Spin} from "antd";
import axios from "axios";
import {API_ROOT} from "../../../config";
import Authentication from "../../../services/Authentication";

class RegisterProduct extends Component {

  constructor(props) {
    super(props);
    this.state = {
      edn: 0,
      quantityRegis: 0,
      repeatAble: '',
      txtPublicKey: '',
      isValidEdnRegis: true,
      isValidQuantityRegis: true,
      isValidPublicKey: true,
      isValidRepeatAble: true,
      isShowModal: false,
      isLoading: false,
    }
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.visible !== nextProps.visible) {
      this.setState({isShowModal: nextProps.visible})
    }
  }

  onChangeModal = (e) => {
    this.setState({[e.target.name]: e.target.value});

  };

  onOK = (data) => {
    if(parseInt(this.state.edn, 10) < 0){
      this.setState({ isValidEdnRegis: false });
      setTimeout(() => {
        this.setState({ isValidEdnRegis: true });
      }, 3000);
      return;
    }
    if(parseInt(this.state.quantityRegis, 10) === 0 || parseInt(this.state.quantityRegis, 10) < 0){
      this.setState({ isValidQuantityRegis: false });
      setTimeout(() => {
        this.setState({ isValidQuantityRegis: true });
      }, 3000);
      return;
    }
    if (this.state.quantityRegis > this.props.productData.quantity) {
      message.error('Quantity cannot be greater count');
      return
    }
    if (this.state.repeatAble === '') {
      message.error('Repeatable must be choose');
      return
    }


    let rules = {
      type : this.state.repeatAble,
      value: []
    };
    if(this.state.repeatAble === 'EXCHANGE_LIMITED_TO_ACCOUNTS') {
      if(this.state.txtPublicKey === '') {
        this.setState({isValidPublicKey : false});

        setTimeout(() => {
          this.setState({ isValidPublicKey: true });
        }, 3000);
        return;
      }
      rules.value.push(this.state.txtPublicKey);
    }
    this.props.productData.price = parseInt(this.state.edn, 10);
    this.props.productData.sourceQuantity = parseInt(this.state.quantityRegis, 10);
    this.props.productData.rules = [];
    this.props.productData.rules.push(rules);
    this.props.productData.source = this.props.productData.id;
    let dataOffer = {
      price: parseInt(this.state.edn, 10),
      sourceQuantity: parseInt(this.state.quantityRegis, 10),
      source: this.props.productData.id,
      rules: this.props.productData.rules,
      name: this.props.productData.name,
      category: this.props.productData.category,
    };
    console.log("productData" + JSON.stringify(dataOffer));
    this.setState({isLoading: true});
    axios.post(`${API_ROOT}/offers`, dataOffer, {
      headers: {
        authorization:
          Authentication.getAuthKey(),
      },
    })
      .then(() => {
        const {history} = this.props;
        history.push('/account/product-management/All');
        message.success('Register success');
        this.setState({isShowModal : false, isLoading: false});
        this.clearDataRegister();
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false});

        if(err.response.data && typeof err.response.data !== 'undefined') {
          message.error( err.response.data.error);
        }
        else {
          message.error( "Cannot register");

        }
      });

  };
  clearDataRegister(){
    this.setState({
      edn: 0,
      quantityRegis: 0,
      repeatAble: '',
      txtPublicKey: ''
    })
  }

  render() {
    const {
       onCancel
    } = this.props;
    const { edn, quantityRegis, repeatAble, isValidEdnRegis, isValidQuantityRegis,
      isValidPublicKey, isValidRepeatAble, isShowModal,isLoading}  = this.state;
    return (
      <div className="register-item">
          <Modal isOpen={isShowModal} toggle={onCancel} className="register-item" size="lg" onClosed={this.props.handleCloseModal} centered>
          <ModalHeader>
            {REGISTER_TITLE}
          </ModalHeader>
          <ModalBody>
            <Spin spinning={isLoading} size="large">
            <div style={styles.containerStyle}>
              <Form>
                <Row>
                  <Col>
                    <Row>
                      <Col sm={2}>
                        <Label className="float-left">
                          Price
                        </Label>
                      </Col>
                      <Col sm={4}>
                        <InputGroup>
                          <Input
                            invalid={!isValidEdnRegis}
                            type="number"
                            name="edn"
                            onChange={this.onChangeModal}
                            value={edn}
                          />
                          <InputGroupAddon addonType="append">
                            EDN
                          </InputGroupAddon>
                          <FormFeedback>
                            Price is invalid
                          </FormFeedback>

                        </InputGroup>
                      </Col>
                      <Col sm={1}/>
                      <Col sm={2}>
                        <Label className="float-left">
                          Quantity
                        </Label>
                      </Col>
                      <Col sm={3}>
                        <Row>
                          <Col sm={10}>
                            <Input
                              invalid={!isValidQuantityRegis}
                              type="number"
                              name="quantityRegis"
                              value={quantityRegis}
                              onChange={this.onChangeModal}
                            />
                            <FormFeedback>
                              Quantity is invalid
                            </FormFeedback>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <br />
                    <Row>
                      <Col sm={2}>
                        <Label className="float-left">
                          Repeatable
                        </Label>
                      </Col>
                      <Col sm={10}>
                        <FormGroup onChange={this.onChangeModal} invalid={!isValidRepeatAble}>
                          <Row className="pl-4">
                            <Col sm={4}>
                              <Label check>
                                <Input type="radio" name="repeatAble" value="EXCHANGE_ONCE" />
                                {' '}
                              Execute One
                              </Label>
                            </Col>
                            <Col sm={2} />
                            <Col sm={5}>
                              <Label check>
                                <Input type="radio" name="repeatAble" value="EXCHANGE_ONCE_PER_ACCOUNT" />
                                {' '}
                              Execute One per Participant
                              </Label>
                            </Col>
                          </Row>
                          <Row className="pl-4">
                            <Col sm={4}>
                              <Label check>
                                <Input type="radio" name="repeatAble" value="EXCHANGE_LIMITED_TO_ACCOUNTS" />
                                {' '}
                                <Input
                                  invalid={!isValidPublicKey}
                                  type="text"
                                  name="txtPublicKey"
                                  onChange={this.onChangeModal}
                                  placeholder="Limit to public key"
                                  disabled = { repeatAble !== 'EXCHANGE_LIMITED_TO_ACCOUNTS'}
                                />
                                <FormFeedback>
                                  PublicKey is invalid
                                </FormFeedback>
                              </Label>
                            </Col>
                          </Row>

                        </FormGroup>
                        <FormFeedback>
                          Repeatable is invalid
                        </FormFeedback>
                      </Col>

                    </Row>
                  </Col>
                </Row>
              </Form>
            </div>
            <br />
            <Row style={styles.containerStyleRow}>
              <Col sm={3}>
                <Button className="btn-primary" onClick={this.onOK} disabled={isLoading}>
                  Register
                </Button>
                {' '}
              </Col>
              <Col sm={3}>
                <Button onClick={onCancel}>
                  Cancel
                </Button>
              </Col>

              <Col />
            </Row>
            <br />
            </Spin>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

RegisterProduct.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  productData: PropTypes.object.isRequired,
  handleCloseModal: PropTypes.func,
};

RegisterProduct.defaultProps = {
  visible: false,
  handleCloseModal: null,
};

const styles = {
  itemWrapper: {
    marginBottom: 25,
  },
  containerStyle: {
    margin: 20,
  },
  containerStyleRow: {
    margin: 10,
  },
};

export default RegisterProduct;
