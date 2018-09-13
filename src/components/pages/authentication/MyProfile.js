import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  FormGroup,
  Form,
  Row,
  Col,
  Input,
  Label,
  Button,
  Container,
} from 'reactstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { API_ROOT } from '../../../config';
import './customUploadButton.css';
import { patchRequest, getRequest, postRequest } from '../../../services/axiosApi';
import warningMessage from '../../common/WarningMessage/warningMessage';

const defaultAvatar = require('../../../assets/img/user.png');

class MyProfile extends Component {
  constructor() {
    super();
    this.state = {
      fullName: '',
      description: '',
      publicKey: 'example public key',
      isOpen: false,
      errors: {},
      imagePreviewUrl: '',
      email: '',
      storeState: {},
      avatar: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleValidation = this.handleValidation.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
    this.toggleCopied = this.toggleCopied.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.resetChange = this.resetChange.bind(this);
    this.toggleSuccessMessage = this.toggleSuccessMessage.bind(this);
    this.toggleErrorMessage = this.toggleErrorMessage.bind(this);
    this.handleSubmitEven = this.handleSubmitEven.bind(this);
  }

  componentDidMount() {
    const api = getRequest(`${API_ROOT}/accounts`);
    api.then((response) => {
      this.setState({
        publicKey: response.publicKey,
        fullName: response.label,
        description: response.description,
        email: response.email,
        storeState: response,
        avatar: response.avatar,
      });
    }).catch(() => {
      warningMessage(false, 'Unable to fetch data from server. Please try again!');
    });
  }

  handleSubmitEven(e) {
    if (e.key === 'Enter') {
      this.updateInfo();
    }
  }

  toggleSuccessMessage() {
    warningMessage(true, 'Your information has been updated ', 3);
  }

  toggleErrorMessage() {
    warningMessage(false, 'Oh something went wrong !!', 3);
  }

  resetChange() {
    const { label, description } = this.state.storeState;
    this.setState({
      fullName: label,
      description,
    });
    this.props.history.push('/store/offers/All');
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleValidation() {
    const fields = this.state;
    const errors = {};
    let formIsValid = true;

    if (!fields.fullName || fields.fullName === '') {
      errors.fullName = 'Full name cannot be empty';
      formIsValid = false;
    }
    if (fields.fullName && fields.fullName.length > 100) {
      errors.fullName = 'Full name must be maximum 100 characters';
      formIsValid = false;
    }
    if (fields.description && fields.description.length > 300) {
      errors.description = 'Description must be maximum 300 characters';
      formIsValid = false;
    }

    this.setState({ errors });
    return formIsValid;
  }

  updateInfo() {
    const data = {
      label: this.state.fullName,
      description: this.state.description,
      avatar: this.state.avatar,
    };
    if (this.handleValidation()) {
      const api = patchRequest(data, 'accounts');
      const { handleUserUpdate } = this.props;
      api.then((response) => {
        this.setState({
          fullName: response.account.label,
          description: response.account.description,
          storeState: response.account,
          avatar: response.account.avatar,
        });
        this.toggleSuccessMessage();
        if (typeof handleUserUpdate === 'function') {
          handleUserUpdate();
        }
      }).catch(() => {
        this.toggleErrorMessage();
      });
    }
  }

  toggleCopied() {
    warningMessage(true, 'Copied', 5);
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
        avatar: respone.url,
      });
    });

    reader.readAsDataURL(file);
  }

  render() {
    const {
      imagePreviewUrl, fullName, description, errors, publicKey, email, avatar,
    } = this.state;
    let $imagePreview = null;
    if (imagePreviewUrl) {
      $imagePreview = (<img src={imagePreviewUrl} className="img-responsive w-100 position-relative" alt="" style={styles.ImgHeight190} />);
    } else if (avatar) {
      $imagePreview = (<img src={`${`${API_ROOT}/${avatar}`}`} className="img-responsive w-100 position-relative" alt="" style={styles.ImgHeight190} />);
    } else {
      $imagePreview = (<img src={defaultAvatar} className="img-responsive w-100 position-relative" alt="" style={styles.ImgHeight190} />);
    }
    return (
      <Container>
        <div style={styles.minHeight100}>
          <div className="row pt-5">
            <Col xs="12" sm="12" style={styles.bodyStyles}>
              <div className="row">
                <Col xs="1" md="1" sm="1" />
                <Col xs="3" sm="3" md="3" className="pt-5">
                  <p style={styles.titles} className="pb-4">
                      My Information
                  </p>
                  <div className="w-75 float-left">
                    <div style={styles.Height190px}>
                      {$imagePreview}
                    </div>
                    <div className="pt-4 w-100">
                      <div className="upload-btn-wrapper">
                        <div className="row">
                          <div className="w-13" />
                          <Button className="btnUploadCustom">
                          Upload profile image
                          </Button>
                        </div>
                        <input
                          type="file"
                          onChange={this.handleImageChange}
                          accept="image/*"
                          style={styles.inputStyle2}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xs="7" sm="7" md="7">
                  <div className="pt-5">
                    <Form>
                      <FormGroup>
                        <Row className="pt-2">
                          <Col xs="3" sm="3" className="text-right">
                            <Label style={styles.textColor}>
                                ID
                            </Label>
                          </Col>
                          <Col xs="9" sm="9">
                            <p style={styles.pStyle}>
                              {email}
                            </p>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row className="pt-2">
                          <Col xs="3" sm="3" className="text-right">
                            <Label style={styles.textColor}>
                                Password
                            </Label>
                          </Col>
                          <Col xs="6" sm="6">
                            <p style={styles.pStyle}>
                                ********
                            </p>
                          </Col>
                          <Col xs="3" sm="3">
                            <Link to="/authentication/change-password">
                              <input type="button" style={styles.buttonSmallStyles} value="Change pass" />
                            </Link>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row className="pt-2">
                          <Col xs="3" sm="3" className="text-right">
                            <Label style={styles.textColor}>
                                Full Name
                            </Label>
                          </Col>
                          <Col xs="9" sm="9">
                            <Input
                              type="text"
                              name="fullName"
                              style={styles.inputStyle}
                              value={fullName}
                              onChange={this.handleChange}
                              onKeyPress={this.handleSubmitEven}
                            />
                            <span style={{ color: 'red' }}>
                              {errors.fullName}
                            </span>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row className="pt-2">
                          <Col xs="3" sm="3" className="text-right">
                            <Label style={styles.textColor}>
                                Description
                            </Label>
                          </Col>
                          <Col xs="9" sm="9">
                            <Input
                              type="textarea"
                              name="description"
                              style={styles.inputAreaStyle}
                              onChange={this.handleChange}
                              value={description}
                            />
                            <span style={{ color: 'red' }}>
                              {errors.description}
                            </span>
                          </Col>
                        </Row>
                      </FormGroup>
                      <FormGroup>
                        <Row className="pt-2">
                          <Col xs="3" sm="3" className="text-right">
                            <Label style={styles.textColor}>
                                Public Key
                            </Label>
                          </Col>
                          <Col xs="6" sm="6">
                            <Input
                              type="text"
                              name="publicKey"
                              style={styles.inputReadOnlyStyle}
                              value={publicKey}
                              onChange={this.handleChange}
                              readOnly="readonly"
                            />
                          </Col>
                          <Col xs="3" sm="3">
                            <CopyToClipboard text={publicKey}>
                              <Button style={styles.buttonSmallStyles} onClick={this.toggleCopied}>
                                  Copy Key
                              </Button>
                            </CopyToClipboard>
                          </Col>
                        </Row>
                      </FormGroup>
                    </Form>
                  </div>
                </Col>
                <Col xs="1" md="1" sm="1" />
                <Col xs="1" md="1" sm="1" />
                <Col xs="8" sm="8" className="pt-5">
                  <div className="row pl-3">
                    <div className="pr-3">
                      <Button style={styles.buttonStyle} onClick={this.updateInfo}>
                          Save Change
                      </Button>
                    </div>
                    <div>
                      <Button style={styles.buttonStyleWhite} onClick={this.resetChange}>
                          Cancel
                      </Button>
                    </div>
                  </div>
                </Col>
              </div>
            </Col>
          </div>
        </div>
      </Container>
    );
  }
}

