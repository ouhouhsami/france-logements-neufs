var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var WebAPIConstants = require('../constants/WebAPIConstants');
var assign = require('react/lib/Object.assign.js');
var d3 = require('d3');

var CHANGE_EVENT = 'change';

var _dataSeries = {
    geojson: null,
    data: null,
    currentDataSerie: null,
    currentYear: null,
    max: null,
    min: null
};


var _scale = "absolute";

function update(geojson, data) {
  _dataSeries.geojson = geojson;
  var nestedData = d3.nest()
      .key(function(d) { return d['Série']; })
      .key(function(d) { return d['N° région, département']; })
      .rollup(function(d){
        Object.keys(d[0]).map(function(val){
          if(!parseInt(val)){
            delete d[0][val];
          };
        })
        return d;
      })
      .map(data, d3.map);
  _dataSeries.data = nestedData;
  _dataSeries.currentYear = null;
  _dataSeries.currentDataSerie = null;
  _dataSeries.min = null;
  _dataSeries.max = null;
}

function set(currentDataSerie, currentYear){
  _dataSeries.currentDataSerie = currentDataSerie;
  _dataSeries.currentYear = currentYear;
  var arr = _dataSeries.data.get(_dataSeries.currentDataSerie).values();
  switch(_scale){
  case "absolute":
    var extent = d3.extent(arr, function(val){
      return parseFloat(val[0][_dataSeries.currentYear]);
    });
    _dataSeries.min = extent[0];
    _dataSeries.max = extent[1];
    break;
  case "relative":
    var max = d3.max(arr, function(val){
      var m = d3.max(d3.values(val[0]), function(v){
        return parseFloat(v);
      });
      return m;
    });
    var min = d3.min(arr, function(val){
      var m = d3.min(d3.values(val[0]), function(v){
        return parseFloat(v);
      });
      return m;
    });
    _dataSeries.min = min;
    _dataSeries.max = max;
    break;
  }

}

function setScale(scale){
  _scale = scale;
  // ugly.
  set(_dataSeries.currentDataSerie, _dataSeries.currentYear);
}

var DataSeriesStore = assign({}, EventEmitter.prototype, {

  /**
   * Get the entire collection of TODOs.
   * @return {object}
   */
  get: function() {
    return _dataSeries;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register to handle all updates
AppDispatcher.register(function(payload) {
  var action = payload.action;
  switch(action.actionType) {
    case WebAPIConstants.WEBAPI_GET:
      update(action.geojson, action.data);
      break;
    case WebAPIConstants.WEBAPI_SET:
      set(action.currentDataSerie, action.currentYear);
      break;
    case WebAPIConstants.WEBAPI_SETSCALE:
      console.log("setScale", action.scale);
      setScale(action.scale);
      break;
    default:
      return true;
  }

  DataSeriesStore.emitChange();

  return true; // No errors.  Needed by promise in Dispatcher.
});

module.exports = DataSeriesStore;
