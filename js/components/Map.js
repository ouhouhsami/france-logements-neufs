/** @jsx React.DOM */

var React = require('react');
var d3 = require('d3');
var queue = require("queue-async");
var colorbrewer = require("colorbrewer");
var DataSeriesStore = require('../stores/DataSeriesStore.js');

var Map = React.createClass({
  getDefaultProps: function() {
    return {
      width: 500,
      height: 500
    };
  },
  getInitialState: function() {
    // TODO: dynamic first choice
    return {
      features: [],
      nestedData: null,
      currentDataSerie: "LO06Prix de vente moyen d'une maison individuelle neuve (en euros)",
      currentYear:1995,
      min: null,
      max: null
    };
  },
  componentDidMount: function() {
    DataSeriesStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    DataSeriesStore.removeChangeListener(this._onChange);
  },
  _onChange: function(event) {
    this.setState({
      features: DataSeriesStore.get().geojson.features,
      nestedData: DataSeriesStore.get().data,
      currentYear: DataSeriesStore.get().currentYear,
      currentDataSerie: DataSeriesStore.get().currentDataSerie,
      min: DataSeriesStore.get().min,
      max: DataSeriesStore.get().max
    });
  },
  render: function() {
    var color = d3.scale.quantize()
    .domain([1, 100000])
    .range(colorbrewer.OrRd[9]);
    var pathGenerator = d3.geo.path();
    var projection = d3.geo.conicConformal() // Lambert-93
        .center([2.454071, 47.279229]) // On centre la carte sur la France
        .scale(2800)
        .translate([this.props.width / 2, this.props.height / 2]);

    var fill = function(){
      return 'pink';
    };

    var self = this;
    var path = d3.geo.path()
        .projection(projection);
        if(this.state.nestedData){
          var ext = [this.state.min, this.state.max]
          color.domain(ext);
          fill = function(feature){
            var code = feature.properties.code
            var t = self.state.nestedData.get(self.state.currentDataSerie).get(code);
            return color(t[0][self.state.currentYear]);
          }
        }

        var regions = this.state.features.map(function(feature){
            return (
                <path d={path(feature)} fill={fill(feature)} />
            )
        })
        var c = color
        var legend = color.range().map(function(color){
          var styleColor = {
            backgroundColor: color
          }
          var text = Number(parseFloat(c.invertExtent(color))).toFixed(2);
          return (<li className="key" style={styleColor}>{text}</li>)
        })
    return (
      <div>
            <div id="legend">
            <ul className="list-inline">
            {legend}
            </ul>
            </div>
            <svg className="map" width={this.props.width} height={this.props.height}>
            {regions}
            </svg>
      </div>
    );
  }
});

module.exports = Map;
