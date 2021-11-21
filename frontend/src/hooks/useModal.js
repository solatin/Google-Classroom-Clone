import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as ModalActions from 'src/actions/modal';
import * as ModalSelectors from 'src/selectors/modal';

export const useModal = (name) => {
  const dispatch = useDispatch();
  const status = useSelector(ModalSelectors.getStatus);
  const currentModal = useSelector(ModalSelectors.getModal);

  const openModal = useCallback(
    (modalName) => {
      dispatch(ModalActions.modalShow(modalName));
    },
    [dispatch]
  );

  const closeModal = useCallback(
    (modalName) => {
      dispatch(ModalActions.modalClose(modalName));
    },
    [dispatch]
  );

  const isShowing = useMemo(() => status && currentModal === name, [status, name, currentModal]);

  return {
    isShowing,
    openModal,
    closeModal
  };
};
