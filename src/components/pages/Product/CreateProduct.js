import React, { Component } from 'react';
import {
  Row,
  Col,
  Label,
  Input,
  Button,
  Container,
  FormFeedback,
} from 'reactstrap';
import axios from 'axios/index';
import { message, Spin } from 'antd';
import Authentication from '../../../services/Authentication';
import { API_ROOT } from '../../../config';
import { postRequest } from '../../../services/axiosApi';

class CreateProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      quantity: 0,
      description: '',
      category: '',
      lstCategories: [],
      images: [],
      isValidName: true,
      isValidDes: true,
      isValidCount: true,
      imagePreviewUrl: '',
      imageProduct: '',
      isUpdate: false,
      isLoading: false,
      holdings: '',

    };
    this.submitProduct = this.submitProduct.bind(this);
    this.cancelCreateProduct = this.cancelCreateProduct.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
  }

  componentDidMount() {
    axios.get(`${API_ROOT}/categories`, {
      headers: {
        authorization: Authentication.getAuthKey(),
      },
    }).then((res) => {
      // console.log(res.data);
      this.setState({ lstCategories: res.data });
    })
      .catch((err) => {
        console.log(err);
      });
    const holdings = window.location.href.split('/').pop();
    if (holdings !== '' && holdings !== 'new-assets') {
      this.setState({ isUpdate: true, holdings });
      axios.get(`${API_ROOT}/holdings/${holdings}/details`, {
        headers: {
          authorization: Authentication.getAuthKey(),
        },
      }).then((res) => {
        this.setState({
          name: res.data.asset,
          description: res.data.description,
          quantity: res.data.quantity,
          category: res.data.category,
          imageProduct: `/${res.data.images[0]}`,
          images: res.data.images,
        });
      })
        .catch((err) => {
          console.log(err);
          message.error('Unable to fetch data from server. Please try again!');
        });
    } else {
      this.setState({ isUpdate: false });
    }
  }

  handleImageChange(e) {
    e.preventDefault();

    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        imagePreviewUrl: reader.result,
      });
    };

    const formData = new FormData();
    formData.append('file', file, file.name);
    const postImage = postRequest(formData, 'uploads');
    postImage.then((respone) => {
      this.setState({
        imageProduct: respone.url,
      });
      const lstImage = [];
      lstImage.push(respone.url);
      this.setState({ images: lstImage });
    });

    reader.readAsDataURL(file);
  }


  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  submitProduct() {
    const {
      name, quantity, description, category, images, isUpdate, holdings,
    } = this.state;
    const { history } = this.props;
    if (images.length === 0) {
      message.error('Image must be choose');
      return;
    }
    if (category === undefined || category === '') {
      message.error('category must be choose');
      return;
    }

    // console.log(JSON.stringify(data))
    if (name.trim() === '') {
      this.setState({ isValidName: false });
      setTimeout(() => {
        this.setState({ isValidName: true });
      }, 3000);
      return;
    }
    if (description.trim() === '') {
      this.setState({ isValidDes: false });
      setTimeout(() => {
        this.setState({ isValidDes: true });
      }, 3000);
      return;
    }
    if (parseInt(quantity, 10) === 0 || parseInt(quantity, 10) < 0 || parseInt(quantity, 10) > 99999) {
      this.setState({ isValidCount: false });
      setTimeout(() => {
        this.setState({ isValidCount: true });
      }, 3000);
      return;
    }
    const data = {
      name,
      quantity: parseInt(quantity, 10),
      description,
      category,
      images,
    };
    if (!isUpdate) {
      axios.post(`${API_ROOT}/assets`, data, {
        headers: {
          authorization:
          Authentication.getAuthKey(),
        },
      })
        .then(() => {
          const dataHolding = {
            asset: name,
            description,
            label: name,
            images,
            category,
            quantity: parseInt(quantity, 10),
          };
          this.setState({ isLoading: true });
          axios.post(`${API_ROOT}/holdings`, dataHolding, {
            headers: {
              authorization:
              Authentication.getAuthKey(),
            },
          })
            .then(() => {
              this.setState({ isLoading: false });

              history.push('/account/product-management/All');
              message.success('Create assest success');
            })
            .catch((err) => {
              this.setState({ isLoading: false });

              if (err.response !== null && err.response.data !== null) {
                message.error(err.response.data.error);
              } else {
                message.error('Cannot create assest');
              }
            });
        })
        .catch((err) => {
          if (err.response !== null && err.response.data !== null) {
            message.error(err.response.data.error);
          } else {
            message.error('Cannot create assest');
          }
        });
    } else {
      const holdingsUpdate = {
        quantity: parseInt(quantity, 10),
        description,
        images,
        category,
      };
      this.setState({ isLoading: true });

      axios.patch(`${API_ROOT}/holdings/${holdings}`, holdingsUpdate, {
        headers: {
          authorization:
            Authentication.getAuthKey(),
        },
      }).then(() => {
        this.setState({ isLoading: false });

        history.push('/account/product-management/All');
        message.success('Update success');
      }).catch((error) => {
        this.setState({ isLoading: false });

        if (error !== null && error.response !== null && error.response.data !== null) {
          message.error(error.response.data.error);
        } else {
          message.error('Cannot update');
        }
      });
    }
  }

  cancelCreateProduct() {
    const { history } = this.props;
    history.push('/account/product-management/All');
    // this.props.history.push('/store/product-management');
  }

  handleChangeCategory(e) {
    const { options } = e.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    } this.setState({ category: value[0] });
  }

  // renderItemCategories() {
  //   const { lstCategories } = this.state;
  //   if (lstCategories != null) {
  //     return
  //     ));
  //   }
  // }


  render() {
    const {
      name, description, category, quantity, imagePreviewUrl, lstCategories,
      isValidName, isValidDes, isValidCount, imageProduct, isUpdate, isLoading,
    } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} className="img-responsive position-relative" alt="" style={styles.ImgHeight155} />);
    } else {
      $imagePreview = (<img src={`${API_ROOT + imageProduct}`} className="img-responsive  position-relative" alt="" style={styles.ImgHeight155} />);
    }
    return (
      <div style={styles.containerStyle}>
        <Spin spinning={isLoading} size="large">
          <Container style={styles.container}>
            <Row className="pl-3 pt-3">
              <Label style={styles.textFont}>
                Product Image
              </Label>
            </Row>
            <Row>
              <Col md="3">
                <div className="upload-btn-wrapper">
                  <div style={styles.btnAddImage}>
                    <button type="button" style={styles.buttonStyle}>
                      <span className="fa-stack fa-2x" style={styles.plusBtnStyle}>
                        <i className="fa fa-circle fa-stack-2x" style={styles.circleBtn} />
                        <i className="fa fa-plus fa-stack-1x" style={styles.circleBtnInline} />
                      </span>
                      <p style={styles.titleStyle}>
                        Add Image
                      </p>
                    </button>

                  </div>
                  <input
                    type="file"
                    onChange={this.handleImageChange}
                    accept="image/*"
                    style={styles.inputStyle2}
                  />
                </div>
              </Col>
              <Col sm={8}>
                <div>
                  <div>
                    {$imagePreview}
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
                  <Col sm={3}>
                    <Label className="float-right ">
                      Category
                    </Label>
                  </Col>
                  <Col>
                    <select name="category" value={category} onChange={this.handleChange} className="form-control">
                      <option disabled selected value="">
                        {' '}
                          -- select an category --
                        {' '}
                      </option>
                      {
                        lstCategories.map(item => (
                          <option value={item.name} key={item.name}>
                            {item.name}
                          </option>))
                      }
                    </select>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col sm={3}>
                    <Label className="float-right">
                      {' '}
                      Item Name
                    </Label>
                  </Col>
                  <Col>
                    <Input
                      disabled={isUpdate}
                      invalid={!isValidName}
                      name="name"
                      id="inputDescription"
                      onChange={this.handleChange}
                      value={name}
                    />
                    <FormFeedback>
Item name is required
                    </FormFeedback>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col sm={3}>
                    <Label className="float-right">
                      Description
                    </Label>
                  </Col>
                  <Col>
                    <Input invalid={!isValidDes} type="textarea" rows={8} name="description" id="inputDescription" onChange={this.handleChange} value={description} />
                    <FormFeedback>
Description is required
                    </FormFeedback>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col sm={3}>
                    <Label className="float-right">
                      Count
                    </Label>
                  </Col>
                  <Col>
                    <Input invalid={!isValidCount} type="number" name="quantity" onChange={this.handleChange} value={quantity} />
                    <FormFeedback>
                    Count is invalid
                    </FormFeedback>

                  </Col>
                </Row>
                <br />
                <Row>
                  <Col sm={3} />
                  <Col>
                    <Button className="float-left mr-4 w-25" onClick={this.submitProduct} style={styles.styleBtnSubmit}>
                      {' '}
                      {!isUpdate ? 'Create' : 'Update'}
                    </Button>

                    <Button className="float-left mr-4 w-25" onClick={this.cancelCreateProduct}>
                      {' '}
                        Cancel
                    </Button>
                  </Col>
                </Row>

              </Col>
            </Row>
            <br />
            <Row />
          </Container>
        </Spin>
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

  previewText: {
    width: '100%',
    marginTop: 20,
  },
  bgRow: {
    backgroundColor: '#EEEEEE',
    paddingTop: 20,
    paddingBottom: 20,
  },
  container: {
    color: '#010228',
    background: '#fff',
    paddingLeft: '97px',
    paddingRight: '256px',
    paddingTop: '20px',
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
  containerStyle: {
    marginTop: 20,
    minHeight: 'calc(100vh - 157px)',
  },
  btnAddImage: {
    background: '#53535c',
    textAlign: 'center',
  },
  buttonStyle: {
    background: 'none',
    border: 'none',
  },
  plusBtnStyle: {
    fontSize: '3em',
    paddingTop: '25px',
  },
  circleBtn: {
    color: '#5bb7e4',
  },
  circleBtnInline: {
    color: 'white',
  },
  titleStyle: {
    color: '#ffffff',
    fontSize: 16,
    paddingTop: '25px',
  },
  inputStyle2: {
    height: '155px',
  },
  ImgHeight155: {
    height: '155px',
    width: 'auto',
    maxWidth: '300px',
  },
  styleBtnSubmit: {
    background: '#004f50',
  },
};

export default CreateProduct;
