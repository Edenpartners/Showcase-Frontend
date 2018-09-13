const initState = {
  page: '',
  tab: '',
  tab_data: [],
};
const page = (state = initState, action) => {
  switch (action.type) {
    case 'CHANGE_PAGE':
      return action.data;
    default:
      return state;
  }
};

export default page;