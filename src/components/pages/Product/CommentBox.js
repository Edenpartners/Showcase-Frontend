import * as React from 'react';
import { styles } from './StyleProductDetail';
import { Row, Col } from 'reactstrap';
import { Button, Pagination } from 'antd';
import { MESSAGE_REQUIRE_COMMENT } from '../../common/const/Messages';
import moment from 'moment';
import { API_ROOT } from '../../../config';


export const CommentBox = ({ avatar, comments, onChange, onComment, onKeyUp, value, isError, onChangePageSize, pagination, isShowAddCommentButton }): Props => (
  <div>
    <Row>
      <div style={styles.textComment}> Comments ({
        comments ? pagination.totalRecords : 0}
        )
      </div>
    </Row>
    {comments.length > 0 && <div style={styles.commentBox}>
      {comments.map((comment) => (

        <div key={comment.id}>
          <Row>
            <Col-2>
              <div className="pull-left">
                <img
                  src={comment.account.avatar ? `${API_ROOT}/${comment.account.avatar}` : avatar}
                  alt=""
                  style={styles.avatarComment}/>
              </div>
              <div className="pull-right">
                <p style={styles.textShopper}>
                  {comment.account.label ? comment.account.label : 'Shopper name'}
                </p>
              </div>
            </Col-2>
          </Row>
          <Row>
            <Col-6 style={styles.marginLeftTextComment}>
              <p>{comment.content}
              </p>
              <p style={styles.commentDate}>
                {moment.unix(comment.encoded_created_date)
                  .format('DD/MM/YYYY hh:mm A')}
              </p>
            </Col-6>
          </Row>
        </div>
      ))}

    </div>}

    {comments.length > 0 && <Row>
      <Col xl="12">
        <Pagination style={styles.paginationComment}
                    current={pagination.index}
                    pageSize={pagination.pageSize}
                    onChange={onChangePageSize}
                    total={pagination.totalRecords}/>

      </Col>
    </Row>}

    {isShowAddCommentButton ?
      <Row style={styles.commentTextBox}>
        <Col xl='12'>
          <div className='form-group'>
      <textarea
        className='form-control'
        rows='4'
        style={styles.backgroundArea}
        onChange={onChange} value={value}
        onKeyUp={onKeyUp}/>
            {isError && <span style={styles.errorTextComment}>{MESSAGE_REQUIRE_COMMENT}</span>}

            <Button
              style={styles.buttonAddComment}
              onClick={onComment}> Add Comment
            </Button>

          </div>
        </Col>
      </Row> : null}
  </div>
);
