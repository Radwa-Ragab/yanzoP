import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import allReducers from './global-state/reducers/rootReducer';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import promiseMiddleware from 'redux-promise';
/* LocalStorage Functions */
import { loadState } from './global-state/LocalStorage';
import { saveState } from './global-state/LocalStorage';
window.hsConversationsSettings = {
  loadImmediately: false,
  enableWidgetCookieBanner: true,
  disableAttachment: false
};
const persistedState = loadState();
const middleware = [thunk];
const store = createStore(
  allReducers,
  persistedState,
  composeWithDevTools(applyMiddleware(promiseMiddleware, ...middleware))
);

store.subscribe(() => {
  saveState({
    auth: store.getState().auth,
    searchData: store.getState().searchData,
    supplierRes: store.getState().supplierRes,
    courierSearchResult:store.getState().courierSearchResult,
    requestData:store.getState().requestData,
    type:store.getState().type,
    courierType:store.getState().courierType,
    quickupTypes:store.getState().quickupTypes

  });
});


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
