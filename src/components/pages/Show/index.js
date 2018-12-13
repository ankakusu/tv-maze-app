import React, { useState, useEffect, useReducer, Fragment } from 'react';
import PropTypes from 'prop-types';
import reducers from '../../../domains/show/show.reducers';
import ShowService from '../../../domains/show/show.service.js';
import { ShowModel } from '../../../domains/show/show.model';
import { FETCH_SHOW_ERROR, FETCH_SHOW_REQUEST } from '../../../domains/show/show.constants';
import NotFound from '../NotFound';

function getShowId(match) {
  if (match && match.params && match.params.showId) {
    return match.params.showId;
  }
  return undefined;
}

function ShowPage(props) {
  const [pageTitle, setPageTitle] = useState('Show');
  const [showId] = useState(getShowId(props.match));

  useEffect(() => {
    document.title = `${pageTitle}`;
  });

  const [{show, serverSideError}, dispatch] = useReducer(reducers, {show: new ShowModel()});
  useEffect(() => {
    ShowService.getShow(showId)
      .subscribe(
        currentShow => {
          setPageTitle(`${pageTitle} ${currentShow.title}`);
          dispatch({
            type: FETCH_SHOW_REQUEST,
            show: currentShow,
            serverSideError: false,
          });
        },
        () => {
          dispatch({
            type: FETCH_SHOW_ERROR,
            serverSideError: true,
          });
        });
  }, []);

  if (serverSideError) {
    return (
      <NotFound/>
    );
  }

  return (
    <Fragment>
      <div data-cy="show-title">{show.title}</div>
      <div data-cy="show-description">{show.description}</div>
    </Fragment>
  );
}

ShowPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      showId: PropTypes.number.isRequired,
    }),
  }),
};

export default ShowPage;