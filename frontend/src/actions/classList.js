import { createTypes } from 'reduxsauce';
import authAxios from 'src/utils/authAxios';

export const ClassListTypes = createTypes(`
  LIST_CLASS_FETCH_REQUEST
  LIST_CLASS_FETCH_SUCCESS
  LIST_CLASS_FETCH_FAILURE

  LIST_CLASS_CREATE_REQUEST
  LIST_CLASS_CREATE_SUCCESS
  LIST_CLASS_CREATE_FAILURE

  LIST_CLASS_RESET_REQUEST
`);

export const fetchSuccess = (list) => ({ type: ClassListTypes.LIST_CLASS_FETCH_SUCCESS, list });

export const fetchFailure = (error) => ({
  type: ClassListTypes.LIST_CLASS_FETCH_FAILURE,
  error
});

export const fetchRequest = () => async (dispatch) => {
  try {
    dispatch({ type: ClassListTypes.LIST_CLASS_FETCH_REQUEST });
    const rs = await authAxios.get('/class');
    dispatch(fetchSuccess(rs));
  } catch (e) {
    console.log(e);
    dispatch(fetchFailure(e));
  }
};

export const createSuccess = (list) => ({ type: ClassListTypes.LIST_CLASS_CREATE_SUCCESS, list });

export const createFailure = (error) => ({
  type: ClassListTypes.LIST_CLASS_CREATE_FAILURE,
  error
});

export const createRequest = (newClass) => async (dispatch) => {
  try {
    dispatch({ type: ClassListTypes.LIST_CLASS_CREATE_REQUEST });
    await authAxios.post('/class', newClass);
    dispatch(fetchRequest());
  } catch (e) {
    dispatch(createFailure(e));
  }
};

export const resetRequest = () => ({ type: ClassListTypes.LIST_CLASS_RESET_REQUEST });