MyProfile.propTypes = {
  handleUserUpdate: PropTypes.func,
};

MyProfile.defaultProps = {
  handleUserUpdate: null,
};

export default MyProfile;

const
  styles = {
    minHeight100: {
      minHeight: '100vh',
    },
    activeFont: {
      fontSize: '18px',
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontStretch: 'normal',
      lineHeight: 'normal',
      letterSpacing: 'normal',
      color: '#ffffff',
    },
    homePageFont: {
      fontSize: '18px',
      fontWeight: 'normal',
      fontStyle: 'normal',
      fontStretch: 'normal',
      lineHeight: 'normal',
      letterSpacing: 'normal',
      color: 'rgba(255, 255, 255, 0.5)',
    },
    bodyStyles: {
      minHeight: '600px',
      backgroundColor: '#ffffff',
    },
    breadcrumb: {
      backgroundColor: '#1a3365',
      height: '60px',
      width: '105%',
      paddingLeft: '5%',
    },
    textColor: {
      color: 'black',
      fontSize: '18px',
    },
    buttonStyle: {
      width: '164px',
      height: '40px',
      backgroundColor: '#004f50',
      borderRadius: '2px',
      color: '#ffffff',
    },
    buttonUploadStyle: {
      width: '100%',
      height: '55px',
      backgroundColor: '#ffffff',
      color: '#637097',
      borderRadius: '2px',
      border: 'solid 1px #637097',
    },
    buttonStyleWhite: {
      width: '164px',
      height: '40px',
      backgroundColor: '#ffffff',
      color: '#637097',
      borderRadius: '2px',
      border: 'solid 1px #637097',
    },
    inputStyle: {
      height: '42px',
    },
    inputStyle2: {
      height: '33px',
    },
    inputReadOnlyStyle: {
      height: '42px',
      backgroundColor: 'white',
    },
    inputAreaStyle: {
      height: '100px',
    },
    inputNoBoder: {
      border: 'none',
      height: '42px',
    },
    buttonSmallStyles: {
      width: '100%',
      height: '42px',
      backgroundColor: '#ffffff',
      color: '#637097',
      borderRadius: '2px',
      fontSize: '13px',
      border: 'solid 1px #637097',
    },
    bufferDivStyle: {
      paddingLeft: '12%',
    },
    titles: {
      fontSize: '18px',
      fontWeight: '600',
      fontStyle: 'normal',
      fontStretch: 'normal',
      lineHeight: 'normal',
      letterSpacing: 'normal',
      color: '#010228',
    },
    Height190px: {
      width: '100%',
      height: '190px',
      border: 'solid 1px #637097',
    },
    pStyle: {
      fontSize: '1rem',
      color: '#495057',
    },
    ImgHeight190: {
      height: '190px',
    },
    successWarningMessageStyle: {
      backgroundColor: '#cbffc0',
      fontSize: '17px',
      color: '#27110f',
      textAlign: 'center',
    },
    errorWarningMessageStyle: {
      backgroundColor: '#ff5661',
      fontSize: '17px',
      color: '#27110f',
      textAlign: 'center',
    },
  };
