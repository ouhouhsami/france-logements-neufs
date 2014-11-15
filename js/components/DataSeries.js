/** @jsx React.DOM */

var React = require('react/addons');
var d3 = require('d3');
var DataSeriesStore = require('../stores/DataSeriesStore.js');
var DataSeriesActions = require('../actions/DataSeriesActions.js');

var Serie = React.createClass({
  getInitialState: function() {
    return {active: false};
  },
  handleClick: function(event) {
    DataSeriesActions.set(this.props.dataSerie, this.props.label);
  },
  componentDidMount: function() {
    DataSeriesStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    DataSeriesStore.removeChangeListener(this._onChange);
  },
  _onChange: function(event) {
    this.setState({active: true})
    var ds = DataSeriesStore.get()
    if (ds.currentDataSerie === this.props.dataSerie && ds.currentYear === this.props.label){
      this.setState({active: true})
    } else{
      this.setState({active: false})
    }
  },

  render: function(){
    var cx = React.addons.classSet;
    var classes = cx({
      'btn': true,
      'btn-default': true,
      'btn-xs': true,
      'active': this.state.active
    });
    return(
      <span>
        <a className={classes} onClick={this.handleClick}>{this.props.label}</a>&nbsp;
      </span>
    );
  }
})

var DataSerie = React.createClass({
  render: function(){
    var l = this.props.label
    var serie = this.props.serie.map(function(value){
      return (
        <Serie label={value} dataSerie={l}></Serie>
      )
    })
    return(
      <div>
      <h6>{this.props.label}</h6>
      <div>
        {serie}
      </div>
      </div>
    )}
})

var DataSeries = React.createClass({

  getInitialState: function() {
    return {dataSeries: [], nestedData: [], scale:"absolute"};
  },

  componentDidMount: function() {
    DataSeriesStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    DataSeriesStore.removeChangeListener(this._onChange);
  },

  _onChange: function(event) {
    this.setState({dataSeries: DataSeriesStore.get().data})
    console.log(this.props.children);
  },
  handleScaleChange: function(event){
    DataSeriesActions.setScale(event.target.value);
    this.setState({scale: event.target.value})
  },

  render: function() {
    var self = this;
    var dataSeries = [];

    this.state.dataSeries.forEach(function(key, val){
      try{
        // TODO: better dynamic years
        dataSeries.push(<DataSerie label={key} serie={Object.keys(val.get('11')[0])}></DataSerie>)
      }
      catch(err){

      }
    })
    if(dataSeries.length > 0){
    var selectScale = <div>
    Affichage des données :
        <select value={this.state.scale} onChange={this.handleScaleChange}>
          <option value="absolute">Absolue (max et min de la série de l'année sélectionnée)</option>
          <option value="relative">Relative (max et min de la série dans son intégralité)</option>
        </select></div>
    }else {
      var selectScale = null
    }
    return (
      <div>
        {selectScale}
        {dataSeries}
      </div>
    );
  }
});

module.exports = DataSeries

