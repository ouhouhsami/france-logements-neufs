/** @jsx React.DOM */

var React = require('react');
var Map = require('./components/Map.js');
var DataSeries = require('./components/DataSeries.js');
var DataSeriesActions = require('./actions/DataSeriesActions.js');


DataSeriesActions.get('geojson/departments.geojson', 'data/departments/TO01.txt');

React.render(
  <DataSeries />,
  document.getElementById('selectors')
);

React.render(
  <Map />,
  document.getElementById('map')
);
