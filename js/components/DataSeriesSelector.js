/** @jsx React.DOM */

var React = require('react/addons');
var DataSeriesActions = require('../actions/DataSeriesActions.js');

var DataSeriesSelector = React.createClass({
  getInitialState: function() {
    return {options: []};
  },
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({options: data.children});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleChange: function(event){
    var val = event.target.value.split(',');
    var geojson = 'geojson/' + val[0] + '.geojson';
    var dataSeriePath = 'data/'+val[1];
    DataSeriesActions.get(geojson, dataSeriePath);
  },
  render: function(){
    var options = [<option value="0">---</option>];
    this.state.options.forEach(function(elmt, index, arr){
      if(elmt.name !== '.DS_Store'){
        options.push(<optgroup label={elmt.name}/>)
        elmt.children.forEach(function(el, i, ar){
          if(el.name !== '.DS_Store'){
            var data = [el.parent, el.path]
            options.push(<option value={data}>{el.name}</option>)
          }
        })
      }
      //options.push(</optgroup>)
    })
    return (
      <div>
        <b>Choisir une série de données</b>
        <select defaultValue={null} onChange={this.handleChange}>
        {options}
        </select>
      </div>
      )
  }
})

module.exports = DataSeriesSelector;
