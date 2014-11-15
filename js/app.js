/** @jsx React.DOM */

var React = require('react');
var Map = require('./components/Map.js');
var DataSeries = require('./components/DataSeries.js');
var DataSeriesSelector = require('./components/DataSeriesSelector.js');

React.render(
  <DataSeries />,
  document.getElementById('selectors')
);

React.render(
  <Map />,
  document.getElementById('map')
);

React.render(
    <DataSeriesSelector url="dataPaths.json" />,
    document.getElementById('dataSeriesSelector')
)
