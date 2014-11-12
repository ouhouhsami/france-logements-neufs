var AppDispatcher = require('../dispatcher/AppDispatcher');
var WebAPIConstants = require('../constants/WebAPIConstants');
var queue = require("queue-async");
var d3 = require('d3');

var DataSeriesActions = {
    get: function(json, tsv) {
        queue()
            .defer(d3.json, json)
            .defer(d3.tsv, tsv)
            .await(loaded);

        function loaded(err, geojson, data) {
            AppDispatcher.handleViewAction({
                actionType: WebAPIConstants.WEBAPI_GET,
                geojson: geojson,
                data: data
            })
        }
    },
    set: function(dataSerie, year){
        AppDispatcher.handleViewAction({
            actionType: WebAPIConstants.WEBAPI_SET,
            currentDataSerie: dataSerie,
            currentYear: year
        })
    },
    setScale: function(scale){
        AppDispatcher.handleViewAction({
            actionType: WebAPIConstants.WEBAPI_SETSCALE,
            scale: scale
        })
    }
}

module.exports = DataSeriesActions;
