const breadcrumb = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_BREADCRUMB':
      return action.data;
    default:
      return state;
  }
};

export default breadcrumb;
